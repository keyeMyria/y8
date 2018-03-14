import _ from 'lodash';
import { AsyncStorage } from 'react-native';

const INITIAL_ACTIVITIES_KEY = 'INITIAL_ACTIVITIES_KEY';

const HasActivitiesStored = async () => {
  try {
    const stored = await AsyncStorage.getItem(INITIAL_ACTIVITIES_KEY);
    if (stored === 'true') {
      return true;
    }
  } catch (error) {
    // Error retrieving data
    console.error('TODO: ', error);
  }
  return false;
};

const SetActivitiesStored = async () => {
  try {
    await AsyncStorage.setItem(INITIAL_ACTIVITIES_KEY, 'true');
    return true;
  } catch (error) {
    // Error retrieving data
    console.error('TODO: ', error);
  }
  return false;
};

const SearchActivities = (activities, text) => {
  if (_.isNull(text) || _.isEmpty(text)) {
    return [];
  }
  // activities byId
  const results = _.filter(activities,
    o => o.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
  return _.map(results, o => o.id);
};


const isActivityExist = (activities, text) => {
  if (_.isNull(text) || _.isEmpty(text)) {
    return false;
  }
  const results = _.filter(activities,
    o => o.name.toLowerCase() === text.toLowerCase());
  return results.length > 0;
};

export {
  HasActivitiesStored,
  SetActivitiesStored,
  SearchActivities,
  isActivityExist
};
