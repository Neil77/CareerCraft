/* CareerPath - application logic
   Each page sets <body data-page="..."> and the matching init function runs.
   Data lives in localStorage under three keys so it survives a refresh. */
(function () {
  "use strict";

  /* ---------- Storage ---------- */
  const KEYS = {
    draft: "careerpath.draft",       // answers while the assessment is in progress
    result: "careerpath.result",     // { scores, date } after the assessment
    progress: "careerpath.progress", // { skillId: [completed step indexes] }
    quizzes: "careerpath.quizzes"    // [{ skillId, score, total, date }]
  };
  const Store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }
  };

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const skillById = id => SKILLS.find(s => s.id === id);
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function band(pct) {
    if (pct >= 75) return { key: "strong", label: "Strong" };
    if (pct >= 50) return { key: "developing", label: "Developing" };
    return { key: "focus", label: "Needs focus" };
  }

  function computeScores(answers) {
    const scores = {};
    SKILLS.forEach(skill => {
      const qs = ASSESSMENT.filter(q => q.skill === skill.id);
      const total = qs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
      scores[skill.id] = Math.round((total / (qs.length * 3)) * 100);
    });
    return scores;
  }

  /* Areas to develop: skills below 75%, lowest first, at most three. */
  function findGaps(scores) {
    return SKILLS
      .map(s => ({ skill: s, pct: scores[s.id] }))
      .filter(x => x.pct < 75)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3);
  }

  function lowestSkill(scores) {
    return SKILLS.map(s => ({ skill: s, pct: scores[s.id] })).sort((a, b) => a.pct - b.pct)[0];
  }

  const getResult = () => Store.get(KEYS.result, null);
  const getProgress = () => Store.get(KEYS.progress, {});
  const getQuizzes = () => Store.get(KEYS.quizzes, []);

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
  }

  /* ---------- Page: Home ---------- */
  function initHome() {
    const cta = $("#resume-note");
    if (cta && getResult()) {
      cta.hidden = false;
    }
  }

  /* ---------- Page: Assessment ---------- */
  function initAssessment() {
    const draft = Store.get(KEYS.draft, {});
    let answers = draft;
    let index = ASSESSMENT.findIndex(q => answers[q.id] === undefined);
    if (index === -1) index = 0;

    const card = $("#question-card");
    const counter = $("#counter");
    const percent = $("#percent");
    const bar = $("#bar");
    const barWrap = $("#bar-wrap");
    const prev = $("#prev");
    const next = $("#next");

    if (getResult()) {
      $("#retake-note").hidden = false;
    }

    function render() {
      const q = ASSESSMENT[index];
      const skill = skillById(q.skill);
      const total = ASSESSMENT.length;
      const done = Math.round(((index + 1) / total) * 100);
      counter.textContent = "Question " + (index + 1) + " of " + total;
      percent.textContent = done + "%";
      bar.style.width = done + "%";
      barWrap.setAttribute("aria-valuenow", String(done));

      card.innerHTML =
        '<span class="q-tag">' + skill.name + "</span>" +
        '<h2 id="q-title">' + escapeHtml(q.q) + "</h2>" +
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
    next.addEventListener("click", () => {
      if (index < ASSESSMENT.length - 1) { index++; render(); return; }
      const scores = computeScores(answers);
      Store.set(KEYS.result, { scores: scores, date: new Date().toISOString() });
      Store.remove(KEYS.draft);
      window.location.href = "analysis.html";
    });

    render();
  }

  /* ---------- Page: Analysis ---------- */
  function initAnalysis() {
    const result = getResult();
    const root = $("#analysis-root");
    if (!result) {
      emptyState(root, "No results yet", "Answer the short assessment and your skill profile will appear here.", "assessment.html", "Take the assessment");
      return;
    }
    root.hidden = false;
    const scores = result.scores;
    renderBars($("#profile-bars"), scores, SKILLS);

    const gaps = findGaps(scores);
    const gapBox = $("#gap-box");
    let pathSkills;
    if (gaps.length) {
      gapBox.innerHTML = '<ul class="gap-list">' + gaps.map(g => "<li>" + g.skill.name + " (" + g.pct + "%)</li>").join("") + "</ul>" +
        '<p class="muted">These are the skills with the most room to grow. Start with the first one.</p>';
      pathSkills = gaps.map(g => g.skill);
    } else {
      const low = lowestSkill(scores);
      gapBox.innerHTML = '<p>Every skill is at 75% or above. Your lowest is ' + low.skill.name + " (" + low.pct + '%), so that is a good one to stretch next.</p>';
      pathSkills = [low.skill];
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
    const root = $("#quiz-root");
    const params = new URLSearchParams(window.location.search);
    const result = getResult();
    let skillId = params.get("skill");
    if (!skillById(skillId)) skillId = result ? lowestSkill(result.scores).skill.id : SKILLS[0].id;
    let questions = [];
    let index = 0;
    let correct = 0;
    let locked = false;

    function showStart() {
      root.innerHTML =
        '<div class="card"><h2>Choose a skill to practice</h2>' +
        '<p class="muted">Each quiz has 5 questions. ' + (result ? "We preselected your lowest-scoring skill." : "Take the assessment to get a personal recommendation.") + "</p>" +
        '<div class="chip-grid">' + SKILLS.map(s =>
          '<button class="chip" data-id="' + s.id + '" aria-pressed="' + (s.id === skillId) + '"><span class="icon-badge" style="margin:0">' + s.icon + "</span><span>" + s.name +
          (result ? "<small>Assessment score " + result.scores[s.id] + "%</small>" : "") + "</span></button>").join("") + "</div>" +
        '<button class="btn" id="start">Start quiz</button></div>';
      $$(".chip", root).forEach(chip => chip.addEventListener("click", () => {
        skillId = chip.dataset.id;
        $$(".chip", root).forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      }));
      $("#start").addEventListener("click", startQuiz);
    }

    function startQuiz() {
      questions = QUIZZES[skillId];
      index = 0; correct = 0; locked = false;
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

    function finish() {
      const total = questions.length;
      const pct = Math.round((correct / total) * 100);
      const history = getQuizzes();
      history.push({ skillId: skillId, score: correct, total: total, date: new Date().toISOString() });
      Store.set(KEYS.quizzes, history);
      const msg = pct >= 80 ? "Strong understanding." : pct >= 60 ? "Good understanding. Keep practising." : "Review the learning path and try again.";
      root.innerHTML =
        '<div class="card result"><h2>Quiz complete</h2><div class="big">' + correct + " / " + total + '</div><div class="pct">' + pct + '%</div>' +
        '<p class="msg">' + msg + "</p>" +
        '<div class="btn-row"><button class="btn secondary" id="retake">Retake quiz</button>' +
        '<a class="btn secondary" href="analysis.html">Back to learning path</a>' +
        '<a class="btn" href="dashboard.html">Go to dashboard</a></div></div>';
      $("#retake").addEventListener("click", startQuiz);
    }

    showStart();
  }

  /* ---------- Page: Dashboard ---------- */
  function initDashboard() {
    const result = getResult();
    const quizzes = getQuizzes();
    const progress = getProgress();
    const root = $("#dash-root");

    if (!result && !quizzes.length) {
      emptyState(root, "Your dashboard is empty", "Complete the assessment to see your skills, learning progress and quiz scores in one place.", "assessment.html", "Take the assessment");
      return;
    }
    root.hidden = false;

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

    // Learning progress: only paths that were recommended or started
    const learn = $("#dash-learning");
    const pathIds = result ? findGaps(result.scores).map(g => g.skill.id) : [];
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

    $("#reset").addEventListener("click", () => {
      if (confirm("Delete your assessment results, learning progress and quiz history from this browser?")) {
        Object.values(KEYS).forEach(Store.remove);
        window.location.reload();
      }
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    const page = document.body.dataset.page;
    const inits = { home: initHome, assessment: initAssessment, analysis: initAnalysis, quiz: initQuiz, dashboard: initDashboard };
    if (inits[page]) inits[page]();
  });
})();
