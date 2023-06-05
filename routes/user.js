const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const user = new User({
    username,
    email,
    password
  });

  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ token, message: 'Logged in successfully' });
});

// Get user details
router.get('/me', auth, async (req, res) => {
  // req.user is available because of the auth middleware
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
