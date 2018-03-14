const CONFIG = require('../config');
const bunyan = require('bunyan');
const fs = require('fs');

const LOG = CONFIG.log;

let streams = [{
  level: LOG.stdout_level,
  stream: process.stdout
}];

if(LOG.enable){
  // create log path if does not exists
  if(!fs.existsSync(LOG.path)){
    fs.mkdirSync(LOG.path, 0744);
  }
  let stream = {
    type: 'rotating-file',
    level: LOG.level,
    path: LOG.path+'/'+LOG.filename,
    period: LOG.period,
    count: LOG.copies
  }
  streams.push(stream);
}

let loggerConfig = {
  name: 'myapp',
  serializers: bunyan.stdSerializers,//{
      //req: bunyan.stdSerializers.req,
      //res: bunyan.stdSerializers.res
  //}
};

if(streams.length>0){
  loggerConfig.streams = streams;
}

module.exports = bunyan.createLogger(loggerConfig);
