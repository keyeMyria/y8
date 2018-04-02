const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  subUserId: {
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
// Duplicate the ID field.
SubscriberSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
SubscriberSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});



mongoose.model('subscriber', SubscriberSchema);
