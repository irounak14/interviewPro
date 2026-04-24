const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

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

// Save candidate (HR bookmarks)
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

module.exports = router;