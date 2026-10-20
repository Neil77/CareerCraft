/* CareerCraft - application logic.
   Each page runs its initializer after authenticating/loading user state from the backend. */
(function () {
  "use strict";

  /* ---------- Server-backed account and state ---------- */
  const KEYS = {
    career: "careercraft.career", draft: "careercraft.draft", result: "careercraft.result",
    progress: "careercraft.progress", quizzes: "careercraft.quizzes"
  };
  const defaults = { career: null, draft: {}, result: null, progress: {}, quizzes: [], history: [], interests: null };
  const cache = { ...defaults };
  let currentUser = null;
  let assessmentHistory = [];
  let interestProfile = null;
  let pendingWrite = Promise.resolve();

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" }, ...options
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Server request failed.");
    return payload;
  }

  function saveField(key, value) {
    const field = key.replace("careercraft.", "");
    // Serializing writes prevents earlier async saves from overwriting newer ones.
    pendingWrite = pendingWrite.catch(() => {}).then(() => api(`/api/state/${field}`, {
      method: "PUT", keepalive: true, body: JSON.stringify({ value })
    }));
    pendingWrite.catch(err => {
      console.error("Could not save your progress:", err);
      const message = document.querySelector("#save-warning");
      if (message) { message.hidden = false; message.textContent = "Could not save your changes: " + err.message; }
    });
    return pendingWrite;
  }
  const Store = {
    get(key, fallback) {
      return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : fallback;
    },
    set(key, value) { cache[key] = structuredClone(value); return saveField(key, value); },
    remove(key) { cache[key] = structuredClone(defaults[key.replace("careercraft.", "")]); return saveField(key, cache[key]); }
  };

  const getSession = () => currentUser && currentUser.email;
  const findUser = email => currentUser && currentUser.email === email.trim().toLowerCase() ? currentUser : null;
  async function registerUser(name, email, password) {
    const data = await api("/api/register", {
      method: "POST", body: JSON.stringify({ name, email, password })
    });
    currentUser = data.user;
    return data.user;
  }
  async function loginUser(email, password) {
    const data = await api("/api/login", {
      method: "POST", body: JSON.stringify({ email, password })
    });
    currentUser = data.user;
    return data.user;
  }
  async function clearSession() {
    await api("/api/logout", { method: "POST" });
    currentUser = null;
  }

  /* Data and authentication must load before page rendering. */
  async function bootstrap() {
    const data = await api("/api/bootstrap");
    currentUser = data.user;
    if (data.state) {
      Object.entries(KEYS).forEach(([key, storageKey]) => {
        cache[storageKey] = data.state[key];
      });
      assessmentHistory = data.state.history || [];
      interestProfile = data.state.interests || null;
    }
  }

  function requireAuth() {
    if (currentUser) return true;
    const here = window.location.pathname.split("/").pop() + window.location.search;
    window.location.href = "login.html?next=" + encodeURIComponent(here);
    return false;
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const skillById = id => SKILLS.find(s => s.id === id);
  const careerById = id => CAREERS.find(c => c.id === id);
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const getCareerId = () => Store.get(KEYS.career, null);
  const getCareer = () => careerById(getCareerId());
  const getResult = () => Store.get(KEYS.result, null);
  const getProgress = () => Store.get(KEYS.progress, {});
  const getQuizzes = () => Store.get(KEYS.quizzes, []);
  const PRACTICE = {
    communication: { exercise: "Explain a technical concept to a friend in two minutes, then ask what was unclear.", label: "Atlassian teamwork playbook", url: "https://www.atlassian.com/team-playbook" },
    problem: { exercise: "Choose a bug or everyday challenge, identify a root cause and compare two possible fixes.", label: "Khan Academy learning library", url: "https://www.khanacademy.org/" },
    teamwork: { exercise: "Lead a 15-minute group retrospective and write down one improvement for the next task.", label: "Atlassian teamwork playbook", url: "https://www.atlassian.com/team-playbook" },
    time: { exercise: "Create a realistic weekly plan with priorities and review how well you followed it.", label: "Atlassian productivity resources", url: "https://www.atlassian.com/blog/productivity" },
    leadership: { exercise: "Organize a small group task, agree on responsibilities and request feedback afterwards.", label: "Atlassian teamwork playbook", url: "https://www.atlassian.com/team-playbook" },
    creativity: { exercise: "Sketch three alternatives to one problem and test the most promising with a classmate.", label: "IDEO Design Kit methods", url: "https://www.designkit.org/methods" },
    analytical: { exercise: "Use a small dataset to create one chart, identify a trend and check an alternative explanation.", label: "Khan Academy statistics", url: "https://www.khanacademy.org/math/statistics-probability" },
    technical: { exercise: "Follow a short tutorial, build a tiny working prototype and commit it to version control.", label: "freeCodeCamp curriculum", url: "https://www.freecodecamp.org/learn/" }
  };


  function band(pct) {
    if (pct >= 75) return { key: "strong", label: "Strong" };
    if (pct >= 50) return { key: "developing", label: "Developing" };
    return { key: "focus", label: "Needs focus" };
  }

  const getAssessment = career => (career && ASSESSMENTS[career.id]) || ASSESSMENTS[CAREERS[0].id];

  /* Weight of a skill for a given career (2 = core, 1 = normal, 1 if no career chosen). */
  function weightFor(career, skillId) {
    return (career && career.weights && career.weights[skillId]) || 1;
  }

  /* Areas to develop: ranked by how much a low score hurts *this* career,
     i.e. (100 - score) * career weight. Falls back to plain lowest score
     when no career is selected. At most three, or one if everything is strong. */
  function findGaps(scores, career) {
    const ranked = SKILLS.map(s => {
      const pct = scores[s.id];
      const weight = weightFor(career, s.id);
      return { skill: s, pct: pct, weight: weight, priority: (100 - pct) * weight };
    });
    const below = ranked.filter(x => x.pct < 75).sort((a, b) => b.priority - a.priority || a.pct - b.pct);
    if (below.length) return below.slice(0, 3);
    const best = ranked.slice().sort((a, b) => b.priority - a.priority || a.pct - b.pct)[0];
    return [best];
  }

  function emptyState(container, title, text, href, label) {
    container.innerHTML =
      '<div class="card empty"><h2>' + escapeHtml(title) + "</h2><p>" + escapeHtml(text) + "</p>" +
      '<a class="btn" href="' + href + '">' + escapeHtml(label) + "</a></div>";
  }

  function renderBars(container, scores, order) {
    container.innerHTML = order.map(skill => {
      const pct = scores[skill.id];
      const b = band(pct);
      return '<div class="bar-row">' +
        '<span class="name">' + skill.name + "</span>" +
        '<span class="bar-track" role="img" aria-label="' + skill.name + " " + pct + ' percent"><span class="bar-fill ' + b.key + '" data-w="' + pct + '"></span></span>' +
        '<span class="bar-val">' + pct + '%<small>' + b.label + "</small></span></div>";
    }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$(".bar-fill", container).forEach(f => { f.style.width = f.dataset.w + "%"; });
    }));
  }

  /* ---------- Shared: navbar ---------- */
  function initNav() {
    const page = document.body.dataset.page;
    $$(".nav-links a").forEach(a => { if (a.dataset.page === page) a.setAttribute("aria-current", "page"); });
    const toggle = $(".nav-toggle");
    const links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    renderAccountSlot();
    const main = document.querySelector("main");
    if (main && !$("#save-warning")) {
      const warning = document.createElement("p");
      warning.id = "save-warning";
      warning.className = "notice save-warning";
      warning.setAttribute("role", "alert");
      warning.hidden = true;
      main.prepend(warning);
    }
  }

  function renderAccountSlot() {
    const slot = $("#nav-account");
    if (!slot) return;
    const email = getSession();
    const user = email && findUser(email);
    if (user) {
      slot.innerHTML =
        '<span class="nav-user">Hi, ' + escapeHtml(user.name) + "</span>" +
        '<button class="btn secondary small" id="logout-btn" type="button">Log out</button>';
      $("#logout-btn", slot).addEventListener("click", async () => {
        try { await clearSession(); window.location.href = "index.html"; }
        catch (err) { alert("Could not log out: " + err.message); }
      });
    } else {
      slot.innerHTML =
        '<a href="login.html" data-page="login">Log in</a>' +
        '<a class="btn small" href="register.html" data-page="register">Sign up</a>';
    }
  }

  /* ---------- Page: Home ---------- */
  function initHome() {
    const note = $("#resume-note");
    if (!note) return;
    const result = getResult();
    const career = getCareer();
    if (result) {
      note.hidden = false;
      note.innerHTML = 'You already have results saved. <a href="dashboard.html">Open your dashboard</a>';
    } else if (career) {
      note.hidden = false;
      note.innerHTML = 'You picked <strong>' + escapeHtml(career.name) + '</strong>. ' +
        '<a href="assessment.html">Continue to the assessment</a> or <a href="careers.html">change your career path</a>.';
    }
  }

  /* ---------- Page: Explore career matches ---------- */
  async function initExplore() {
    if (!requireAuth()) return;
    const root = $("#explore-root");
    try {
      const data = await api("/api/matches");
      const values = data.profile || Object.fromEntries(data.interests.map(x => [x.id, 3]));
      root.innerHTML = '<div class="card"><h2>What do you enjoy working on?</h2>' +
        '<p class="muted">Rate each interest from 1 (not interested) to 5 (very interested). Your responses are saved in MongoDB.</p>' +
        '<form id="interest-form" class="interest-grid">' + data.interests.map(it =>
          '<label class="interest-item"><strong>' + escapeHtml(it.label) + '</strong><span>' + escapeHtml(it.hint) + '</span>' +
          '<div class="range-row"><span>1</span><input type="range" name="' + it.id + '" min="1" max="5" step="1" value="' + values[it.id] + '"><span>5</span><output>' + values[it.id] + '</output></div></label>'
        ).join("") + '</form><div class="btn-row" style="margin-top:1rem"><button id="find-matches" class="btn">Show my career matches</button>' +
        '<a class="btn secondary" href="careers.html">I already have a career in mind</a></div></div>' +
        '<section id="match-results" style="margin-top:1.4rem" aria-live="polite"></section>';
      $$("input[type=range]", root).forEach(input => input.addEventListener("input", () => {
        input.closest(".range-row").querySelector("output").textContent = input.value;
      }));
      $("#find-matches").addEventListener("click", async () => {
        const interests = {};
        $$("input[type=range]", root).forEach(input => { interests[input.name] = Number(input.value); });
        const button = $("#find-matches");
        button.disabled = true;
        try {
          await api("/api/interests", { method: "PUT", body: JSON.stringify({ interests }) });
          interestProfile = interests;
          const result = await api("/api/matches");
          renderMatches(result);
        } catch (err) { alert("Could not find matches: " + err.message); }
        finally { button.disabled = false; }
      });
      if (data.profile) renderMatches(data);
    } catch (err) { root.textContent = "Could not load career exploration: " + err.message; }
    function renderMatches(data) {
      const box = $("#match-results");
      if (!data.matches.length) { box.innerHTML = '<p class="notice">Rate your interests and select Show my career matches.</p>'; return; }
      box.innerHTML = '<div class="page-head"><h2>Your career exploration matches</h2>' +
        '<p>Ranked using ' + (data.hasAssessment ? "70% interest alignment and 30% indicative skill scores" : "interest alignment only") +
        '. These numbers are a transparent exploration aid, <strong>not</strong> probabilities of success, selection or job fit. You can choose any career.</p></div>' +
        '<div class="career-grid">' + data.matches.map((m, i) =>
          '<article class="card career-card"><div class="match-heading"><span class="icon-badge">' + m.icon + '</span><span class="match-score">' + m.match + '<small>/100 exploratory fit</small></span></div>' +
          '<h3>' + (i + 1) + '. ' + escapeHtml(m.name) + '</h3><p>' + escapeHtml(m.blurb) + '</p>' +
          '<p class="muted"><strong>Related interests:</strong> ' + escapeHtml(m.reasons.join(", ")) + '</p>' +
          (m.prioritySkills.length ? '<p class="muted"><strong>Skills to develop:</strong> ' + m.prioritySkills.map(id => escapeHtml(skillById(id).name)).join(", ") + '</p>' : '') +
          '<div class="match-track"><span style="width:' + m.match + '%"></span></div>' +
          '<button class="btn career-match-pick" data-id="' + m.id + '">Build a path for this career</button></article>'
        ).join("") + '</div><p class="field-hint">The same 8 core skills are reused between careers; this is a starting point for exploration, not an externally validated aptitude test.</p>';
      $$(".career-match-pick", box).forEach(button => button.addEventListener("click", async () => {
        try {
          await Store.set(KEYS.career, button.dataset.id);
          await Store.remove(KEYS.draft);
          window.location.href = "assessment.html";
        } catch (err) { alert("Could not save your choice: " + err.message); }
      }));
    }
  }

  /* ---------- Page: Careers ---------- */
  function initCareers() {
    if (!requireAuth()) return;
    const root = $("#careers-root");
    const current = getCareerId();
    root.innerHTML = CAREERS.map(c => {
      const chips = (c.techSkills || []).map(s => '<span class="tech-chip">' + escapeHtml(s) + "</span>").join("");
      return '<article class="card career-card' + (c.id === current ? " selected" : "") + '" data-id="' + c.id + '">' +
        '<div class="icon-badge" aria-hidden="true">' + c.icon + "</div>" +
        "<h3>" + escapeHtml(c.name) + "</h3>" +
        "<p>" + escapeHtml(c.blurb) + "</p>" +
        (chips ? '<div class="tech-block"><span class="tech-label">Typical skills &amp; tools</span><div class="tech-chips">' + chips + "</div></div>" : "") +
        '<button class="btn career-pick" data-id="' + c.id + '">' + (c.id === current ? "Selected \u2713" : "Choose this path") + "</button>" +
        "</article>";
    }).join("");

    const search = $("#career-search");
    if (search) search.addEventListener("input", () => {
      const phrase = search.value.trim().toLowerCase();
      $$(".career-card", root).forEach(c => { c.hidden = !c.textContent.toLowerCase().includes(phrase); });
    });
    $$(".career-pick", root).forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          if (btn.dataset.id !== current) {
            await Store.set(KEYS.career, btn.dataset.id);
            await Store.remove(KEYS.draft);
            // Keep earlier assessments and learning history when changing paths.
          }
          window.location.href = "assessment.html";
        } catch (err) { alert("Could not save career: " + err.message); }
      });
    });
  }

  /* ---------- Page: Assessment ---------- */
  function initAssessment() {
    if (!requireAuth()) return;
    const career = getCareer();
    const careerNote = $("#career-note");
    if (!career) {
      window.location.href = "careers.html";
      return;
    }
    if (careerNote) {
      careerNote.hidden = false;
      careerNote.innerHTML = 'Assessing for <strong>' + escapeHtml(career.name) + '</strong>. <a href="careers.html">Change career</a>';
    }

    const assessment = getAssessment(career);
    const draft = Store.get(KEYS.draft, {});
    // Older assessment drafts used different question IDs and option ordering.
    // Keep only answers from the current question bank/version.
    const validIds = new Set(assessment.map(q => q.id));
    let answers = Object.fromEntries(Object.entries(draft || {}).filter(([id, value]) =>
      validIds.has(id) && Number.isInteger(value) && value >= 0 && value < 4));
    let index = assessment.findIndex(q => answers[q.id] === undefined);
    if (index === -1) index = 0;

    const card = $("#question-card");
    const counter = $("#counter");
    const percent = $("#percent");
    const bar = $("#bar");
    const barWrap = $("#bar-wrap");
    const prev = $("#prev");
    const next = $("#next");

    if (assessmentHistory.some(a => a.career === career.id)) {
      $("#retake-note").hidden = false;
    }

    function render() {
      const q = assessment[index];
      const skill = skillById(q.skill);
      const total = assessment.length;
      const answered = assessment.filter(q => answers[q.id] !== undefined).length;
      const done = Math.round((answered / total) * 100);
      counter.textContent = "Question " + (index + 1) + " of " + total;
      percent.textContent = done + "%";
      bar.style.width = done + "%";
      barWrap.setAttribute("aria-valuenow", String(done));

      card.innerHTML =
        '<span class="q-tag">Scenario ' + (index + 1) + ' of ' + total + '</span>' +
        '<h2 id="q-title">' + escapeHtml(q.q) + "</h2>" +
        '<p class="assessment-hint">Think of what you actually did in a similar situation, not the answer that sounds most impressive.</p>' +
        '<div class="options" role="radiogroup" aria-labelledby="q-title">' +
        q.options.map((opt, i) =>
          '<label class="opt' + (answers[q.id] === i ? " selected" : "") + '">' +
          '<input type="radio" name="answer" value="' + i + '"' + (answers[q.id] === i ? " checked" : "") + ">" +
          '<span class="dot"></span><span>' + escapeHtml(opt) + "</span></label>").join("") +
        "</div>";

      $$('input[name="answer"]', card).forEach(input => {
        input.addEventListener("change", () => {
          answers[q.id] = Number(input.value);
          Store.set(KEYS.draft, answers);
          $$(".opt", card).forEach(l => l.classList.remove("selected"));
          input.closest(".opt").classList.add("selected");
          next.disabled = false;
        });
      });

      prev.disabled = index === 0;
      next.disabled = answers[q.id] === undefined;
      next.textContent = index === total - 1 ? "Analyze my skills" : "Next";
    }

    prev.addEventListener("click", () => { if (index > 0) { index--; render(); } });
    next.addEventListener("click", async () => {
      if (index < assessment.length - 1) { index++; render(); return; }
      // Discourage response-position straight-lining; do not invalidate real users.
      const positionCounts = [0, 0, 0, 0];
      assessment.forEach(q => positionCounts[answers[q.id]]++);
      if (Math.max(...positionCounts) >= 15 &&
          !window.confirm("Your selections repeatedly use the same answer position. Since the options are intentionally mixed, please review whether each choice describes your real behavior. Click Cancel to review or OK to continue.")) return;
      if (!window.confirm("Before submitting: are these the choices that best match your real experiences? You can choose Cancel to review them.")) return;
      next.disabled = true;
      try {
        await pendingWrite; // wait for the last saved draft
        const response = await api("/api/assessment/submit", { method: "POST", body: JSON.stringify({ career: career.id, answers }) });
        cache[KEYS.result] = response.result;
        assessmentHistory.push(response.result);
        cache[KEYS.draft] = {};
        window.location.href = "analysis.html";
      } catch (err) {
        alert("Could not save your assessment: " + err.message);
        next.disabled = false;
      }
    });

    render();
  }

  /* ---------- Page: Analysis ---------- */
  function initAnalysis() {
    if (!requireAuth()) return;
    const result = getResult();
    const root = $("#analysis-root");
    root.hidden = false;
    if (!result) {
      emptyState(root, "No results yet", "Choose a career and answer the short assessment to see your skill profile here.", "careers.html", "Choose a career path");
      return;
    }
    root.hidden = false;
    const scores = result.scores;
    const career = careerById(result.career) || getCareer();

    const careerBadge = $("#analysis-career");
    if (careerBadge && career) {
      careerBadge.hidden = false;
      careerBadge.innerHTML = 'Skill profile for <strong>' + escapeHtml(career.name) + '</strong> \u00b7 <a href="careers.html">change career</a>';
    }

    renderBars($("#profile-bars"), scores, SKILLS);
    CareerCharts.radar($("#radar-chart"), SKILLS, scores);
    CareerCharts.distribution($("#distribution-chart"), SKILLS, scores);

    if (career && career.techSkills && career.techSkills.length) {
      $("#tech-section").hidden = false;
      $("#tech-chips").innerHTML = career.techSkills.map(s => '<span class="tech-chip">' + escapeHtml(s) + "</span>").join("");
    }

    const gaps = findGaps(scores, career);
    const gapBox = $("#gap-box");
    let pathSkills;
    if (gaps.some(g => g.pct < 75)) {
      gapBox.innerHTML = '<ul class="gap-list">' + gaps.map(g =>
        "<li>" + g.skill.name + " (" + g.pct + "%)" + (g.weight > 1 ? '<span class="key-tag">Key for ' + (career ? escapeHtml(career.name) : "this path") + '</span>' : "") + "</li>").join("") + "</ul>" +
        '<p class="muted">' + (career ? "These matter most for " + escapeHtml(career.name) + " and have the most room to grow. " : "These have the most room to grow. ") + "Start with the first one.</p>";
      pathSkills = gaps.map(g => g.skill);
    } else {
      const top = gaps[0];
      gapBox.innerHTML = '<p>Every skill is at 75% or above. Your lowest relative to ' + (career ? escapeHtml(career.name) : "your profile") + " is " + top.skill.name + " (" + top.pct + '%), so that is a good one to stretch next.</p>';
      pathSkills = [top.skill];
    }

    const tabs = $("#path-tabs");
    const pathBox = $("#path-box");
    let current = pathSkills[0].id;

    function renderPath() {
      const skill = skillById(current);
      const done = getProgress()[current] || [];
      pathBox.innerHTML =
        '<h3>' + skill.name + ' learning path</h3>' +
        '<ol class="path-steps">' +
        PATHS[current].map((step, i) =>
          '<li class="path-step' + (done.includes(i) ? " done" : "") + '"><input type="checkbox" id="step-' + i + '" data-i="' + i + '"' + (done.includes(i) ? " checked" : "") + '>' +
          '<label for="step-' + i + '"><strong>' + escapeHtml(step.title) + "</strong><span>" + escapeHtml(step.desc) + "</span></label></li>").join("") +
        "</ol>" +
        '<p class="path-tip"><strong>Practice activity:</strong> ' + escapeHtml(PRACTICE[current]?.exercise || "Apply this skill in your next project and record what you learned.") + '</p>' +
        '<p><a href="' + escapeHtml(PRACTICE[current]?.url || "https://www.khanacademy.org/") + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(PRACTICE[current]?.label || "Explore a learning resource") + ' ↗</a></p>' +
        '<a class="btn" href="quiz.html?skill=' + current + '">Take the ' + skill.name.toLowerCase() + " quiz</a>";

      $$('input[type="checkbox"]', pathBox).forEach(box => {
        box.addEventListener("change", () => {
          const progress = getProgress();
          const list = new Set(progress[current] || []);
          const i = Number(box.dataset.i);
          if (box.checked) list.add(i); else list.delete(i);
          progress[current] = Array.from(list).sort();
          Store.set(KEYS.progress, progress);
          box.closest(".path-step").classList.toggle("done", box.checked);
        });
      });
    }

    tabs.innerHTML = pathSkills.map(s =>
      '<button class="tab" role="tab" data-id="' + s.id + '" aria-selected="' + (s.id === current) + '">' + s.name + "</button>").join("");
    $$(".tab", tabs).forEach(tab => tab.addEventListener("click", () => {
      current = tab.dataset.id;
      $$(".tab", tabs).forEach(t => t.setAttribute("aria-selected", String(t === tab)));
      renderPath();
    }));
    renderPath();
  }

  /* ---------- Page: Quiz ---------- */
  function initQuiz() {
    if (!requireAuth()) return;
    const root = $("#quiz-root");
    const params = new URLSearchParams(window.location.search);
    const result = getResult();
    const career = (result && careerById(result.career)) || getCareer();
    let skillId = params.get("skill");
    if (!skillById(skillId)) {
      skillId = result ? findGaps(result.scores, career)[0].skill.id : SKILLS[0].id;
    }
    let questions = [];
    let index = 0;
    let correct = 0;
    let locked = false;
    let chosenAnswers = [];

    function showStart() {
      root.innerHTML =
        '<div class="card"><h2>Choose a skill to practice</h2>' +
        '<p class="muted">Each quiz has 5 questions. ' + (result ? "We preselected the skill that matters most for your career and needs the most work." : "Take the assessment to get a personal recommendation.") + "</p>" +
        '<div class="chip-grid">' + SKILLS.map(s => {
          const key = career && weightFor(career, s.id) > 1;
          return '<button class="chip" data-id="' + s.id + '" aria-pressed="' + (s.id === skillId) + '"><span class="icon-badge" style="margin:0">' + s.icon + "</span><span>" + s.name +
            (key ? '<small class="key-tag">Key skill</small>' : "") +
            (result ? "<small>Assessment score " + result.scores[s.id] + "%</small>" : "") + "</span></button>";
        }).join("") + "</div>" +
        '<button class="btn" id="start">Start quiz</button></div>';
      $$(".chip", root).forEach(chip => chip.addEventListener("click", () => {
        skillId = chip.dataset.id;
        $$(".chip", root).forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      }));
      $("#start").addEventListener("click", startQuiz);
    }

    function startQuiz() {
      questions = QUIZZES[skillId];
      index = 0; correct = 0; locked = false; chosenAnswers = [];
      showQuestion();
    }

    function showQuestion() {
      const q = questions[index];
      const skill = skillById(skillId);
      const total = questions.length;
      const pct = Math.round((index / total) * 100);
      root.innerHTML =
        '<div class="progress-meta"><span>' + skill.name + " quiz</span><span>Question " + (index + 1) + " of " + total + "</span></div>" +
        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card q-card"><h2>' + escapeHtml(q.q) + '</h2><div class="options">' +
        q.options.map((opt, i) => '<button class="opt" data-i="' + i + '"><span class="dot"></span><span>' + escapeHtml(opt) + "</span></button>").join("") +
        '</div><p class="feedback" aria-live="polite"></p>' +
        '<div class="nav-buttons"><span></span><button class="btn" id="qnext" disabled>' + (index === total - 1 ? "See result" : "Next") + "</button></div></div>";
      locked = false;

      $$(".opt", root).forEach(btn => btn.addEventListener("click", () => {
        if (locked) return;
        locked = true;
        const chosen = Number(btn.dataset.i);
        chosenAnswers[index] = chosen;
        const ok = chosen === q.answer;
        if (ok) correct++;
        $$(".opt", root).forEach(b => {
          b.disabled = true;
          if (Number(b.dataset.i) === q.answer) b.classList.add("correct");
        });
        if (!ok) btn.classList.add("wrong");
        $(".feedback", root).textContent = ok ? "Correct." : "Not quite. The correct answer is highlighted.";
        $("#qnext").disabled = false;
        $("#qnext").focus();
      }));
      $("#qnext").addEventListener("click", () => {
        if (index < questions.length - 1) { index++; showQuestion(); } else { finish(); }
      });
    }

    async function finish() {
      try {
        const response = await api("/api/quiz/submit", {
          method: "POST", body: JSON.stringify({ skillId, answers: chosenAnswers })
        });
        const attempt = response.attempt;
        cache[KEYS.quizzes].push(attempt);
        const pct = Math.round((attempt.score / attempt.total) * 100);
        const msg = pct >= 80 ? "Strong understanding." : pct >= 60 ? "Good progress. Keep practicing." : "Review the learning path and try again.";
        root.innerHTML =
          '<div class="card result"><h2>Quiz complete</h2><div class="big">' + attempt.score + " / " + attempt.total + '</div><div class="pct">' + pct + '%</div>' +
          '<p class="msg">' + msg + '</p><p class="muted">Your quiz score was graded and saved by the server.</p>' +
          '<div class="btn-row"><button class="btn secondary" id="retake">Retake quiz</button>' +
          '<a class="btn secondary" href="analysis.html">Back to learning path</a>' +
          '<a class="btn" href="dashboard.html">Go to dashboard</a></div></div>';
        $("#retake").addEventListener("click", startQuiz);
      } catch (err) { alert("Could not save your quiz: " + err.message); }
    }

    showStart();
  }

  /* ---------- Page: Dashboard ---------- */
  function initDashboard() {
    if (!requireAuth()) return;
    const result = getResult();
    const quizzes = getQuizzes();
    const progress = getProgress();
    const root = $("#dash-root");
    root.hidden = false;
    const career = (result && careerById(result.career)) || getCareer();

    if (!result && !quizzes.length && !assessmentHistory.length) {
      emptyState(root, "Your dashboard is empty", "Choose a career and complete the assessment to see your skills, learning progress and quiz scores in one place.", "careers.html", "Choose a career path");
      return;
    }
    root.hidden = false;

    const careerBadge = $("#dash-career");
    if (careerBadge && career) {
      careerBadge.hidden = false;
      careerBadge.innerHTML = 'Career path: <strong>' + escapeHtml(career.name) + '</strong> \u00b7 <a href="careers.html">change</a>';
    }

    const stepsDone = Object.values(progress).reduce((n, list) => n + list.length, 0);
    const latest = quizzes.length ? quizzes[quizzes.length - 1] : null;
    $("#stat-quiz").textContent = latest ? Math.round((latest.score / latest.total) * 100) + "%" : "None yet";
    $("#stat-skills").textContent = result ? SKILLS.length : 0;
    $("#stat-steps").textContent = stepsDone;

    // Skill progress
    const bars = $("#dash-bars");
    if (result) {
      renderBars(bars, result.scores, SKILLS.slice().sort((a, b) => result.scores[b.id] - result.scores[a.id]));
    } else {
      bars.innerHTML = '<p class="muted">Take the assessment to see your skill scores.</p>';
    }

    const skillFilter = $("#quiz-filter");
    skillFilter.innerHTML = '<option value="all">All skills</option>' +
      SKILLS.map(s => '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>').join("");
    const updateQuizChart = () => CareerCharts.trend($("#quiz-trend"),
      skillFilter.value === "all" ? quizzes : quizzes.filter(q => q.skillId === skillFilter.value), SKILLS);
    skillFilter.addEventListener("change", updateQuizChart);
    updateQuizChart();
    const comparableHistory = assessmentHistory.filter(a => a.assessmentVersion === 2);
    CareerCharts.growth($("#growth-chart"), comparableHistory, SKILLS);
    const first = comparableHistory[0];
    const last = comparableHistory[comparableHistory.length - 1];
    if (first && last && comparableHistory.length > 1) {
      const avg = scores => Math.round(SKILLS.reduce((sum, sk) => sum + (scores[sk.id] || 0), 0) / SKILLS.length);
      const change = avg(last.scores) - avg(first.scores);
      $("#growth-summary").textContent = `Average skill score change across ${comparableHistory.length} comparable attempts: ${change >= 0 ? "+" : ""}${change} percentage points (from ${avg(first.scores)}% to ${avg(last.scores)}%). Self-reported scores may vary.` + (comparableHistory.length !== assessmentHistory.length ? " Earlier assessments use a different scoring method and are not included." : "");
    } else {
      $("#growth-summary").textContent = "Complete the revised assessment twice to compare changes with the same scoring method. Older attempts remain saved but are not directly comparable.";
    }
    $("#print-report").addEventListener("click", () => window.print());

    // Learning progress: only paths that were recommended or started
    const learn = $("#dash-learning");
    const pathIds = result ? findGaps(result.scores, career).map(g => g.skill.id) : [];
    Object.keys(progress).forEach(id => { if (progress[id].length && !pathIds.includes(id)) pathIds.push(id); });
    if (!pathIds.length) {
      learn.innerHTML = '<p class="muted">No learning path yet. Finish the assessment to get one.</p>';
    } else {
      learn.innerHTML = pathIds.map(id => {
        const done = progress[id] || [];
        const nextIndex = PATHS[id].findIndex((_, i) => !done.includes(i));
        return '<div class="learn-group"><h3>' + skillById(id).name + '</h3><ul class="learn-list">' +
          PATHS[id].map((step, i) => {
            const state = done.includes(i) ? "done" : (i === nextIndex ? "next" : "todo");
            const mark = state === "done" ? "✓" : state === "next" ? "→" : "○";
            return '<li class="' + state + '"><span class="mk">' + mark + "</span><span>" + escapeHtml(step.title) + "</span></li>";
          }).join("") + "</ul></div>";
      }).join("");
    }

    // Quiz history (newest first)
    const table = $("#dash-history");
    if (!quizzes.length) {
      table.innerHTML = '<p class="muted">No quizzes taken yet.</p>';
    } else {
      table.innerHTML = '<table><thead><tr><th>Quiz</th><th>Date</th><th>Score</th></tr></thead><tbody>' +
        quizzes.slice().reverse().slice(0, 8).map(q =>
          "<tr><td>" + skillById(q.skillId).name + "</td><td>" + new Date(q.date).toLocaleDateString() + '</td><td class="num">' + Math.round((q.score / q.total) * 100) + "%</td></tr>").join("") +
        "</tbody></table>";
    }

    $("#reset").addEventListener("click", async () => {
      if (confirm("Delete your saved career, assessment, learning progress and quiz history from your account?")) {
        try {
          await pendingWrite;
          await api("/api/state", { method: "DELETE" });
          window.location.reload();
        } catch (err) { alert("Could not reset your progress: " + err.message); }
      }
    });
  }

  /* ---------- Page: Login ---------- */
  function initLogin() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    const dest = (next && /^[a-zA-Z0-9_-]+\.html/.test(next)) ? next : "careers.html";
    if (getSession()) { window.location.href = dest; return; }
    const signupLink = $(".auth-switch a");
    if (signupLink && next) signupLink.href = "register.html?next=" + encodeURIComponent(dest);
    const form = $("#login-form");
    const error = $("#form-error");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const email = $("#email").value;
      const password = $("#password").value;
      try { await loginUser(email, password); window.location.href = dest; }
      catch (err) { error.textContent = err.message; error.hidden = false; }
    });
  }

  /* ---------- Page: Register ---------- */
  function initRegister() {
    const destQuery = new URLSearchParams(window.location.search).get("next");
    const dest = destQuery && /^[a-zA-Z0-9_-]+\.html(?:\?.*)?$/.test(destQuery) ? destQuery : "careers.html";
    if (getSession()) { window.location.href = dest; return; }
    const signIn = $(".auth-switch a");
    if (signIn && destQuery) signIn.href = "login.html?next=" + encodeURIComponent(dest);
    const form = $("#register-form");
    const error = $("#form-error");
    function fail(msg) { error.textContent = msg; error.hidden = false; }
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const password = $("#password").value;
      const confirm = $("#confirm").value;
      if (!name || !email || !password) return fail("Please fill in every field.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Enter a valid email address.");
      if (password.length < 8) return fail("Use a password with at least 8 characters.");
      if (password !== confirm) return fail("Passwords don't match.");
      try { await registerUser(name, email, password); window.location.href = dest; }
      catch (err) { fail(err.message); }
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", async () => {
    try { await bootstrap(); }
    catch (err) {
      const main = document.querySelector("main");
      if (main) main.insertAdjacentHTML("afterbegin", '<p class="notice" role="alert">Backend unavailable. Start the Node.js server with <strong>npm start</strong> and open <strong>http://localhost:3000</strong>. Details: ' + escapeHtml(err.message) + '</p>');
      return;
    }
    initNav();
    const page = document.body.dataset.page;
    const inits = {
      home: initHome, explore: initExplore, careers: initCareers, assessment: initAssessment, analysis: initAnalysis,
      quiz: initQuiz, dashboard: initDashboard, login: initLogin, register: initRegister
    };
    if (inits[page]) inits[page]();
  });
})();
