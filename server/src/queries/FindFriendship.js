mongoose = require('mongoose');

module.exports = (fromUser, toUser) => {

  const Friend = mongoose.model('friends');

  let query = {
    $or: [
      {
        $and: [
          {
            'fromUser': fromUser
          }, {
            'toUser': toUser
          }
        ]
      }, {
        $and: [
          {
            'fromUser': toUser
          }, {
            'toUser': fromUser
          }
        ]
      }
    ]
  }

  return Friend.findOne(query).then((friendship) => {
    return friendship;
  });

}
