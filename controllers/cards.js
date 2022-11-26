const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const SUCCESS_OK = 200;
const CREATED = 201;


//возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

//удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if( err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};

//создаёт карточку
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if( err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};

//поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},
  )
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if( err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};


//убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  )
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if( err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};