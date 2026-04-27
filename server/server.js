const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const passport = require("./config/passport");
const session = require("express-session");

const app = express();   // ✅ FIRST create app

// ✅ THEN use middlewares
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// ✅ NOW add routes
app.use("/auth", require("./routes/auth"));   // 👈 MOVE HERE
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/hr', require('./routes/hr'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));