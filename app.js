const express = require('express');
const mongoose = require('mongoose');

const { errors, celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFound = require('./errors/NotFound');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.listen(3000);
app.use(express.json());

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?\d?\D{1,}#?/),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use((req, res, next) => {
  const error = new NotFound('Страница не найдена');
  next(error);
});

app.use(errors());
app.use(errorHandler);
