import uuidv4 from 'uuid/v4';
import moment from 'moment';
import _ from 'lodash';
import {
  TIME_TOGGLE_REQUEST,
  TIME_TOGGLE_SUCCESS,
  TIME_TOGGLE_ERROR,
  TIME_TOGGLE_RESET,

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
} from '../types/TimeTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import ApiRequest from '../services/ApiRequest';
import { fakePromise } from '../services/Common';

export const getTimesByGroup = (groupId, query) => (
  async (dispatch) => {
    try {
      await dispatch({
        type: TIME_FETCH_BY_GROUP_REQUEST,
      });
      const apiUrl = `/api/private/time/${groupId}?page=${query.page}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'get',
      };
      const resp = await ApiRequest(payload);
      await dispatch({
        type: TIME_FETCH_BY_GROUP_SUCCESS,
        payload: {
          ...resp.data
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
          type: TIME_FETCH_BY_GROUP_ERROR,
          payload: error.response
        });
      }
      await dispatch({
        type: TIME_FETCH_BY_GROUP_RESET,
      });
    }
  });

export const startActivity = (activityId, groupId) => (
  async (dispatch, getState) => {
    try {
      const { myActivities, network } = getState();
      const { offlineMode } = network;

      await dispatch({
        type: TIME_TOGGLE_REQUEST,
        payload: {
          activityId,
          groupId
        }
      });

      const startedAt = moment().valueOf();
      const data = {
        id: uuidv4(),
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

      if (!offlineMode) {
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

export const stopActivity = (id, activityId, groupId, stoppedAt) => (
  async (dispatch, getState) => {
    try {
      const { network, myActivities } = getState();
      const { offlineMode } = network;
      await dispatch({
        type: TIME_TOGGLE_REQUEST,
        payload: {
          activityId,
          groupId
        }
      });
      //const stoppedAt = moment().valueOf();
      const data = {
        id,
        stoppedAt
      };

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

      if (!offlineMode) {
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


  export const createTime = (groupId, startedAt, stoppedAt) => (
    async (dispatch) => {
      try {
        await dispatch({
          type: TIME_CREATE_REQUEST,
        });
        const data = {
          startedAt, stoppedAt
        };

        const apiUrl = `/api/private/time/${groupId}`;
        const payload = {
          UID: uuidv4(),
          data,
          apiUrl,
          method: 'post',
        };

        const resp = await ApiRequest(payload);

        await dispatch({
          type: TIME_CREATE_SUCCESS,
          payload: {
            id: resp.data.id,
            groupId,
            startedAt,
            stoppedAt,
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
            type: TIME_CREATE_ERROR,
            payload: error.response
          });
        }
      }
      await dispatch({
        type: TIME_CREATE_RESET,
      });
    });

export const updateTime = (groupId, timeId, startedAt, stoppedAt) => (
  async (dispatch) => {
    try {
      await dispatch({
        type: TIME_UPDATE_REQUEST,
      });
      const data = {
        startedAt, stoppedAt, timeId
      };

      const apiUrl = `/api/private/time/${groupId}`;
      const payload = {
        UID: uuidv4(),
        data,
        apiUrl,
        method: 'put',
      };

      const resp = await ApiRequest(payload);

      await dispatch({
        type: TIME_UPDATE_SUCCESS,
        payload: {
          id: resp.data.id,
          groupId,
          startedAt,
          stoppedAt,
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
          type: TIME_UPDATE_ERROR,
          payload: error.response
        });
      }
    }
    await dispatch({
      type: TIME_UPDATE_RESET,
    });
  });

  export const deleteTime = (groupId, timeId) => (
    async (dispatch) => {
      try {
        await dispatch({
          type: TIME_DELETE_REQUEST,
        });

        const apiUrl = `/api/private/time/${groupId}/${timeId}`;
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'delete',
        };

        const resp = await ApiRequest(payload);

        await dispatch({
          type: TIME_DELETE_SUCCESS,
          payload: {
            id: resp.data.id,
            groupId,
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
            type: TIME_DELETE_ERROR,
            payload: error.response
          });
        }
      }
      await dispatch({
        type: TIME_DELETE_RESET,
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
