import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import ApiRequest from '../services/ApiRequest';
import {
  TAGS_FETCH_REQUEST,
  TAGS_FETCH_SUCCESS,
  TAGS_FETCH_ERROR,
  TAGS_FETCH_RESET,

  TAG_ADD_REQUEST,
  TAG_ADD_SUCCESS,
  TAG_ADD_ERROR,
  TAG_ADD_RESET,

  TAG_UPDATE_REQUEST,
  TAG_UPDATE_SUCCESS,
  TAG_UPDATE_ERROR,
  TAG_UPDATE_RESET,

  TAG_DELETE_REQUEST,
  TAG_DELETE_SUCCESS,
  TAG_DELETE_ERROR,
  TAG_DELETE_RESET
} from '../types/TagTypes';

import { AUTH_ERROR } from '../types/AuthTypes';
import { OFFLINE_QUEUE } from '../types/OfflineTypes';
import { fakePromise } from '../services/Common';

export const getTags = () => (
  async (dispatch, getState) => {
    try {
      const { isConnected } = getState().network;
      if (isConnected) {
        dispatch({
          type: TAGS_FETCH_REQUEST
        });
        const payload = {
          data: null,
          apiUrl: '/api/private/tag',
          method: 'get'
        };

        const tags = {
          byId: {},
          allIds: []
        };

        //if (isConnected) {
          const response = await ApiRequest(payload);
          const { data } = response;

          data.forEach((tag) => {
            tags.byId[tag.id] = tag;
            tags.allIds.push(tag.id);
          });
        //}

        dispatch({
          type: TAGS_FETCH_SUCCESS,
          payload: tags
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
          type: TAGS_FETCH_ERROR,
          payload: error.response
        });
      }
    }

    await fakePromise(100);
    dispatch({
      type: TAGS_FETCH_RESET
    });
  }
);

  // add activity action
  export const addTag = (newTag) => (
    async (dispatch, getState) => {
      try {
        dispatch({
          type: TAG_ADD_REQUEST
        });
        let tag = newTag;

        if (!_.has(tag, 'id')) {
          tag.id = uuidv4();
        }
        if (!_.has(tag, 'createdAt')) {
          tag.createdAt = Date.now();
        }
        if (!_.has(tag, 'updatedAt')) {
          tag.updatedAt = Date.now();
        }

        const { offlineMode } = getState().network;
        const apiUrl = '/api/private/tag';
        const payload = {
          UID: uuidv4(),
          data: tag,
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

        const tagId = tag.id;
        tag = {
          [tagId]: tag
        };

        await dispatch({
          type: TAG_ADD_SUCCESS,
          payload: {
            byId: tag,
            allIds: [tagId]
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
            type: TAG_ADD_ERROR,
            payload: error.response
          });
        }
      }
      await dispatch({
        type: TAG_ADD_RESET
      });
    }
  );

  // update activity action
  export const updateTag = (updatedTag) => (
    async (dispatch, getState) => {
      try {
        dispatch({
          type: TAG_UPDATE_REQUEST
        });
        const tag = updatedTag;
        tag.updatedAt = Date.now();

        const { offlineMode } = getState().network;
        const apiUrl = '/api/private/tag';
        const payload = {
          UID: uuidv4(),
          data: tag,
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
          type: TAG_UPDATE_SUCCESS,
          payload: {
            tag
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
            type: TAG_UPDATE_ERROR,
            payload: error.response
          });
        }
      }
      await dispatch({
        type: TAG_UPDATE_RESET
      });
    }
  );

  // update activity action
  export const deleteTag = (id) => (
    async (dispatch, getState) => {
      try {
        await dispatch({
          type: TAG_DELETE_REQUEST
        });
        const { offlineMode } = getState().network;
        const apiUrl = `/api/private/tag/${id}`;
        const payload = {
          UID: uuidv4(),
          data: null,
          apiUrl,
          method: 'delete',
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
          type: TAG_DELETE_SUCCESS,
          payload: {
            id
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
            type: TAG_DELETE_ERROR,
            payload: error.response
          });
        }
      }
      await dispatch({
        type: TAG_DELETE_RESET
      });
    }
  );
