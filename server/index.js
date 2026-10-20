"use strict";
// Express + MongoDB / Mongoose. Assessment and quiz grades are computed on the server.
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const { SKILLS, CAREERS, ASSESSMENTS, QUIZZES, PATHS } = require("../public/js/data.js");
const { INTERESTS, validInterests, getMatches } = require("./matching.js");
const { scoreAssessment, gradeQuiz } = require("./scoring.js");
const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careercraft";
const publicDir = path.resolve(__dirname, "../public");
const isRecord = x => x !== null && typeof x === "object" && !Array.isArray(x);
const validCareer = id => CAREERS.some(c => c.id === id);
const validSkill = id => SKILLS.some(s => s.id === id);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  career: { type: String, default: null },
  draft: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  interests: { type: mongoose.Schema.Types.Mixed, default: null }
}, { timestamps: true, versionKey: false, collection: "users" });
const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  career: { type: String, required: true },
  scores: { type: mongoose.Schema.Types.Mixed, required: true },
  answers: { type: mongoose.Schema.Types.Mixed, default: () => ({}) },
  questionCount: { type: Number, default: null },
  assessmentVersion: { type: Number, default: 1 },
  date: { type: Date, required: true }
}, { timestamps: true, versionKey: false, collection: "assessments" });
assessmentSchema.index({ userId: 1, date: -1 });
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  steps: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true, versionKey: false, collection: "progress" });
const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  position: { type: Number, required: true },
  skillId: { type: String, required: true },
  score: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true }
}, { versionKey: false, collection: "quizzes" });
quizSchema.index({ userId: 1, position: 1 }, { unique: true });
const User = mongoose.model("User", userSchema);
const Assessment = mongoose.model("Assessment", assessmentSchema);
const Progress = mongoose.model("Progress", progressSchema);
const Quiz = mongoose.model("Quiz", quizSchema);

function cleanUser(user) { return { id: String(user._id), name: user.name, email: user.email }; }
function sendError(res, err) {
  if (err?.code === 11000) return res.status(409).json({ error: "This record already exists. Please retry." });
  if (err?.name === "ValidationError") return res.status(400).json({ error: "Invalid data was submitted." });
  console.error("CareerCraft backend error:", err);
  return res.status(500).json({ error: "An unexpected server error occurred." });
}
function requireAuth(req, res, next) {
  if (!mongoose.isValidObjectId(req.session?.userId)) return res.status(401).json({ error: "Please log in first." });
  next();
}
async function latestAssessment(userId) {
  return Assessment.findOne({ userId }).sort({ date: -1, _id: -1 }).lean();
}
function publicAssessment(a) {
  return a ? { career: a.career, scores: a.scores, date: a.date.toISOString(), questionCount: a.questionCount ?? null, assessmentVersion: a.assessmentVersion ?? 1 } : null;
}
async function readState(user) {
  const [assessment, history, learning, quizHistory] = await Promise.all([
    latestAssessment(user._id),
    Assessment.find({ userId: user._id }).sort({ date: -1, _id: -1 }).limit(50).lean(),
    Progress.findOne({ userId: user._id }).lean(),
    Quiz.find({ userId: user._id }).sort({ position: 1 }).lean()
  ]);
  return {
    career: user.career ?? null, draft: user.draft ?? {},
    result: publicAssessment(assessment),
    history: history.reverse().map(publicAssessment),
    interests: validInterests(user.interests) ? user.interests : null,
    progress: learning?.steps ?? {},
    quizzes: quizHistory.map(q => ({ skillId: q.skillId, score: q.score, total: q.total, date: q.date.toISOString() }))
  };
}

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
// Basic same-origin protection for state-changing browser requests.
app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.get("origin")) {
    try {
      const origin = new URL(req.get("origin"));
      if (origin.host !== req.get("host") || origin.protocol !== req.protocol + ":") {
        return res.status(403).json({ error: "Cross-origin requests are not allowed." });
      }
    } catch (_) { return res.status(403).json({ error: "Invalid Origin header." }); }
  }
  next();
});
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("Set SESSION_SECRET in production.");
}
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
let sessionMiddleware = null;
app.use((req, res, next) => {
  if (!sessionMiddleware) return res.status(503).json({ error: "Database is starting. Try again shortly." });
  sessionMiddleware(req, res, next);
});

app.get("/api/health", (req, res) => res.json({ ok: mongoose.connection.readyState === 1, database: mongoose.connection.name }));
app.get("/api/bootstrap", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.session?.userId)) return res.json({ user: null, state: null });
    const user = await User.findById(req.session.userId).lean();
    if (!user) return res.json({ user: null, state: null });
    res.json({ user: cleanUser(user), state: await readState(user) });
  } catch (e) { sendError(res, e); }
});

// Small local rate-limit for auth attempts (demo protection; use Redis if scaled).
const authHits = new Map();
function authLimit(req, res, next) {
  const key = `${req.ip}:${String(req.body?.email || "").toLowerCase()}`;
  const now = Date.now(), hit = authHits.get(key);
  if (!hit || now - hit.start > 15 * 60 * 1000) { authHits.set(key, { start: now, count: 1 }); return next(); }
  hit.count++;
  if (hit.count > 12) return res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
  next();
}
app.post("/api/register", authLimit, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (!name || name.length > 80 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254 ||
      typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).json({ error: "Enter your name, valid email and a password of 8–128 characters." });
  }
  try {
    const existing = await User.exists({ email });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    req.session.regenerate(err => {
      if (err) return sendError(res, err);
      req.session.userId = String(user._id);
      req.session.save(error => error ? sendError(res, error) : res.status(201).json({ user: cleanUser(user) }));
    });
  } catch (e) { sendError(res, e); }
});
app.post("/api/login", authLimit, async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = req.body?.password;
  if (!email || typeof password !== "string") return res.status(400).json({ error: "Enter your email and password." });
  try {
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: "Incorrect email or password." });
    req.session.regenerate(err => {
      if (err) return sendError(res, err);
      req.session.userId = String(user._id);
      req.session.save(error => error ? sendError(res, error) : res.json({ user: cleanUser(user) }));
    });
  } catch (e) { sendError(res, e); }
});
app.post("/api/logout", (req, res) => {
  req.session.destroy(err => err ? sendError(res, err) : (res.clearCookie("careercraft.sid"), res.json({ ok: true })));
});

app.put("/api/state/:key", requireAuth, async (req, res) => {
  const key = req.params.key, value = req.body?.value;
  if (!["career", "draft", "progress"].includes(key)) {
    return res.status(400).json({ error: "Use the scored assessment/quiz endpoints for results." });
  }
  const uid = req.session.userId;
  try {
    if (key === "career") {
      if (value !== null && !validCareer(value)) return res.status(400).json({ error: "Unknown career." });
      await User.updateOne({ _id: uid }, { $set: { career: value, draft: {} } });
    } else if (key === "draft") {
      if (!isRecord(value) || Object.keys(value).length > 24 ||
          !Object.values(value).every(v => Number.isInteger(v) && v >= 0 && v <= 3)) {
        return res.status(400).json({ error: "Invalid assessment draft." });
      }
      await User.updateOne({ _id: uid }, { $set: { draft: value } });
    } else {
      if (!isRecord(value) || Object.keys(value).some(id => !validSkill(id)) ||
          Object.entries(value).some(([id, steps]) => !Array.isArray(steps) || steps.length > PATHS[id].length ||
            steps.some(i => !Number.isInteger(i) || i < 0 || i >= PATHS[id].length))) {
        return res.status(400).json({ error: "Invalid learning progress." });
      }
      await Progress.updateOne({ userId: uid }, { $set: { steps: value } }, { upsert: true, runValidators: true });
    }
    res.json({ ok: true });
  } catch (e) { sendError(res, e); }
});
app.post("/api/assessment/submit", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const career = req.body?.career;
    if (!user || !validCareer(career) || career !== user.career) return res.status(400).json({ error: "Select this career first." });
    const scores = scoreAssessment(career, req.body.answers);
    if (!scores) return res.status(400).json({ error: "Answer every question before finishing the assessment." });
    const attempt = await Assessment.create({ userId: user._id, career, scores, answers: req.body.answers, questionCount: ASSESSMENTS[career].length, assessmentVersion: 2, date: new Date() });
    user.draft = {};
    user.markModified("draft");
    await user.save();
    res.status(201).json({ result: publicAssessment(attempt) });
  } catch (e) { sendError(res, e); }
});
app.post("/api/quiz/submit", requireAuth, async (req, res) => {
  const skillId = req.body?.skillId, answers = req.body?.answers;
  const grade = gradeQuiz(skillId, answers);
  if (!grade) return res.status(400).json({ error: "Submit one valid answer per quiz question." });
  try {
    const { score, total } = grade;
    // Serialize position assignment for this user's local demo usage. Retry collision once.
    let attempt;
    for (let i = 0; i < 2; i++) {
      const last = await Quiz.findOne({ userId: req.session.userId }).sort({ position: -1 }).lean();
      try {
        attempt = await Quiz.create({ userId: req.session.userId, position: (last?.position ?? -1) + 1,
          skillId, score, total, date: new Date() });
        break;
      } catch (error) { if (error.code !== 11000 || i === 1) throw error; }
    }
    res.status(201).json({ attempt: { skillId, score, total, date: attempt.date.toISOString() } });
  } catch (e) { sendError(res, e); }
});
app.put("/api/interests", requireAuth, async (req, res) => {
  if (!validInterests(req.body?.interests)) return res.status(400).json({ error: "Rate all seven interests from 1 to 5." });
  try {
    await User.updateOne({ _id: req.session.userId }, { $set: { interests: req.body.interests } });
    res.json({ ok: true });
  } catch (e) { sendError(res, e); }
});
app.get("/api/matches", requireAuth, async (req, res) => {
  try {
    const [user, last] = await Promise.all([User.findById(req.session.userId).lean(), latestAssessment(req.session.userId)]);
    res.json({ interests: INTERESTS, profile: validInterests(user?.interests) ? user.interests : null,
      hasAssessment: !!last, matches: getMatches(user?.interests, last?.scores, CAREERS) });
  } catch (e) { sendError(res, e); }
});
app.delete("/api/state", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    await Promise.all([
      User.updateOne({ _id: userId }, { $set: { career: null, draft: {}, interests: null } }),
      Assessment.deleteMany({ userId }), Progress.deleteMany({ userId }), Quiz.deleteMany({ userId })
    ]);
    res.json({ ok: true });
  } catch (e) { sendError(res, e); }
});

app.use(express.static(publicDir));
app.get("/", (_, res) => res.sendFile(path.join(publicDir, "index.html")));
app.use("/api", (_, res) => res.status(404).json({ error: "API endpoint not found." }));
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON." });
  sendError(res, err);
});
async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    // Share Mongoose's MongoDB client with the session store (no second connection).
    sessionMiddleware = session({
      name: "careercraft.sid", secret: sessionSecret, resave: false, saveUninitialized: false,
      store: MongoStore.create({ client: mongoose.connection.getClient(), collectionName: "sessions", ttl: 7 * 24 * 60 * 60 }),
      cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 }
    });
    // Earlier CareerCraft version had one assessment per user (unique userId index).
    // Remove only that obsolete index; then preserve every attempt as a document.
    const indexes = await Assessment.collection.indexes().catch(e => e.codeName === "NamespaceNotFound" ? [] : Promise.reject(e));
    if (indexes.some(i => i.name === "userId_1" && i.unique)) {
      await Assessment.collection.dropIndex("userId_1");
      console.log("Migrated assessments to retain history.");
    }
    await Promise.all([User.init(), Assessment.init(), Progress.init(), Quiz.init()]);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    app.listen(PORT, () => console.log(`CareerCraft running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("MongoDB startup failed:", err.message);
    console.error("Start MongoDB Community Server before npm start (Compass alone is not the server).");
    process.exitCode = 1;
    await mongoose.disconnect().catch(() => {});
  }
}
if (require.main === module) start();
module.exports = { app, start, User, Assessment, Progress, Quiz, scoreAssessment, getMatches };
