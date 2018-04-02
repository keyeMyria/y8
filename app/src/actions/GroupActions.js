import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import {
  GROUP_ADD_REQUEST,
  GROUP_ADD_SUCCESS,
  GROUP_ADD_ERROR,
  GROUP_ADD_RESET,

  GROUP_FETCH_REQUEST,
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_ERROR,
  GROUP_FETCH_RESET,

  ONLYGROUPS_FETCH_REQUEST,
  ONLYGROUPS_FETCH_SUCCESS,
  ONLYGROUPS_FETCH_ERROR,
  ONLYGROUPS_FETCH_RESET,

  GROUP_GROUP_ADD_REQUEST,
  GROUP_GROUP_ADD_SUCCESS,
  GROUP_GROUP_ADD_ERROR,
  GROUP_GROUP_ADD_RESET,

  GROUP_REMOVE_TAG_REQUEST,
  GROUP_REMOVE_TAG_SUCCESS,
  GROUP_REMOVE_TAG_ERROR,
  GROUP_REMOVE_TAG_RESET,

  GROUP_REMOVE_GROUP_REQUEST,
  GROUP_REMOVE_GROUP_SUCCESS,
  GROUP_REMOVE_GROUP_ERROR,
  GROUP_REMOVE_GROUP_RESET,

} from '../types/GroupTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import ApiRequest from '../services/ApiRequest';
import { fakePromise } from '../services/Common';

import {
  startActivity
} from './TimeActions';

// add addTagsGroupToMyActivity action
export const addTagsGroupToMyActivity = (activity, tags, prevTimeId, prevGroupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_ADD_REQUEST,
      });

      const activityId = activity.id;
      const groupId = uuidv4();
      const myactivity = {
        byActivityId: {
          [activityId]: {
            byGroupId: {
              [groupId]: { tagsGroup: tags },
            },
            allGroupIds: [groupId]
          }
        },
        allActivityIds: [activityId]
      };

      const group = {
        prevGroupId,
        groupId,
        activityId,
        tags,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const { isConnected } = getState().network;
      const apiUrl = '/api/private/group';
      const payload = {
        UID: uuidv4(),
        data: group,
        apiUrl,
        method: 'post',
      };

      if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
        //const { data } = response;
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }
      await dispatch({
        type: GROUP_ADD_SUCCESS,
        payload: myactivity
      });

      await dispatch(startActivity(prevTimeId, activityId, groupId));
    } catch (error) {
      console.log('addTagsGroupToMyActivity', error);
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_ADD_RESET,
    });
  }
);


export const getMyActivities = () => (
  async (dispatch, getState) => {
    let myactivities = {
      byActivityId: {},
      allActivityIds: []
    };



    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: GROUP_FETCH_REQUEST
        });

        const payload = {
          data: null,
          apiUrl: '/api/private/group',
          method: 'get'
        };

        if (isConnected) {
          const response = await ApiRequest(payload);
          //console.log('responseGetMyActivities:');
          console.log(response);
          const { data } = response;
          console.log(data);
          //_.reverse(data.rows);
          _.forEach(data.rows, (row) => {
            const { activityId } = row._id;
            myactivities.allActivityIds.push(activityId);
            const allGroupIds = [];
            const byGroupId = {};
            _.forEach(row.groups, (group) => {
              allGroupIds.push(group.groupId);
              byGroupId[group.groupId] = {
                tagsGroup: group.tagsGroup,
                sharedWith: group.sharedWith,
                groupTimes: group.groupTimes
              };
            });
            myactivities.byActivityId[activityId] = { allGroupIds, byGroupId };
          });


          const temp = [];
          myactivities.allActivityIds.forEach((aId, index) => {
            const gId = myactivities.byActivityId[aId].allGroupIds[0];
            const { groupTimes } = myactivities.byActivityId[aId].byGroupId[gId];
            if (!_.isNil(groupTimes) && !_.isNil(groupTimes[0])) {
              const { stoppedAt } = groupTimes[0];

              if (_.isNil(stoppedAt) || stoppedAt === '') {
                myactivities.allActivityIds.splice(index, 1);
                temp.push(aId);
              }
            }
          });
          myactivities.allActivityIds = [...temp, ...myactivities.allActivityIds];
        }

        dispatch({
          type: GROUP_FETCH_SUCCESS,
          payload: myactivities,
          isOnline: isConnected
        });
      }
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    await fakePromise(100);
    dispatch({
      type: GROUP_FETCH_RESET
    });
  }
);

export const useThisGroupForActivity = (activityId, groupId, prevTimeId, prevGroupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_GROUP_ADD_REQUEST,
      });

      const { isConnected } = getState().network;
      const apiUrl = '/api/private/group';
      const payload = {
        UID: uuidv4(),
        data: { prevGroupId, groupId, updatedAt: Date.now() },
        apiUrl,
        method: 'put',
      };
      if (isConnected) {
        //TODO: Make api call if network available, otherwise store in activity queue
        await ApiRequest(payload);
        //const { data } = response;
      } else {
        dispatch({
          type: OFFLINE_QUEUE,
          payload
        });
        await fakePromise(300);
      }

      const onlygroups = getState().onlygroups;

      let tagsGroup = [];
      //if (!_.isNil(groupId)) {
        tagsGroup = _.filter(onlygroups.data, { id: groupId });
      //}
      console.log(tagsGroup);

      const data = {
        tagsGroup: tagsGroup[0].tags,
        activityId,
        groupId
      };
      dispatch({
        type: GROUP_GROUP_ADD_SUCCESS,
        payload: data
      });
      await dispatch(startActivity(prevTimeId, activityId, groupId));
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_GROUP_ADD_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_GROUP_ADD_RESET,
    });
  }
);


export const removeTagFromGroup = (activityId, groupId, tagId, onlyPrevGroupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_REMOVE_TAG_REQUEST,
      });
      const { isConnected } = getState().network;

      const apiUrl = `/api/private/group/${groupId}/${tagId}/${onlyPrevGroupId}/tag`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      // if (isConnected) {
        const resp = await ApiRequest(payload);
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }

      const onlygroups = getState().onlygroups;
      console.log('removeGroupFromActivity', onlygroups, onlyPrevGroupId);

      let tagsGroup = [];
      if (!_.isNil(onlyPrevGroupId)) {
        tagsGroup = _.filter(onlygroups.data, { id: onlyPrevGroupId });
      }
      if (tagsGroup.length === 1) {
        tagsGroup = tagsGroup[0].tags;
      }

      dispatch({
        type: GROUP_REMOVE_TAG_SUCCESS,
        payload: {
          tagsGroup,
          groupTimes: resp.data.nextGroupLatestTime,
          activityId,
          groupId,
          tagId
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        console.log(error.response);
        dispatch({
          type: GROUP_REMOVE_TAG_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_REMOVE_TAG_RESET,
    });
  }
);

//removeGroupFromActivity
export const removeGroupFromActivity = (activityId, groupId, onlyPrevGroupId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: GROUP_REMOVE_GROUP_REQUEST,
      });
      const { isConnected } = getState().network;

      const apiUrl = `/api/private/group/${groupId}/${onlyPrevGroupId}/group`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'delete',
      };

      //if (isConnected) {
      const resp = await ApiRequest(payload);


      const onlygroups = getState().onlygroups;
      console.log('removeGroupFromActivity', onlygroups, onlyPrevGroupId);

      let tagsGroup = [];
      if (!_.isNil(onlyPrevGroupId)) {
        tagsGroup = _.filter(onlygroups.data, { id: onlyPrevGroupId });
      }
      if (tagsGroup.length === 1) {
        tagsGroup = tagsGroup[0].tags;
      }
      //console.log(tagsGroup);
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }
      console.log({
        tagsGroup,
        groupTimes: resp.data.nextGroupLatestTime,
        activityId,
        groupId,
      });

      dispatch({
        type: GROUP_REMOVE_GROUP_SUCCESS,
        payload: {
          tagsGroup,
          groupTimes: resp.data.nextGroupLatestTime,
          activityId,
          groupId,
        }
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: GROUP_REMOVE_GROUP_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: GROUP_REMOVE_GROUP_RESET,
    });
  }
);


//getGroupsByActivity
export const getGroupsByActivity = (activityId) => (
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ONLYGROUPS_FETCH_REQUEST,
      });
      //const { isConnected } = getState().network;

      const apiUrl = `/api/private/group/${activityId}`;
      const payload = {
        UID: uuidv4(),
        data: null,
        apiUrl,
        method: 'get',
      };

      //if (isConnected) {
        const resp = await ApiRequest(payload);
      // } else {
      //   dispatch({
      //     type: OFFLINE_QUEUE,
      //     payload
      //   });
      //   await fakePromise(100);
      // }

      dispatch({
        type: ONLYGROUPS_FETCH_SUCCESS,
        payload: resp.data
      });
    } catch (error) {
      if (!_.isUndefined(error.response) && error.response.status === 401) {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      } else {
        dispatch({
          type: ONLYGROUPS_FETCH_ERROR,
          payload: error.response
        });
      }
    }
    dispatch({
      type: ONLYGROUPS_FETCH_RESET,
    });
  }
);
