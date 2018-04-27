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
GroupSchema.set('toObject', {
  virtuals: true,
});
//Ensure virtual fields are serialised.
GroupSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
GroupSchema.virtual('cansharewith', {
  ref: 'canshare', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'groupId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
});

mongoose.model('group', GroupSchema);
