/* ============================================================
   DATA MODEL
   state.mainTopics = [
     { id, name, ext, color, topics:[
         { id, title, level, desc, subtopics:[str],
           projects:[{title,description}],
           sources:[{label,url,badge,note}],
           notesUrl, validate, done }
     ]}
   ]
   ============================================================ */

const STORAGE_KEY = 'skillLedgerState_v1';

const DEFAULT_STATE = { mainTopics: [
  { id:'sql', name:'SQL', ext:'sql', color:'#0F766E', topics:[
    { id:'s1', title:'CTEs (Common Table Expressions)', level:'intermediate',
      desc:'Named temporary result sets defined with WITH. Make complex queries readable and reusable. Replace nested subqueries. Foundational for all advanced SQL work.',
      subtopics:['WITH clause syntax','Multiple chained CTEs','Replacing subqueries','Recursive CTEs (basic)'],
      projects:[
        {title:'Rolling 7-day call volume', description:'Use your Petpooja call log data. Write a CTE that calculates daily call counts, then query it to get 7-day rolling sums per agent. Directly applicable to your existing work.'},
        {title:'E-commerce funnel analysis', description:'Olist dataset. CTE layer 1: sessions per user. CTE layer 2: purchases per user. Final: conversion rate per category.'},
        {title:'Customer cohort retention', description:'Find users who signed up in month X and came back in month X+1, X+2. Classic interview problem, forces multi-CTE thinking.'}
      ],
      sources:[
        {label:'Mode Analytics — CTE Tutorial', url:'https://mode.com/sql-tutorial/sql-with/', badge:'FREE', note:'Best structured walkthrough with real business datasets.'},
        {label:'LeetCode — Database Medium problems', url:'https://leetcode.com/tag/database/', badge:'PRACTICE', note:'Filter by "CTE" in solutions to see the pattern.'},
        {label:'PostgreSQL Tutorial — CTEs', url:'https://www.postgresqltutorial.com/postgresql-cte/', badge:'FREE', note:'Thorough with examples including recursive.'}
      ],
      notesUrl:'', validate:'Solve LeetCode #185 (Department Top Three Salaries) and #262 (Trips and Users) using CTEs without looking at solutions. If you can write them cleanly in one attempt, you own CTEs.', done:false },
    { id:'s2', title:'Window Functions', level:'advanced',
      desc:'Perform calculations across rows related to the current row — without collapsing them like GROUP BY does. The single biggest jump from intermediate to advanced SQL. Tested in almost every senior interview.',
      subtopics:['ROW_NUMBER / RANK / DENSE_RANK','LAG and LEAD','SUM/AVG/COUNT OVER','PARTITION BY vs ORDER BY','ROWS BETWEEN (frames)'],
      projects:[
        {title:'Agent performance ranking by week', description:'Rank agents by calls/conversions within each week. Use RANK() OVER (PARTITION BY week ORDER BY conversions DESC). Show how rankings shift week over week using LAG().'},
        {title:'Running revenue total — e-commerce', description:'Olist dataset. SUM(revenue) OVER (PARTITION BY seller ORDER BY order_date ROWS UNBOUNDED PRECEDING). A standard BI report query.'},
        {title:'Month-over-month growth calculator', description:'Any sales dataset. Use LAG(revenue, 1) to calculate MoM change % per product. Highly interview-relevant.'}
      ],
      sources:[
        {label:'windowfunctions.com', url:'https://www.windowfunctions.com', badge:'FREE', note:'Interactive playground. Each function explained with live editable queries. Start here.'},
        {label:'Mode Analytics — Window Functions', url:'https://mode.com/sql-tutorial/sql-window-functions/', badge:'FREE', note:'Business-context examples throughout.'},
        {label:'LeetCode Top SQL 50', url:'https://leetcode.com/studyplan/top-sql-50/', badge:'PRACTICE', note:'Problems 35–50 are mostly window functions. These are actual interview questions.'}
      ],
      notesUrl:'', validate:'Solve LeetCode #184 (Department Highest Salary), #178 (Rank Scores), and #180 (Consecutive Numbers) — all three using window functions. If you solve them unaided, you are interview-ready on window functions.', done:false },
    { id:'s3', title:'Advanced JOINs & Self JOINs', level:'intermediate',
      desc:'You likely know INNER/LEFT JOIN. The gaps are SELF JOIN (a table joined to itself), non-equi joins, and understanding when to use each. Commonly tested with org-chart or comparison problems.',
      subtopics:['SELF JOIN','Non-equi JOIN','CROSS JOIN use cases','Multiple table JOINs','JOIN vs subquery performance intuition'],
      projects:[
        {title:'Manager salary comparison', description:'Classic: employees table joined to itself. Find employees who earn more than their manager. Teaches self-join pattern completely.'},
        {title:'Product pair analysis', description:'Find all pairs of products bought together in the same order (CROSS JOIN or self-join on order_items). Common in e-commerce analytics.'}
      ],
      sources:[
        {label:'StrataScratch', url:'https://www.stratascratch.com', badge:'PRACTICE', note:'Filter by "joins" difficulty Medium. Questions come from actual company interviews (Airbnb, Meta, etc.).'},
        {label:'SQLZoo — Self Join', url:'https://sqlzoo.net/wiki/Self_join', badge:'FREE', note:'Concise, interactive, good for confirming understanding quickly.'}
      ],
      notesUrl:'', validate:'LeetCode #181 (Employees Earning More Than Managers) and #197 (Rising Temperature). Solve without hints. Completing them in under 15 min each = solid.', done:false },
    { id:'s4', title:'Aggregations & Grouping Patterns', level:'intermediate',
      desc:'You know basic GROUP BY. The advanced layer is conditional aggregation (CASE inside SUM), HAVING filters, ROLLUP/CUBE, and multi-level aggregation patterns common in business reporting.',
      subtopics:['Conditional aggregation (SUM CASE WHEN)','HAVING vs WHERE','ROLLUP / CUBE (bonus)','Aggregating after window functions','Pivot using aggregation'],
      projects:[
        {title:'Call outcome pivot table', description:"Using your Petpooja data conceptually: count calls per agent split by outcome (answered/missed/transferred) as columns, using SUM(CASE WHEN outcome='X' THEN 1 ELSE 0 END). This is conditional aggregation."},
        {title:'Monthly sales report with subtotals', description:'Use ROLLUP to get per-category totals AND a grand total in one query. Show this as an "executive summary SQL" piece.'}
      ],
      sources:[
        {label:'Mode Analytics — Aggregations', url:'https://mode.com/sql-tutorial/sql-aggregate-functions/', badge:'FREE', note:'Covers the conditional aggregation pattern thoroughly.'},
        {label:'HackerRank — Advanced Aggregation', url:'', badge:'PRACTICE', note:"You're close to done there — focus on the problems you skipped."}
      ],
      notesUrl:'', validate:'Write one query that produces a pivot-style report (outcomes as columns) using only CASE WHEN inside SUM. If it runs correctly first try, this topic is closed.', done:false },
    { id:'s5', title:'Subqueries & Correlated Subqueries', level:'intermediate',
      desc:'Subqueries inside SELECT, FROM, WHERE, and HAVING. Correlated subqueries reference the outer query — slow but heavily tested in interviews. Knowing when to replace them with CTEs or JOINs is a senior signal.',
      subtopics:['Scalar subquery in SELECT','Correlated subquery in WHERE','Exists vs IN vs JOIN','Subquery vs CTE decision'],
      projects:[
        {title:'Find agents above average performance', description:'Subquery calculates average, outer query filters. Then rewrite the same thing as a CTE. Show both in your notebook as a comparison — it demonstrates you understand the tradeoff.'}
      ],
      sources:[
        {label:'SQLite Tutorial — Correlated Subqueries', url:'https://www.sqlitetutorial.net/sqlite-correlated-subquery/', badge:'FREE', note:'Concise explanation with a visual of what "correlated" means.'},
        {label:'LeetCode #185 & #262', url:'https://leetcode.com/tag/database/', badge:'PRACTICE', note:'Both require choosing between a subquery and a CTE.'}
      ],
      notesUrl:'', validate:"LeetCode #184 and #626. Solve first with a subquery, then rewrite with a CTE. If you can explain why one is more readable, you've closed this topic.", done:false },
    { id:'s6', title:'Date & Time Manipulation', level:'intermediate',
      desc:'Every real business dataset has timestamps. Date filtering, truncating to month/week, date differences, and formatting are tested constantly in take-home assignments.',
      subtopics:['DATE_TRUNC / DATE_FORMAT','DATEDIFF / AGE','Extracting parts (YEAR, MONTH, DOW)','Filtering date ranges','Current date logic (NOW, TODAY)'],
      projects:[
        {title:'Cohort analysis by signup month', description:'Group users by the month they signed up, calculate how many returned each subsequent month. One of the most common take-home projects.'},
        {title:'Business hours call filtering', description:'Filter your Petpooja-style call data to only 9am–6pm weekdays using EXTRACT(DOW) and EXTRACT(HOUR).'}
      ],
      sources:[
        {label:'W3Schools — SQL Dates', url:'https://www.w3schools.com/sql/sql_dates.asp', badge:'FREE', note:'Quick reference for all date functions across MySQL/PostgreSQL.'},
        {label:'Mode Analytics — Date/Time', url:'https://mode.com/sql-tutorial/sql-datetime-format/', badge:'FREE', note:'Business-context examples.'}
      ],
      notesUrl:'', validate:'Write a query that: (1) finds the count of events per day-of-week, (2) calculates the gap in days between consecutive events per user using LAG. Combines dates + window functions.', done:false }
  ]},
  { id:'py', name:'Python · Pandas', ext:'py', color:'#4338CA', topics:[
    { id:'p1', title:'pandas Core — Loading, Cleaning, Shaping', level:'foundation',
      desc:"The absolute bedrock. 80% of analyst Python work is here. You already use pandas in your pipeline — the goal is going deeper: methodically handling any messy dataset you're handed.",
      subtopics:['read_csv / read_excel with options','Handling nulls (fillna, dropna, isna)','dtype conversion','rename / drop / reindex','String cleaning (str.strip, str.lower, str.replace)','Duplicate detection & removal'],
      projects:[
        {title:'Dirty data cleaning challenge', description:'Download any messy Kaggle dataset (search "dirty data" or "data cleaning"). Document every cleaning step in a Jupyter notebook with before/after value counts.'},
        {title:'Reframe your Petpooja script', description:"Extract just the cleaning portion of your pipeline into a standalone notebook. Add markdown cells explaining each step. That's a portfolio piece."}
      ],
      sources:[
        {label:'Luke Barousse — Python for Data Analytics', url:'https://www.youtube.com/watch?v=2uvysYbKdjM', badge:'VIDEO', note:'Free, 14 hours. Covers this entire section — watch at 1.5x.'},
        {label:'Kaggle Learn — Pandas', url:'https://kaggle.com/learn/pandas', badge:'FREE', note:'5 hours, gets a certificate, interactive exercises.'},
        {label:'pandas official User Guide', url:'https://pandas.pydata.org/docs/user_guide/index.html', badge:'FREE', note:'Use as a reference, not a course.'}
      ],
      notesUrl:'', validate:'Complete the Kaggle Pandas micro-course and get the certificate. Passing it with no hints = confirmed foundation.', done:false },
    { id:'p2', title:'groupby, agg, pivot_table', level:'intermediate',
      desc:"The pandas equivalent of SQL's GROUP BY. groupby().agg() lets you apply multiple functions simultaneously. pivot_table reshapes data into summary tables.",
      subtopics:['groupby single and multiple columns','agg with dict (multiple functions)','Named aggregations','pivot_table with values/index/columns/aggfunc','value_counts and crosstab'],
      projects:[
        {title:'Agent performance summary table', description:"From a call-log CSV: groupby agent → agg(calls='count', avg_duration='mean', answered=sum logic). Output a ranked summary table."},
        {title:'Sales pivot by category & region', description:"Olist dataset. pivot_table(values='revenue', index='product_category', columns='state', aggfunc='sum'). Export to Excel."}
      ],
      sources:[
        {label:'Real Python — pandas GroupBy', url:'https://realpython.com/pandas-groupby/', badge:'FREE', note:'The most thorough free tutorial on groupby.'},
        {label:'Corey Schafer — pandas groupby', url:'https://www.youtube.com/watch?v=txMdrV1Ut64', badge:'VIDEO', note:'30 minutes, very clear.'}
      ],
      notesUrl:'', validate:"Without looking at docs, write groupby code that calculates mean, max, and count simultaneously for 3 columns. One .agg() call, cleanly — this topic is yours.", done:false },
    { id:'p3', title:'merge, join, concat', level:'intermediate',
      desc:'pandas equivalent of SQL JOINs. Analysts constantly combine datasets — orders with customers, calls with agents, products with categories.',
      subtopics:['pd.merge — how, on, left_on/right_on','merge vs join vs concat','Handling duplicate column names after merge','Detecting bad merges (many-to-many)','pd.concat along axis 0 and 1'],
      projects:[
        {title:'Enrich call logs with agent metadata', description:'Merge a call-log DataFrame with an agent-info DataFrame on agent_id. Find calls where the agent is missing from the lookup (left join + isna check).'},
        {title:'Combine multiple monthly CSV files', description:'Read 12 monthly CSVs in a loop, pd.concat them into one DataFrame, then analyse the full year.'}
      ],
      sources:[
        {label:'Real Python — merge, join, concat', url:'https://realpython.com/pandas-merge-join-and-concatenate/', badge:'FREE', note:'Covers every edge case with examples.'},
        {label:'pandas merge docs', url:'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html', badge:'FREE', note:'Reference for the how= parameter options.'}
      ],
      notesUrl:'', validate:'Download two related Kaggle datasets, merge them, and verify the row count matches your expectation (no accidental duplicates).', done:false },
    { id:'p4', title:'apply, map, lambda, vectorisation', level:'intermediate',
      desc:'Transforming column values. apply() runs a function row-by-row or column-by-column. map() replaces values. Vectorised operations are the professional way — interviewers notice this.',
      subtopics:['Series.apply() vs DataFrame.apply()','map() for value replacement','lambda functions in apply','np.where for conditional columns','Avoiding for loops — vectorised operations'],
      projects:[
        {title:'Agent name normalisation', description:'Refactor your agent-name cleaning code into a clean apply/map pattern instead of a loop. Show before/after in a notebook.'},
        {title:'Derived feature engineering', description:'On any dataset, create 3 new columns using apply/lambda: a bucketed age group, a revenue tier, and a weekend flag.'}
      ],
      sources:[
        {label:'Real Python — pandas apply()', url:'https://realpython.com/pandas-apply/', badge:'FREE', note:'Explains when to use apply vs map vs vectorised ops.'},
        {label:'Codebasics — pandas apply', url:'https://www.youtube.com/watch?v=7oa0NjPMIzA', badge:'VIDEO', note:'Short, practical, Indian context.'}
      ],
      notesUrl:'', validate:'Rewrite a for-loop-based column transformation using apply() or np.where(). Time both with %timeit — seeing the speed gap confirms understanding.', done:false },
    { id:'p5', title:'Data Visualisation — matplotlib & seaborn', level:'intermediate',
      desc:"Analysis means nothing if you can't show it. matplotlib for control, seaborn for quick statistical plots. Every portfolio project needs 3–4 well-formatted charts.",
      subtopics:['Line, bar, scatter, histogram, boxplot','Subplots (multiple charts in one figure)','Titles, axis labels, legends (non-negotiable)','Seaborn heatmap for correlation','Colour palette and style choices','Saving to PNG/PDF for reports'],
      projects:[
        {title:'EV market trend charts', description:'VAHAN data. Monthly registrations line chart, state-wise bar chart, brand market share pie/bar — 4 labelled charts, exported cleanly.'},
        {title:'Call centre daily report visual', description:'Plot call volume by hour, agent comparison bar, and outcome distribution stacked bar. Save to PNG.'}
      ],
      sources:[
        {label:'Corey Schafer — matplotlib', url:'https://www.youtube.com/watch?v=3Xc3CA655Y4', badge:'VIDEO', note:'6 videos, covers everything you need.'},
        {label:'seaborn official tutorial', url:'https://seaborn.pydata.org/tutorial.html', badge:'FREE', note:'The gallery examples are the best reference.'},
        {label:'Kaggle Learn — Data Visualisation', url:'https://kaggle.com/learn/data-visualization', badge:'FREE', note:'Certificate course, seaborn-focused.'}
      ],
      notesUrl:'', validate:'Build a 4-chart 2×2 subplot grid with proper titles, axis labels, and a saved PNG — without looking at examples.', done:false },
    { id:'p6', title:'Exploratory Data Analysis (EDA) — Full Workflow', level:'advanced',
      desc:"EDA is what analysts actually do with data. Shape → nulls → distributions → correlations → outliers → hypothesis → insight. Interviewers ask 'walk me through your EDA process' to separate real analysts from tutorial completers.",
      subtopics:['df.info(), .describe(), .shape','Null heatmaps','Correlation matrix + heatmap','Outlier detection (IQR, z-score)','Distribution plots per feature','Forming and testing hypotheses from the data'],
      projects:[
        {title:'Full EDA on the IBM HR Attrition dataset', description:'The most interview-mentioned EDA project. Find 5 interesting patterns, write a conclusion section, publish on Kaggle.'},
        {title:'IPL match EDA', description:'Cricsheet.org data. Does the toss matter? Best death-over bowlers? Home advantage? Your findings section is what gets attention.'}
      ],
      sources:[
        {label:'Kaggle — Detailed EDA reference notebook', url:'https://www.kaggle.com/code/ekami66/detailed-exploratory-data-analysis-with-python', badge:'FREE', note:'Read as a template for structure, not to copy code.'},
        {label:'Ken Jee — EDA project walkthrough', url:'https://www.youtube.com/watch?v=xi0vhXFPegw', badge:'VIDEO', note:'Shows how to narrate your EDA, not just run it.'}
      ],
      notesUrl:'', validate:'Publish your EDA notebook on Kaggle. Get at least 3 upvotes from strangers — honest external validation.', done:false },
    { id:'p7', title:'Jupyter Notebooks — Professional Presentation', level:'foundation',
      desc:'Your code is your presentation layer in data roles. Messy notebooks with no markdown = junior signal. Clean notebooks with headers and insight callouts = analyst signal.',
      subtopics:['Markdown cells for context and conclusions','Hiding implementation cells (input hiding)','Notebook structure: question → data → analysis → insight','Exporting to HTML/PDF','Sharing via GitHub or nbviewer'],
      projects:[
        {title:'Reformat one existing project as a proper notebook report', description:'(1) Problem statement, (2) Data overview, (3) Analysis with markdown narration, (4) Key findings, (5) Limitations.'}
      ],
      sources:[
        {label:'Corey Schafer — Jupyter Notebook tips', url:'https://www.youtube.com/watch?v=HW29067qVWk', badge:'VIDEO', note:'Covers shortcuts, markdown, and exports.'},
        {label:'nbviewer.org', url:'https://nbviewer.org', badge:'FREE', note:'Share any GitHub notebook as a clean rendered page.'}
      ],
      notesUrl:'', validate:'Share a notebook link with someone non-technical. If they understand your findings without you explaining — confirmed.', done:false }
  ]}
]};

/* ============================================================
   STATE
   ============================================================ */
let state = loadState();
let uiState = { activeTab: state.mainTopics[0] ? state.mainTopics[0].id : null, filters:{} };

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ console.warn('Could not read saved state, using starter set.', e); }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function uid(prefix){
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}
function mdBold(str){
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function getFilter(mainId){
  if(!uiState.filters[mainId]) uiState.filters[mainId] = { level:'all', tags:[], search:'' };
  return uiState.filters[mainId];
}

const LEVEL_META = {
  foundation:{label:'foundation', bg:'var(--teal-soft)', fg:'var(--teal)'},
  intermediate:{label:'intermediate', bg:'var(--indigo-soft)', fg:'var(--indigo)'},
  advanced:{label:'advanced', bg:'var(--rose-soft)', fg:'var(--rose)'}
};
const PROJECT_DOT_CYCLE = ['#0F766E','#4338CA','#9D174D'];

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  renderTabs();
  renderPanels();
  refreshGlobal();
}

function renderTabs(){
  const row = document.getElementById('tabs-row');
  let html = state.mainTopics.map(mt => `
    <div class="tab-wrap">
      <button class="tab ${mt.id===uiState.activeTab?'active':''}" onclick="switchTab('${mt.id}')">
        ${escapeHtml(mt.name)}<span class="ext">.${escapeHtml(mt.ext)}</span>
      </button>
      <button class="tab-edit" title="Edit topic set" onclick="event.stopPropagation();openMainTopicModal('${mt.id}')">✎</button>
    </div>
  `).join('');
  html += `<button class="tab-add" onclick="openMainTopicModal(null)">+ New topic set</button>`;
  row.innerHTML = html;
}

function renderPanels(){
  const wrap = document.getElementById('panels');
  wrap.innerHTML = state.mainTopics.map(mt => `<div id="panel-${mt.id}" class="panel ${mt.id===uiState.activeTab?'active':''}"></div>`).join('');
  state.mainTopics.forEach(mt => renderPanel(mt.id));
}

function renderPanel(mainId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  const panel = document.getElementById('panel-'+mainId);
  if(!mt || !panel) return;
  const filter = getFilter(mainId);
  const total = mt.topics.length;
  const done = mt.topics.filter(t=>t.done).length;
  const pct = total ? Math.round(done/total*100) : 0;

  const allTags = [...new Set(mt.topics.flatMap(t=>t.subtopics))].sort();

  panel.innerHTML = `
    <div class="summary-row">
      <div class="stat-card"><div class="stat-num">${done}</div><div class="stat-label">Confirmed</div></div>
      <div class="stat-card"><div class="stat-num">${total-done}</div><div class="stat-label">Remaining</div></div>
      <div class="stat-card"><div class="stat-num">${total}</div><div class="stat-label">Total</div></div>
    </div>
    <div class="progress-label"><span>Progress</span><span>${pct}%</span></div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width:${pct}%;background:${mt.color}"></div></div>

    <div class="controls">
      <button class="chip ${filter.level==='all'?'active':''}" onclick="setLevelFilter('${mainId}','all',this)">All levels</button>
      <button class="chip ${filter.level==='foundation'?'active':''}" onclick="setLevelFilter('${mainId}','foundation',this)">Foundation</button>
      <button class="chip ${filter.level==='intermediate'?'active':''}" onclick="setLevelFilter('${mainId}','intermediate',this)">Intermediate</button>
      <button class="chip ${filter.level==='advanced'?'active':''}" onclick="setLevelFilter('${mainId}','advanced',this)">Advanced</button>
      <input class="search-box" placeholder="Search topics…" value="${escapeHtml(filter.search)}" oninput="setSearch('${mainId}',this.value)">
      ${allTags.length ? `<div class="controls-label">Filter by subtopic</div>` + allTags.map(tag=>`<button class="chip tag-chip ${filter.tags.includes(tag)?'active':''}" onclick="toggleTagFilter('${mainId}','${escapeAttr(tag)}',this)">#${escapeHtml(tag)}</button>`).join('') : ''}
    </div>

    <div id="list-${mainId}"></div>
    <button class="add-card" onclick="openTopicModal('${mainId}', null)">+ Add topic to ${escapeHtml(mt.name)}</button>
  `;
  renderList(mainId);
}

function escapeAttr(str){ return String(str).replace(/'/g,"\\'"); }

function renderList(mainId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  const list = document.getElementById('list-'+mainId);
  if(!list) return;
  const filter = getFilter(mainId);
  const search = filter.search.toLowerCase();

  const filtered = mt.topics.filter(t=>{
    const lvlMatch = filter.level==='all' || t.level===filter.level;
    const tagMatch = filter.tags.length===0 || t.subtopics.some(s=>filter.tags.includes(s));
    const searchMatch = !search || t.title.toLowerCase().includes(search) || t.subtopics.some(s=>s.toLowerCase().includes(search));
    return lvlMatch && tagMatch && searchMatch;
  });

  if(filtered.length===0){
    list.innerHTML = `<div class="empty-state">No topics match this filter — try clearing search or filters above.</div>`;
    return;
  }

  list.innerHTML = filtered.map(t => renderTopicCard(mainId, t)).join('');
}

function renderTopicCard(mainId, t){
  const lm = LEVEL_META[t.level] || LEVEL_META.intermediate;
  const projsHtml = t.projects.map((p,i)=>`<div class="proj-item"><div class="proj-dot" style="background:${PROJECT_DOT_CYCLE[i%3]}"></div><div class="proj-text"><strong>${escapeHtml(p.title)}</strong> — ${mdBold(p.description)}</div></div>`).join('');
  const srcsHtml = t.sources.map(s=>{
    const label = s.url ? `<a href="${escapeAttr(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.label)}</a>` : escapeHtml(s.label);
    return `<div class="source-item"><span class="src-badge src-${s.badge}">${s.badge}</span><div class="src-text">${label}${s.note ? ' — '+escapeHtml(s.note) : ''}</div></div>`;
  }).join('');
  const subHtml = t.subtopics.map(s=>`<span class="stag">${escapeHtml(s)}</span>`).join('');
  const notesHtml = t.notesUrl ? `<a class="notes-pill" href="${escapeAttr(t.notesUrl)}" target="_blank" rel="noopener">📓 Open my RemNote note ↗</a>` : '';

  const practicePrompt = `Give me a practice problem for "${t.title}" that I can solve on my own dataset. Don't give me the final answer — if I get stuck, guide me with hints and questions instead of solving it for me.`;
  const projectPrompt = `I'm working through these projects to learn "${t.title}":\n${t.projects.map(p=>'- '+p.title).join('\n')}\nHelp me plan the first one step by step. Ask me guiding questions rather than handing me the finished solution.`;
  const resourcePrompt = `I'm learning "${t.title}". I already have these resources:\n${t.sources.map(s=>'- '+s.label).join('\n')}\nCan you suggest 2-3 more good resources, and quiz me on the fundamentals before explaining anything?`;

  return `
  <div class="topic-block lv-${t.level}" id="block-${t.id}">
    <div class="level-stripe"></div>
    <div class="topic-main">
      <div class="topic-header" id="hdr-${t.id}" onclick="toggleBody('${t.id}')">
        <div class="check ${t.done?'done':''}" onclick="event.stopPropagation();toggleDone('${mainId}','${t.id}')"></div>
        <div style="flex:1;min-width:0">
          <div class="topic-title" style="${t.done?'text-decoration:line-through;color:var(--ink-faint)':''}">${escapeHtml(t.title)}</div>
          <div class="topic-sub">Tap to expand · check off once confirmed</div>
        </div>
        <span class="topic-level" style="background:${lm.bg};color:${lm.fg}">${lm.label}</span>
        <div class="kebab-wrap">
          <button class="kebab-btn" onclick="event.stopPropagation();toggleKebab('${t.id}')">⋮</button>
          <div class="kebab-menu" id="kebab-${t.id}">
            <button onclick="event.stopPropagation();openTopicModal('${mainId}','${t.id}')">Edit</button>
            <button class="danger" onclick="event.stopPropagation();deleteTopic('${mainId}','${t.id}')">Delete</button>
          </div>
        </div>
        <span class="chevron">▶</span>
      </div>
      <div class="topic-body" id="body-${t.id}">
        <div class="topic-body-inner">
          <div class="topic-desc">${escapeHtml(t.desc)}</div>
          ${notesHtml}
          <div class="section-mini-row"><div class="section-mini">Specific subtopics to know</div></div>
          <div class="subtopics">${subHtml || '<span class="topic-sub">None added yet</span>'}</div>

          <div class="section-mini-row">
            <div class="section-mini">Real projects that prove this topic</div>
            <button class="mini-copy-btn" onclick="copyPrompt(this, \`${escapeBacktick(projectPrompt)}\`)">⧉ copy prompt</button>
          </div>
          ${projsHtml || '<div class="topic-sub">None added yet</div>'}

          <div class="section-mini-row">
            <div class="section-mini">Where to learn &amp; practice</div>
            <button class="mini-copy-btn" onclick="copyPrompt(this, \`${escapeBacktick(resourcePrompt)}\`)">⧉ copy prompt</button>
          </div>
          ${srcsHtml || '<div class="topic-sub">None added yet</div>'}

          ${t.validate ? `<div class="validate-box"><div class="validate-title">How to confirm you own this topic</div><div class="validate-text">${escapeHtml(t.validate)}</div></div>` : ''}

          <button class="btn-ask" onclick="copyPrompt(this, \`${escapeBacktick(practicePrompt)}\`)">📋 Copy a practice-problem prompt</button>
        </div>
      </div>
    </div>
  </div>`;
}

function escapeBacktick(str){ return String(str).replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${'); }

/* ============================================================
   INTERACTIONS
   ============================================================ */
function switchTab(id){
  uiState.activeTab = id;
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  renderTabs(); // reapply active class correctly
  document.getElementById('panel-'+id).classList.add('active');
}

function toggleBody(id){
  const body = document.getElementById('body-'+id);
  const hdr = document.getElementById('hdr-'+id);
  const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';
  if(isOpen){ body.style.maxHeight = '0px'; hdr.classList.remove('open'); }
  else{ body.style.maxHeight = body.scrollHeight + 'px'; hdr.classList.add('open'); }
}

function toggleKebab(id){
  document.querySelectorAll('.kebab-menu.open').forEach(m=>{ if(m.id!=='kebab-'+id) m.classList.remove('open'); });
  document.getElementById('kebab-'+id).classList.toggle('open');
}
document.addEventListener('click', ()=> document.querySelectorAll('.kebab-menu.open').forEach(m=>m.classList.remove('open')) );

function toggleDone(mainId, topicId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  const t = mt.topics.find(x=>x.id===topicId);
  t.done = !t.done;
  saveState();
  renderPanel(mainId);
  refreshGlobal();
}

function setLevelFilter(mainId, lvl, btn){
  getFilter(mainId).level = lvl;
  renderPanel(mainId);
}
function toggleTagFilter(mainId, tag, btn){
  const f = getFilter(mainId);
  const idx = f.tags.indexOf(tag);
  if(idx>-1) f.tags.splice(idx,1); else f.tags.push(tag);
  renderPanel(mainId);
}
function setSearch(mainId, val){
  getFilter(mainId).search = val;
  renderList(mainId);
}

function refreshGlobal(){
  let done=0, total=0;
  state.mainTopics.forEach(mt=>{ total += mt.topics.length; done += mt.topics.filter(t=>t.done).length; });
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('g-count').textContent = done;
  document.getElementById('g-total').textContent = total;
  document.getElementById('g-pct').textContent = pct+'%';
}

function copyPrompt(btn, text){
  const done = ()=>{
    const original = btn.innerHTML;
    btn.innerHTML = btn.classList.contains('btn-ask') ? '✓ Copied — paste into any AI chat' : '✓ copied';
    btn.classList.add('copied');
    setTimeout(()=>{ btn.innerHTML = original; btn.classList.remove('copied'); }, 1800);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done){
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); done(); }catch(e){}
  document.body.removeChild(ta);
}

/* ============================================================
   DELETE
   ============================================================ */
function deleteTopic(mainId, topicId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  const t = mt.topics.find(x=>x.id===topicId);
  if(!confirm(`Delete "${t.title}"? This can't be undone (unless you have an exported backup).`)) return;
  mt.topics = mt.topics.filter(x=>x.id!==topicId);
  saveState();
  renderPanel(mainId);
  refreshGlobal();
}
function deleteMainTopic(mainId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  if(!confirm(`Delete the whole "${mt.name}" topic set and all its topics? This can't be undone (unless you have an exported backup).`)) return;
  state.mainTopics = state.mainTopics.filter(m=>m.id!==mainId);
  if(uiState.activeTab===mainId) uiState.activeTab = state.mainTopics[0] ? state.mainTopics[0].id : null;
  saveState();
  closeModal();
  render();
}

/* ============================================================
   EXPORT / IMPORT / RESET
   ============================================================ */
function exportData(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'skill-ledger-backup.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importData(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    try{
      const parsed = JSON.parse(e.target.result);
      if(!parsed.mainTopics) throw new Error('Missing mainTopics');
      state = parsed;
      uiState = { activeTab: state.mainTopics[0] ? state.mainTopics[0].id : null, filters:{} };
      saveState();
      render();
      alert('Backup imported successfully.');
    }catch(err){
      alert('That file doesn\'t look like a valid Skill Ledger backup.');
    }
  };
  reader.readAsText(file);
  evt.target.value = '';
}
function confirmReset(){
  if(!confirm('Reset everything to the starter SQL/Python set? This erases your current topics unless you\'ve exported a backup.')) return;
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  uiState = { activeTab: state.mainTopics[0].id, filters:{} };
  saveState();
  render();
}

/* ============================================================
   MODALS
   ============================================================ */
function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-root').innerHTML = '';
}
function closeModalOnOverlay(evt){
  if(evt.target.id==='modal-overlay') closeModal();
}

/* ---- Main topic (tab) modal ---- */
function openMainTopicModal(mainId){
  const isEdit = !!mainId;
  const mt = isEdit ? state.mainTopics.find(m=>m.id===mainId) : null;
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-header"><h2>${isEdit?'Edit topic set':'New topic set'}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Name</label>
        <input class="form-input" id="mt-name" placeholder="e.g. Excel, Statistics, SQL" value="${mt?escapeHtml(mt.name):''}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Short tag</label>
          <input class="form-input" id="mt-ext" maxlength="6" placeholder="e.g. xlsx" value="${mt?escapeHtml(mt.ext):''}">
          <div class="form-hint">Shown after the name, like <code>.sql</code></div></div>
        <div class="form-group" style="flex:0 0 70px"><label class="form-label">Color</label>
          <input type="color" class="form-color" id="mt-color" value="${mt?mt.color:'#0F766E'}"></div>
      </div>
    </div>
    <div class="modal-footer">
      ${isEdit ? `<button class="toolbar-btn danger" onclick="deleteMainTopic('${mainId}')">Delete set</button>` : ''}
      <button class="toolbar-btn" onclick="closeModal()">Cancel</button>
      <button class="btn-ask" style="margin-top:0" onclick="saveMainTopicModal(${isEdit?`'${mainId}'`:'null'})">Save</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}
function saveMainTopicModal(mainId){
  const name = document.getElementById('mt-name').value.trim();
  const ext = document.getElementById('mt-ext').value.trim() || 'new';
  const color = document.getElementById('mt-color').value;
  if(!name){ alert('Give this topic set a name first.'); return; }
  if(mainId){
    const mt = state.mainTopics.find(m=>m.id===mainId);
    mt.name = name; mt.ext = ext; mt.color = color;
  } else {
    const id = uid('mt');
    state.mainTopics.push({ id, name, ext, color, topics:[] });
    uiState.activeTab = id;
  }
  saveState();
  closeModal();
  render();
}

/* ---- Topic modal (add/edit) ---- */
function openTopicModal(mainId, topicId){
  const mt = state.mainTopics.find(m=>m.id===mainId);
  const isEdit = !!topicId;
  const t = isEdit ? mt.topics.find(x=>x.id===topicId) : {
    title:'', level:'foundation', desc:'', subtopics:[], projects:[], sources:[], notesUrl:'', validate:''
  };
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-header"><h2>${isEdit?'Edit topic':'Add topic to '+escapeHtml(mt.name)}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Title</label>
        <input class="form-input" id="tf-title" placeholder="e.g. Window Functions" value="${escapeHtml(t.title)}"></div>
      <div class="form-group"><label class="form-label">Level</label>
        <select class="form-select" id="tf-level">
          <option value="foundation" ${t.level==='foundation'?'selected':''}>Foundation</option>
          <option value="intermediate" ${t.level==='intermediate'?'selected':''}>Intermediate</option>
          <option value="advanced" ${t.level==='advanced'?'selected':''}>Advanced</option>
        </select></div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea class="form-textarea" id="tf-desc" placeholder="What is this topic and why does it matter?">${escapeHtml(t.desc)}</textarea></div>

      <div class="form-group"><label class="form-label">Subtopics</label>
        <div class="tag-box" id="tf-tagbox">
          ${t.subtopics.map(s=>tagChipHtml(s)).join('')}
          <input class="tag-input-field" id="tf-tag-input" placeholder="Type and press Enter…" onkeydown="handleTagKeydown(event)">
        </div>
      </div>

      <div class="form-group"><label class="form-label">Real projects</label>
        <div id="tf-projects">${t.projects.map(p=>projectRowHtml(p)).join('')}</div>
        <button type="button" class="repeat-add-btn" onclick="addProjectRow()">+ Add project</button>
      </div>

      <div class="form-group"><label class="form-label">Where to learn &amp; practice</label>
        <div id="tf-sources">${t.sources.map(s=>sourceRowHtml(s)).join('')}</div>
        <button type="button" class="repeat-add-btn" onclick="addSourceRow()">+ Add resource</button>
      </div>

      <div class="form-group"><label class="form-label">RemNote link (optional)</label>
        <input class="form-input" id="tf-notes" placeholder="https://www.remnote.com/..." value="${escapeHtml(t.notesUrl)}"></div>

      <div class="form-group"><label class="form-label">How you'll know you've mastered it (optional)</label>
        <textarea class="form-textarea" id="tf-validate" placeholder="e.g. Solve these two problems unaided...">${escapeHtml(t.validate)}</textarea></div>
    </div>
    <div class="modal-footer">
      ${isEdit ? `<button class="toolbar-btn danger" onclick="closeModal();deleteTopic('${mainId}','${topicId}')">Delete</button>` : ''}
      <button class="toolbar-btn" onclick="closeModal()">Cancel</button>
      <button class="btn-ask" style="margin-top:0" onclick="saveTopicModal('${mainId}', ${isEdit?`'${topicId}'`:'null'})">Save topic</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}

function tagChipHtml(tag){
  return `<span class="tag-chip-removable">${escapeHtml(tag)}<button type="button" onclick="this.parentElement.remove()">✕</button></span>`;
}
function handleTagKeydown(evt){
  if(evt.key==='Enter'){
    evt.preventDefault();
    const val = evt.target.value.trim();
    if(val){
      evt.target.insertAdjacentHTML('beforebegin', tagChipHtml(val));
      evt.target.value = '';
    }
  }
}
function projectRowHtml(p){
  p = p || {title:'',description:''};
  return `<div class="repeat-row">
    <button type="button" class="repeat-remove" onclick="this.parentElement.remove()">✕</button>
    <div class="form-group" style="margin-bottom:8px"><label class="form-label">Project title</label>
      <input class="form-input proj-title" placeholder="e.g. Rolling 7-day call volume" value="${escapeHtml(p.title)}"></div>
    <div class="form-group" style="margin-bottom:0"><label class="form-label">Description</label>
      <textarea class="form-textarea proj-desc" placeholder="What will you build and what does it prove?">${escapeHtml(p.description)}</textarea></div>
  </div>`;
}
function addProjectRow(){
  document.getElementById('tf-projects').insertAdjacentHTML('beforeend', projectRowHtml());
}
function sourceRowHtml(s){
  s = s || {label:'',url:'',badge:'FREE',note:''};
  return `<div class="repeat-row">
    <button type="button" class="repeat-remove" onclick="this.parentElement.remove()">✕</button>
    <div class="form-row" style="margin-bottom:8px">
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Label</label>
        <input class="form-input src-label" placeholder="e.g. LeetCode — Database problems" value="${escapeHtml(s.label)}"></div>
      <div class="form-group" style="flex:0 0 110px;margin-bottom:0"><label class="form-label">Type</label>
        <select class="form-select src-badge">
          <option value="FREE" ${s.badge==='FREE'?'selected':''}>Free</option>
          <option value="PAID" ${s.badge==='PAID'?'selected':''}>Paid</option>
          <option value="VIDEO" ${s.badge==='VIDEO'?'selected':''}>Video</option>
          <option value="PRACTICE" ${s.badge==='PRACTICE'?'selected':''}>Practice</option>
        </select></div>
    </div>
    <div class="form-group" style="margin-bottom:8px"><label class="form-label">Link (leave blank if none)</label>
      <input class="form-input src-url" placeholder="https://..." value="${escapeHtml(s.url)}"></div>
    <div class="form-group" style="margin-bottom:0"><label class="form-label">Note</label>
      <input class="form-input src-note" placeholder="Why this resource, in a few words" value="${escapeHtml(s.note)}"></div>
  </div>`;
}
function addSourceRow(){
  document.getElementById('tf-sources').insertAdjacentHTML('beforeend', sourceRowHtml());
}

function saveTopicModal(mainId, topicId){
  const title = document.getElementById('tf-title').value.trim();
  if(!title){ alert('Give this topic a title first.'); return; }
  const level = document.getElementById('tf-level').value;
  const desc = document.getElementById('tf-desc').value.trim();
  const notesUrl = document.getElementById('tf-notes').value.trim();
  const validate = document.getElementById('tf-validate').value.trim();

  const subtopics = [...document.querySelectorAll('#tf-tagbox .tag-chip-removable')].map(el=>el.firstChild.textContent.trim());

  const projects = [...document.querySelectorAll('#tf-projects .repeat-row')].map(row=>({
    title: row.querySelector('.proj-title').value.trim(),
    description: row.querySelector('.proj-desc').value.trim()
  })).filter(p=>p.title || p.description);

  const sources = [...document.querySelectorAll('#tf-sources .repeat-row')].map(row=>({
    label: row.querySelector('.src-label').value.trim(),
    url: row.querySelector('.src-url').value.trim(),
    badge: row.querySelector('.src-badge').value,
    note: row.querySelector('.src-note').value.trim()
  })).filter(s=>s.label);

  const mt = state.mainTopics.find(m=>m.id===mainId);
  if(topicId){
    const t = mt.topics.find(x=>x.id===topicId);
    Object.assign(t, {title, level, desc, subtopics, projects, sources, notesUrl, validate});
  } else {
    mt.topics.push({ id:uid('t'), title, level, desc, subtopics, projects, sources, notesUrl, validate, done:false });
  }
  saveState();
  closeModal();
  renderPanel(mainId);
  refreshGlobal();
}

/* ============================================================
   INIT
   ============================================================ */
render();
