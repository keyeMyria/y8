const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionsSchema = new Schema({
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
  status: {
    // 0 - not Subscribed
    // 1 - Subscribed
    type: Number,
    default: 0
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
SubscriptionsSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
SubscriptionsSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});



mongoose.model('subscriptions', SubscriptionsSchema);
