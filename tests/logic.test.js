"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { SKILLS, CAREERS, ASSESSMENTS, QUIZZES } = require("../public/js/data.js");
const { scoreAssessment, gradeQuiz } = require("../server/scoring.js");
const { validInterests, getMatches, INTERESTS } = require("../server/matching.js");

test("every career has 24 unique questions and 3 per skill", () => {
  assert.equal(CAREERS.length, 12);
  for (const career of CAREERS) {
    const q = ASSESSMENTS[career.id];
    assert.equal(q.length, 24, career.id);
    assert.equal(new Set(q.map(x => x.id)).size, 24);
    for (const skill of SKILLS) assert.equal(q.filter(x => x.skill === skill.id).length, 3);
  }
});
test("private scoring key grades response behavior rather than answer position", () => {
  const keys = require("../server/assessment-keys.json");
  for (const c of CAREERS) {
    const qs = ASSESSMENTS[c.id];
    const best = Object.fromEntries(qs.map(q => [q.id, keys[q.id].indexOf(3)]));
    const weakest = Object.fromEntries(qs.map(q => [q.id, keys[q.id].indexOf(0)]));
    assert.deepEqual(Object.values(scoreAssessment(c.id, best)), Array(8).fill(100), c.id);
    assert.deepEqual(Object.values(scoreAssessment(c.id, weakest)), Array(8).fill(0), c.id);
    const fourthOnly = Object.values(scoreAssessment(c.id, Object.fromEntries(qs.map(q => [q.id, 3]))));
    assert.ok(fourthOnly.every(p => p >= 33 && p <= 67), `${c.id}: ${fourthOnly}`);
    const positions = qs.map(q => keys[q.id].indexOf(3));
    assert.deepEqual(positions.reduce((counts, x) => (counts[x]++, counts), [0,0,0,0]), [6,6,6,6]);
    assert.ok(qs.every(q => keys[q.id].slice().sort().join(",") === "0,1,2,3"));
    assert.ok(qs.every(q => q.options.length === 4 && q.options.every(s => s.length > 25)));
  }
});
test("the browser question data does not contain scored weights", () => {
  for (const questions of Object.values(ASSESSMENTS)) {
    assert.ok(questions.every(q => !Object.hasOwn(q,"scores") && !Object.hasOwn(q,"answer") && !Object.hasOwn(q,"weights")));
  }
});
test("assessment rejects omissions, unknown careers, extra questions and forged scores", () => {
  const valid = Object.fromEntries(ASSESSMENTS.swe.map(q => [q.id, 2]));
  assert.equal(scoreAssessment("invalid", valid), null);
  assert.equal(scoreAssessment("swe", { ...valid, junk: 3 }), null);
  delete valid[ASSESSMENTS.swe[0].id];
  assert.equal(scoreAssessment("swe", valid), null);
});
test("server grades quizzes from answer indices, not client-provided scores", () => {
  for (const [id, questions] of Object.entries(QUIZZES)) {
    assert.equal(gradeQuiz(id, questions.map(q => q.answer)).score, questions.length);
    assert.equal(gradeQuiz(id, questions.map(q => (q.answer+1)%q.options.length)).score, 0);
    assert.equal(gradeQuiz(id, []), null);
  }
});
test("career matches are sorted, deterministic, and do not require an assessment", () => {
  const profile = Object.fromEntries(INTERESTS.map(x => [x.id, 1]));
  profile.coding = 5; profile.data = 5;
  assert.ok(validInterests(profile));
  const matches = getMatches(profile, null, CAREERS);
  assert.equal(matches.length, 12);
  assert.equal(matches[0].skillFit, null);
  assert.ok(matches.every((m, i) => m.match >= 0 && m.match <= 100 && (i === 0 || matches[i-1].match >= m.match)));
  assert.deepEqual(matches, getMatches(profile, null, CAREERS));
});
test("interest validation and 70/30 blend", () => {
  const profile = Object.fromEntries(INTERESTS.map(x => [x.id, 3]));
  assert.equal(validInterests(profile), true);
  profile.coding = 6;
  assert.equal(validInterests(profile), false);
  profile.coding = 5;
  const scores = Object.fromEntries(SKILLS.map(x => [x.id, 100]));
  const matches = getMatches(profile, scores, CAREERS);
  assert.equal(matches[0].skillFit, 100);
  assert.ok(matches.every(m => m.match === Math.round(.7*m.interestFit + .3*m.skillFit)));
});
