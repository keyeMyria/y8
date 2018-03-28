const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegisteredDevicesSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  userId: {
    type: String,
    ref: 'users',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  os: {
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
// Duplicate the ID field.
RegisteredDevicesSchema.virtual('id').get(function(){
    return this._id;
});

//Ensure virtual fields are serialised.
RegisteredDevicesSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});



mongoose.model('devices', RegisteredDevicesSchema);
