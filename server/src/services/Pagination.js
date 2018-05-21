var CONFIG = require('../config');
var _ = require('lodash');
pagination = (req, type) => {

  if(_.isNil(type) || type == ''){
    type = 'page';
  }
  let PER_PAGE_LIMIT = CONFIG.paging[type].limit;
  let MAX_LIMIT = CONFIG.paging[type].max_limit;

  var { page, limit } = req.query;
  // pagination logic
  page = !page ? 1 : parseInt(page);
  limit = !limit ? PER_PAGE_LIMIT : parseInt(limit);
  limit = limit <= 0 ? PER_PAGE_LIMIT : limit;
  limit = limit > MAX_LIMIT ? MAX_LIMIT : limit;
  const offset = (page - 1) * limit;
  return { page, offset, limit };
}

module.exports = pagination;
