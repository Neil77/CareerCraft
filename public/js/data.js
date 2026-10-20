/* CareerCraft - content data
   Edit this file to change careers, questions, learning paths and quizzes.
   Assessment options use a private, position-independent server scoring key. */

/* ---------- Core skills (8) ---------- */
const SKILLS = [
  { id: "communication", name: "Communication",       icon: "💬", blurb: "Expressing ideas clearly" },
  { id: "problem",       name: "Problem Solving",     icon: "🧩", blurb: "Handling difficult situations" },
  { id: "teamwork",      name: "Teamwork",             icon: "🤝", blurb: "Working with others" },
  { id: "time",          name: "Time Management",     icon: "⏱️", blurb: "Prioritizing tasks" },
  { id: "leadership",    name: "Leadership",           icon: "🧭", blurb: "Taking responsibility" },
  { id: "creativity",    name: "Creativity",           icon: "🎨", blurb: "Generating new ideas" },
  { id: "analytical",    name: "Analytical Thinking", icon: "🔎", blurb: "Reasoning from evidence" },
  { id: "technical",     name: "Technical Skills",     icon: "💻", blurb: "Using tools and technology effectively" }
];

/* ---------- Careers (12) ----------
   weights: how much each skill matters for this career.
   2 = core skill for this career, 1 = still useful but not a focus.
   Used to prioritise "areas to develop" after the assessment. */
const CAREERS = [
  { id: "swe", name: "Software Engineer", icon: "💻",
    blurb: "Designs, builds and maintains software applications and systems.",
    techSkills: ["Python", "Java or C++", "JavaScript", "SQL", "Git", "Data structures & algorithms"],
    weights: { problem: 2, technical: 2, teamwork: 2, communication: 2, time: 2, analytical: 1, creativity: 1, leadership: 1 } },
  { id: "aiml", name: "AI/ML Engineer", icon: "🤖",
    blurb: "Builds and trains machine learning models and intelligent systems.",
    techSkills: ["Python", "SQL", "PyTorch or TensorFlow", "Statistics & probability", "Linear algebra"],
    weights: { problem: 2, analytical: 2, technical: 2, teamwork: 2, communication: 1, time: 1, leadership: 1, creativity: 1 } },
  { id: "dataeng", name: "Data Engineer", icon: "🗄️",
    blurb: "Builds and maintains the pipelines and systems that move and store data.",
    techSkills: ["Python or Scala", "SQL", "Airflow / ETL tools", "Cloud platforms (AWS/GCP/Azure)", "Data modeling"],
    weights: { problem: 2, analytical: 2, technical: 2, communication: 2, time: 2, teamwork: 1, leadership: 1, creativity: 1 } },
  { id: "cybersec", name: "Cybersecurity Engineer", icon: "🔐",
    blurb: "Protects systems, networks and data from security threats.",
    techSkills: ["Python or Bash scripting", "Networking (TCP/IP)", "Linux", "Security tools (Wireshark, Nmap)", "Cryptography basics"],
    weights: { problem: 2, analytical: 2, technical: 2, communication: 2, teamwork: 1, time: 1, leadership: 1, creativity: 1 } },
  { id: "electrical", name: "Electrical Engineer", icon: "⚡",
    blurb: "Designs and maintains electrical systems and power infrastructure.",
    techSkills: ["MATLAB", "Circuit simulation (SPICE)", "C (for control systems)", "CAD (AutoCAD/EPLAN)", "Power systems analysis"],
    weights: { problem: 2, analytical: 2, technical: 2, time: 2, teamwork: 1, leadership: 1, creativity: 1, communication: 1 } },
  { id: "electronics", name: "Electronics Engineer", icon: "🔌",
    blurb: "Designs circuits and electronic devices, from concept to prototype.",
    techSkills: ["C or C++", "PCB design (Altium/KiCad)", "SPICE simulation", "Microcontroller programming", "Signal processing basics"],
    weights: { problem: 2, analytical: 2, technical: 2, creativity: 2, time: 1, teamwork: 1, leadership: 1, communication: 1 } },
  { id: "embedded", name: "Embedded Systems Engineer", icon: "📡",
    blurb: "Builds the firmware and hardware-software systems inside devices.",
    techSkills: ["C or C++", "RTOS basics", "ARM microcontroller programming", "Git", "Python for tooling/scripts"],
    weights: { problem: 2, technical: 2, analytical: 2, time: 2, teamwork: 1, leadership: 1, creativity: 1, communication: 1 } },
  { id: "mechanical", name: "Mechanical Engineer", icon: "⚙️",
    blurb: "Designs and analyzes mechanical parts, machines and systems.",
    techSkills: ["CAD (SolidWorks/AutoCAD)", "MATLAB", "FEA tools (ANSYS)", "Basic Python or C for automation", "Thermodynamics & mechanics fundamentals"],
    weights: { problem: 2, technical: 2, analytical: 2, creativity: 2, time: 1, teamwork: 1, leadership: 1, communication: 1 } },
  { id: "robotics", name: "Robotics Engineer", icon: "🦾",
    blurb: "Designs and builds robots and automated mechanical systems.",
    techSkills: ["Python", "C++", "ROS (Robot Operating System)", "Control systems", "CAD"],
    weights: { problem: 2, technical: 2, creativity: 2, teamwork: 2, time: 1, leadership: 1, analytical: 1, communication: 1 } },
  { id: "industrial", name: "Industrial/Manufacturing Engineer", icon: "🏭",
    blurb: "Improves how production lines and processes run.",
    techSkills: ["Advanced Excel / data analysis", "SQL basics", "Process simulation (Arena/Simul8)", "Six Sigma / Lean tools", "Statistics"],
    weights: { problem: 2, time: 2, analytical: 2, leadership: 2, teamwork: 1, technical: 1, creativity: 1, communication: 1 } },
  { id: "civil", name: "Civil Engineer", icon: "🏗️",
    blurb: "Plans and designs infrastructure such as buildings, roads and bridges.",
    techSkills: ["AutoCAD", "Revit / BIM", "STAAD.Pro or ETABS", "Basic Python for automation", "Structural analysis fundamentals"],
    weights: { problem: 2, technical: 2, teamwork: 2, time: 2, analytical: 1, leadership: 1, creativity: 1, communication: 1 } },
  { id: "chemical", name: "Chemical Engineer", icon: "🧪",
    blurb: "Designs and manages processes that convert raw materials into products.",
    techSkills: ["Aspen Plus or HYSYS", "MATLAB", "Python for data analysis", "Process simulation", "Mass & energy balances"],
    weights: { problem: 2, analytical: 2, technical: 2, time: 2, teamwork: 1, leadership: 1, creativity: 1, communication: 1 } }
];

/* ---------- Behavior-based assessment (v2, 24 scenarios per career) ----------
   Answer options describe plausible past choices rather than obvious "wrong"
   versus "perfect" responses. Their scores are held in server/assessment-keys.json,
   and are deliberately NOT dependent on option index. The client contains only
   questions and response text, never the scoring key. Not a validated aptitude test.
*/
const ASSESSMENTS = {
  "swe": [
    {
      "id": "swe_v2_problem_03",
      "skill": "problem",
      "q": "A result from a software feature is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time."
      ]
    },
    {
      "id": "swe_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a new programming framework for an assignment. What best describes how you got started the last time?",
      "options": [
        "I followed a familiar example and adjusted it to my task.",
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation."
      ]
    },
    {
      "id": "swe_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a software feature. Which description is closest to how you contributed recently?",
      "options": [
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling."
      ]
    },
    {
      "id": "swe_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given performance logs and test results showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it."
      ]
    },
    {
      "id": "swe_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a software feature. What reflects your typical reaction?",
      "options": [
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins."
      ]
    },
    {
      "id": "swe_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a software feature. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "swe_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a software feature without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points."
      ]
    },
    {
      "id": "swe_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a software feature is no longer getting useful results. What do you tend to try?",
      "options": [
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale."
      ]
    },
    {
      "id": "swe_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used."
      ]
    },
    {
      "id": "swe_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue."
      ]
    },
    {
      "id": "swe_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review."
      ]
    },
    {
      "id": "swe_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a software feature, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda."
      ]
    },
    {
      "id": "swe_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a software feature, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I examine what the failed attempt ruled out and revise my next test.",
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities."
      ]
    },
    {
      "id": "swe_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly."
      ]
    },
    {
      "id": "swe_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a software feature. What did you do in a similar situation?",
      "options": [
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision."
      ]
    },
    {
      "id": "swe_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of performance logs and test results disagree. How have you usually handled similar cases?",
      "options": [
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge."
      ]
    },
    {
      "id": "swe_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me."
      ]
    },
    {
      "id": "swe_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail."
      ]
    },
    {
      "id": "swe_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available."
      ]
    },
    {
      "id": "swe_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "swe_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "swe_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer."
      ]
    },
    {
      "id": "swe_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time."
      ]
    },
    {
      "id": "swe_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    }
  ],
  "aiml": [
    {
      "id": "aiml_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a model evaluation. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "aiml_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given training and validation metrics showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation."
      ]
    },
    {
      "id": "aiml_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a model evaluation is no longer getting useful results. What do you tend to try?",
      "options": [
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale."
      ]
    },
    {
      "id": "aiml_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a model evaluation without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation."
      ]
    },
    {
      "id": "aiml_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a model evaluation. Which description is closest to how you contributed recently?",
      "options": [
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly."
      ]
    },
    {
      "id": "aiml_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a model evaluation. What reflects your typical reaction?",
      "options": [
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback."
      ]
    },
    {
      "id": "aiml_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a machine-learning library for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "aiml_v2_problem_03",
      "skill": "problem",
      "q": "A result from a model evaluation is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check."
      ]
    },
    {
      "id": "aiml_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used."
      ]
    },
    {
      "id": "aiml_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of training and validation metrics disagree. How have you usually handled similar cases?",
      "options": [
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge."
      ]
    },
    {
      "id": "aiml_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution."
      ]
    },
    {
      "id": "aiml_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a model evaluation, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding."
      ]
    },
    {
      "id": "aiml_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option."
      ]
    },
    {
      "id": "aiml_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a model evaluation. What did you do in a similar situation?",
      "options": [
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision."
      ]
    },
    {
      "id": "aiml_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a model evaluation, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "aiml_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late."
      ]
    },
    {
      "id": "aiml_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision.",
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before."
      ]
    },
    {
      "id": "aiml_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time."
      ]
    },
    {
      "id": "aiml_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background."
      ]
    },
    {
      "id": "aiml_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations."
      ]
    },
    {
      "id": "aiml_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference."
      ]
    },
    {
      "id": "aiml_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready."
      ]
    },
    {
      "id": "aiml_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer."
      ]
    },
    {
      "id": "aiml_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem."
      ]
    }
  ],
  "dataeng": [
    {
      "id": "dataeng_v2_problem_03",
      "skill": "problem",
      "q": "A result from a data pipeline is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check."
      ]
    },
    {
      "id": "dataeng_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a data orchestration platform for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "dataeng_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a data pipeline. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "dataeng_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a data pipeline without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points."
      ]
    },
    {
      "id": "dataeng_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a data pipeline. Which description is closest to how you contributed recently?",
      "options": [
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling."
      ]
    },
    {
      "id": "dataeng_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a data pipeline is no longer getting useful results. What do you tend to try?",
      "options": [
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea."
      ]
    },
    {
      "id": "dataeng_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given pipeline monitoring logs showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust."
      ]
    },
    {
      "id": "dataeng_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a data pipeline. What reflects your typical reaction?",
      "options": [
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins."
      ]
    },
    {
      "id": "dataeng_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints."
      ]
    },
    {
      "id": "dataeng_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of pipeline monitoring logs disagree. How have you usually handled similar cases?",
      "options": [
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding."
      ]
    },
    {
      "id": "dataeng_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution."
      ]
    },
    {
      "id": "dataeng_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly."
      ]
    },
    {
      "id": "dataeng_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a data pipeline. What did you do in a similar situation?",
      "options": [
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test."
      ]
    },
    {
      "id": "dataeng_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a data pipeline, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda."
      ]
    },
    {
      "id": "dataeng_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result."
      ]
    },
    {
      "id": "dataeng_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a data pipeline, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "dataeng_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent."
      ]
    },
    {
      "id": "dataeng_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "dataeng_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available."
      ]
    },
    {
      "id": "dataeng_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time."
      ]
    },
    {
      "id": "dataeng_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I identify the missing information and suggest a temporary decision.",
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide."
      ]
    },
    {
      "id": "dataeng_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    },
    {
      "id": "dataeng_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks."
      ]
    },
    {
      "id": "dataeng_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail."
      ]
    }
  ],
  "cybersec": [
    {
      "id": "cybersec_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a network analysis utility for an assignment. What best describes how you got started the last time?",
      "options": [
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task.",
        "I asked someone to walk me through the parts I needed."
      ]
    },
    {
      "id": "cybersec_v2_problem_03",
      "skill": "problem",
      "q": "A result from a security review is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears."
      ]
    },
    {
      "id": "cybersec_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a security review without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points."
      ]
    },
    {
      "id": "cybersec_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a security review. What reflects your typical reaction?",
      "options": [
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback."
      ]
    },
    {
      "id": "cybersec_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a security review. Which description is closest to how you contributed recently?",
      "options": [
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly."
      ]
    },
    {
      "id": "cybersec_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a security review is no longer getting useful results. What do you tend to try?",
      "options": [
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea."
      ]
    },
    {
      "id": "cybersec_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given network activity logs showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data."
      ]
    },
    {
      "id": "cybersec_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a security review. How do you usually organise your time?",
      "options": [
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them."
      ]
    },
    {
      "id": "cybersec_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a security review, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step."
      ]
    },
    {
      "id": "cybersec_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time."
      ]
    },
    {
      "id": "cybersec_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a security review, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test.",
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem."
      ]
    },
    {
      "id": "cybersec_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of network activity logs disagree. How have you usually handled similar cases?",
      "options": [
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding."
      ]
    },
    {
      "id": "cybersec_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly."
      ]
    },
    {
      "id": "cybersec_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later."
      ]
    },
    {
      "id": "cybersec_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review."
      ]
    },
    {
      "id": "cybersec_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a security review. What did you do in a similar situation?",
      "options": [
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision."
      ]
    },
    {
      "id": "cybersec_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further."
      ]
    },
    {
      "id": "cybersec_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background."
      ]
    },
    {
      "id": "cybersec_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule."
      ]
    },
    {
      "id": "cybersec_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent."
      ]
    },
    {
      "id": "cybersec_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical."
      ]
    },
    {
      "id": "cybersec_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    },
    {
      "id": "cybersec_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision.",
        "I agreed on the risks, a reversible step, and a review time."
      ]
    },
    {
      "id": "cybersec_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready."
      ]
    }
  ],
  "electrical": [
    {
      "id": "electrical_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given circuit measurements showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust."
      ]
    },
    {
      "id": "electrical_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing an electrical design. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "electrical_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a circuit simulation program for an assignment. What best describes how you got started the last time?",
      "options": [
        "I followed a familiar example and adjusted it to my task.",
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation."
      ]
    },
    {
      "id": "electrical_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain an electrical design without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation."
      ]
    },
    {
      "id": "electrical_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to an electrical design. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "electrical_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for an electrical design is no longer getting useful results. What do you tend to try?",
      "options": [
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar."
      ]
    },
    {
      "id": "electrical_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for an electrical design. What reflects your typical reaction?",
      "options": [
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback."
      ]
    },
    {
      "id": "electrical_v2_problem_03",
      "skill": "problem",
      "q": "A result from an electrical design is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before."
      ]
    },
    {
      "id": "electrical_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late."
      ]
    },
    {
      "id": "electrical_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in an electrical design, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "electrical_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete an electrical design. What did you do in a similar situation?",
      "options": [
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test."
      ]
    },
    {
      "id": "electrical_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about an electrical design, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding."
      ]
    },
    {
      "id": "electrical_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue."
      ]
    },
    {
      "id": "electrical_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review."
      ]
    },
    {
      "id": "electrical_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result."
      ]
    },
    {
      "id": "electrical_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of circuit measurements disagree. How have you usually handled similar cases?",
      "options": [
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system."
      ]
    },
    {
      "id": "electrical_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail."
      ]
    },
    {
      "id": "electrical_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved."
      ]
    },
    {
      "id": "electrical_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates."
      ]
    },
    {
      "id": "electrical_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "electrical_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision.",
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before."
      ]
    },
    {
      "id": "electrical_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem."
      ]
    },
    {
      "id": "electrical_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me."
      ]
    },
    {
      "id": "electrical_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks."
      ]
    }
  ],
  "electronics": [
    {
      "id": "electronics_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given sensor and circuit readings showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation."
      ]
    },
    {
      "id": "electronics_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to an electronics prototype. How do you usually organise your time?",
      "options": [
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately."
      ]
    },
    {
      "id": "electronics_v2_problem_03",
      "skill": "problem",
      "q": "A result from an electronics prototype is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears."
      ]
    },
    {
      "id": "electronics_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain an electronics prototype without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details."
      ]
    },
    {
      "id": "electronics_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing an electronics prototype. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "electronics_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for an electronics prototype. What reflects your typical reaction?",
      "options": [
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning."
      ]
    },
    {
      "id": "electronics_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a PCB design application for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "electronics_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for an electronics prototype is no longer getting useful results. What do you tend to try?",
      "options": [
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar."
      ]
    },
    {
      "id": "electronics_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about an electronics prototype, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately."
      ]
    },
    {
      "id": "electronics_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in an electronics prototype, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "electronics_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late."
      ]
    },
    {
      "id": "electronics_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete an electronics prototype. What did you do in a similar situation?",
      "options": [
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward."
      ]
    },
    {
      "id": "electronics_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of sensor and circuit readings disagree. How have you usually handled similar cases?",
      "options": [
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge."
      ]
    },
    {
      "id": "electronics_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project."
      ]
    },
    {
      "id": "electronics_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option."
      ]
    },
    {
      "id": "electronics_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time."
      ]
    },
    {
      "id": "electronics_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect."
      ]
    },
    {
      "id": "electronics_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me."
      ]
    },
    {
      "id": "electronics_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan."
      ]
    },
    {
      "id": "electronics_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved."
      ]
    },
    {
      "id": "electronics_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks."
      ]
    },
    {
      "id": "electronics_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs."
      ]
    },
    {
      "id": "electronics_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can."
      ]
    },
    {
      "id": "electronics_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    }
  ],
  "embedded": [
    {
      "id": "embedded_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing an embedded-device prototype. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "embedded_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for an embedded-device prototype. What reflects your typical reaction?",
      "options": [
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins."
      ]
    },
    {
      "id": "embedded_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a microcontroller debugging tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "embedded_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to an embedded-device prototype. How do you usually organise your time?",
      "options": [
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately."
      ]
    },
    {
      "id": "embedded_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain an embedded-device prototype without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points."
      ]
    },
    {
      "id": "embedded_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for an embedded-device prototype is no longer getting useful results. What do you tend to try?",
      "options": [
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea."
      ]
    },
    {
      "id": "embedded_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given device telemetry readings showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data."
      ]
    },
    {
      "id": "embedded_v2_problem_03",
      "skill": "problem",
      "q": "A result from an embedded-device prototype is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears."
      ]
    },
    {
      "id": "embedded_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late."
      ]
    },
    {
      "id": "embedded_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in an embedded-device prototype, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "embedded_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example."
      ]
    },
    {
      "id": "embedded_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used."
      ]
    },
    {
      "id": "embedded_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints."
      ]
    },
    {
      "id": "embedded_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about an embedded-device prototype, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step."
      ]
    },
    {
      "id": "embedded_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete an embedded-device prototype. What did you do in a similar situation?",
      "options": [
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward."
      ]
    },
    {
      "id": "embedded_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of device telemetry readings disagree. How have you usually handled similar cases?",
      "options": [
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system."
      ]
    },
    {
      "id": "embedded_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan."
      ]
    },
    {
      "id": "embedded_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "embedded_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates."
      ]
    },
    {
      "id": "embedded_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me."
      ]
    },
    {
      "id": "embedded_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect."
      ]
    },
    {
      "id": "embedded_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    },
    {
      "id": "embedded_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer."
      ]
    },
    {
      "id": "embedded_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail."
      ]
    }
  ],
  "mechanical": [
    {
      "id": "mechanical_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a mechanical design is no longer getting useful results. What do you tend to try?",
      "options": [
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar."
      ]
    },
    {
      "id": "mechanical_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a CAD or simulation tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "mechanical_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a mechanical design without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask."
      ]
    },
    {
      "id": "mechanical_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a mechanical design. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "mechanical_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a mechanical design. What reflects your typical reaction?",
      "options": [
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum."
      ]
    },
    {
      "id": "mechanical_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a mechanical design. How do you usually organise your time?",
      "options": [
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them."
      ]
    },
    {
      "id": "mechanical_v2_problem_03",
      "skill": "problem",
      "q": "A result from a mechanical design is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears."
      ]
    },
    {
      "id": "mechanical_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given simulation and load-test measurements showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust."
      ]
    },
    {
      "id": "mechanical_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option."
      ]
    },
    {
      "id": "mechanical_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late."
      ]
    },
    {
      "id": "mechanical_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a mechanical design, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step."
      ]
    },
    {
      "id": "mechanical_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a mechanical design. What did you do in a similar situation?",
      "options": [
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward."
      ]
    },
    {
      "id": "mechanical_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time."
      ]
    },
    {
      "id": "mechanical_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a mechanical design, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test.",
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem."
      ]
    },
    {
      "id": "mechanical_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of simulation and load-test measurements disagree. How have you usually handled similar cases?",
      "options": [
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system."
      ]
    },
    {
      "id": "mechanical_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result."
      ]
    },
    {
      "id": "mechanical_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks."
      ]
    },
    {
      "id": "mechanical_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks."
      ]
    },
    {
      "id": "mechanical_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan."
      ]
    },
    {
      "id": "mechanical_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "mechanical_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem."
      ]
    },
    {
      "id": "mechanical_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can."
      ]
    },
    {
      "id": "mechanical_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    },
    {
      "id": "mechanical_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me."
      ]
    }
  ],
  "robotics": [
    {
      "id": "robotics_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a robotics prototype. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "robotics_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a robotics prototype is no longer getting useful results. What do you tend to try?",
      "options": [
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea."
      ]
    },
    {
      "id": "robotics_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given robot sensor recordings showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data."
      ]
    },
    {
      "id": "robotics_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a robotics prototype without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask."
      ]
    },
    {
      "id": "robotics_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a robotics simulation tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "robotics_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a robotics prototype. How do you usually organise your time?",
      "options": [
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it."
      ]
    },
    {
      "id": "robotics_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a robotics prototype. What reflects your typical reaction?",
      "options": [
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum."
      ]
    },
    {
      "id": "robotics_v2_problem_03",
      "skill": "problem",
      "q": "A result from a robotics prototype is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time."
      ]
    },
    {
      "id": "robotics_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I renegotiated milestones and reordered my tasks accordingly.",
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work."
      ]
    },
    {
      "id": "robotics_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a robotics prototype, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding."
      ]
    },
    {
      "id": "robotics_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution."
      ]
    },
    {
      "id": "robotics_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of robot sensor recordings disagree. How have you usually handled similar cases?",
      "options": [
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system."
      ]
    },
    {
      "id": "robotics_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a robotics prototype, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test.",
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem."
      ]
    },
    {
      "id": "robotics_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly."
      ]
    },
    {
      "id": "robotics_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a robotics prototype. What did you do in a similar situation?",
      "options": [
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward."
      ]
    },
    {
      "id": "robotics_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion."
      ]
    },
    {
      "id": "robotics_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I suggest using a safer known solution until more time is available.",
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect."
      ]
    },
    {
      "id": "robotics_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer."
      ]
    },
    {
      "id": "robotics_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later."
      ]
    },
    {
      "id": "robotics_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision.",
        "I agreed on the risks, a reversible step, and a review time."
      ]
    },
    {
      "id": "robotics_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify."
      ]
    },
    {
      "id": "robotics_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates."
      ]
    },
    {
      "id": "robotics_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "robotics_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations."
      ]
    }
  ],
  "industrial": [
    {
      "id": "industrial_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given production throughput readings showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data."
      ]
    },
    {
      "id": "industrial_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a production improvement. How do you usually organise your time?",
      "options": [
        "I check which deadlines are nearest and adjust my list.",
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it."
      ]
    },
    {
      "id": "industrial_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a process-analysis tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I asked someone to walk me through the parts I needed.",
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task."
      ]
    },
    {
      "id": "industrial_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a production improvement. Which description is closest to how you contributed recently?",
      "options": [
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time."
      ]
    },
    {
      "id": "industrial_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a production improvement without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask."
      ]
    },
    {
      "id": "industrial_v2_problem_03",
      "skill": "problem",
      "q": "A result from a production improvement is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time."
      ]
    },
    {
      "id": "industrial_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a production improvement. What reflects your typical reaction?",
      "options": [
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins."
      ]
    },
    {
      "id": "industrial_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a production improvement is no longer getting useful results. What do you tend to try?",
      "options": [
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team.",
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale."
      ]
    },
    {
      "id": "industrial_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a production improvement, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test.",
        "I try another common adjustment to see whether it makes a difference."
      ]
    },
    {
      "id": "industrial_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I think about which parts could transfer to my current project.",
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used."
      ]
    },
    {
      "id": "industrial_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly."
      ]
    },
    {
      "id": "industrial_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I reproduced the issue and isolated one change at a time.",
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example."
      ]
    },
    {
      "id": "industrial_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a production improvement. What did you do in a similar situation?",
      "options": [
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed."
      ]
    },
    {
      "id": "industrial_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review."
      ]
    },
    {
      "id": "industrial_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a production improvement, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda."
      ]
    },
    {
      "id": "industrial_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of production throughput readings disagree. How have you usually handled similar cases?",
      "options": [
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding."
      ]
    },
    {
      "id": "industrial_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can."
      ]
    },
    {
      "id": "industrial_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical."
      ]
    },
    {
      "id": "industrial_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available."
      ]
    },
    {
      "id": "industrial_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "industrial_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time.",
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks."
      ]
    },
    {
      "id": "industrial_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I ask what is blocking them and offer help if I can spare time.",
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready."
      ]
    },
    {
      "id": "industrial_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved."
      ]
    },
    {
      "id": "industrial_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations."
      ]
    }
  ],
  "civil": [
    {
      "id": "civil_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a structural modeling tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task.",
        "I asked someone to walk me through the parts I needed."
      ]
    },
    {
      "id": "civil_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a structural design. What reflects your typical reaction?",
      "options": [
        "I volunteer to begin one concrete part to create momentum.",
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins."
      ]
    },
    {
      "id": "civil_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a structural design is no longer getting useful results. What do you tend to try?",
      "options": [
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team."
      ]
    },
    {
      "id": "civil_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a structural design. Which description is closest to how you contributed recently?",
      "options": [
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly.",
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling."
      ]
    },
    {
      "id": "civil_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given site measurements and inspection reports showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation.",
        "I compare the result with an earlier report I already trust."
      ]
    },
    {
      "id": "civil_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a structural design without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I started with the technical sequence so I would not leave out important details.",
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation."
      ]
    },
    {
      "id": "civil_v2_problem_03",
      "skill": "problem",
      "q": "A result from a structural design is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before.",
        "I ask someone who has seen this type of issue what they would check."
      ]
    },
    {
      "id": "civil_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a structural design. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "civil_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a structural design, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "civil_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time."
      ]
    },
    {
      "id": "civil_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a structural design, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I ask them which part sounds different from their understanding.",
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately."
      ]
    },
    {
      "id": "civil_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option.",
        "I explain the reasons behind the plan so they can see its constraints."
      ]
    },
    {
      "id": "civil_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project."
      ]
    },
    {
      "id": "civil_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly."
      ]
    },
    {
      "id": "civil_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a structural design. What did you do in a similar situation?",
      "options": [
        "I asked each person to send their reasoning so I could look at it afterward.",
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision."
      ]
    },
    {
      "id": "civil_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of site measurements and inspection reports disagree. How have you usually handled similar cases?",
      "options": [
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question.",
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding."
      ]
    },
    {
      "id": "civil_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available."
      ]
    },
    {
      "id": "civil_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I offer to follow up with a written answer after checking the detail.",
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background."
      ]
    },
    {
      "id": "civil_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "civil_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I used shared criteria to compare the uncertain trade-offs.",
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks."
      ]
    },
    {
      "id": "civil_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent.",
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output."
      ]
    },
    {
      "id": "civil_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "civil_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved.",
        "I compare the two cases to find the first meaningful difference."
      ]
    },
    {
      "id": "civil_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time."
      ]
    }
  ],
  "chemical": [
    {
      "id": "chemical_v2_communication_00",
      "skill": "communication",
      "q": "A reviewer asks you to explain a process design without specialist jargon. Thinking of a similar experience, what did you tend to do?",
      "options": [
        "I sent a brief written overview and let the reviewer decide what to ask.",
        "I chose a familiar example, but mainly checked that I had covered my points.",
        "I asked what decision mattered most, then tailored an explanation.",
        "I started with the technical sequence so I would not leave out important details."
      ]
    },
    {
      "id": "chemical_v2_leadership_12",
      "skill": "leadership",
      "q": "Your group has no clear starting plan for a process design. What reflects your typical reaction?",
      "options": [
        "I suggest that the group decide who should lead the planning.",
        "I draft a few possible next steps and ask for feedback.",
        "I suggested shared goals and agreed on owners and check-ins.",
        "I volunteer to begin one concrete part to create momentum."
      ]
    },
    {
      "id": "chemical_v2_creativity_15",
      "skill": "creativity",
      "q": "An approach used for a process design is no longer getting useful results. What do you tend to try?",
      "options": [
        "I combine a familiar method with a small new idea.",
        "I explored different approaches and tried one on a small scale.",
        "I improve the existing approach because its limits are familiar.",
        "I look for a proven approach used by another team."
      ]
    },
    {
      "id": "chemical_v2_problem_03",
      "skill": "problem",
      "q": "A result from a process design is inconsistent with expectations. What do you usually do first?",
      "options": [
        "I ask someone who has seen this type of issue what they would check.",
        "I isolate a small example so I can see when the issue appears.",
        "I reproduced the issue and tested causes one at a time.",
        "I try a familiar fix that helped with something similar before."
      ]
    },
    {
      "id": "chemical_v2_technical_21",
      "skill": "technical",
      "q": "You need to use a process simulation tool for an assignment. What best describes how you got started the last time?",
      "options": [
        "I completed a short tutorial and then tried the task myself.",
        "I tried a small example and checked my result against the documentation.",
        "I followed a familiar example and adjusted it to my task.",
        "I asked someone to walk me through the parts I needed."
      ]
    },
    {
      "id": "chemical_v2_time_09",
      "skill": "time",
      "q": "You have several competing deadlines connected to a process design. How do you usually organise your time?",
      "options": [
        "I set priorities by deadlines and impact, then reviewed them.",
        "I begin with the task I can make progress on immediately.",
        "I work through my written list in the order I created it.",
        "I check which deadlines are nearest and adjust my list."
      ]
    },
    {
      "id": "chemical_v2_analytical_18",
      "skill": "analytical",
      "q": "You are given plant process measurements showing an unexpected pattern. What most resembles your first reaction?",
      "options": [
        "I compare the result with an earlier report I already trust.",
        "I check whether the pattern appears in another subset of the data.",
        "I checked definitions and data sources before interpreting it.",
        "I look for the most prominent change to help form an explanation."
      ]
    },
    {
      "id": "chemical_v2_teamwork_06",
      "skill": "teamwork",
      "q": "Your group is completing a process design. Which description is closest to how you contributed recently?",
      "options": [
        "I concentrated on delivering my assigned part accurately and on time.",
        "I joined discussions when decisions affected the part I was handling.",
        "I shared progress with others and offered help when I had capacity.",
        "I checked the team's dependencies and adjusted my work accordingly."
      ]
    },
    {
      "id": "chemical_v2_time_10",
      "skill": "time",
      "q": "An unexpected interruption takes time away from a task. What most resembles what you do afterward?",
      "options": [
        "I continue from where I stopped and make up the time later.",
        "I tell anyone waiting on my output that I might be late.",
        "I recalculate what I can finish and move less urgent work.",
        "I renegotiated milestones and reordered my tasks accordingly."
      ]
    },
    {
      "id": "chemical_v2_technical_22",
      "skill": "technical",
      "q": "A tool produces unexpected output while you are working. What is closest to your usual response?",
      "options": [
        "I try a commonly recommended setting to see whether it resolves the issue.",
        "I search examples of the same error and follow a relevant solution.",
        "I check the tool settings and compare them against a working example.",
        "I reproduced the issue and isolated one change at a time."
      ]
    },
    {
      "id": "chemical_v2_communication_01",
      "skill": "communication",
      "q": "In a discussion about a process design, a teammate appears to interpret your point differently. What is closest to your usual response?",
      "options": [
        "I checked their interpretation and confirmed our next step.",
        "I add supporting details about my reasoning before returning to the agenda.",
        "I leave time after the meeting for them to ask privately.",
        "I ask them which part sounds different from their understanding."
      ]
    },
    {
      "id": "chemical_v2_teamwork_07",
      "skill": "teamwork",
      "q": "Two teammates disagree about how to complete a process design. What did you do in a similar situation?",
      "options": [
        "I listened to both views and summarized where they already agreed.",
        "I helped them compare constraints and choose a next step everyone could test.",
        "I suggested letting the person closest to the work make the decision.",
        "I asked each person to send their reasoning so I could look at it afterward."
      ]
    },
    {
      "id": "chemical_v2_creativity_16",
      "skill": "creativity",
      "q": "You discover a useful technique from a different subject. What usually happens next?",
      "options": [
        "I adapt the technique to a specific constraint and test the result.",
        "I save it for a future task where it might fit more directly.",
        "I use the technique in roughly the same way it was originally used.",
        "I think about which parts could transfer to my current project."
      ]
    },
    {
      "id": "chemical_v2_analytical_19",
      "skill": "analytical",
      "q": "Two summaries of plant process measurements disagree. How have you usually handled similar cases?",
      "options": [
        "I compare the methods and identify where the numbers diverge.",
        "I reconciled the time windows and definitions before deciding.",
        "I rely on the report from the person most familiar with the system.",
        "I choose the report that best fits our original question."
      ]
    },
    {
      "id": "chemical_v2_leadership_13",
      "skill": "leadership",
      "q": "Someone challenges a plan you suggested. What do you tend to do?",
      "options": [
        "I explain the reasons behind the plan so they can see its constraints.",
        "I ask them to put their concerns in writing for later review.",
        "I ask which assumption they disagree with and hear their suggestion.",
        "I compared the alternatives and explained the chosen option."
      ]
    },
    {
      "id": "chemical_v2_problem_04",
      "skill": "problem",
      "q": "You tried a change in a process design, but the problem is still present. Which approach best reflects your last similar experience?",
      "options": [
        "I try another common adjustment to see whether it makes a difference.",
        "I ask for a second opinion before spending more time on the problem.",
        "I compare the new result with the earlier one to narrow down possibilities.",
        "I examine what the failed attempt ruled out and revise my next test."
      ]
    },
    {
      "id": "chemical_v2_time_11",
      "skill": "time",
      "q": "You estimate that a task will take two hours, but it takes much longer. How do you react?",
      "options": [
        "I work longer on this task to avoid changing the wider schedule.",
        "I note what took longer and update my remaining tasks.",
        "I identified which assumptions were wrong and adjusted estimates.",
        "I increase the estimate for similar tasks the next time."
      ]
    },
    {
      "id": "chemical_v2_problem_05",
      "skill": "problem",
      "q": "A solution works for one example but not another. What is closest to your normal next step?",
      "options": [
        "I compare the two cases to find the first meaningful difference.",
        "I form a possible explanation and test it against both cases.",
        "I focus on the case that works while the other case is investigated later.",
        "I search for a similar example that has already been solved."
      ]
    },
    {
      "id": "chemical_v2_creativity_17",
      "skill": "creativity",
      "q": "A teammate proposes an unusual idea with some clear weaknesses. How do you normally respond?",
      "options": [
        "I ask them to demonstrate the idea before discussing it further.",
        "I explore which part of the idea might solve our main problem.",
        "I suggested a small test of the idea's most promising aspect.",
        "I suggest using a safer known solution until more time is available."
      ]
    },
    {
      "id": "chemical_v2_communication_02",
      "skill": "communication",
      "q": "After a presentation, you receive a question you did not prepare for. What most resembles your response in the past?",
      "options": [
        "I clarify what aspect they are asking about before answering what I can.",
        "I clarified the question and stated what I could verify.",
        "I explain the nearest topic I know well to provide some useful background.",
        "I offer to follow up with a written answer after checking the detail."
      ]
    },
    {
      "id": "chemical_v2_analytical_20",
      "skill": "analytical",
      "q": "You need to choose between two reasonable options with imperfect evidence. What do you tend to do?",
      "options": [
        "I use my experience to select the option that seems more practical.",
        "I ask the people affected which option they prefer.",
        "I list the trade-offs and choose the option with fewer major risks.",
        "I used shared criteria to compare the uncertain trade-offs."
      ]
    },
    {
      "id": "chemical_v2_leadership_14",
      "skill": "leadership",
      "q": "A group decision has to be made without all the information you wanted. What is your usual approach?",
      "options": [
        "I agreed on the risks, a reversible step, and a review time.",
        "I choose the option that fits how we handled similar tasks before.",
        "I ask the most experienced teammate to decide.",
        "I identify the missing information and suggest a temporary decision."
      ]
    },
    {
      "id": "chemical_v2_teamwork_08",
      "skill": "teamwork",
      "q": "A teammate is behind schedule on a shared task. What is closest to how you typically respond?",
      "options": [
        "I checked what blocked them and helped adjust the shared plan.",
        "I finish my share first to avoid making the delay larger.",
        "I message them to ask when their part is likely to be ready.",
        "I ask what is blocking them and offer help if I can spare time."
      ]
    },
    {
      "id": "chemical_v2_technical_23",
      "skill": "technical",
      "q": "You finish a task with a tool you have only recently learned. What do you usually do before handing it over?",
      "options": [
        "I checked key examples and explained the tool's limitations.",
        "I check that the main result looks like the expected output.",
        "I ask another person to review it because the tool is new to me.",
        "I try a second example to see whether the result is consistent."
      ]
    }
  ]
};

/* ---------- Learning paths (4 steps per skill) ---------- */
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
  time: [
    { title: "Time management basics", desc: "Learn how to organize daily tasks." },
    { title: "Goal setting", desc: "Learn how to create achievable goals." },
    { title: "Prioritization", desc: "Learn how to tell urgent tasks from important ones." },
    { title: "Productivity techniques", desc: "Learn practical methods for managing your time." }
  ],
  leadership: [
    { title: "Taking initiative", desc: "Start useful work without waiting to be asked." },
    { title: "Delegating and motivating", desc: "Match tasks to strengths and recognise effort." },
    { title: "Making decisions", desc: "Decide with incomplete information and review the outcome." },
    { title: "Leading by example", desc: "Model the standards and behaviour you expect from the team." }
  ],
  creativity: [
    { title: "Idea generation", desc: "Produce many possible ideas before judging any of them." },
    { title: "Looking at problems differently", desc: "Reframe a problem to see new angles and options." },
    { title: "Combining ideas", desc: "Mix existing ideas from different areas into something new." },
    { title: "Testing and refining ideas", desc: "Turn a raw idea into something workable through feedback." }
  ],
  analytical: [
    { title: "Reading data and evidence", desc: "Pull out the facts that actually matter from the noise." },
    { title: "Spotting patterns", desc: "Notice trends, comparisons and relationships in information." },
    { title: "Structured reasoning", desc: "Move from evidence to a conclusion in clear, logical steps." },
    { title: "Evaluating decisions", desc: "Weigh options against evidence before choosing one." }
  ],
  technical: [
    { title: "Everyday productivity tools", desc: "Get comfortable with documents, spreadsheets and slides." },
    { title: "Online safety and privacy", desc: "Protect your accounts, passwords and personal data." },
    { title: "Evaluating online information", desc: "Judge whether a source is reliable before you use it." },
    { title: "Learning new tools quickly", desc: "Build the habit of picking up new software and tools with confidence." }
  ]
};

/* ---------- Quizzes (5 questions per skill) ---------- */
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
  creativity: [
    { q: "What is the goal of a brainstorming session?",
      options: ["Pick the first idea and stop", "Generate as many ideas as possible before judging them", "Copy an existing solution exactly", "Let one person decide alone"], answer: 1 },
    { q: "Which is an example of combining ideas creatively?",
      options: ["Using a solution from one field to solve a problem in another", "Repeating the same design every time", "Rejecting any idea that seems unusual", "Waiting for inspiration before starting"], answer: 0 },
    { q: "What usually blocks creative thinking the most?",
      options: ["Judging ideas too early", "Asking too many questions", "Trying more than one option", "Working with other people"], answer: 0 },
    { q: "Why is it useful to reframe a problem?",
      options: ["It makes the problem disappear", "It can reveal new angles and options you missed", "It avoids the need for a solution", "It is only useful in art"], answer: 1 },
    { q: "How should a raw creative idea usually be treated?",
      options: ["Used exactly as first imagined", "Refined through feedback and testing", "Discarded if it is unusual", "Kept private forever"], answer: 1 }
  ],
  analytical: [
    { q: "When given a set of data, what should you look for first?",
      options: ["Any random number", "Patterns, trends or relationships", "The largest number only", "Nothing, just guess"], answer: 1 },
    { q: "What is the danger of jumping straight to a conclusion?",
      options: ["It saves time with no downside", "You may miss evidence that changes the answer", "It always gives the right answer", "It makes the analysis more thorough"], answer: 1 },
    { q: "What does it mean to reason logically from evidence to a conclusion?",
      options: ["Guessing based on a feeling", "Following clear steps that each evidence point supports", "Picking the answer you prefer", "Ignoring the evidence"], answer: 1 },
    { q: "Two options both look reasonable. What should you do?",
      options: ["Pick either one randomly", "Weigh each against the evidence and trade-offs", "Choose the more popular one only", "Avoid deciding"], answer: 1 },
    { q: "Why is comparing data over time useful?",
      options: ["It has no real use", "It helps you notice a trend rather than one snapshot", "It only matters for weather data", "It replaces the need for evidence"], answer: 1 }
  ],
  technical: [
    { q: "Which is the strongest password?",
      options: ["Your birthday", "A long mix of words, numbers and symbols", "12345678", "Your name"], answer: 1 },
    { q: "Which is a sign of a phishing email?",
      options: ["An urgent request for your password from an unknown sender", "A message from a known contact", "Plain text formatting", "Correct spelling"], answer: 0 },
    { q: "Which source is most likely to be reliable?",
      options: ["One with the most likes", "One with many ads", "One that names the author and cites evidence", "The first search result"], answer: 2 },
    { q: "Why do shared cloud documents help collaboration?",
      options: ["Files must be emailed back and forth", "Only one person may open the file", "They work offline only", "Several people can edit the same file at once"], answer: 3 },
    { q: "What is the best way to get comfortable with a new tool quickly?",
      options: ["Avoid it until forced to use it", "Explore its basics and look up what you get stuck on", "Wait for someone else to explain everything", "Assume it works exactly like every other tool"], answer: 1 }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SKILLS, CAREERS, ASSESSMENTS, PATHS, QUIZZES };
}
