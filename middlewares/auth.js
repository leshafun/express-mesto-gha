const jwt = require('jsonwebtoken');
const UnauthorizatedError = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizatedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    next(new UnauthorizatedError('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};