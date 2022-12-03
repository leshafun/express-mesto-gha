const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFound = require('./errors/NotFound');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.post('/signin', routerUsers);
app.post('/signup', routerUsers);
app.use('/', (req, res) => {
  res.status(NotFound).send({ message: 'Введенный адрес не найден' });
});

app.listen(PORT);

app.use(errorHandler);
