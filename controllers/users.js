const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const SuccessOk = require('../errors/SuccessOk');
const Created = require('../errors/Created');
const EmailError = require('../errors/EmailError');

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(SuccessOk).send(user))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.status(SuccessOk).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Получение информации о пользователе

module.exports.getuserInfo = (req, res, next) => {
  User.findById(req.user.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(SuccessOk).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        throw new EmailError('email не уникальный');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }));
    })

    .then((user) => res.status(Created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else if (err.code === 11000) {
        next(new EmailError('Email не уникальный'));
      } else {
        next(err);
      }
    });
};

// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SuccessOk).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SuccessOk).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Авторизоваться
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sing({ userId: user.userId }, 'some-secret-key', { expiresIn: '7d' });
      return res.send(token);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};
