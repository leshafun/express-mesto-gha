const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');
const { authorization } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?\d?\D{1,}#?/),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(authorization);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

app.listen(PORT);

app.use(errors());
app.use(errorHandler);
