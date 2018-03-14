const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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

mongoose.model('friends', FriendSchema);
