const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.createUser = () => {
  return new User({}).save();
}

exports.deleteUser = (id) => User.deleteOne({ _id: id });