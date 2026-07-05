# Data Skill Ledger

A personal, always-online tracker for your SQL / Python (and anything else you
add later) upskilling journey. Static site — no server, no build step,
no database. GitHub Pages just serves the three files as-is.

## 1. Put it on GitHub Pages (one-time setup)

1. Create a new repository on GitHub — call it whatever you like, e.g. `skill-ledger`.
2. Upload these four files to the root of that repo: `index.html`, `app.js`, `style.css`, `data.js`.
   (Drag-and-drop them on the GitHub web UI under "Add file → Upload files" if you don't use git locally.)
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait ~1 minute, then GitHub gives you a URL like `https://yourusername.github.io/skill-ledger/`. Open it — that's your live tool.

Any time you edit `data.js` and push the change, the live site updates automatically within a minute or two. No rebuild step.

## 2. How the files fit together

- **`index.html`** — the page shell. You shouldn't need to touch this.
- **`style.css`** — all the visual styling (colors, fonts, layout, responsiveness). Only touch this if you want to change the look.
- **`app.js`** — the logic: rendering topics, progress tracking, filters, the "+ Add topic" form, copy-to-clipboard prompts. Only touch this if you want new behavior.
- **`data.js`** — **this is the file you'll actually edit.** Every topic, project, resource link, and note lives here as a plain JavaScript object. It has a comment block at the top explaining the exact shape.

## 3. Adding a new topic

You don't need to hand-write the object in `data.js`. Instead:

1. Open the live site, click **"+ Add topic"**.
2. Fill in the title, level, description, subtopics, projects, resource links (LeetCode, HackerRank, YouTube, articles — pick a type or let it auto-detect from the URL), and your RemNote link if you have one.
3. Click **"Generate code"** — it prints a ready-to-paste JavaScript object.
4. Click **"Copy code"**, then paste it into `data.js`:
   - If it's a **topic** for an existing track, paste it inside that track's `topics: [ ... ]` array (remember the comma after the previous item).
   - If it's a **whole new track** (e.g. "Excel & BI"), paste it as a new object inside the top-level `tracks: [ ... ]` array.
5. Commit and push. The live site picks it up automatically.

This "generate then paste" flow is deliberate: GitHub Pages can't run a database, so there's no way for a button click to save permanently on its own. Routing edits through `data.js` and git means every change is versioned, free, and works from any device once pushed — you just do the one extra copy/paste step.

## 4. Progress tracking

Checking off a topic saves in that browser's `localStorage`, keyed per track. It's local to whichever browser/device you're using — it does **not** sync across devices, since that would need a backend. If you use the tool from your phone and your laptop, you'll have two independent progress states. (If that becomes annoying, the natural next step is a tiny backend or a service like Firebase — worth revisiting once the content side feels solid.)

## 5. Subtopic filtering

Each track panel shows a cloud of every subtopic used across its topics. Click one to filter the topic list down to anything tagged with it — useful once you have 15–20 topics in a track and want to jump straight to, say, everything touching "window functions". Clicking a subtopic chip *inside* an expanded topic does the same thing.
