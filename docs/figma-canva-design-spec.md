# CareerPath: UI/UX prototype guide for Figma or Canva

Work through this top to bottom. The screenshots in `docs/screens/` show the finished layout for every frame; use them as a reference while you build (they use a fallback font, so set the real fonts from section 1 in your design).

## 1. Design tokens (create these as styles first)

**Colors**

| Name | Hex | Used for |
|---|---|---|
| Ink | #1B2340 | Headings, body text, dark CTA band |
| Ink soft | #4A5578 | Secondary text |
| Paper | #F6F8FC | Page background |
| Card | #FFFFFF | Cards, navbar |
| Line | #DCE2F0 | Borders, empty progress tracks |
| Path blue | #3B5BDB | Primary buttons, selected states, progress |
| Path blue dark | #2B46B3 | Button hover, links |
| Path blue soft | #E7ECFF | Selected backgrounds, icon badges |
| Growth green | #2B8A3E | Strong skills, correct answer, completed steps |
| Growth soft | #E3F5E8 | Completed step and correct-answer backgrounds |
| Focus amber | #D9822B | "Needs focus" bars |
| Focus text | #9A5B00 on #FFF1D6 | Areas-to-develop tags |

**Type** (both are free on Google Fonts and in Canva)

| Style | Font | Size / weight |
|---|---|---|
| Display | Bricolage Grotesque | 58 / Bold, line height 100% |
| H1 (inner pages) | Bricolage Grotesque | 35 / Bold |
| H2 | Bricolage Grotesque | 35 / Bold (section), 22 / Bold (card) |
| H3 | Bricolage Grotesque | 19 / SemiBold |
| Body | Source Sans 3 | 17 / Regular, line height 160% |
| Label | Source Sans 3 | 16 / SemiBold |

**Shape and spacing:** cards 16 px radius, buttons and options 10 px, pills 999 px. Spacing scale 4, 8, 12, 16, 24, 32, 64. Borders 1 px Line for cards, 2 px for options and buttons.

## 2. Frames

- Desktop: 1440 x 1024, layout grid 12 columns, content width 1080 (margin 180), gutter 24.
- Mobile: 390 x 844, 1 column, margin 20.

Build these 12 frames (desktop first, then mobile versions of the 5 main pages):

| # | Frame | Contents |
|---|---|---|
| 1 | Home | Navbar, hero with headline and winding-path illustration, Why CareerPath (3 cards), How it works (5 steps), Skills covered (6 cards), SDG connection (3 cards), dark CTA band, footer |
| 2 | Assessment | Page title, "Question 4 of 12" and percent, progress bar, question card with skill tag and four options, Previous / Next |
| 3 | Assessment, answered | Same frame with one option in the selected state and Next enabled |
| 4 | Analysis | Skill profile bars, Areas to develop tags, path tabs, four path steps, "Take the quiz" button |
| 5 | Analysis, empty | Empty-state card with "Take the assessment" |
| 6 | Quiz, start | Six skill chips (one selected), "Start quiz" |
| 7 | Quiz, question | Progress bar, question, four options |
| 8 | Quiz, answered | One option correct (green), one wrong (red), feedback line, Next |
| 9 | Quiz, result | Big score such as 4 / 5, percent, message, three buttons |
| 10 | Dashboard | Three stat cards, skill bars, learning progress list, quiz history table |
| 11 | Dashboard, empty | Empty-state card |
| 12 | Mobile set | Home, Assessment, Analysis, Quiz, Dashboard at 390 wide |

**Navbar (all frames):** logo mark + "CareerPath" on the left; Home, Assessment, Analysis, Quiz, Dashboard on the right. Active item gets Path blue soft background and Path blue dark text. On mobile, replace the links with a "Menu" button.

**Hero illustration:** draw one dashed Path blue line (4 px, dash 8 / gap 10) that zigzags up through six circles (white fill, 4 px Path blue stroke, the first one solid). Label each circle with a skill name. This is the only illustration the design needs.

## 3. Components (build once, reuse everywhere)

| Component | Variants |
|---|---|
| Button | Primary, Secondary (outlined), Disabled |
| Nav link | Default, Hover, Active |
| Card | Standard, SDG (6 px colored left border) |
| Icon badge | 44 px rounded square, Path blue soft, emoji inside |
| Answer option | Default, Hover, Selected, Correct, Wrong |
| Progress bar | 12 px high, value 0 to 100 |
| Skill bar | Strong (green), Developing (blue), Needs focus (amber), each with percent and band label |
| Tab | Default, Selected |
| Path step | To do, Done (green background, strikethrough title) |
| Stat card | Number + label |
| Skill chip | Default, Selected |

In Figma use Component Sets with variant properties (State = default / hover / selected / correct / wrong). In Canva, duplicate an element and recolor it for each state, then group them.

## 4. Prototype wiring (click flow)

```
Home ──Take the assessment──> Assessment ──Analyze my skills──> Analysis
                                                                   │
                     Dashboard <──Go to dashboard── Quiz result <──┤ Take the quiz
                         ▲                              │          ▼
                         └───── navbar (any page) ──────┴──── Quiz start ──> Quiz question
```

| From (element) | To | Trigger | Animation (Figma) |
|---|---|---|---|
| Logo, "Home" nav link | Home | On click | Instant |
| "Take the assessment" (hero, CTA) | Assessment | On click | Smart animate, 200 ms, ease out |
| "See how it works" | Home, How it works section | On click | Scroll to |
| Answer option | Same option, Selected variant (and Next enabled) | On click | Instant |
| Next (Q1 to Q11) | Next question frame | On click | Push left, 200 ms |
| Previous | Previous question frame | On click | Push right, 200 ms |
| "Analyze my skills" | Analysis | On click | Smart animate |
| Path tab | Same frame, other tab selected | On click | Instant |
| Path step checkbox | Step, Done variant | On click | Instant |
| "Take the ... quiz" | Quiz, start | On click | Smart animate |
| "Start quiz" | Quiz, question | On click | Smart animate |
| Quiz option | Quiz, answered (correct or wrong) | On click | Instant |
| "See result" | Quiz, result | On click | Smart animate |
| "Retake quiz" | Quiz, start | On click | Instant |
| "Go to dashboard" | Dashboard | On click | Smart animate |
| Navbar links | Matching page | On click | Instant |

**Figma:** switch to Prototype mode, drag from each element to its target frame, and set the trigger and animation from the table. Set the starting frame to Home, device to Desktop, then press Present (top right). Share with "View only" for your submission.

**Canva:** put each frame on its own page (custom size 1440 x 1024). Select a button, press Ctrl+K (Cmd+K on Mac) and pick the page in this design to link to, then use Present to click through. Canva can't do component variants, so use the separate answered/selected frames (3, 8) as the targets.

## 5. UX decisions to mention in your report

- **One task per screen.** The assessment and quiz show a single question at a time so the student is never overwhelmed.
- **Visible progress.** A progress bar and "Question n of N" appear on both flows.
- **Positive language.** Low scores are called "areas to develop", not weaknesses; amber is used instead of red.
- **Color is never the only signal.** Every bar has a percentage and a band label; correct and wrong answers also show a text message.
- **Instant feedback.** Quiz answers are marked right or wrong straight away, which supports learning.
- **Empty states.** Analysis and Dashboard tell a new student what to do next instead of showing blank space.
- **Accessibility.** Text contrast meets WCAG AA, focus outlines are visible, options are real radio buttons, and motion is reduced when the user asks for it.
