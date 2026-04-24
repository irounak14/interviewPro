const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'hr'], required: true },

  // Candidate-specific
  location: { type: String, default: '' },
  skills: [String],
  totalSessions: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  openToWork: { type: Boolean, default: true },
  savedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);