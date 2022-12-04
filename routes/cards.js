const cardRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?\d?\D{1,}#?/),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteLike);

module.exports = cardRouter;
