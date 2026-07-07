/* ============================================================
   SKILL LEDGER — app logic
   Data (tracks + topics) lives in Supabase, not a local file.
   Progress (checked topics) still lives in localStorage per track id
   — that part stays local to whichever browser you're using.
   "Add topic" saves straight to Supabase and re-renders live.
   ============================================================ */

const TRACK_PALETTE = ['#0F766E', '#4338CA', '#9D174D', '#B45309', '#0369A1', '#15803D'];
let activeTrackId = null;
let supabaseClient = null;
const appData = { tracks: [] };

/* ---------- Supabase wiring ---------- */
function configReady(){
  return typeof SUPABASE_URL !== 'undefined'
    && typeof SUPABASE_ANON_KEY !== 'undefined'
    && !SUPABASE_URL.includes('PASTE_YOUR')
    && !SUPABASE_ANON_KEY.includes('PASTE_YOUR');
}

async function loadData(){
  const { data: tracks, error: trackErr } = await supabaseClient.from('tracks').select('*').order('id');
  if(trackErr){ throw trackErr; }
  const { data: topics, error: topicErr } = await supabaseClient.from('topics').select('*').order('created_at');
  if(topicErr){ throw topicErr; }

  appData.tracks = (tracks || []).map(tr => ({
    id: tr.id, name: tr.name, ext: tr.ext, color: tr.color,
    topics: (topics || []).filter(tp => tp.track_id === tr.id).map(tp => ({
      id: tp.id,
      title: tp.title,
      level: tp.level,
      desc: tp.description || '',
      subtopics: tp.subtopics || [],
      projects: tp.projects || [],
      sources: tp.sources || [],
      notes: tp.notes || null,
      validate: tp.validate || ''
    }))
  }));
}

function escapeHtml(str){
  return String(str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ---------- localStorage progress ---------- */
function getDone(trackId){
  try { return JSON.parse(localStorage.getItem('done_'+trackId) || '{}'); }
  catch(e){ return {}; }
}
function setDone(trackId, obj){
  localStorage.setItem('done_'+trackId, JSON.stringify(obj));
}

/* ---------- source categorisation (auto-detect if not set) ---------- */
function detectCategory(url){
  const u = (url||'').toLowerCase();
  if(u.includes('youtube.com') || u.includes('youtu.be')) return 'video';
  if(u.includes('leetcode.com') || u.includes('hackerrank.com') || u.includes('stratascratch') || u.includes('sqlzoo')) return 'practice';
  if(!u) return 'other';
  return 'article';
}
const CATEGORY_ICON = { article:'📄', practice:'🧩', video:'🎥', other:'🔗' };

/* ============================================================
   RENDERING
   ============================================================ */
function renderTabs(){
  const tabWrap = document.getElementById('tabs');
  const tracks = appData.tracks;
  if(tracks.length === 0){
    tabWrap.innerHTML = '';
    return;
  }
  if(!activeTrackId || !tracks.find(t=>t.id===activeTrackId)) activeTrackId = tracks[0].id;
  tabWrap.innerHTML = tracks.map(t => `
    <button class="tab ${t.id===activeTrackId?'active':''}" onclick="switchTrack('${t.id}')">
      ${escapeHtml(t.name)}<span class="ext">${escapeHtml(t.ext)}</span>
    </button>
  `).join('');
}

function switchTrack(trackId){
  activeTrackId = trackId;
  renderTabs();
  renderAllPanels();
}

function renderAllPanels(){
  const container = document.getElementById('panels');
  const tracks = appData.tracks;

  if(tracks.length === 0){
    container.innerHTML = `<div class="panel active"><div class="no-tracks">No tracks yet — click "+ Add topic" to create your first one.</div></div>`;
    refreshGlobal();
    return;
  }

  container.innerHTML = tracks.map(t => `<div class="panel ${t.id===activeTrackId?'active':''}" id="panel-${t.id}"></div>`).join('');
  tracks.forEach(t => buildTrackPanel(t));
  refreshGlobal();
}

function buildTrackPanel(track){
  const panel = document.getElementById('panel-'+track.id);
  if(!panel.dataset.filterLevel) panel.dataset.filterLevel = 'all';
  if(!panel.dataset.filterSub) panel.dataset.filterSub = '';
  if(!panel.dataset.search) panel.dataset.search = '';

  const allSubtopics = [...new Set(track.topics.flatMap(t => t.subtopics))];

  panel.innerHTML = `
    <div class="summary-row">
      <div class="stat-card"><div class="stat-num" id="done-${track.id}">0</div><div class="stat-label">Confirmed</div></div>
      <div class="stat-card"><div class="stat-num" id="left-${track.id}">0</div><div class="stat-label">Remaining</div></div>
      <div class="stat-card"><div class="stat-num">${track.topics.length}</div><div class="stat-label">Total</div></div>
    </div>
    <div class="progress-label"><span>Progress</span><span id="pct-${track.id}">0%</span></div>
    <div class="progress-bar-wrap"><div class="progress-bar" id="bar-${track.id}" style="background:${track.color}"></div></div>

    <div class="controls">
      <button class="chip active" onclick="setLevelFilter('${track.id}','all',this)">All</button>
      <button class="chip" onclick="setLevelFilter('${track.id}','foundation',this)">Foundation</button>
      <button class="chip" onclick="setLevelFilter('${track.id}','intermediate',this)">Intermediate</button>
      <button class="chip" onclick="setLevelFilter('${track.id}','advanced',this)">Advanced</button>
      <input class="search-box" placeholder="Search topics…" oninput="setSearch('${track.id}',this.value)">
    </div>

    ${allSubtopics.length ? `
    <div class="subtopic-filter-row">
      <div class="subtopic-filter-label">Filter by subtopic — click one to narrow the list below</div>
      <div class="subtopic-cloud" id="subcloud-${track.id}">
        ${allSubtopics.map(s => `<span class="stag-filter" onclick="toggleSubFilter('${track.id}', this)">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>` : ''}

    <div id="list-${track.id}"></div>
  `;
  renderTopicList(track);
  refreshStats(track);
}

function renderTopicList(track){
  const panel = document.getElementById('panel-'+track.id);
  const list = document.getElementById('list-'+track.id);
  const done = getDone(track.id);
  const levelFilter = panel.dataset.filterLevel;
  const subFilter = panel.dataset.filterSub;
  const search = (panel.dataset.search || '').toLowerCase();

  const filtered = track.topics.filter(t => {
    const lvlMatch = levelFilter === 'all' || t.level === levelFilter;
    const subMatch = !subFilter || t.subtopics.includes(subFilter);
    const searchMatch = !search || t.title.toLowerCase().includes(search) || t.subtopics.some(s => s.toLowerCase().includes(search));
    return lvlMatch && subMatch && searchMatch;
  });

  if(filtered.length === 0){
    list.innerHTML = `<div class="empty-state">No topics match this filter — try clearing the search, level, or subtopic filter above.</div>`;
    return;
  }

  list.innerHTML = filtered.map(t => renderTopicCard(t, track, done)).join('');
}

function renderTopicCard(t, track, done){
  const isDone = !!done[t.id];
  const levelClass = 'lv-' + t.level;

  const subHtml = t.subtopics.map(s => `<span class="stag" onclick="jumpToSubFilter('${track.id}','${escapeHtml(s).replace(/'/g,"\\'")}')">${escapeHtml(s)}</span>`).join('');

  const projHtml = t.projects.map((p, i) => {
    const color = TRACK_PALETTE[i % TRACK_PALETTE.length];
    return `<div class="proj-item"><div class="proj-dot" style="background:${color}"></div><div class="proj-text">${p.text}</div></div>`;
  }).join('');

  const srcHtml = t.sources.map(s => {
    const cat = s.category || detectCategory(s.url);
    return `<div class="source-item">
      <span class="src-badge ${s.free ? 'src-free' : 'src-paid'}">${s.free ? 'FREE' : 'PAID'}</span>
      <span class="src-cat" title="${cat}">${CATEGORY_ICON[cat] || '🔗'}</span>
      <div class="src-text">${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>` : escapeHtml(s.label)}</div>
    </div>`;
  }).join('');

  const notesHtml = (t.notes && t.notes.url)
    ? `<a class="notes-link" href="${escapeHtml(t.notes.url)}" target="_blank" rel="noopener">📓 ${escapeHtml(t.notes.label || 'My RemNote notes')} ↗</a>`
    : `<span class="notes-empty">No notes linked yet</span>`;

  const promptText = buildPrompt(t);

  return `
    <div class="topic-block ${levelClass}" id="block-${t.id}">
      <div class="level-stripe"></div>
      <div class="topic-main">
        <div class="topic-header" id="hdr-${t.id}" onclick="toggleBody('${t.id}')">
          <div class="check ${isDone?'done':''}" id="chk-${t.id}" onclick="event.stopPropagation();toggleDone('${t.id}','${track.id}')"></div>
          <div style="flex:1;min-width:0">
            <div class="topic-title" style="${isDone?'text-decoration:line-through;color:var(--ink-faint)':''}" id="title-${t.id}">${escapeHtml(t.title)}</div>
            <div class="topic-sub">Tap to expand · check off once confirmed</div>
          </div>
          <span class="topic-level">${t.level}</span>
          <span class="chevron">▶</span>
        </div>
        <div class="topic-body" id="body-${t.id}">
          <div class="topic-body-inner">
            <div class="topic-desc">${t.desc}</div>
            <div class="section-mini">Specific subtopics to know</div>
            <div class="subtopics">${subHtml}</div>
            <div class="section-mini">Real projects that prove this topic</div>
            ${projHtml}
            <div class="section-mini">Where to learn &amp; practice</div>
            ${srcHtml}
            <div class="section-mini">My notes</div>
            ${notesHtml}
            <div class="validate-box">
              <div class="validate-title">How to confirm you own this topic</div>
              <div class="validate-text">${t.validate}</div>
            </div>
            <button class="btn-ask" onclick="event.stopPropagation();copyPrompt(this, ${JSON.stringify(promptText)})">📋 Copy a prompt to learn more with any AI</button>
          </div>
        </div>
      </div>
    </div>`;
}

function buildPrompt(t){
  return `I'm learning "${t.title}" (${t.level} level). Subtopics involved: ${t.subtopics.join(', ')}. ` +
         `Explain the parts I'm likely missing, then give me one practice problem I can solve on my own dataset, ` +
         `and check my solution when I'm done. Don't give me the final answer outright — walk me through it.`;
}

/* ---------- interactions ---------- */
function toggleBody(id){
  const body = document.getElementById('body-'+id);
  const hdr = document.getElementById('hdr-'+id);
  const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
  if(isOpen){ body.style.maxHeight = '0px'; hdr.classList.remove('open'); }
  else { body.style.maxHeight = body.scrollHeight + 'px'; hdr.classList.add('open'); }
}

function toggleDone(topicId, trackId){
  const done = getDone(trackId);
  done[topicId] = !done[topicId];
  setDone(trackId, done);

  const chk = document.getElementById('chk-'+topicId);
  const title = document.getElementById('title-'+topicId);
  const isDone = done[topicId];
  chk.className = 'check' + (isDone ? ' done' : '');
  title.style.textDecoration = isDone ? 'line-through' : 'none';
  title.style.color = isDone ? 'var(--ink-faint)' : 'var(--ink)';

  const track = appData.tracks.find(t => t.id === trackId);
  refreshStats(track);
}

function refreshStats(track){
  const done = getDone(track.id);
  const doneCount = Object.values(done).filter(Boolean).length;
  const total = track.topics.length;
  document.getElementById('done-'+track.id).textContent = doneCount;
  document.getElementById('left-'+track.id).textContent = total - doneCount;
  const pct = total ? Math.round(doneCount/total*100) : 0;
  document.getElementById('pct-'+track.id).textContent = pct + '%';
  document.getElementById('bar-'+track.id).style.width = pct + '%';
  refreshGlobal();
}

function refreshGlobal(){
  const tracks = appData.tracks;
  let doneCount = 0, total = 0;
  tracks.forEach(t => {
    const done = getDone(t.id);
    doneCount += Object.values(done).filter(Boolean).length;
    total += t.topics.length;
  });
  const pct = total ? Math.round(doneCount/total*100) : 0;
  document.getElementById('g-count').textContent = doneCount;
  document.getElementById('g-total').textContent = total;
  document.getElementById('g-pct').textContent = pct + '%';
}

function setLevelFilter(trackId, level, btn){
  const panel = document.getElementById('panel-'+trackId);
  panel.dataset.filterLevel = level;
  panel.querySelectorAll('.controls .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const track = appData.tracks.find(t => t.id === trackId);
  renderTopicList(track);
}

function setSearch(trackId, val){
  const panel = document.getElementById('panel-'+trackId);
  panel.dataset.search = val;
  const track = appData.tracks.find(t => t.id === trackId);
  renderTopicList(track);
}

function toggleSubFilter(trackId, el){
  const panel = document.getElementById('panel-'+trackId);
  const label = el.textContent;
  const isActive = el.classList.contains('active');
  panel.querySelectorAll('#subcloud-'+trackId+' .stag-filter').forEach(c => c.classList.remove('active'));
  panel.dataset.filterSub = isActive ? '' : label;
  if(!isActive) el.classList.add('active');
  const track = appData.tracks.find(t => t.id === trackId);
  renderTopicList(track);
}

function jumpToSubFilter(trackId, subtopic){
  const cloudChip = [...document.querySelectorAll('#subcloud-'+trackId+' .stag-filter')].find(c => c.textContent === subtopic);
  if(cloudChip){
    toggleSubFilter(trackId, cloudChip);
    document.getElementById('panel-'+trackId).scrollIntoView({behavior:'smooth', block:'start'});
  }
}

/* ---------- copy-to-clipboard ---------- */
function copyPrompt(btn, text){
  const done = () => {
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Copied — paste into any AI chat';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 1800);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done){
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch(e){}
  document.body.removeChild(ta);
}

/* ============================================================
   ADD TOPIC MODAL — generates a code snippet, doesn't save live
   ============================================================ */
function openAddTopicModal(){
  const tracks = appData.tracks;
  document.getElementById('modal-overlay').classList.add('open');

  const trackOptionsHtml = tracks.map(t =>
    `<label><input type="radio" name="track-choice" value="${t.id}" ${t.id===activeTrackId?'checked':''}> ${escapeHtml(t.name)}</label>`
  ).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="field">
      <label>Where does this topic go?</label>
      <div class="track-choice">
        ${trackOptionsHtml}
        <label><input type="radio" name="track-choice" value="__new__"> + New track</label>
      </div>
      <div id="new-track-fields" style="display:none">
        <div class="field-row">
          <div class="field"><label>New track name</label><input type="text" id="nt-name" placeholder="e.g. Excel &amp; BI"></div>
          <div class="field"><label>File extension tag</label><input type="text" id="nt-ext" placeholder="e.g. .xlsx"></div>
        </div>
      </div>
    </div>

    <div class="field-row">
      <div class="field"><label>Topic title</label><input type="text" id="tf-title" placeholder="e.g. Pivot Tables"></div>
      <div class="field" style="max-width:160px">
        <label>Level</label>
        <select id="tf-level">
          <option value="foundation">Foundation</option>
          <option value="intermediate" selected>Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label>Description</label>
      <textarea id="tf-desc" placeholder="One paragraph: what this is and why it matters"></textarea>
    </div>

    <div class="field">
      <label>Subtopics</label>
      <div class="chip-input-box" id="tf-tagbox">
        <input type="text" id="tf-tag-input" placeholder="Type a subtopic, press Enter">
      </div>
      <div class="field-hint">Press Enter after each one to turn it into a chip.</div>
    </div>

    <div class="field">
      <label>Real projects that prove this topic</label>
      <div id="tf-projects"></div>
      <button type="button" class="add-row-btn" onclick="addProjectRow()">+ Add a project</button>
    </div>

    <div class="field">
      <label>Where to learn &amp; practice</label>
      <div id="tf-sources"></div>
      <button type="button" class="add-row-btn" onclick="addSourceRow()">+ Add a link (article, LeetCode/HackerRank, YouTube…)</button>
    </div>

    <div class="field-row">
      <div class="field"><label>My notes link (RemNote, etc.) — optional</label><input type="text" id="tf-notes-url" placeholder="https://remnote.com/..."></div>
      <div class="field"><label>Notes label</label><input type="text" id="tf-notes-label" placeholder="e.g. My RemNote notes"></div>
    </div>

    <div class="field">
      <label>How to confirm you own this topic</label>
      <textarea id="tf-validate" placeholder="e.g. Solve these two problems unaided..."></textarea>
    </div>
  `;

  document.querySelectorAll('input[name="track-choice"]').forEach(r => {
    r.addEventListener('change', () => {
      document.getElementById('new-track-fields').style.display = r.value === '__new__' && r.checked ? 'block' : 'none';
      document.querySelectorAll('.track-choice label').forEach(l => l.classList.remove('picked'));
      r.closest('label').classList.add('picked');
    });
  });
  document.getElementById('tf-tag-input').addEventListener('keydown', handleTagKeydown);
  const preChecked = document.querySelector('input[name="track-choice"]:checked');
  if(preChecked) preChecked.closest('label').classList.add('picked');
  addProjectRow();
  addSourceRow();
}

function closeAddTopicModal(){
  document.getElementById('modal-overlay').classList.remove('open');
}

function tagChipHtml(tag){
  return `<span class="chip-removable">${escapeHtml(tag)}<button type="button" onclick="this.parentElement.remove()">✕</button></span>`;
}
function handleTagKeydown(evt){
  if(evt.key === 'Enter'){
    evt.preventDefault();
    const val = evt.target.value.trim();
    if(val){
      evt.target.insertAdjacentHTML('beforebegin', tagChipHtml(val));
      evt.target.value = '';
    }
  }
}

function projectRowHtml(){
  return `<div class="repeat-row">
    <div class="repeat-row-head"><span>project</span><button type="button" class="remove-row" onclick="this.closest('.repeat-row').remove()">✕ remove</button></div>
    <textarea class="proj-text-input" placeholder="e.g. **Rolling 7-day call volume** — use **text** for bold. Describe the project and what it proves."></textarea>
  </div>`;
}
function addProjectRow(){
  document.getElementById('tf-projects').insertAdjacentHTML('beforeend', projectRowHtml());
}

function sourceRowHtml(){
  return `<div class="repeat-row">
    <div class="repeat-row-head"><span>resource</span><button type="button" class="remove-row" onclick="this.closest('.repeat-row').remove()">✕ remove</button></div>
    <div class="field-row" style="margin-bottom:8px">
      <div class="field" style="margin-bottom:0"><label>Label</label><input type="text" class="src-label-input" placeholder="e.g. LeetCode — Database problems"></div>
      <div class="field" style="max-width:110px;margin-bottom:0"><label>Cost</label>
        <select class="src-free-input"><option value="true">Free</option><option value="false">Paid</option></select>
      </div>
    </div>
    <div class="field-row">
      <div class="field" style="margin-bottom:0"><label>URL</label><input type="text" class="src-url-input" placeholder="https://..."></div>
      <div class="field" style="max-width:130px;margin-bottom:0"><label>Type</label>
        <select class="src-cat-input">
          <option value="">Auto-detect</option>
          <option value="article">Article</option>
          <option value="practice">Practice (LeetCode/HackerRank)</option>
          <option value="video">Video (YouTube)</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  </div>`;
}
function addSourceRow(){
  document.getElementById('tf-sources').insertAdjacentHTML('beforeend', sourceRowHtml());
}

function slugify(str){
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

async function saveTopic(){
  const title = document.getElementById('tf-title').value.trim();
  if(!title){ alert('Give the topic a title first — I need something to work with here.'); return; }

  const trackChoiceEl = document.querySelector('input[name="track-choice"]:checked');
  const isNewTrack = trackChoiceEl && trackChoiceEl.value === '__new__';
  const trackId = isNewTrack ? slugify(document.getElementById('nt-name').value || 'new-track') : trackChoiceEl.value;

  const level = document.getElementById('tf-level').value;
  const desc = document.getElementById('tf-desc').value.trim();
  const validate = document.getElementById('tf-validate').value.trim();
  const notesUrl = document.getElementById('tf-notes-url').value.trim();
  const notesLabel = document.getElementById('tf-notes-label').value.trim();

  const subtopics = [...document.querySelectorAll('#tf-tagbox .chip-removable')].map(el => el.firstChild.textContent.trim());

  const projects = [...document.querySelectorAll('#tf-projects .repeat-row')]
    .map(row => row.querySelector('.proj-text-input').value.trim())
    .filter(Boolean)
    .map(text => ({ text }));

  const sources = [...document.querySelectorAll('#tf-sources .repeat-row')].map(row => ({
    label: row.querySelector('.src-label-input').value.trim(),
    free: row.querySelector('.src-free-input').value === 'true',
    url: row.querySelector('.src-url-input').value.trim(),
    category: row.querySelector('.src-cat-input').value
  })).filter(s => s.label);

  const notes = notesUrl ? { url: notesUrl, label: notesLabel || 'My notes' } : null;
  const topicId = trackId + '-' + slugify(title);

  const saveBtn = document.getElementById('save-topic-btn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving…';

  try {
    if(isNewTrack){
      const trackName = document.getElementById('nt-name').value.trim() || 'New Track';
      const trackExt = document.getElementById('nt-ext').value.trim() || '.txt';
      const color = TRACK_PALETTE[appData.tracks.length % TRACK_PALETTE.length];
      const { error: trackErr } = await supabaseClient.from('tracks').insert({ id: trackId, name: trackName, ext: trackExt, color });
      if(trackErr) throw trackErr;
    }

    const { error: topicErr } = await supabaseClient.from('topics').insert({
      id: topicId,
      track_id: trackId,
      title: title,
      level: level,
      description: desc,
      subtopics: subtopics,
      projects: projects,
      sources: sources,
      notes: notes,
      validate: validate
    });
    if(topicErr) throw topicErr;

    activeTrackId = trackId;
    await loadData();
    renderTabs();
    renderAllPanels();
    closeAddTopicModal();
  } catch(err){
    alert('Could not save to Supabase: ' + (err.message || err));
    console.error(err);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save topic';
  }
}

/* ============================================================
   INIT
   ============================================================ */
async function init(){
  const panels = document.getElementById('panels');

  if(!configReady()){
    panels.innerHTML = `<div class="panel active"><div class="no-tracks">
      Supabase isn't configured yet — open <code>config.js</code> and paste in your
      Project URL and anon public key from Supabase → Settings → API.
    </div></div>`;
    return;
  }

  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  panels.innerHTML = `<div class="panel active"><div class="no-tracks">Loading your topics from Supabase…</div></div>`;

  try {
    await loadData();
    renderTabs();
    renderAllPanels();
  } catch(err){
    console.error(err);
    panels.innerHTML = `<div class="panel active"><div class="no-tracks">
      Couldn't load data from Supabase. Open the browser console (F12) for the exact error —
      it's usually either wrong credentials in <code>config.js</code>, or the tables/policies
      haven't been created yet in the SQL editor.
    </div></div>`;
  }
}
init();
