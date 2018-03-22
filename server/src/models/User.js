const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  loginType: {
    type: String
  },
  profileId: {
    type: String,
    unique: true
  },
  pic:{
    type: String,
  },
  status: {
    type: Number,
    default: 9 // 0 - inactive, 9 - active
  }
});

UserSchema.virtual('id').get(function(){
    return this._id;
});
//Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

mongoose.model('users', UserSchema);
