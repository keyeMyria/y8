import _ from 'lodash';
import moment from 'moment';
import {
  TIME_FETCH_BY_GROUP_REQUEST,
  TIME_FETCH_BY_GROUP_SUCCESS,
  TIME_FETCH_BY_GROUP_ERROR,
  TIME_FETCH_BY_GROUP_RESET,

  TIME_CREATE_REQUEST,
  TIME_CREATE_SUCCESS,
  TIME_CREATE_ERROR,
  TIME_CREATE_RESET,

  TIME_UPDATE_REQUEST,
  TIME_UPDATE_SUCCESS,
  TIME_UPDATE_ERROR,
  TIME_UPDATE_RESET,

  TIME_DELETE_REQUEST,
  TIME_DELETE_SUCCESS,
  TIME_DELETE_ERROR,
  TIME_DELETE_RESET,

} from '../types/TimeTypes.js';

//  extraObj can have updated or deleted time object info
const getSections = (rows) => {
  const sectionData = {};
  rows.forEach((row) => {
    const monthYear = moment(row.startedAt).format('MMMM_YYYY');
    const dayDateHmmssa1 = moment(row.startedAt).format('ddd Do, h:mm:ss a');

    let dayDateHmmssa2 = '';
    if (!_.isNil(row.stoppedAt) && row.stoppedAt !== '') {
      dayDateHmmssa2 = moment(row.stoppedAt).format('ddd Do, h:mm:ss a');
    }

    if (_.isNil(sectionData[monthYear])) {
      sectionData[monthYear] = [];
    }

    sectionData[monthYear].push({
      id: row.id,
      startedAt: dayDateHmmssa1,
      stoppedAt: dayDateHmmssa2,
      startedTimestamp: row.startedAt,
      stoppedTimestamp: row.stoppedAt,
    });
  });

  const sections = [];
  _.forEach(sectionData, (section, key) => {
    const title = `${key.replace('_', ' ')}   #${section.length} times in this month`;
    const eachSection = {
      title,
      data: section
    };
    sections.push(eachSection);
  });
  return sections;
};

const updateTime = (state, action) => {
  const newState = Object.assign({}, state);
  const rows = [...state.rows];
  _.forEach(rows, (row, index) => {
    if (!_.isNil(row)) {
      if (row.id === action.payload.id) {
        rows.splice(index, 1, {
          startedAt: action.payload.startedAt,
          stoppedAt: action.payload.stoppedAt,
          id: row.id
        });
      }
    }
  });
  newState.rows = rows;
  newState.sections = getSections(rows);
  newState.updateLoading = false;
  return Object.assign({}, newState);
};

const deleteTime = (state, action) => {
  const newState = Object.assign({}, state);
  const rows = [...state.rows];
  _.forEach(rows, (row, index) => {
    if (!_.isNil(row)) {
      if (row.id === action.payload.id) {
        rows.splice(index, 1);
      }
    }
  });
  newState.rows = rows;
  newState.sections = getSections(rows);
  newState.deleteLoading = false;
  return Object.assign({}, newState);
};

const getTimesByGroup = (state, action) => {
  const { count, offset, limit, page, totalPages } = action.payload;
  let { rows } = action.payload;
  //("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"

  if (page > 1) {
    rows = [...state.rows, ...rows];
  }

  return Object.assign({}, state, {
    error: null,
    refreshing: false,
    sections: getSections(rows),
    rows,
    count,
    offset,
    limit,
    page,
    totalPages,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
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
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
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
    case TIME_CREATE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        createLoading: true,
      });
    case TIME_CREATE_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        createLoading: false,
      });
    case TIME_CREATE_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        createLoading: false,
      });
    case TIME_CREATE_RESET:
      return Object.assign({}, state, {
        error: null,
        createLoading: false,
      });

    case TIME_UPDATE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        updateLoading: true,
      });
    case TIME_UPDATE_SUCCESS:
      return updateTime(state, action);
    case TIME_UPDATE_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        updateLoading: false,
      });
    case TIME_UPDATE_RESET:
      return Object.assign({}, state, {
        error: null,
        updateLoading: false,
      });

    case TIME_DELETE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        deleteLoading: true,
      });
    case TIME_DELETE_SUCCESS:
      return deleteTime(state, action);
    case TIME_DELETE_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        deleteLoading: false,
      });
    case TIME_DELETE_RESET:
      return Object.assign({}, state, {
        error: null,
        deleteLoading: false,
      });
    default:
      return state;
  }
};
