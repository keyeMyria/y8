const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  fromUser: {
    type: String,
    ref: 'users',
    required: true
  },
  toUser: {
    type: String,
    ref: 'users',
    required: true,
    /*validate: {
      validator: function(v) {
        console.log(v);
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: '{VALUE} is not a valid phone number!'
    }*/
  },
  status: {
    // 0 - Pending
    // 1 - Accepted
    // 2 - Rejected
    // 3 - Blocked
    type: Number,
    default: 0
  },
  actionUser: {
    type: String,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

// Duplicate the ID field.
FriendSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
FriendSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});


mongoose.model('friends', FriendSchema);
