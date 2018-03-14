import _ from 'lodash';

const SearchTags = (tags, text) => {
  if (_.isNull(text) || _.isEmpty(text)) {
    return [];
  }
  // tags byId
  const results = _.filter(tags,
    o => o.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
  return _.map(results, o => o.id);
};

const isTagExist = (tags, text) => {
  if (_.isNull(text) || _.isEmpty(text)) {
    return false;
  }
  const results = _.filter(tags,
    o => o.name.toLowerCase() === text.toLowerCase());
  return results.length > 0;
};

export {
  SearchTags,
  isTagExist
};
