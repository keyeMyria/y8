import ApiRequest from '../services/ApiRequest';

import {
  OFFLINE_RESET,
  OFFLINE_REQUEST,
  OFFLINE_DONE,
  OFFLINE_CLEAR,
  OFFLINE_ERROR,
} from '../types/OfflineTypes';
//import { fakePromise } from '../services/Common';


function executeTasks(...args) {
  const tasks = Array.prototype.concat.apply([], args);
  const task = tasks.shift();
  task(() => {
      if (tasks.length > 0) {
        executeTasks.apply(this, tasks);
      }
  });
}

function createTask(num) {
  return async (callback) => {
    setTimeout(async () => {
        console.log(num);
        await num();
        if (typeof callback === 'function') {
          await callback();
        }
    }, 500);
  };
}

export const offlineRequest = () => (
  async (dispatch, getState) => {
    try {
      const { network, offlineQueue } = Object.assign({}, getState());
      const { offlineMode } = network;
      const { payloads } = offlineQueue;
      // && !syncing
      dispatch({
        type: OFFLINE_RESET
      });
      if (!offlineMode && payloads.length > 0) {
        dispatch({
          type: OFFLINE_REQUEST
        });

        const reqs = [];
        payloads.forEach(async (payload) => {
          const req = async () => {
              await ApiRequest(payload);
              await dispatch({
                type: OFFLINE_CLEAR,
                payload
              });
          };
          reqs.push(createTask(req));
        });

        // var t1 = createTask(1);
        // var t2 = createTask(2);
        // var t3 = createTask(3);
        // var t4 = createTask(4);
        // var t5 = createTask(5);
        //
        // reqs.push(t1);
        // reqs.push(t2);
        // reqs.push(t3);
        // reqs.push(t4);
        // reqs.push(t5);


        executeTasks(...reqs);

        // payloads.forEach(async (payload) => {
        //   await ApiRequest(payload);
        //   await dispatch({
        //     type: OFFLINE_CLEAR,
        //     payload
        //   });
        //   await fakePromise(2000);
        // });


        // await Promise.all(payloads.map(async (payload) => {
        //   if (!offlineMode) {
        //     await ApiRequest(payload);
        //     dispatch({
        //       type: OFFLINE_CLEAR,
        //       payload
        //     });
        //     await fakePromise(2000);
        //   }
        // }));
        if (!offlineMode) {
          dispatch({
            type: OFFLINE_DONE,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: OFFLINE_ERROR,
        payload: error
      });
    }
  }
);
/*
export const offlineRequest = () => (
  async (dispatch, getState) => {
    try {
      const { network, offlineQueue } = Object.assign({}, getState());
      const { offlineMode } = network;
      const { payloads } = offlineQueue;
      // && !syncing
      dispatch({
        type: OFFLINE_RESET
      });
      if (!offlineMode && payloads.length > 0) {
        dispatch({
          type: OFFLINE_REQUEST
        });
        await Promise.all(payloads.map(async (payload) => {
          if (!offlineMode) {
            await ApiRequest(payload);
            dispatch({
              type: OFFLINE_CLEAR,
              payload
            });
          }
        }));
        if (!offlineMode) {
          dispatch({
            type: OFFLINE_DONE,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: OFFLINE_ERROR,
        payload: error
      });
    }
  }
);*/
