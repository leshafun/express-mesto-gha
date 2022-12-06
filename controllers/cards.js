const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const { SUCCESS_OK } = require('../utils/constants');
const { CREATED } = require('../utils/constants');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch(next);
};

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .then((data) => {
      if (!data) {
        throw new NotFound('Карточка не найдена');
      }
      if (!data.owner.equals(userId)) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          res.status(SUCCESS_OK).send({ card });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

// убрать лайк с карточки
const deleteLike = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((data) => {
      res.status(SUCCESS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
};
