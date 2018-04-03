import _ from 'lodash';
import {
  ONLYGROUPS_FETCH_REQUEST,
  ONLYGROUPS_FETCH_SUCCESS,
  ONLYGROUPS_FETCH_ERROR,
  ONLYGROUPS_FETCH_RESET,

  GROUP_REMOVE_GROUP_SUCCESS,
  GROUP_REMOVE_TAG_SUCCESS

} from '../types/GroupTypes';

const removeOnlyGroupItem = (state, action) => {
  const newState = Object.assign({}, state);
  const rows = [...state.data];
  _.pullAllBy(rows, [{ id: action.payload.groupId }], 'id');
  newState.data = rows;
  return Object.assign({}, newState);
};

const removeTagFromOnlyGroupItem = (state, action) => {
  const { groupId, tagId } = action.payload;
  const newState = Object.assign({}, state);
  const rows = [...state.data];

  //rows = _.filter(rows);
  console.log(rows);

  _.forEach(rows, (row, index) => {
    if (!_.isNil(row)) {
      if (row.id === groupId) {
        _.pull(row.tags, tagId);
        if (row.tags.length === 0) {
          rows.splice(index, 1);
        }
      }
    }
  });

  console.log(rows);

  newState.data = rows;
  return Object.assign({}, newState);
};

const INITIAL_ONLYGROUPS_STATE = {
  error: null,
  loading: false,
  data: []
};
export const onlygroups = (state = INITIAL_ONLYGROUPS_STATE, action) => {
  switch (action.type) {
    case GROUP_REMOVE_TAG_SUCCESS:
      return removeTagFromOnlyGroupItem(state, action);
    case GROUP_REMOVE_GROUP_SUCCESS:
      return removeOnlyGroupItem(state, action);
    case ONLYGROUPS_FETCH_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
      });
    case ONLYGROUPS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        data: action.payload
      });
    case ONLYGROUPS_FETCH_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.payload,
      });
    case ONLYGROUPS_FETCH_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null,
      });
    default:
      return state;
  }
};