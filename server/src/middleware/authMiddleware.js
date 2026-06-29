const { verifyAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorized, no token', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token invalid or expired', 401);
  }
};

module.exports = { protect };
