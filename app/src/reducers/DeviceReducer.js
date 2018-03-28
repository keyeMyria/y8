import {
  REGISTER_DEVICE_REQUEST,
  REGISTER_DEVICE_SUCCESS,
  REGISTER_DEVICE_ERROR,
  REGISTER_DEVICE_RESET,
} from '../types/DeviceTypes';

const INITIAL_DEVICE_STATE = {
  error: null,
  loading: false,
  deviceId: null
};
export const device = (state = INITIAL_DEVICE_STATE, action) => {
  switch (action.type) {

    case REGISTER_DEVICE_REQUEST:
      return Object.assign({}, state, {
        error: null,
        loading: true,
        deviceId: null
      });
    case REGISTER_DEVICE_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        loading: false,
        deviceId: action.payload.deviceId
      });
    case REGISTER_DEVICE_ERROR:
      return Object.assign({}, state, {
        deviceId: null,
        loading: false,
        error: action.payload
      });
    case REGISTER_DEVICE_RESET:
      return Object.assign({}, state, {
        loading: false,
        error: null
      });
    default:
      return state;
  }
};
