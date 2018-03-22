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
  activityId: {
    type: String,
  },
  groupId: {
    type: String,
  },
  tags: [String],
  startedAt: {
    type: String,
    required: true
  },
  stoppedAt: {
    type: String,
    required: false
  }
});
mongoose.model('time', TimeSchema);
