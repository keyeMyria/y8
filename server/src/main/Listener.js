const LOGGER = require('../logger');
const CONFIG = require('../config');
const express = require('express');
const SERVER = express();
const bodyParser = require('body-parser');

SERVER.set('name', 'Api Server');
SERVER.use((req, res, next)=>{
  //req.log = LOGGER.child({ ssss: 123});
  req.log = LOGGER;
  next();
});

SERVER.use(bodyParser.urlencoded({ extended: true }));
SERVER.use(bodyParser.json());

SERVER.use('/api', require('../routes'));


SERVER.listen(CONFIG.app.port, () => {
  console.log("%s listening at %s", SERVER.get('name'), CONFIG.app.port);
  LOGGER.info("%s listening at %s", SERVER.get('name'), CONFIG.app.port);
});
