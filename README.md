# CareerPath

Interactive student skill assessment and learning platform (SDG 4, SDG 8, SDG 10).

## Run it
Open `index.html` in a browser. No install or server needed. (Fonts load from Google Fonts when online; the site falls back to system fonts offline.)

## Files
```
index.html        Home
assessment.html   12-question skill assessment
analysis.html     Skill scores, areas to develop, learning path
quiz.html         5-question quiz per skill
dashboard.html    Stats, progress, quiz history
css/style.css     All styling
js/data.js        Skills, questions, learning paths, quizzes (edit content here)
js/app.js         Logic: scoring, DOM rendering, LocalStorage
docs/             Use case diagram, use case specifications, design guide, reference screens
```

## LocalStorage keys
`careerpath.draft`, `careerpath.result`, `careerpath.progress`, `careerpath.quizzes`
(Clear them from the "Reset all saved data" link on the dashboard.)
