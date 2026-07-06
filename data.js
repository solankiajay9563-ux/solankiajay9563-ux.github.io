/*
  ============================================================
  DATA FILE — this is the only file you need to touch to grow
  your ledger. Everything else (index.html, app.js, style.css)
  just reads this object and renders it.

  STRUCTURE
  window.skillData = {
    tracks: [
      {
        id:    'sql',                unique, no spaces, lowercase
        name:  'SQL',                shown on the tab
        ext:   '.sql',               shown in mono next to the name
        color: '#0F766E',            accent used for this track's bar/tabs
        topics: [ { ...topic }, ... ]
      },
      {
        id: "regex",
        name: "Regex",
        ext: ".rgx",
        color: "#9D174D",
        topics: [{id: "regex-regex-module",title: "Regex Module",level: "intermediate",
      desc: "",
      subtopics: [],
      projects: [
    
      ],
      sources: [
        { free: true, category: "practice", label: "Hackerrank", url: "https://www.hackerrank.com/domains/regex?filters%5Bstatus%5D%5B%5D=unsolved" }
      ],
      validate: "Try all problems on this topic on HackerRank"
    }
  ]
}
      ...
    ]
  }

  Each topic object:
    {
      id:        'sql-ctes',                 unique across the whole file
      title:     'CTEs (Common Table Expressions)',
      level:     'foundation' | 'intermediate' | 'advanced',
      desc:      'one paragraph, plain text or simple <em>/<strong> html',
      subtopics: ['tag one', 'tag two', ...],
      projects:  [ { text: '<strong>Name</strong> — description' }, ... ],
      sources:   [
        { free:true, label:'Mode Analytics — CTE Tutorial',
          url:'https://mode.com/...', category:'article' },
        ...
        category is one of: 'article' | 'practice' | 'video' | 'other'
        ('practice' = leetcode/hackerrank/stratascratch-style problem sets,
         'video' = youtube, 'article' = written tutorial/docs,
         'other' = anything else). If you omit category, the app
         guesses it from the URL — but setting it explicitly is more
         reliable.
      ],
      notes: { url:'https://remnote.com/...', label:'My RemNote notes' }
             — optional. Omit the whole "notes" key if you don't have one yet.
      validate:  'how you prove to yourself you actually know this'
    }

  HOW TO ADD A NEW TOPIC
  Use the "+ Add topic" button in the app — fill the form, click
  "Generate code", then paste the object it gives you into the right
  track's topics array below (or into a brand-new track object).
  Commit + push, and GitHub Pages picks it up automatically.
  ============================================================
*/

window.skillData = {
  tracks: [
    {
      id: 'sql',
      name: 'SQL',
      ext: '.sql',
      color: '#0F766E',
      topics: [
        {
          id: 'sql-ctes',
          title: 'CTEs (Common Table Expressions)',
          level: 'intermediate',
          desc: 'Named temporary result sets defined with WITH. Make complex queries readable and reusable. Replace nested subqueries. Foundational for all advanced SQL work.',
          subtopics: ['WITH clause syntax', 'Multiple chained CTEs', 'Replacing subqueries', 'Recursive CTEs (basic)'],
          projects: [
            { text: '<strong>Rolling 7-day call volume</strong> — Use your Petpooja call log data. Write a CTE that calculates daily call counts, then query it to get 7-day rolling sums per agen[...]},
            { text: '<strong>E-commerce funnel analysis</strong> — Olist dataset. CTE layer 1: sessions per user. CTE layer 2: purchases per user. Final: conversion rate per category.' },
            { text: '<strong>Customer cohort retention</strong> — Find users who signed up in month X and came back in month X+1, X+2. Classic interview problem, forces multi-CTE thinking.' }
          ],
          sources: [
            { free: true, category: 'article', label: 'Mode Analytics — CTE Tutorial', url: 'https://mode.com/sql-tutorial/sql-with/' },
            { free: true, category: 'practice', label: 'LeetCode — Database Medium problems', url: 'https://leetcode.com/tag/database/' },
            { free: true, category: 'article', label: 'PostgreSQL Tutorial — CTEs', url: 'https://www.postgresqltutorial.com/postgresql-cte/' }
          ],
          validate: 'Solve LeetCode #185 (Department Top Three Salaries) and #262 (Trips and Users) using CTEs without looking at solutions. If you can write them cleanly in one attempt, you own C[...]
        },
        {
          id: 'sql-window',
          title: 'Window Functions',
          level: 'advanced',
          desc: 'Perform calculations across rows related to the current row — without collapsing them like GROUP BY does. The single biggest jump from intermediate to advanced SQL. Tested in a[...]
          subtopics: ['ROW_NUMBER / RANK / DENSE_RANK', 'LAG and LEAD', 'SUM/AVG/COUNT OVER', 'PARTITION BY vs ORDER BY', 'ROWS BETWEEN (frames)'],
          projects: [
            { text: '<strong>Agent performance ranking by week</strong> — Rank agents by calls/conversions within each week. Use RANK() OVER (PARTITION BY week ORDER BY conversions DESC). Show [...]
            { text: '<strong>Running revenue total — e-commerce</strong> — Olist dataset. SUM(revenue) OVER (PARTITION BY seller ORDER BY order_date ROWS UNBOUNDED PRECEDING). A standard BI r[...]
            { text: '<strong>Month-over-month growth calculator</strong> — Any sales dataset. Use LAG(revenue, 1) to calculate MoM change % per product. Highly interview-relevant.' }
          ],
          sources: [
            { free: true, category: 'article', label: 'windowfunctions.com — interactive playground', url: 'https://www.windowfunctions.com' },
            { free: true, category: 'article', label: 'Mode Analytics — Window Functions', url: 'https://mode.com/sql-tutorial/sql-window-functions/' },
            { free: true, category: 'practice', label: 'LeetCode Top SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/' }
          ],
          validate: 'Solve LeetCode #184 (Department Highest Salary), #178 (Rank Scores), and #180 (Consecutive Numbers) — all three using window functions. If you solve them unaided, you are i[...]
        },
        {
          id: 'sql-joins',
          title: 'Advanced JOINs & Self JOINs',
          level: 'intermediate',
          desc: 'You likely know INNER/LEFT JOIN. The gaps are SELF JOIN (a table joined to itself), non-equi joins, and understanding when to use each. Commonly tested with org-chart or comparis[...]
          subtopics: ['SELF JOIN', 'Non-equi JOIN', 'CROSS JOIN use cases', 'Multiple table JOINs', 'JOIN vs subquery performance intuition'],
          projects: [
            { text: '<strong>Manager salary comparison</strong> — Classic: employees table joined to itself. Find employees who earn more than their manager. Teaches self-join pattern completel[...]
            { text: '<strong>Product pair analysis</strong> — Find all pairs of products bought together in the same order (CROSS JOIN or self-join on order_items). Common in e-commerce analyti[...]
          ],
          sources: [
            { free: true, category: 'practice', label: 'StrataScratch — real interview questions', url: 'https://www.stratascratch.com' },
            { free: true, category: 'article', label: 'SQLZoo — Self Join', url: 'https://sqlzoo.net/wiki/Self_join' }
          ],
          validate: 'LeetCode #181 (Employees Earning More Than Managers) and #197 (Rising Temperature). Solve without hints. Completing them in under 15 min each = solid.'
        },
        {
          id: 'sql-aggregation',
          title: 'Aggregations & Grouping Patterns',
          level: 'intermediate',
          desc: 'You know basic GROUP BY. The advanced layer is conditional aggregation (CASE inside SUM), HAVING filters, ROLLUP/CUBE, and multi-level aggregation patterns common in business rep[...]
          subtopics: ['Conditional aggregation (SUM CASE WHEN)', 'HAVING vs WHERE', 'ROLLUP / CUBE (bonus)', 'Aggregating after window functions', 'Pivot using aggregation'],
          projects: [
            { text: "<strong>Call outcome pivot table</strong> — Using your Petpooja data conceptually: count calls per agent split by outcome (answered/missed/transferred) as columns, using SU[...]
            { text: '<strong>Monthly sales report with subtotals</strong> — Use ROLLUP to get per-category totals AND a grand total in one query. Show this as an "executive summary SQL".' }
          ],
          sources: [
            { free: true, category: 'article', label: 'Mode Analytics — Aggregations', url: 'https://mode.com/sql-tutorial/sql-aggregate-functions/' },
            { free: true, category: 'practice', label: 'HackerRank — Advanced Aggregation', url: 'https://www.hackerrank.com/domains/sql' }
          ],
          validate: 'Write one query that produces a pivot-style report (outcomes as columns) from any dataset using only CASE WHEN inside SUM. If it runs correctly first try, this topic is close[...]
        },
        {
          id: 'sql-subqueries',
          title: 'Subqueries & Correlated Subqueries',
          level: 'intermediate',
          desc: 'Subqueries inside SELECT, FROM, WHERE, and HAVING. Correlated subqueries reference the outer query — slow but heavily tested in interviews. Understanding when to replace them w[...]
          subtopics: ['Scalar subquery in SELECT', 'Correlated subquery in WHERE', 'Exists vs IN vs JOIN', 'Subquery vs CTE decision'],
          projects: [
            { text: '<strong>Find agents above average performance</strong> — Subquery calculates average, outer query filters. Then rewrite the same thing as a CTE and compare.' }
          ],
          sources: [
            { free: true, category: 'article', label: 'SQLite Tutorial — Correlated Subqueries', url: 'https://www.sqlitetutorial.net/sqlite-correlated-subquery/' },
            { free: true, category: 'practice', label: 'LeetCode #185, #262', url: 'https://leetcode.com/tag/database/' }
          ],
          validate: "LeetCode #184 and #626. Solve first with a subquery, then rewrite with a CTE. If you can do both and explain why one is more readable, you've closed this topic."
        },
        {
          id: 'sql-datetime',
          title: 'Date & Time Manipulation',
          level: 'intermediate',
          desc: 'Every real business dataset has timestamps. Date filtering, truncating to month/week, date differences, and formatting are tested constantly in take-home assignments.',
          subtopics: ['DATE_TRUNC / DATE_FORMAT', 'DATEDIFF / AGE', 'Extracting parts (YEAR, MONTH, DOW)', 'Filtering date ranges', 'Current date logic (NOW, TODAY)'],
          projects: [
            { text: '<strong>Cohort analysis by signup month</strong> — Group users by the month they signed up, calculate how many returned each subsequent month.' },
            { text: '<strong>Business hours call filtering</strong> — Filter call data to only 9am–6pm weekdays using EXTRACT(DOW) and EXTRACT(HOUR).' }
          ],
          sources: [
            { free: true, category: 'article', label: 'W3Schools SQL Dates', url: 'https://www.w3schools.com/sql/sql_dates.asp' },
            { free: true, category: 'article', label: 'Mode Analytics — Date/Time', url: 'https://mode.com/sql-tutorial/sql-datetime-format/' }
          ],
          validate: 'Write a query that: (1) finds the count of events per day-of-week, (2) calculates the gap in days between consecutive events per user using LAG.'
        }
      ]
    },
    {
      id: 'py',
      name: 'Python · pandas',
      ext: '.py',
      color: '#4338CA',
      topics: [
        {
          id: 'py-core',
          title: 'pandas Core — Loading, Cleaning, Shaping',
          level: 'foundation',
          desc: "The absolute bedrock. 80% of analyst Python work is here. You already use pandas in your pipeline — the goal is going deeper: methodically handling any messy dataset you're han[...]
          subtopics: ['read_csv / read_excel with options', 'Handling nulls (fillna, dropna, isna)', 'dtype conversion', 'rename / drop / reindex', 'String cleaning (str.strip, str.lower, str.rep[...]
          projects: [
            { text: '<strong>Dirty data cleaning challenge</strong> — Download any messy Kaggle dataset. Document every cleaning step in a Jupyter notebook with before/after value counts.' },
            { text: "<strong>Reframe your Petpooja script</strong> — Extract just the cleaning portion of your pipeline into a standalone notebook. Add markdown cells explaining each step." }
          ],
          sources: [
            { free: true, category: 'video', label: 'Luke Barousse — Python for Data Analytics (14hr)', url: 'https://www.youtube.com/watch?v=2uvysYbKdjM' },
            { free: true, category: 'practice', label: 'Kaggle Learn — Pandas', url: 'https://kaggle.com/learn/pandas' },
            { free: true, category: 'article', label: 'pandas official User Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html' }
          ],
          validate: 'Complete the Kaggle Pandas micro-course and get the certificate. Passing it with no hints = confirmed foundation.'
        },
        {
          id: 'py-groupby',
          title: 'groupby, agg, pivot_table',
          level: 'intermediate',
          desc: "The pandas equivalent of SQL's GROUP BY. groupby().agg() lets you apply multiple functions simultaneously. pivot_table reshapes data into summary tables.",
          subtopics: ['groupby single and multiple columns', 'agg with dict (multiple functions)', 'Named aggregations', 'pivot_table with values/index/columns/aggfunc', 'value_counts and crossta[...]
          projects: [
            { text: "<strong>Agent performance summary table</strong> — From call log CSV: groupby agent → agg(calls='count', avg_duration='mean'). Output a ranked summary table." },
            { text: "<strong>Sales pivot by category & region</strong> — Olist dataset. pivot_table(values='revenue', index='product_category', columns='state', aggfunc='sum')." }
          ],
          sources: [
            { free: true, category: 'article', label: 'Real Python — pandas GroupBy', url: 'https://realpython.com/pandas-groupby/' },
            { free: true, category: 'video', label: 'Corey Schafer — pandas groupby', url: 'https://www.youtube.com/watch?v=txMdrV1Ut64' }
          ],
          validate: "Without looking at docs, write groupby code that calculates mean, max, and count simultaneously for 3 columns on a dataset you haven't used before."
        },
        {
          id: 'py-merge',
          title: 'merge, join, concat',
          level: 'intermediate',
          desc: 'pandas equivalent of SQL JOINs. Analysts constantly combine datasets — orders with customers, calls with agents, products with categories.',
          subtopics: ['pd.merge — how, on, left_on/right_on', 'merge vs join vs concat', 'Handling duplicate column names after merge', 'Detecting bad merges (many-to-many)', 'pd.concat along a[...]
          projects: [
            { text: '<strong>Enrich call logs with agent metadata</strong> — Merge a call log DataFrame with an agent info DataFrame on agent_id, then find calls where agent is missing (left jo[...]
            { text: '<strong>Combine multiple monthly CSV files</strong> — Read 12 monthly CSVs in a loop, pd.concat them into one DataFrame, then analyse the full year.' }
          ],
          sources: [
            { free: true, category: 'article', label: 'Real Python — merge, join, concat', url: 'https://realpython.com/pandas-merge-join-and-concatenate/' },
            { free: true, category: 'article', label: 'pandas merge docs', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html' }
          ],
          validate: 'Download two related Kaggle datasets, merge them, and verify the row count matches your expectation (no accidental duplicates).'
        },
        {
          id: 'py-apply',
          title: 'apply, map, lambda, vectorisation',
          level: 'intermediate',
          desc: 'Transforming column values. apply() runs a function row-by-row or column-by-column. map() replaces values. Vectorised operations (avoid loops) are the professional way — interv[...]
          subtopics: ['Series.apply() vs DataFrame.apply()', 'map() for value replacement', 'lambda functions in apply', 'np.where for conditional columns', 'Avoiding for loops — vectorised ope[...]
          projects: [
            { text: '<strong>Agent name normalisation</strong> — Refactor a cleaning loop into a clean apply/map pattern instead. Show before and after in a notebook.' },
            { text: '<strong>Derived feature engineering</strong> — Create 3 new columns using apply/lambda: a bucketed age group, a revenue tier, and a weekend flag.' }
          ],
          sources: [
            { free: true, category: 'article', label: 'Real Python — pandas apply()', url: 'https://realpython.com/pandas-apply/' },
            { free: true, category: 'video', label: 'Codebasics — pandas apply', url: 'https://www.youtube.com/watch?v=7oa0NjPMIzA' }
          ],
          validate: 'Rewrite any for-loop-based column transformation using apply() or np.where(). Time both versions on 100k rows using %timeit.'
        },
        {
          id: 'py-viz',
          title: 'Data Visualisation — matplotlib & seaborn',
          level: 'intermediate',
          desc: "Analysis means nothing if you can't show it. matplotlib for control, seaborn for quick statistical plots. Every portfolio project needs at least 3–4 well-formatted charts.",
          subtopics: ['Line, bar, scatter, histogram, boxplot', 'Subplots (multiple charts in one figure)', 'Titles, axis labels, legends (non-negotiable)', 'Seaborn heatmap for correlation', 'Co[...]
          projects: [
            { text: '<strong>EV market trend charts</strong> — VAHAN data. Monthly registrations line chart, state-wise bar chart, brand market share bar. 4 charts, all labelled.' },
            { text: '<strong>Call centre daily report visual</strong> — Plot call volume by hour, agent performance comparison, and call outcome distribution.' }
          ],
          sources: [
            { free: true, category: 'video', label: 'Corey Schafer — matplotlib', url: 'https://www.youtube.com/watch?v=3Xc3CA655Y4' },
            { free: true, category: 'article', label: 'seaborn official tutorial', url: 'https://seaborn.pydata.org/tutorial.html' },
            { free: true, category: 'practice', label: 'Kaggle Learn — Data Visualisation', url: 'https://kaggle.com/learn/data-visualization' }
          ],
          validate: "Build a 4-chart figure (2x2 subplot grid) on any dataset, with proper titles, axis labels, and a saved PNG output — without looking at examples."
        },
        {
          id: 'py-eda',
          title: 'Exploratory Data Analysis (EDA) — Full Workflow',
          level: 'advanced',
          desc: 'EDA is what analysts actually do with data. Shape → nulls → distributions → correlations → outliers → hypothesis → insight. Interviewers ask "walk me through your EDA[...]
          subtopics: ['df.info(), .describe(), .shape', 'Null heatmaps', 'Correlation matrix + heatmap', 'Outlier detection (IQR, z-score)', 'Distribution plots per feature', 'Forming and testing[...]
          projects: [
            { text: '<strong>Full EDA on IBM HR Attrition dataset</strong> — Go through every feature, find 5 interesting patterns, write a conclusion section. Publish on Kaggle as a notebook.'[...]
            { text: '<strong>IPL match EDA</strong> — Cricsheet.org data. Does toss matter? Best death-over bowlers? Home advantage trends?' }
          ],
          sources: [
            { free: true, category: 'article', label: 'Kaggle — Detailed EDA reference notebook', url: 'https://www.kaggle.com/code/ekami66/detailed-exploratory-data-analysis-with-python' },
            { free: true, category: 'video', label: 'Ken Jee — EDA project walkthrough', url: 'https://www.youtube.com/watch?v=xi0vhXFPegw' }
          ],
          validate: 'Publish your EDA notebook on Kaggle. Get at least 3 upvotes from strangers — honest, external confirmation your work is clear and valuable.'
        },
        {
          id: 'py-notebooks',
          title: 'Jupyter Notebooks — Professional Presentation',
          level: 'foundation',
          desc: 'Your code is your presentation layer in data roles. Messy notebooks with no markdown = junior signal. Clean notebooks with headers, insight callouts, and conclusions = analyst si[...]
          subtopics: ['Markdown cells for context and conclusions', 'Hiding implementation cells (input hiding)', 'Notebook structure: question → data → analysis → insight', 'Exporting to H[...]
          projects: [
            { text: "<strong>Reformat one existing project as a proper notebook report</strong> — Problem statement, data overview, analysis with markdown narration, key findings, limitations."[...]
          ],
          sources: [
            { free: true, category: 'video', label: 'Corey Schafer — Jupyter Notebook tips', url: 'https://www.youtube.com/watch?v=HW29067qVWk' },
            { free: true, category: 'other', label: 'nbviewer.org — share any notebook as a rendered page', url: 'https://nbviewer.org' }
          ],
          validate: 'Share a notebook link with someone non-technical and ask: "Can you understand what I found without me explaining it?" If yes — confirmed.'
        }
      ]
    },
    {
      id: "regex",
      name: "Regex",
      ext: ".Rgx",
      color: "#9D174D",
      topics: [
        {
          id: "regex-regex-module",
          title: "Regex Module",
          level: "intermediate",
          desc: "Pattern Matching, String Matching",
          subtopics: ["Literal Characters"],
          projects: [
            { text: "Pending To add here" }
          ],
          sources: [
            { free: true, category: "practice", label: "Hackerrank", url: "https://www.hackerrank.com/domains/regex?filters%5Bstatus%5D%5B%5D=unsolved" },
            { free: true, category: "practice", label: "Leetcode - Solve all Regex Problems", url: "https://leetcode.com/studyplan/top-sql-50/" }
          ],
          notes: { url: "https://www.remnote.com/w/6a49e95ee028ccd69b806a62/Regex-Gc8gjEQ0gdzsXwXPB", label: "Notes On Regex" },
          validate: "Solve all problems on the given link"
        }
      ]
    }
  ]
};
