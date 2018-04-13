import {
  FEED_FETCH_DATA,
  FEED_UPDATE,
  FEED_UPDATE_BADGE_COUNT
} from '../types/FeedTypes';

const INITIAL_FEED_STATE = {
  badgeCount: 0,
  data: []
};
export const feed = (state = INITIAL_FEED_STATE, action) => {
  switch (action.type) {
    case FEED_FETCH_DATA:
      return Object.assign({}, state, {
        badgeCount: action.payload.badgeCount,
        data: [...action.payload.notifications, ...state.data]
      });
    case FEED_UPDATE:
      return Object.assign({}, state, {
        badgeCount: action.payload.badgeCount,
        data: [action.payload.notification, ...state.data]
      });
    case FEED_UPDATE_BADGE_COUNT:
      return Object.assign({}, state, {
        badgeCount: action.payload.badgeCount,
      });
    default:
      return state;
  }
};
