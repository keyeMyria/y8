const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TimeSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  groupId: {
    type: String,
    ref: 'group'
  },
  latest: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Number,
    required: true
  },
  stoppedAt: {
    type: Number,
    required: false
  }
});
mongoose.model('time', TimeSchema);
