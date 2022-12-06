const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailError = require('../errors/EmailError');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const { SUCCESS_OK } = require('../utils/constants');
const { CREATED } = require('../utils/constants');

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch(next);
};

// возвращает пользователя по _id
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Неправильные, некорректные данные'));
          } else if (err.code === 11000) {
            next(new EmailError('Email уже используется'));
          } else {
            next(err);
          }
        });
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate({ _id: userId }, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
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
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate({ _id: userId }, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
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
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

// Получение информации о пользователе
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new Error('Пользователь не найден'));
      }
      return res.status(SUCCESS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
