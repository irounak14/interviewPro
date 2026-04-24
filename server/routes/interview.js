const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/authMiddleware');

// Get random questions by subject
router.get('/questions/:subject', auth, async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $match: { subject: req.params.subject } },
      { $sample: { size: 7 } }
    ]);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

const Session = require('../models/Session');
const User = require('../models/User');

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Evaluate a single answer
router.post('/evaluate', auth, async (req, res) => {
  try {
    const { question, answer, subject, keywords } = req.body;

    if (!answer || answer.trim().length < 5) {
      return res.json({ score: 0, feedback: 'No answer was provided.' });
    }

    const prompt = `You are a strict but fair technical interviewer.

Question: "${question}"
Candidate's Answer: "${answer}"
Expected Keywords: ${keywords.join(', ')}

Evaluate this answer and respond ONLY with a valid JSON object like this:
{
  "score": <number between 0 and 100>,
  "feedback": "<2-3 sentences of specific feedback>"
}

Be strict. If the answer is vague or missing key concepts, score it low.`;

const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 300,
  temperature: 0.3,
});

const raw = completion.choices[0].message.content;
const cleaned = raw.replace(/```json|```/g, '').trim();
const parsed = JSON.parse(cleaned);

res.json(parsed);
  } catch (err) {
    console.error('EVALUATE ERROR:', err.message);
    res.status(500).json({ msg: 'Evaluation failed' });
  }
});

// Save full session
router.post('/session', auth, async (req, res) => {
  try {
    const { subject, answers } = req.body;
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const avgScore = Math.round(totalScore / answers.length);

    const session = new Session({
      candidate: req.user.id,
      subject,
      answers,
      totalScore,
      avgScore,
    });

    await session.save();

    // Get single session by ID
router.get('/session/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).json({ msg: 'Session not found' })
    res.json(session)
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// Get all sessions for logged in candidate
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ candidate: req.user.id })
      .sort({ completedAt: -1 })
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

    // Update user stats
    const user = await User.findById(req.user.id);
    const allSessions = await Session.find({ candidate: req.user.id });
    const overallAvg = Math.round(
      allSessions.reduce((sum, s) => sum + s.avgScore, 0) / allSessions.length
    );

    user.totalSessions = allSessions.length;
    user.avgScore = overallAvg;
    if (!user.skills.includes(subject)) user.skills.push(subject);
    await user.save();

    res.json({ sessionId: session._id, avgScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to save session' });
  }
});
module.exports = router;