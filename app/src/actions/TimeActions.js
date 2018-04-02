import uuidv4 from 'uuid/v4';
import moment from 'moment';
import _ from 'lodash';
import {
  TIME_TOGGLE_REQUEST,
  TIME_TOGGLE_SUCCESS,
  TIME_TOGGLE_ERROR,
  TIME_TOGGLE_RESET
} from '../types/TimeTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import ApiRequest from '../services/ApiRequest';
import { fakePromise } from '../services/Common';

export const getTimes = () => (
  async (dispatch) => {
    try {
      const apiUrl = '/api/private/time/search';
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'get',
      };
      await ApiRequest(payload);
    } catch (error) {
      console.log(error.response);
    }
  });

export const startActivity = (prevTimeId, activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;

      await dispatch({
        type: TIME_TOGGLE_REQUEST,
        payload: {
          activityId,
          groupId
        }
      });

      const { myActivities, times } = getState();
      const startedAt = moment().valueOf();
      const data = {
        id: uuidv4(),
        prevTimeId,
        groupId,
        startedAt
      };

      let newIndex = 0;
      myActivities.allActivityIds.forEach((aId, index) => {
        const gId = myActivities.byActivityId[aId].allGroupIds[0];
        const { groupTimes } = myActivities.byActivityId[aId].byGroupId[gId];
        if (!_.isNil(groupTimes) && !_.isNil(groupTimes[0])) {
          const { stoppedAt } = groupTimes[0];
          if (_.isNil(stoppedAt) || stoppedAt === '') {
            newIndex = index;
          }
        }
      });

      const apiUrl = '/api/private/time';
      const payload = {
        UID: uuidv4(),
        data,
        apiUrl,
        method: 'post',
      };

      if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }
      await dispatch({
        type: TIME_TOGGLE_SUCCESS,
        payload: {
          id: data.id,
          activityId,
          groupId,
          startedAt,
          isStart: true,
          newIndex
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        await dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        await dispatch({
          type: TIME_TOGGLE_ERROR,
          payload: error.response
        });
      }
    }
    await dispatch({
      type: TIME_TOGGLE_RESET,
    });
  });

export const stopActivity = (id, activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;

      await dispatch({
        type: TIME_TOGGLE_REQUEST,
        payload: {
          activityId,
          groupId
        }
      });

      const stoppedAt = moment().valueOf();
      const data = {
        id,
        stoppedAt
      };

      const { myActivities, times } = getState();
      // let newIndex = 0;
      // myActivities.allActivityIds.forEach((aId, index) => {
      //   const gId = myActivities.byActivityId[aId].allGroupIds[0];
      //   if (!_.isUndefined(times.byActivityId[aId]) &&
      //     !_.isUndefined(times.byActivityId[aId][gId])) {
      //     const stoppedTime = times.byActivityId[aId][gId][0].stoppedAt;
      //     if (_.isNull(stoppedTime)) {
      //       newIndex = index;
      //     }
      //   }
      // });

      let newIndex = 0;
      myActivities.allActivityIds.forEach((aId, index) => {
        const gId = myActivities.byActivityId[aId].allGroupIds[0];
        const { groupTimes } = myActivities.byActivityId[aId].byGroupId[gId];
        if (!_.isNil(groupTimes) && !_.isNil(groupTimes[0])) {
          const stoppedTime = groupTimes[0].stoppedAt;
          if (_.isNil(stoppedTime) || stoppedTime === '') {
            newIndex = index;
          }
        }
      });

      const apiUrl = '/api/private/time';
      const payload = {
        UID: uuidv4(),
        data,
        apiUrl,
        method: 'put',
      };

      if (isConnected) {
        await ApiRequest(payload);
      } else {
        await dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(100);
      }

      await dispatch({
        type: TIME_TOGGLE_SUCCESS,
        payload: {
          id,
          activityId,
          groupId,
          stoppedAt,
          isStart: false,
          newIndex
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        await dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
      await dispatch({
          type: TIME_TOGGLE_ERROR,
          payload: error.response
        });
      }
    }
    await dispatch({
      type: TIME_TOGGLE_RESET,
    });
  });

/*
// start activity action
export const toggleActivity = (activityId, groupId, isStart) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: TIME_TOGGLE_REQUEST,
      });

      const data = {
        activityId,
        groupId,
        isStart,
      };

      if (isStart) {
        data.startedAt = moment().valueOf();
      } else {
        data.stoppedAt = moment().valueOf();

        const { myActivities, times } = getState();
        let newIndex = 0;
        myActivities.allActivityIds.forEach((aId, index) => {
          const gId = myActivities.byActivityId[aId].allGroupIds[0];
          if (!_.isUndefined(times.byActivityId[aId]) &&
            !_.isUndefined(times.byActivityId[aId][gId])) {
            const { stoppedAt } = times.byActivityId[aId][gId][0];
            //console.log(stoppedAt);
            if (_.isNull(stoppedAt)) {
              newIndex = index;
            }
          }
        });
        data.newIndex = newIndex;
      }

      let done = false;
      if (!done) {
        //TODO: Make api call if network available, otherwise store in activity queue
        done = true;
      } else {

        // dispatch({
        //   type: ACTIVITIES_TOGGLE_QUEUE,
        //   payload: activity
        // });
      }

      if (done === true) {
        dispatch({
          type: TIME_TOGGLE_SUCCESS,
          payload: data
        });
      } else {
        dispatch({
          type: TIME_TOGGLE_ERROR,
          payload: 'TIME_TOGGLE_ERROR'
        });
      }
    } catch (error) {
      dispatch({
        type: TIME_TOGGLE_ERROR,
        payload: 'TIME_TOGGLE_ERROR'
      });
    }
  }
);
*/
