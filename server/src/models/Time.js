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
// Duplicate the ID field.
TimeSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
TimeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {   delete ret._id  }
});
mongoose.model('time', TimeSchema);
