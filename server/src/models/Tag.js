const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  name: {
    type: String,
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

TagSchema.index(
  {
    userId: 1, name: 1
  }, {unique: true}
);
// Duplicate the ID field.
TagSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
TagSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});



mongoose.model('tags', TagSchema);
