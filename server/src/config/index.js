// creating singleton global object for server settings

const SERVER_CONFIG = Symbol.for("SERVER.CONFIG");

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasServerConfig = (globalSymbols.indexOf(SERVER_CONFIG) > -1);

if(!hasServerConfig){
  var env = process.env.NODE_ENV || 'dev';
  global[SERVER_CONFIG] = require('./settings.'+env+'.js');
  console.log('settings.'+env+'.js file loaded!');
}

var singleton = global[SERVER_CONFIG];
Object.freeze(singleton);


module.exports = singleton;
