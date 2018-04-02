const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CanShareSchema = new Schema({
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
    ref: 'group',
    required: true
  },
  sharedWith: {
    type: String,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }

});

CanShareSchema.index(
  {
    groupId: 1, sharedWith: 1
  }, {unique: true}
);
// Duplicate the ID field.
CanShareSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
CanShareSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});



mongoose.model('canshare', CanShareSchema);
