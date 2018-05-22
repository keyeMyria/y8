import _ from 'lodash';
import moment from 'moment';
import {
  TIME_FETCH_BY_GROUP_REQUEST,
  TIME_FETCH_BY_GROUP_SUCCESS,
  TIME_FETCH_BY_GROUP_ERROR,
  TIME_FETCH_BY_GROUP_RESET,

} from '../types/TimeTypes.js';

const getTimesByGroup = (state, action) => {
  const { count, offset, limit, page, totalPages } = action.payload;
  let { rows } = action.payload;
  //("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"


  if (page > 1) {
    rows = [...state.rows, ...rows];
  }
  const sectionData = {};
  rows.forEach((row) => {
    //console.log(row);
    const monthYear = moment(row.startedAt).format('MMMM_YYYY');
    const dayDateHmmssa1 = moment(row.startedAt).format('dddd Do, h:mm:ss a');

    let dayDateHmmssa2 = '';
    if (!_.isNil(row.stoppedAt) && row.stoppedAt !== '') {
      dayDateHmmssa2 = moment(row.stoppedAt).format('dddd Do, h:mm:ss a');
    }

    if (_.isNil(sectionData[monthYear])) {
      sectionData[monthYear] = [];
    }
    sectionData[monthYear].push({
      startedAt: dayDateHmmssa1,
      stoppedAt: dayDateHmmssa2,
      startedTimestamp: row.startedAt,
      stoppedTimestamp: row.stoppedAt,
    });
  });

  const sections = [];
  _.forEach(sectionData, (section, key) => {
    const eachSection = { title: key.replace('_', ' '), data: section };
    sections.push(eachSection);
  });

  return Object.assign({}, state, {
    error: null,
    refreshing: false,
    sections,
    rows,
    count,
    offset,
    limit,
    page,
    totalPages
  });
};

const INITIAL_TIMES_STATE = {
  error: null,
  refreshing: false,
  sections: [],
  rows: [],
  count: 0,
  offset: 0,
  limit: 0,
  page: 1,
  totalPages: 0,
};
export const timesByGroup = (state = INITIAL_TIMES_STATE, action) => {
  switch (action.type) {
    case TIME_FETCH_BY_GROUP_REQUEST:
      return Object.assign({}, state, {
        error: null,
        refreshing: action.page === 1,
      });
    case TIME_FETCH_BY_GROUP_SUCCESS:
      return getTimesByGroup(state, action);
    case TIME_FETCH_BY_GROUP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        refreshing: false
      });
    case TIME_FETCH_BY_GROUP_RESET:
      return Object.assign({}, state, {
        error: null,
        refreshing: false
      });
    default:
      return state;
  }
};
