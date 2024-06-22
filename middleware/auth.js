const db = require('../db');

exports.authenticateApiKeyAndToken = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const token = req.headers['x-token'];

  if (!apiKey || !token) {
    return res.status(401).json({ message: 'You are not logged in' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE api_key = ? AND token = ?', [apiKey, token]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key or token' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

