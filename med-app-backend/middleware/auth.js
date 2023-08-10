const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // console.log('AUTH MIDDLEWARE aaaa');
  const authHeader = req.header('Authorization');
  // console.log('Auth Header:', authHeader)
  if (!authHeader) {
    console.log('AUTH MIDDLEWARE No token, authorization denied')
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract only the token part
  // console.log('AUTH MIDDLEWARE Token:', token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;
