const CONFIG = require('../config');
const LOGGER = require('../logger');
const mongoose = require('mongoose');
const activities = require('../data/activities');

mongoose.Promise = global.Promise;

// connect to mongodb
const PORT = CONFIG.db.port!=''?':'+CONFIG.db.port:'';
const CONN_URL = 'mongodb://'+CONFIG.db.host+PORT+'/'+CONFIG.db.name;

mongoose.connect(CONN_URL);
mongoose.connection
  .once('open', () => {
    console.log('Mongodb connected successfully');
    LOGGER.info('Mongodb connected successfully');

    // console logging
    mongoose.set('debug', CONFIG.db.console_logging);

    // Load all files in models dir
    const fs = require('fs');
    fs.readdirSync(process.cwd()+'/src/models')
      .forEach( (filename) => {
        if(~filename.indexOf('.js')){
          require(process.cwd()+'/src/models/'+filename);
        }
      });

    // start the listeer
    require('./Listener');

    /********************* TEMP CODE *************************/


    const Activity = mongoose.model('activities');

    Activity.find({userId: null}).count().then( count => {
      if(count==0){
        Activity.insertMany(activities).then(()=>{
          console.log('Temp Users Created');
        });
      }
    });

    //mongoose.connection.collections.friends.drop(()=>{});
    /*mongoose.connection.collections.users.drop(()=>{
      // Ready to run the next test!
      //done();
    });*/
    // const User = mongoose.model('users');
    //
    // User.count().then( count => {
    //   if(count==0){
    //     User.insertMany([
    //       {email:'naveen1@gmail.com', firstName:'naveen1'},
    //       {email:'naveen2@gmail.com', firstName:'naveen2'},
    //       {email:'naveen3@gmail.com', firstName:'naveen3'},
    //       {email:'naveen4@gmail.com', firstName:'naveen4'},
    //       {email:'naveen5@gmail.com', firstName:'naveen5'}
    //     ]).then(()=>{
    //       console.log('Temp Users Created');
    //     });
    //   }
    // });
    /********************* TEMP CODE *************************/

  }).on('error', (error) => {
    console.log(error);
    LOGGER.error("Mongodb connnection failed: %s", error);
  });
