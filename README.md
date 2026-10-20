# CareerCraft – Explore + Grow (MongoDB Edition)

CareerCraft is a Web Programming mini-project designed around **two student journeys**:

1. **Discover suitable careers:** Students rate seven interests, receive a ranked list of 12 engineering/technology paths, see *why* each option was suggested, and can select any career to explore.
2. **Improve skills for a chosen career:** Students choose a specific career, complete a 24-question self-assessment (three scenarios per skill), view eight skill scores and career-prioritized gaps, follow small learning activities, take quizzes, and track improvement over time.

> Career matching is a transparent **exploration heuristic**, not an aptitude test or a probability of job success. Self-assessment scores are **indicative** and should not be interpreted as validated measurements. Students should consider actual interests, coursework, projects, work exposure, job requirements, and guidance from people in the field.

## What's new in this edition

| Feature | What it does |
|---|---|
| **Career Matches** (`explore.html`) | Seven 1–5 interest sliders rank 12 careers. The app shows the top interests and (if there is an assessment) priority skills for each match. |
| **Transparent ranking** | For users without an assessment, the ranking uses interests only. With assessment data, it blends **70% interest fit + 30% indicative skill fit**. The displayed `0–100` number is an internal exploration score, not a probability. |
| **Behavior-focused assessment (v2)** | Every career has 24 scenario questions (three per skill) with realistic response choices and no reliably "correct" position. The scoring key is private to the server, and every answer position is the highest-scoring choice exactly six times per assessment. |
| **Server-scored results** | The Express backend validates all 24 answer indices, uses a private question-specific scoring key, and creates a new assessment document per attempt. Scores are no longer based on response position. The UI asks for an honest review and warns users about extreme straight-line answering. |
| **Saved assessment history** | Each attempt is preserved in MongoDB with an `assessmentVersion`; the growth chart compares only v2 attempts using the same scoring method. Prior attempts remain stored but are not directly comparable, even if they also contain 24 questions. |
| **Server-graded quizzes** | The server validates and grades submitted answers, then creates one MongoDB quiz document per attempt. |
| **Actionable learning paths** | Recommended skill paths include practical self-directed tasks and external learning resources as well as completion checkboxes and practice quizzes. |
| **Dashboard improvements** | Filter the quiz trend by skill, inspect assessment history, and use **Print / Save report as PDF** (the browser's print dialog; no PDF is generated on the backend). |
| **Career search** | Filter the 12 career cards by title, description, and typical tools. |
| **Authentication and persistence** | bcrypt password hashing, MongoDB-backed session cookies, basic same-origin checking and an in-process login-attempt limiter. |

## Install and run (Windows + VS Code)

**Requirements**: Node.js 18 or later (`node -v`, `npm -v`); **MongoDB Community Server** running locally; MongoDB Compass optional to inspect data. Compass alone is not the server.

1. Extract `CareerCraft_Explore_Grow_MongoDB.zip` and open the **CareerCraft-Standout** folder in VS Code. It must contain `package.json`.
2. If MongoDB is installed as a Windows service, open `services.msc`, find **MongoDB Server**, and click **Start**. Compass should connect to `mongodb://127.0.0.1:27017`.
3. From VS Code **Terminal > New Terminal**, run:

   ```powershell
   dir
   npm install
   npm start
   ```

4. Open **http://localhost:3000** in Chrome. Do **not** use Live Server, double-click an HTML file, or use `npm run dev` from another React project: this project has an Express backend, not Vite.
5. Register an account (password **at least eight characters**). Then try either journey:
   - **Unsure of a career?** Home → **Career Matches** → rate seven interests → **Show my career matches** → select a suggested career → assessment.
   - **Already chosen a career?** Home → **Careers** → choose one of 12 → 24-question assessment → **Analysis** → learning activity → quiz → **Dashboard**.

### Environment variables (optional for local use)

```powershell
Copy-Item .env.example .env
```

Edit `.env` as needed:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/careercraft
PORT=3000
SESSION_SECRET=replace-this-with-a-long-random-secret
```

For any shared deployment, configure a unique strong `SESSION_SECRET`; use HTTPS and review the security section below. **Do not upload a real `.env` file or credentials to GitHub.**

### View data in MongoDB Compass

Connect to `mongodb://127.0.0.1:27017`, open database `careercraft` and check **Documents** for:

| Collection | Contents |
|---|---|
| `users` | Account name/email, hashed password, selected career, interests, unfinished assessment draft |
| `assessments` | **One document per completed assessment attempt**, including career, answers, eight scores, date, question count |
| `quizzes` | One document per quiz attempt, graded score, skill and date |
| `progress` | Completed learning steps per skill |
| `sessions` | MongoDB-backed login sessions, managed by `connect-mongo` |

Select **Refresh** in Compass if new records have not appeared.

### Assessment question and scoring design (v2)

- **What changed:** The previous 0–3 index-based answer options created an easy exploit: selecting the fourth option always maximized the score. That design was replaced with context-specific, behavior-based scenarios with four plausible trade-offs, balanced wording lengths, and randomized score positions in a stable authored question bank. The 24 questions are interleaved across skills.
- **Where to edit:** `public/js/data.js` holds only public question and option wording. `server/assessment-keys.json` holds each option's scoring weight and **must not be moved into `public/`**. The server joins these by question ID in `server/scoring.js`. If you edit or reorder an existing question's options, also update its server weights and tests; otherwise scoring becomes wrong. Create a fresh assessment version for substantial changes.
- **Old data:** Assessment drafts from older formats are ignored because v2 question IDs have a new prefix. Completed assessments remain saved. MongoDB documents include `assessmentVersion: 2` for new results; older versions default to 1 in the API. The dashboard only charts comparable v2 assessment attempts.
- **What it cannot prove:** This remains an **indicative self-assessment**, not a psychometrically validated career assessment. A determined person can still misrepresent their behaviors, so interpret percentages as reflection prompts, corroborate them with skills-based quizzes and projects, and avoid high-stakes claims.

### API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check MongoDB connection |
| GET | `/api/bootstrap` | Load signed-in account, current assessment, up to 50 historical assessments, progress, quizzes, interests |
| POST | `/api/register` / `/api/login` / `/api/logout` | Authentication |
| PUT | `/api/state/career` | Select career |
| PUT | `/api/state/draft` | Save unfinished assessment answers |
| POST | `/api/assessment/submit` | Validate and grade all answers on server; save new attempt |
| PUT | `/api/state/progress` | Save checked learning steps |
| POST | `/api/quiz/submit` | Validate and grade quiz on server; save attempt |
| PUT | `/api/interests` | Save seven 1–5 interest ratings |
| GET | `/api/matches` | Retrieve ranked, explainable career suggestions |
| DELETE | `/api/state` | Clear **all** user career state, interests, assessments, quizzes and learning progress, retaining account |

The scoring/ranking logic is in `server/scoring.js` and `server/matching.js`. The same career and quiz data is exported from `public/js/data.js` in Node and loaded in the browser.

## Project structure

```text
CareerCraft-Standout/
├── package.json
├── .env.example
├── server/
│   ├── index.js          Express APIs, session & Mongoose schemas
│   ├── scoring.js        Assessment / quiz server scoring
│   └── matching.js       Interests and explainable match ranking
├── tests/
│   └── logic.test.js     Automated catalog, scoring and matching tests
└── public/
    ├── index.html        Two student entry journeys
    ├── explore.html      Interests → ranked career suggestions
    ├── careers.html      Career picker and text filtering
    ├── assessment.html   24 scenario prompts
    ├── analysis.html     Radar/doughnut charts and learning plan
    ├── quiz.html         Skill quizzes
    ├── dashboard.html    Growth + quiz trends / report printing
    ├── login.html, register.html
    ├── css/style.css
    └── js/data.js, js/app.js, js/charts.js
```

## Existing MongoDB accounts / migration

**Do not delete your previous MongoDB database.** Using the same `MONGODB_URI` loads your earlier users, progress and quizzes, with the same login credentials. Existing assessment documents remain. At startup the backend **drops the obsolete unique `assessments.userId_1` index** used by the old version, allowing multiple attempts per user. It only drops that named index when marked unique. `questionCount` is missing from old attempts; the dashboard warns that older 10-question scores are not strictly comparable with current 24-question results.

If an older server is already running on port 3000, stop it (`Ctrl + C`) before starting this version. Do not run both versions against the same database concurrently.

## Testing

```powershell
npm test
```

The built-in tests check: 12 careers, 24 unique questions per career, three questions per skill, min/max score calculations, invalid assessment input rejection, quiz grading, interest validation, and deterministic career ranking. They do not require a live MongoDB server, but `npm install` is still needed for Express/Mongoose and the backend to run.

**Testing status for this build:** Pure scoring and matching tests passed, and backend/frontend JavaScript syntax checks passed. Full browser-to-MongoDB integration was **not** verified in the packaging environment because npm dependency installation timed out. Run `npm install`, `npm test`, and the complete browser flows on your computer before demonstrating.

## Limitations and safe deployment

- **Exploratory only.** These questions are not standardized, career-fit research has not been conducted, and a high match should not be treated as a hiring or admissions recommendation.
- **Backend is a coursework starting point, not production hardened.** Use an HTTPS reverse proxy, a trusted session secret, stronger abuse prevention (e.g. shared rate-limit store), and a thorough security review before deployment. Same-origin checks and `SameSite=Lax` cookies are not replacements for a comprehensive CSRF mitigation strategy.
- Passwords are salted/hashed with bcrypt; do not ask users for their real passwords during a public demonstration.
- Resources link to third-party learning websites and may change.
- Browser **Print / Save as PDF** is a browser function, not a generated server PDF document.
