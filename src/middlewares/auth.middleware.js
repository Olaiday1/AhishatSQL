const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  const spTOken = token.split(' ')[1];
  try {
    const decoded = jwt.verify(spTOken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Error is: ', error);
    res.status(500).json({ error: 'Invalid token' });
  }
};
