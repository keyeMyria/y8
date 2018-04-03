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
    ref: 'activities',
    required: true
  },
  tags: [String],
  latest: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: false
  }
});
// Duplicate the ID field.
GroupSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
GroupSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

mongoose.model('group', GroupSchema);
