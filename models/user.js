const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    select: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Введите верный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
