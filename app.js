const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', auth, routerUsers);
app.use('/cards', auth, routerCards);
app.post('/signin', routerUsers);
app.post('/signup', routerUsers);
app.use('/', auth, (req, res, next) => {
  next(new NotFound('Введенный адрес не найден'));
});

app.listen(PORT);

app.use(errorHandler);
