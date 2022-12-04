const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const EmailError = require('../errors/EmailError');

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
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

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
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
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then(() => {
      res.status(201).send({
        name: req.body.name, about: req.body.about, avatar: req.body.avatar, email: req.body.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else if (err.code === 11000) {
        next(new EmailError('Email уже используется'));
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
      res.status(200).send(user);
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
      res.status(200).send(user);
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
      const token = jwt.sign({ userId: user.userId }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
