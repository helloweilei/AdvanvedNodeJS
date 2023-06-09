require('../models/User');
const { createUser, deleteUser } = require('./factories/user');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys['mongoURI'], {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

let signedUsed = null;

exports = {
  getUser: () => signedUsed,
};

beforeAll(async () => {
  signedUsed = await createUser();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (signedUsed) {
    await deleteUser(user._id);
  }
});