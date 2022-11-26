const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Закоментить перед стартом
 app.use((req, res, next) => {
  req.user = {
    _id: '638233903e0a7aebf024dbbb' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.get('/', function (req, res){
  res.send('hello world')
})

app.listen(PORT, () => {
  console.log('SERVER START')
});