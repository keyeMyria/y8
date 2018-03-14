//import uuidv4 from 'uuid/v4';
import moment from 'moment';
import _ from 'lodash';
import {
  TIME_TOGGLE_REQUEST,
  TIME_TOGGLE_SUCCESS,
  TIME_TOGGLE_ERROR,

} from '../types/TimeTypes';

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
        /*
        dispatch({
          type: ACTIVITIES_TOGGLE_QUEUE,
          payload: activity
        });*/
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
