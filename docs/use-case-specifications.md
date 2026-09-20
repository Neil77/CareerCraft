# CareerPath: use case specifications

Diagram: `use-case-diagram.svg` / `use-case-diagram.png` (same folder).

## Actors

| Actor | Type | Role |
|---|---|---|
| Student | Primary | Takes the assessment, follows the learning path, takes quizzes and views progress |
| LocalStorage | Secondary | Browser storage that keeps results, progress and quiz history between visits |

## Use case list

| ID | Use case | Actor | Relationship | Description |
|---|---|---|---|---|
| UC-01 | Take skill assessment | Student | includes UC-02 | Student answers 12 situation-based questions covering six skills |
| UC-02 | Answer assessment questions | Student, LocalStorage | included by UC-01 | One question at a time with previous/next and a progress bar; answers are kept as a draft |
| UC-03 | View skill analysis | Student | includes UC-04 and UC-05 | Shows a percentage score for each skill |
| UC-04 | Identify skill gaps | System | included by UC-03 | Lists skills below 75%, lowest first (maximum three) as "areas to develop" |
| UC-05 | Recommend learning path | System | included by UC-03 | Shows a four-step path for each area to develop |
| UC-06 | Follow learning path | Student | extended by UC-07 | Student works through the steps of a recommended path |
| UC-07 | Mark step as complete | Student, LocalStorage | extends UC-06 | Ticking a step saves it so it shows on the dashboard |
| UC-08 | Take skill quiz | Student | includes UC-09 | Five multiple-choice questions on one skill, with instant right/wrong feedback |
| UC-09 | View quiz result | Student, LocalStorage | included by UC-08; extended by UC-10 | Shows score, percentage and a message; saves the result to quiz history |
| UC-10 | Retake quiz | Student | extends UC-09 | Restarts the same quiz |
| UC-11 | View dashboard | Student | extended by UC-12 | Shows latest quiz score, skills assessed, steps completed, skill bars, learning progress and quiz history |
| UC-12 | Reset saved data | Student, LocalStorage | extends UC-11 | Deletes all saved results after a confirmation prompt |

## Scoring rules used by the system

- Each assessment answer is worth 0 to 3 points (first option = 0, last option = 3).
- Each skill has two questions, so a skill score = points earned / 6 x 100, rounded.
- Bands: Strong 75% and above, Developing 50 to 74%, Needs focus below 50%.
- Areas to develop: skills below 75%. If none, the lowest skill is offered as a stretch.
- Quiz score = correct answers / 5 x 100.

## Detailed specifications

### UC-01 Take skill assessment

| Field | Description |
|---|---|
| Actor | Student |
| Preconditions | Student has opened the website |
| Trigger | Student selects "Take the assessment" |
| Main flow | 1. System shows question 1 of 12 with a progress bar. 2. Student selects one answer. 3. System enables "Next" and saves the answer as a draft. 4. Student repeats steps 2 and 3 for each question. 5. On the last question the button reads "Analyze my skills". 6. System calculates the six skill scores, saves them and opens the analysis page. |
| Alternative flow A | Student selects "Previous" and changes an earlier answer; the draft is updated. |
| Alternative flow B | Student refreshes the page mid-way; the assessment resumes at the first unanswered question. |
| Alternative flow C | Student has completed the assessment before; a notice says finishing again replaces old results. |
| Postconditions | Skill scores are stored in LocalStorage and the draft is cleared |

### UC-03 View skill analysis

| Field | Description |
|---|---|
| Actor | Student |
| Preconditions | UC-01 has been completed |
| Main flow | 1. System reads the saved scores. 2. System shows a bar and band label for each skill. 3. System lists the areas to develop. 4. System shows tabs, one recommended path per area, with the lowest-scoring skill selected. |
| Alternative flow | No saved results: System shows an empty state with a "Take the assessment" button. |
| Postconditions | None (read only) |

### UC-08 Take skill quiz

| Field | Description |
|---|---|
| Actor | Student |
| Preconditions | None. If an assessment exists, the lowest-scoring skill is preselected |
| Trigger | Student selects "Take the [skill] quiz" on the analysis page, or opens the Quiz page |
| Main flow | 1. Student picks a skill and selects "Start quiz". 2. System shows a question with four options. 3. Student selects an option. 4. System locks the options, highlights the correct answer and shows feedback. 5. Student selects "Next". 6. Steps 2 to 5 repeat for five questions. 7. System shows the result (UC-09). |
| Alternative flow | Student opens the quiz from a link with a skill in the address (`quiz.html?skill=time`); step 1 is skipped for that skill. |
| Postconditions | Quiz score and date are added to quiz history in LocalStorage |

### UC-07 Mark step as complete

| Field | Description |
|---|---|
| Actor | Student |
| Preconditions | Student is viewing a learning path on the analysis page |
| Main flow | 1. Student ticks the checkbox of a step. 2. System marks the step as done and saves it. 3. Dashboard later shows the step with a tick and highlights the next unfinished step. |
| Alternative flow | Student unticks the box; the step returns to "not done". |
| Postconditions | Path progress for that skill is updated in LocalStorage |

## Non-functional requirements (for your report)

- Runs entirely in the browser with HTML, CSS and JavaScript; no server or login.
- Data persists after refresh using LocalStorage; it is private to the browser.
- Responsive from 360 px phones to desktop; keyboard operable with visible focus.
- Content (questions, paths, quizzes) lives in one file, `js/data.js`, so it can be edited without touching the logic.
