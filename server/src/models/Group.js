const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupSchema = new Schema({
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
  tags: [String],
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: false
  }
});
mongoose.model('group', GroupSchema);
