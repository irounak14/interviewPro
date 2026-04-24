const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  subject: String,
});

const SessionSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  answers: [AnswerSchema],
  totalScore: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', SessionSchema);