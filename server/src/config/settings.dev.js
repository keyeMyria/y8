var config = {};

config.db = {};
config.app = {};
config.log = {};
config.paging = {};
config.swagger = {};

// app server settings
config.app.host = '0.0.0.0';
config.app.port = 3000;
config.app.api_prefix = '/api';

// Swagger settings
config.swagger.enable = false;
config.swagger.directory = process.cwd()+'/swagger-ui';
config.swagger.jsonEndPoint = '/api-docs.json'; // http://localhost/api-docs.json
config.swagger.webEndPoint = '/.*/';

// database settings
config.db.name = 'app';
config.db.host = 'localhost';
config.db.port = ''; // '' for default;
config.db.username = 'root';
config.db.password = 'root';
config.db.console_logging = false;

// config.db.name = 'app';
// config.db.host = '192.168.0.22';
// config.db.port = ''; // '' for default;
// config.db.username = 'root';
// config.db.password = 'root';
// config.db.console_logging = false;

// log settings
// Please refer here https://www.npmjs.com/package/bunyan
config.log.enable = false;
config.log.filename = 'app.log';
config.log.path = process.cwd()+'/logs';
config.log.level = 'debug';
// trace(10), debug(20), info(30), warn(40), error(50), fatal(60)
// example: 'info'  ( it will log info and above )
config.log.stdout_level = 'fatal';
config.log.period = '1h',
config.log.copies = 5,


// pagination settings for all pages by default
config.paging.page = {};
config.paging.page.limit = 5;
config.paging.page.max_limit = 10;

// pagination settings for times
config.paging.times = {};
config.paging.times.limit = 5;
config.paging.times.max_limit = 15;

// pagination settings for myactivites
config.paging.myactivites = {};
config.paging.myactivites.limit = 100;
config.paging.myactivites.max_limit = 100;

// pagination settings for activites
config.paging.activites = {};
config.paging.activites.limit = 100;
config.paging.activites.max_limit = 100;

// pagination settings for tags
config.paging.tags = {};
config.paging.tags.limit = 500;
config.paging.tags.max_limit = 500;





module.exports  = config;
