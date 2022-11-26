const mongoose = require('mongoose');
const User = require('../models/user.js');
const {Schema} = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
    require: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: User,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);