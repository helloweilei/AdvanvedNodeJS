require('../models/User');
const { createUser, deleteUser } = require('./factories/user');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys['mongoURI'], {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let signedUser = null;

module.exports = {
  getUser: () => signedUser,
};

beforeAll(async () => {
  signedUser = await createUser();
});

afterAll(async () => {
  if (signedUser) {
    await deleteUser(signedUser._id);
  }
  await mongoose.disconnect();
});