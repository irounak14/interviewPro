const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name, email,
      password: hashedPassword,
      role, location
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE PROFILE
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, location, openToWork } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (location !== undefined) user.location = location;
    if (openToWork !== undefined) user.openToWork = openToWork;
    await user.save();
    res.json({ name: user.name, location: user.location, openToWork: user.openToWork });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GOOGLE OAuth - initiate
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

// GOOGLE OAuth - callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/candidate/login`,
    session: true
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.CLIENT_URL}/candidate/login`)
      }

      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const user = JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      })

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(user)}`)
    } catch (err) {
      console.error('Google callback error:', err)
      res.redirect(`${process.env.CLIENT_URL}/candidate/login`)
    }
  }
)

module.exports = router;