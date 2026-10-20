"use strict";
// Transparent, exploratory ranking. Not a validated psychometric career test.
const INTERESTS = [
  { id: "coding", label: "Building software", hint: "Apps, programming and digital tools" },
  { id: "data", label: "Data and investigation", hint: "Patterns, statistics and research" },
  { id: "security", label: "Security and reliability", hint: "Protecting systems and checking risks" },
  { id: "hardware", label: "Circuits and machines", hint: "Physical devices, electronics and mechanisms" },
  { id: "design", label: "Design and invention", hint: "Creating new solutions and prototypes" },
  { id: "systems", label: "Processes and infrastructure", hint: "Improving operations and large systems" },
  { id: "impact", label: "Science and real-world impact", hint: "Solving environmental, health or community needs" }
];
const careerInterests = {
  swe: { coding: 3, data: 1, design: 2 },
  aiml: { coding: 2, data: 3, design: 1 },
  dataeng: { coding: 2, data: 3, systems: 2 },
  cybersec: { coding: 2, security: 3, systems: 2 },
  electrical: { hardware: 3, systems: 2, impact: 1 },
  electronics: { hardware: 3, design: 2, coding: 1 },
  embedded: { hardware: 3, coding: 3, design: 1 },
  mechanical: { hardware: 3, design: 2, systems: 1 },
  robotics: { hardware: 3, coding: 2, design: 2 },
  industrial: { systems: 3, data: 2, impact: 1 },
  civil: { systems: 3, design: 2, impact: 2 },
  chemical: { impact: 3, data: 2, systems: 2 }
};
function validInterests(input) {
  return input && typeof input === "object" && !Array.isArray(input) &&
    Object.keys(input).length === INTERESTS.length &&
    INTERESTS.every(({ id }) => Number.isInteger(input[id]) && input[id] >= 1 && input[id] <= 5);
}
function getMatches(profile, scores, careers) {
  if (!validInterests(profile)) return [];
  const hasAssessment = scores && typeof scores === "object" &&
    careers[0] && Object.keys(careers[0].weights).every(id => Number.isFinite(scores[id]));
  return careers.map(c => {
    const interests = careerInterests[c.id] || {};
    const points = Object.entries(interests);
    const sumWeights = points.reduce((sum, [, w]) => sum + w, 0) || 1;
    const interestFit = Math.round(points.reduce((sum, [id, w]) => sum + ((profile[id] - 1) / 4) * w * 100, 0) / sumWeights);
    const skillItems = Object.entries(c.weights);
    const skillFit = hasAssessment ? Math.round(skillItems.reduce((sum, [id, w]) => sum + scores[id] * w, 0) /
      skillItems.reduce((sum, [, w]) => sum + w, 0)) : null;
    const match = hasAssessment ? Math.round(0.7 * interestFit + 0.3 * skillFit) : interestFit;
    const reasons = points.slice().sort((a, b) => profile[b[0]] * b[1] - profile[a[0]] * a[1]).slice(0, 2).map(([id]) => INTERESTS.find(x => x.id === id).label);
    const prioritySkills = hasAssessment ? skillItems.slice().sort((a, b) => (100 - scores[b[0]]) * b[1] - (100 - scores[a[0]]) * a[1]).slice(0, 2).map(([id]) => id) : [];
    return { id: c.id, name: c.name, match, interestFit, skillFit, reasons, prioritySkills, icon: c.icon, blurb: c.blurb, tools: c.techSkills };
  }).sort((a,b) => b.match - a.match || b.interestFit - a.interestFit || a.name.localeCompare(b.name));
}
module.exports = { INTERESTS, careerInterests, validInterests, getMatches };
