/* CareerPath - content data
   Edit this file to change questions, learning paths and quizzes.
   Assessment options are scored 0-3 by position (first option = 0). */

const SKILLS = [
  { id: "communication", name: "Communication",    icon: "💬", blurb: "Expressing ideas clearly" },
  { id: "problem",       name: "Problem solving",  icon: "🧩", blurb: "Handling difficult situations" },
  { id: "teamwork",      name: "Teamwork",         icon: "🤝", blurb: "Working with others" },
  { id: "leadership",    name: "Leadership",       icon: "🧭", blurb: "Taking responsibility" },
  { id: "time",          name: "Time management", icon: "⏱️", blurb: "Prioritizing tasks" },
  { id: "digital",       name: "Digital literacy", icon: "💻", blurb: "Using digital tools effectively" }
];

const ASSESSMENT = [
  { id: "c1", skill: "communication", q: "How comfortable are you speaking in front of a group?",
    options: ["Not comfortable", "Slightly comfortable", "Comfortable", "Very comfortable"] },
  { id: "p1", skill: "problem", q: "How do you usually approach a difficult problem?",
    options: ["I avoid it", "I try different solutions", "I break it into smaller problems", "I systematically analyze and solve it"] },
  { id: "t1", skill: "teamwork", q: "In a group project, how do you usually contribute?",
    options: ["I wait to be told what to do", "I complete only my assigned part", "I share ideas and help others", "I coordinate ideas and support everyone's work"] },
  { id: "l1", skill: "leadership", q: "Your group has no clear plan. What do you do?",
    options: ["Wait for someone else to start", "Suggest something if I am asked", "Propose a plan", "Propose a plan, assign roles and follow up"] },
  { id: "m1", skill: "time", q: "How do you plan your week?",
    options: ["I don't plan", "I keep tasks in my head", "I keep a to-do list", "I schedule tasks with deadlines and priorities"] },
  { id: "d1", skill: "digital", q: "How comfortable are you with documents, spreadsheets and online collaboration tools?",
    options: ["Barely comfortable", "I manage with help", "Comfortable with the basics", "Very comfortable, and I pick up new tools quickly"] },
  { id: "c2", skill: "communication", q: "Someone explains something you don't understand. What do you usually do?",
    options: ["Stay quiet and hope it becomes clear", "Nod and work it out later", "Ask a question when I get a chance", "Restate it in my own words to confirm"] },
  { id: "p2", skill: "problem", q: "A solution you tried did not work. What do you do next?",
    options: ["Give up", "Repeat the same steps", "Ask someone for the answer", "Work out why it failed and adjust"] },
  { id: "t2", skill: "teamwork", q: "A teammate disagrees with your idea. How do you respond?",
    options: ["Stop participating", "Insist that mine is right", "Listen and find a compromise", "Ask for their reasoning and combine the best of both"] },
  { id: "l2", skill: "leadership", q: "A team project starts going wrong. How do you react?",
    options: ["Blame the circumstances", "Stay silent", "Take my share of responsibility", "Take responsibility and lead the fix"] },
  { id: "m2", skill: "time", q: "Three tasks are due tomorrow. Which do you start with?",
    options: ["The one I enjoy most", "Whichever comes to mind first", "The easiest one", "The most urgent and important one"] },
  { id: "d2", skill: "digital", q: "How do you check whether an online source is reliable?",
    options: ["I don't check", "I trust the first result", "I compare a few sources", "I check the author, date and evidence across sources"] }
];

const PATHS = {
  communication: [
    { title: "Active listening", desc: "Give full attention and confirm what you heard." },
    { title: "Effective communication", desc: "Structure your message so others understand it the first time." },
    { title: "Presentation skills", desc: "Plan, rehearse and deliver a short talk with confidence." },
    { title: "Professional communication", desc: "Write clear emails and speak appropriately in formal settings." }
  ],
  problem: [
    { title: "Defining the problem", desc: "State what is wrong before you look for a fix." },
    { title: "Breaking problems down", desc: "Split a large problem into smaller, solvable parts." },
    { title: "Testing solutions", desc: "Try ideas, measure the result and adjust." },
    { title: "Reflecting on results", desc: "Learn from what worked and what did not." }
  ],
  teamwork: [
    { title: "Working in a team", desc: "Understand roles, shared goals and individual responsibility." },
    { title: "Giving and receiving feedback", desc: "Share specific, respectful feedback and act on what you receive." },
    { title: "Resolving conflict", desc: "Handle disagreement by focusing on the issue, not the person." },
    { title: "Collaboration tools", desc: "Use shared documents and task boards to work together." }
  ],
  leadership: [
    { title: "Taking initiative", desc: "Start useful work without waiting to be asked." },
    { title: "Delegating and motivating", desc: "Match tasks to strengths and recognise effort." },
    { title: "Making decisions", desc: "Decide with incomplete information and review the outcome." },
    { title: "Leading by example", desc: "Model the standards and behaviour you expect from the team." }
  ],
  time: [
    { title: "Time management basics", desc: "Learn how to organize daily tasks." },
    { title: "Goal setting", desc: "Learn how to create achievable goals." },
    { title: "Prioritization", desc: "Learn how to tell urgent tasks from important ones." },
    { title: "Productivity techniques", desc: "Learn practical methods for managing your time." }
  ],
  digital: [
    { title: "Everyday productivity tools", desc: "Get comfortable with documents, spreadsheets and slides." },
    { title: "Online safety and privacy", desc: "Protect your accounts, passwords and personal data." },
    { title: "Evaluating online information", desc: "Judge whether a source is reliable before you use it." },
    { title: "Collaborating online", desc: "Share, edit and comment on files with other people." }
  ]
};

const QUIZZES = {
  time: [
    { q: "You have three tasks due tomorrow. Which should you generally do first?",
      options: ["The easiest task", "The most urgent and important task", "The task you enjoy most", "A random task"], answer: 1 },
    { q: "Which of these is a SMART goal?",
      options: ["Do better this semester", "Study more in the long run", "Finish chapters 1 to 3 by Friday evening", "Be the best in class"], answer: 2 },
    { q: "A task is important but not urgent. What should you do with it?",
      options: ["Ignore it until it becomes urgent", "Schedule time for it in advance", "Hand it to anyone available", "Leave it for the last minute"], answer: 1 },
    { q: "What helps most with frequent distractions while studying?",
      options: ["Keeping your phone beside you", "Switching between subjects constantly", "Studying for hours without breaks", "Working in short focused blocks with notifications off"], answer: 3 },
    { q: "What is the Pomodoro technique?",
      options: ["Working in timed intervals with short breaks", "A method for memorising lists", "Doing only one task per day", "A type of calendar app"], answer: 0 }
  ],
  communication: [
    { q: "What does active listening involve?",
      options: ["Planning your reply while they speak", "Giving full attention and confirming understanding", "Interrupting to save time", "Checking your phone now and then"], answer: 1 },
    { q: "What is the best way to open a presentation?",
      options: ["Apologise for being nervous", "Read the slide word for word", "Tell the audience what they will gain", "Start with an unrelated joke"], answer: 2 },
    { q: "Which email subject line is clearest?",
      options: ["Hello", "Question", "URGENT!!!", "Feedback needed on project draft by Friday"], answer: 3 },
    { q: "Which of these is non-verbal communication?",
      options: ["Eye contact and posture", "The words in a speech", "A written report", "The length of an email"], answer: 0 },
    { q: "What makes feedback most useful?",
      options: ["Keeping it vague to stay polite", "Being specific about the work and suggesting improvements", "Focusing on the person's character", "Saving it for later"], answer: 1 }
  ],
  problem: [
    { q: "What is the best first step when solving a problem?",
      options: ["Try a random fix", "Define the problem clearly", "Ask for the answer", "Decide who caused it"], answer: 1 },
    { q: "Why does breaking a large problem into parts help?",
      options: ["It hides the difficult parts", "It removes the need for planning", "Each part is easier to solve and check", "It guarantees instant results"], answer: 2 },
    { q: "Your solution fails. What is the best next step?",
      options: ["Repeat exactly the same steps", "Find out why it failed and adjust", "Abandon the problem", "Change everything at random"], answer: 1 },
    { q: "What is root cause analysis trying to find?",
      options: ["Who is at fault", "A list of all symptoms", "The fastest possible fix", "The underlying reason the problem occurs"], answer: 3 },
    { q: "Brainstorming works best when...",
      options: ["Only one idea is allowed", "Every idea is judged immediately", "Many ideas come first and evaluation comes later", "Only experts speak"], answer: 2 }
  ],
  teamwork: [
    { q: "How is a disagreement in a team best handled?",
      options: ["Avoid the topic", "Listen to each view and look for common ground", "Vote without any discussion", "Let the loudest person decide"], answer: 1 },
    { q: "Why do clear roles help a team?",
      options: ["Everyone does the same task", "Work overlaps and becomes confusing", "They reduce overlap and confusion", "They remove the need to communicate"], answer: 2 },
    { q: "A teammate is falling behind. What do you do first?",
      options: ["Ignore it", "Ask whether they need help and offer support", "Report them without speaking to them", "Redo their work without telling them"], answer: 1 },
    { q: "Which describes good feedback within a team?",
      options: ["Personal and blunt", "Saved for the end of the semester", "Avoided entirely", "Specific, respectful and focused on the work"], answer: 3 },
    { q: "Which tool best supports remote teamwork?",
      options: ["A shared document with comments", "Printed copies passed around", "Verbal notes only", "Individual files sent at the very end"], answer: 0 }
  ],
  leadership: [
    { q: "The group has no plan. What does a good leader do?",
      options: ["Waits for someone else", "Proposes a plan and invites input", "Takes over without telling anyone", "Blames the situation"], answer: 1 },
    { q: "What does delegation mean?",
      options: ["Doing everything yourself", "Giving tasks out at random", "Assigning tasks by strengths and following up", "Leaving work to others"], answer: 2 },
    { q: "How does a leader respond to a team mistake?",
      options: ["Owns it and leads the fix", "Blames teammates", "Hides it", "Waits for it to go away"], answer: 0 },
    { q: "What is the best way to motivate a team?",
      options: ["Threaten consequences", "Compare members with each other", "Stay silent", "Recognise effort and set clear goals"], answer: 3 },
    { q: "How should you decide when information is incomplete?",
      options: ["Delay until everything is certain", "Gather the key facts, decide, then review", "Guess without checking", "Let someone else decide"], answer: 1 }
  ],
  digital: [
    { q: "Which is the strongest password?",
      options: ["Your birthday", "A long mix of words, numbers and symbols", "12345678", "Your name"], answer: 1 },
    { q: "Which is a sign of a phishing email?",
      options: ["An urgent request for your password from an unknown sender", "A message from a known contact", "Plain text formatting", "Correct spelling"], answer: 0 },
    { q: "Which source is most likely to be reliable?",
      options: ["One with the most likes", "One with many ads", "One that names the author and cites evidence", "The first search result"], answer: 2 },
    { q: "Why do shared cloud documents help collaboration?",
      options: ["Files must be emailed back and forth", "Only one person may open the file", "They work offline only", "Several people can edit the same file at once"], answer: 3 },
    { q: "What does two-factor authentication add?",
      options: ["Faster sign-in", "A second proof of identity beyond the password", "Automatic backups", "A stronger Wi-Fi signal"], answer: 1 }
  ]
};
