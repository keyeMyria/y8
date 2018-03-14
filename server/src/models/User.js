const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  loginType: {
    type: String
  },
  profileId: {
    type: String,
    unique: true
  }
});

mongoose.model('users', UserSchema);
