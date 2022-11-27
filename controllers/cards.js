const Card = require('../models/card');

const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const SUCCESS_OK = 200;
const NOT_FOUND = 404;

//возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};
//создаёт карточку
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user.userId;

  Card.create({name, link, owner})
    .then((card) => res.status(SUCCESS_OK).send(card))
    .catch((err) => {
      if( err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};

//удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({message: 'Переданы некорректные данные для постановки/удаления лака'})
      } else {
        card.remove()
          .then(() => {
            res.send(card)
          })
    }})
    .catch((err) => {
      if( err.name === 'CastError') {
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
    {$addToSet: {likes: req.user.userId}},
    {new: true},
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({message: 'Переданы некорректные данные для постановки/удаления лака'})
      } else {
      res.status(SUCCESS_OK).send(card)
    }})
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
    {$pull: {likes: req.user.userId}},
    {new: true},
  )
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({message: 'Переданы некорректные данные для постановки/удаления лака'})
      } else {
        card.remove()
          .then(() => {
            res.send(card)
          })
      }})
    .catch((err) => {
      if(err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неправильные, некорректные данные'})
      } else if (err.message === "NotFound") {
        res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные для постановки/удаления лака'})
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера'})
      }
    })
};
