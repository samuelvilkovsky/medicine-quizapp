const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv').config();
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

  console.log('Secret:', process.env.JWT_SECRET)

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ token, message: 'Logged in successfully' });
});

// Get user details
router.get('/me', auth, async (req, res) => {
  // req.user is available because of the auth middleware
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Change password endpoint
router.post('/change-password', auth, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // Retrieve the user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if the current password is correct
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  // console.log('Valid Password:', validPassword)
  if (!validPassword) {
    const response = { success: false, message: 'Current password does not match' };
    return res.status(400).json(response);
  }

  // Update the password
  user.password = newPassword;
  await user.save();

  const response = { success: true, message: 'Password changed successfully' };
  console.log('Sending response:', response);
  res.json(response);
});

router.delete('/delete', auth, async (req, res) => {
  try{
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }

});


module.exports = router;
