/* Dependency-free SVG charts for the CareerCraft analysis and dashboard. */
window.CareerCharts = (() => {
  "use strict";
  const html = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const clamp = value => Math.max(0, Math.min(100, Number(value) || 0));

  function radar(container, skills, scores) {
    const cx = 300, cy = 214, radius = 135, count = skills.length;
    const point = (i, r) => {
      const theta = (i / count) * 2 * Math.PI - Math.PI / 2;
      return [cx + Math.cos(theta) * r, cy + Math.sin(theta) * r];
    };
    const polygon = r => skills.map((_, i) => point(i, r).map(n => n.toFixed(1)).join(",")).join(" ");
    const rings = [25, 50, 75, 100].map(level =>
      `<polygon points="${polygon(radius * level / 100)}" fill="none" stroke="#dce2f0" stroke-width="1.5"/>`).join("");
    const axes = skills.map((_, i) => {
      const [x, y] = point(i, radius);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#cbd5e1"/>`;
    }).join("");
    const labels = skills.map((skill, i) => {
      const [x, y] = point(i, radius + 41);
      const anchor = x < cx - 20 ? "end" : x > cx + 20 ? "start" : "middle";
      return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}" fill="#4a5578" font-size="12" font-weight="600">${html(skill.name)}</text>`;
    }).join("");
    const userPoly = skills.map((s, i) => point(i, radius * clamp(scores[s.id]) / 100).map(n => n.toFixed(1)).join(",")).join(" ");
    const dots = skills.map((s, i) => {
      const [x, y] = point(i, radius * clamp(scores[s.id]) / 100);
      return `<circle cx="${x}" cy="${y}" r="4" fill="#3b5bdb" stroke="#fff" stroke-width="1.5"><title>${html(s.name)}: ${clamp(scores[s.id])}%</title></circle>`;
    }).join("");
    container.innerHTML = `<svg viewBox="0 0 600 425" class="viz-svg" role="img" aria-label="Radar chart of scores across eight skills; see skill profile for the exact percentages.">
      ${rings}${axes}<polygon points="${userPoly}" fill="#3b5bdb" fill-opacity="0.20" stroke="#3b5bdb" stroke-width="3" stroke-linejoin="round"/>
      ${dots}${labels}</svg>`;
  }

  function distribution(container, skills, scores) {
    const groups = [
      { label: "Strong (75–100%)", count: skills.filter(s => clamp(scores[s.id]) >= 75).length, color: "#2b8a3e" },
      { label: "Developing (50–74%)", count: skills.filter(s => clamp(scores[s.id]) >= 50 && clamp(scores[s.id]) < 75).length, color: "#3b5bdb" },
      { label: "Needs focus (0–49%)", count: skills.filter(s => clamp(scores[s.id]) < 50).length, color: "#d97706" }
    ];
    const circumference = 2 * Math.PI * 74;
    let offset = 0;
    const circles = groups.map(g => {
      const segment = (g.count / skills.length) * circumference;
      const element = `<circle cx="150" cy="142" r="74" fill="none" stroke="${g.color}" stroke-width="27" stroke-dasharray="${segment} ${circumference - segment}" stroke-dashoffset="${-offset}" transform="rotate(-90 150 142)"><title>${html(g.label)}: ${g.count} skills</title></circle>`;
      offset += segment;
      return element;
    }).join("");
    const avg = Math.round(skills.reduce((sum, s) => sum + clamp(scores[s.id]), 0) / skills.length);
    container.innerHTML = `<div class="distribution-viz"><svg viewBox="0 0 300 288" class="donut-svg" role="img" aria-label="Doughnut chart: ${groups.map(g => `${g.count} ${g.label}`).join(', ')}">
      <circle cx="150" cy="142" r="74" fill="none" stroke="#edf0f7" stroke-width="27"/>${circles}
      <text x="150" y="136" text-anchor="middle" class="donut-number">${avg}%</text>
      <text x="150" y="160" text-anchor="middle" class="donut-subtitle">average score</text>
      </svg><div class="viz-legend">${groups.map(g => `<div><span class="legend-dot" style="background:${g.color}"></span><span>${html(g.label)}</span><strong>${g.count} / ${skills.length}</strong></div>`).join("")}</div></div>`;
  }

  function trend(container, quizzes, skills) {
    if (!quizzes.length) {
      container.innerHTML = '<p class="muted">Take a quiz to see your performance history.</p>';
      return;
    }
    const recent = quizzes.slice(-10);
    const xLeft = 53, xRight = 585, yTop = 22, yBottom = 220;
    const coords = recent.map((q, i) => ({
      x: recent.length === 1 ? (xLeft + xRight) / 2 : xLeft + i * (xRight - xLeft) / (recent.length - 1),
      y: yBottom - clamp((Number(q.score) / Number(q.total)) * 100) * (yBottom - yTop) / 100,
      pct: clamp(Math.round((Number(q.score) / Number(q.total)) * 100)),
      label: (skills.find(s => s.id === q.skillId) || { name: "Quiz" }).name
    }));
    const guides = [0, 25, 50, 75, 100].map(tick => {
      const y = yBottom - tick * (yBottom - yTop) / 100;
      return `<line x1="${xLeft}" x2="${xRight}" y1="${y}" y2="${y}" stroke="#e2e8f0"/>
        <text x="${xLeft - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#64748b">${tick}%</text>`;
    }).join("");
    const points = coords.map(c => `${c.x},${c.y}`).join(" ");
    const dots = coords.map((c, i) => `<circle cx="${c.x}" cy="${c.y}" r="5" fill="#3b5bdb" stroke="#fff" stroke-width="2"><title>Quiz ${i + 1}: ${html(c.label)}, ${c.pct}%</title></circle>
      <text x="${c.x}" y="${yBottom + 22}" text-anchor="middle" font-size="12" fill="#4a5578">${i + 1}</text>`).join("");
    container.innerHTML = `<svg viewBox="0 0 620 260" class="viz-svg" role="img" aria-label="Line chart of your last ${recent.length} quiz scores in chronological order">
      ${guides}<polyline points="${points}" fill="none" stroke="#3b5bdb" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>
      <p class="field-hint">Quiz number along the bottom (oldest to newest). Hover or tap a point for the skill and score. Exact results appear in Quiz history.</p>`;
  }

  function growth(container, history, skills) {
    if (!history || history.length < 2) {
      container.innerHTML = '<p class="muted">Your next saved assessment will unlock a growth chart.</p>';
      return;
    }
    const recent = history.slice(-10), left = 55, right = 585, top = 22, bottom = 224;
    const avg = a => Math.round(skills.reduce((sum, s) => sum + (Number(a.scores[s.id]) || 0), 0) / skills.length);
    const coords = recent.map((a, i) => ({
      x: left + (i * (right - left)) / (recent.length - 1),
      pct: avg(a),
      y: bottom - avg(a) * (bottom - top) / 100,
      label: new Date(a.date).toLocaleDateString(),
      career: a.career
    }));
    const grids = [0, 25, 50, 75, 100].map(t => {
      const y = bottom - t * (bottom - top) / 100;
      return `<line x1="${left}" x2="${right}" y1="${y}" y2="${y}" stroke="#e2e8f0"/><text x="${left - 10}" y="${y+4}" text-anchor="end" fill="#64748b" font-size="12">${t}%</text>`;
    }).join('');
    container.innerHTML = `<svg viewBox="0 0 620 275" class="viz-svg" role="img" aria-label="Average self-assessment score for your last ${recent.length} attempts, oldest to newest">
      ${grids}<polyline points="${coords.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#3b5bdb" stroke-width="3" stroke-linejoin="round"/>
      ${coords.map((p,i) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#3b5bdb" stroke="white" stroke-width="2"><title>${html(p.label)}: ${p.pct}% (${html(p.career)})</title></circle><text x="${p.x}" y="${bottom+24}" font-size="12" fill="#4a5578" text-anchor="middle">${i+1}</text>`).join('')}
    </svg><p class="field-hint">Attempt number along the bottom; hover over points for date, career and average score.</p>`;
  }

  return { radar, distribution, trend, growth };
})();
