const jwt = require('jsonwebtoken');
const { db } = require('../../db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Access token is missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // Fetch user details and attach to request object
    const user = await db.query('SELECT * FROM users WHERE "userId" = $1', [
      userId,
    ]);
    if (!user.rows[0]) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'Invalid token or user not found',
      });
    }

    req.user = {
      userId: user.rows[0].userId,
      email: user.rows[0].email,
      // Add more user details as needed
    };

    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({
      status: 'Unauthorized',
      message: 'Invalid token',
    });
  }
};

module.exports = authenticate;
