import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import { PushNotificationIOS } from 'react-native';
import {
  FEED_FETCH_DATA,
  FEED_UPDATE,
  FEED_UPDATE_BADGE_COUNT
} from '../types/FeedTypes';

export const updateFeed = (notification) => (
  async (dispatch, getState) => {
    try {
      const { title, body } = notification;
      const { data } = notification.payload;

      const feed = getState().feed;
      const badgeCount = feed.badgeCount + 1;

      await dispatch({
        type: FEED_UPDATE,
        payload: {
          badgeCount,
          notification: {
            id: uuidv4(),
            title,
            body,
            startedAt: data.startedAt,
            stoppedAt: data.stoppedAt,
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateFeedBadgeCount = (badgeCount) => (
  async (dispatch) => {
    try {
      if (badgeCount === 0) {
        PushNotificationIOS.removeAllDeliveredNotifications();
      }

      await dispatch({
        type: FEED_UPDATE_BADGE_COUNT,
        payload: {
          badgeCount
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export const getFeed = () => (
  async (dispatch) => {
    try {
      await PushNotificationIOS.getDeliveredNotifications(async (results) => {
        const notifications = [];
        _.forEach(results, (result) => {
          const { startedAt, stoppedAt } = result.userInfo.payload.data;
          notifications.unshift({
            title: result.title, body: result.body, id: result.identifier, startedAt, stoppedAt
          });
        });
        await dispatch({
          type: FEED_FETCH_DATA,
          payload: {
            badgeCount: notifications.length,
            notifications
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
);
