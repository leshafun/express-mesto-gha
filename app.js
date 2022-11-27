const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use((req, res, next) => {
  req.user = {
    userId: '638233903e0a7aebf024dbbb'
  };

  next();
});


app.use('/users', routerUsers);
app.use('/cards', routerCards);


app.listen(PORT, () => {
  console.log('SERVER START')
});