"use strict";
const { SKILLS, CAREERS, ASSESSMENTS, QUIZZES } = require("../public/js/data.js");
// Private key: never send scores/weights with the public question bank.
// The four response positions are deliberately NOT ranked 0,1,2,3.
const answerWeights = require("./assessment-keys.json");
const isRecord = x => x !== null && typeof x === "object" && !Array.isArray(x);

function scoreAssessment(career, answers) {
  if (!CAREERS.some(c => c.id === career) || !isRecord(answers)) return null;
  const questions = ASSESSMENTS[career];
  if (Object.keys(answers).length !== questions.length ||
    !questions.every(q => Number.isInteger(answers[q.id]) && answers[q.id] >= 0 && answers[q.id] < q.options.length)) return null;
  const scores = {};
  for (const skill of SKILLS) {
    const subset = questions.filter(q => q.skill === skill.id);
    const earned = subset.reduce((sum, q) => {
      const weights = answerWeights[q.id];
      if (!Array.isArray(weights) || weights.length !== q.options.length) throw new Error(`Missing key for ${q.id}`);
      return sum + weights[answers[q.id]];
    }, 0);
    scores[skill.id] = Math.round(100 * earned / (subset.length * 3));
  }
  return scores;
}
function gradeQuiz(skillId, answers) {
  const questions = QUIZZES[skillId];
  if (!questions || !Array.isArray(answers) || answers.length !== questions.length ||
    !answers.every((n, i) => Number.isInteger(n) && n >= 0 && n < questions[i].options.length)) return null;
  return { skillId, score: questions.reduce((n,q,i) => n + (answers[i] === q.answer ? 1 : 0), 0), total: questions.length };
}
module.exports = { scoreAssessment, gradeQuiz };
