//TODO: this file is not in use, need to delete in clean up
import {
  getTags,
} from './TagActions';
import {
  getActivities,
} from './ActivityActions';
import {
  getMyActivities
} from './MyActivityActions';

import {
  INIT_FETCH_DATA_REQUEST,
  INIT_FETCH_DATA_DONE
} from '../types/InitTypes';

export const loadInitData = () => (
  async (dispatch) => {
    console.log('loadInitData');
    await dispatch({
      type: INIT_FETCH_DATA_REQUEST
    });
    await dispatch(getTags());
    await dispatch(getActivities());
    await dispatch(getMyActivities());
    await dispatch({
      type: INIT_FETCH_DATA_DONE
    });
  }
);
