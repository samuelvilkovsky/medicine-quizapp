const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

router.get('', auth, async (req, res) => {
  console.log('Token verification route hit');
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1]; // Extract only the token part
    console.log('Received token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', decoded);

    const user = req.user;

    res.json({ user });
  } catch (err) {
    console.error(err);
    console.log('Token verification failed:', err);
    res.status(401).json({ error: 'Token verification failed' });
  }
});

module.exports = router;