const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const myTagsSchema = new Schema({}, {_id : false, strict: false });
const myTagsSchema = new Schema({
  groupId: {
    type: String
  },
  tags: [String]
}, {_id : false});
const MyActivitySchema = new Schema({
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
  groups: [myTagsSchema],
  //groups: myTagsSchema,
  //tags: [String],
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String,
    required: true
  }

});

// Duplicate the ID field.
MyActivitySchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
MyActivitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {   delete ret._id  }
});

mongoose.model('myactivities', MyActivitySchema);
