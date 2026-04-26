const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const { sendInterviewInvite } = require('../utils/emailService');

// Get all candidates with their stats
router.get('/candidates', auth, async (req, res) => {
  try {
    const { subject } = req.query;
    let filter = { role: 'candidate' }
    if (subject && subject !== 'all') {
      filter.skills = subject
    }
    const candidates = await User.find(filter)
      .select('-password')
      .sort({ avgScore: -1 })
    res.json(candidates)
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// Save candidate
router.post('/save/:candidateId', auth, async (req, res) => {
  try {
    const hr = await User.findById(req.user.id)
    if (!hr.savedCandidates) hr.savedCandidates = []
    const alreadySaved = hr.savedCandidates.includes(req.params.candidateId)
    if (alreadySaved) {
      hr.savedCandidates = hr.savedCandidates.filter(
        id => id.toString() !== req.params.candidateId
      )
    } else {
      hr.savedCandidates.push(req.params.candidateId)
    }
    await hr.save()
    res.json({ saved: !alreadySaved, total: hr.savedCandidates.length })
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// Get saved candidates
router.get('/saved', auth, async (req, res) => {
  try {
    const hr = await User.findById(req.user.id).select('savedCandidates')
    const candidates = await User.find({
      _id: { $in: hr.savedCandidates || [] }
    }).select('-password')
    res.json(candidates)
  } catch (err) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// Send interview invite email
router.post('/invite/:candidateId', auth, async (req, res) => {
  try {
    const hr = await User.findById(req.user.id).select('-password')
    const candidate = await User.findById(req.params.candidateId).select('-password')

    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' })
    if (hr.role !== 'hr') return res.status(403).json({ msg: 'Only HR can send invites' })

    await sendInterviewInvite({
      hrName: hr.name,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      subject: req.body.subject || 'General'
    })

    res.json({ msg: 'Invite sent successfully!' })
  } catch (err) {
    console.error('EMAIL ERROR:', err.message)
    res.status(500).json({ msg: 'Failed to send invite' })
  }
})

module.exports = router;