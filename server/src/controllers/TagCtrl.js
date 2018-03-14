'use strict'
const _ = require('lodash');
const mongoose = require('mongoose');

class TagCtrl {

  create(req, res, next) {
    try {
      const {
        id, name, createdAt, updatedAt
      } = req.body;

      //TODO: do validation here
      const { userId } = req;
      const data = {
        _id: id, userId, name, createdAt, updatedAt
      };

      const Tag = mongoose.model('tags');

      Tag.create(data).then((result)=>{
        console.log('Tag Created!');
        res.status(200).send(result);
        next();

      }).catch((tagError)=>{
        console.log('tagError: ' + tagError);
        req.log.error(tagError.message);
        res.status(400).send('Bad request');
        next();

      });

    } catch (error) {
      console.log('TagCtrl: ' + error);
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }

  }

  get(req, res, next) {
    const { userId } = req;
    const Tag = mongoose.model('tags');
    Tag.find({userId},{
      id: 1,
      name: 1,
      updatedAt: 1
    })
      //.populate({path: 'fromUser', select: ['email','firstName']})
      //.populate({path: 'toUser', select: 'email'})
      .sort({updatedAt: -1})
      //.skip(offset)
      //.limit(limit);
      .then((tags)=>{
        console.log(tags._id);
        console.log(tags);
        res.status(200).send(tags);
        next();
      })
      .catch((error)=>{
        req.log.error(error.message);
        res.status(400).send('Bad request');
        next();
      })
  }

  update(req, res, next) {
    try {
      const { userId } = req;
      const { id, name, updatedAt } = req.body;
      const tag = { id, name, updatedAt };
      const Tag = mongoose.model('tags');

      Tag.update(
        { _id: id, userId },
        { $set: { name, updatedAt }},
        (done)=>{
          console.log(done);
          if(!done) {
            //throw new Error('Failed to update');
          }
          res.status(200).send(tag);
          next();
        });
      // Tag.findByIdAndUpdate(id,
      //   { $set: { name, updatedAt } }, { new: true },
      //   (err, tag) => {
      //     if (err) {
      //       throw new Error(err);
      //     }
      //     console.log(req.body);
      //     res.status(200).send(tag);
      //     next();
      // });

    } catch(error) {
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    }

  }

  delete(req, res, next) {
    const { userId } = req;
    const tagId = req.params.id;

    const Tag = mongoose.model('tags');
    Tag.deleteOne({ _id: tagId, userId })
    .then((done) => {
      if(!done){
        return Promise.reject({message:"Failed to unblock request"});
      }

      const MyActivity = mongoose.model('myactivities');

      const criteria =  {};
      criteria.userId = {$eq: userId};

      return MyActivity.find(criteria, {
        groups: 1,
      });

    }).then((result) => {
      console.log('deleteOne');
      _.forEach(result, (myactivity, myactivityIndex) => {
        console.log(myactivity.groups);
        _.forEach(myactivity.groups, (group, groupIndex) => {
            console.log(group, groupIndex);
            if (!_.isUndefined(group)) {
              const index = group.tags.indexOf(tagId);
              if (index !== -1) {
                group.tags.splice(index, 1);
              }
              // if tags are empty, then delete group also.
              if (group.tags.length === 0) {
                //myactivity.groups.splice(groupIndex, 1);
                delete myactivity.groups[groupIndex];
              }
            }

        });
        myactivity.groups = _.filter(myactivity.groups);
        // if groups are empty then delete activity
        if (myactivity.groups.length === 0) {
          myactivity.remove();
          //result.splice(myactivityIndex, 1);
        }else{
          myactivity.save();
        }
      });
      return true;
    }).then((updated) => {
      if (!updated) {
        console.log("Failed to delete tag from myactivities");
        res.status(400).send("Failed to delete tag from myactivities");
      } else {
        console.log("Tag deleted successfully from myactivities");
        res.status(200).send({tagId});
      }
      next();
    }).catch((error)=>{
      req.log.error(error.message);
      res.status(400).send('Bad request');
      next();
    });
  }

  getList(req, res, next){

    // const User = mongoose.model('users');
    //
    // User.create({
    //   _id: '3002a825-0667-4be4-a2fa-bfe36022a861',
    //   email:'naveen1@gmail.com',
    //   firstName:'naveen14'}).then(()=>{
    //     console.log('Temp Users Created');
    //   }).catch((error)=>{
    //     console.log('Hello'+error);
    //   });
    console.log(1234);
    console.log(req.userId);
    res.status(200).send("Im am getList() from TagCtrl");
    req.log.debug("hello data");
    //return next(new errs.InvalidArgumentError("I just don't like you"));
    return next();
  }
}

module.exports = TagCtrl;
