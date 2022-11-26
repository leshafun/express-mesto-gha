const User = require('../models/user');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SUCCESS_OK = 200;
const CREATED = 201;


// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

//возвращает пользователя по _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND)
      } else {
        res.status(SUCCESS_OK).send(user)
      }
  })
    .catch((err) => {
      if( err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
        } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
  })
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if( err.name === 'ValidationError' ) {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};

//обновляет профиль
module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND)
      } else {
        res.status(SUCCESS_OK).send(user)
      }
    })
    .catch((err) => {
      if( err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};

//обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND)
      } else {
        res.status(SUCCESS_OK).send(user)
      }
    })
    .catch((err) => {
      if( err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};



