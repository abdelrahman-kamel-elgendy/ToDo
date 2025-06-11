const jwt = require('jsonwebtoken');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const { prisma } = require('../lib/prisma');

const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError('You are not logged in. Please log in to get access.'));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return next(new AuthenticationError('The user belonging to this token no longer exists.'));
    }

    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(new AuthenticationError());
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
}; 