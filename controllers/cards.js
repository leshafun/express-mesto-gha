const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const SuccessOk = require('../errors/SuccessOk');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(SuccessOk).send(card))
    .catch(next);
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.userId;

  Card.create({ name, link, owner })
    .then((card) => res.status(SuccessOk).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findDyId(req.params.cardId)
    .orFail(() => next(new NotFound('Картинка не найдена')))
    .then((card) => {
      if (!card.owner.equals(req.user.userId)) {
        next(new Forbidden('Нельзя удалить карточку другого пользователя'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.status(SuccessOk).send(card);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } },
    { new: true },
  )
    .orFail(() => next(new NotFound('Картинка не найдена')))
    .then((card) => {
      res.status(SuccessOk).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.userId } },
    { new: true },
  )
    .orFail(() => next(new NotFound('Картинка не найдена')))
    .then((card) => {
      res.status(SuccessOk).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неправильные, некорректные данные'));
      } else {
        next(err);
      }
    });
};
