import axios from 'axios';
import _ from 'lodash';
import { GetLoginToken, SetLoginToken } from '../services/AuthService';

axios.defaults.baseURL = 'http://192.168.0.6:3000';
// 76.183.223.3
//axios.defaults.baseURL = 'http://76.183.223.3:3000';
//axios.defaults.baseURL = 'http://localhost:3000';
//axios.defaults.headers.common.TMPAUTH = 'naveen1@gmail.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
axios.interceptors.request.use(async (config) => {
    // Do something before request is sent

    const token = await GetLoginToken();
    const newConfig = Object.assign({}, config);
    newConfig.headers.common.Authorization = `Bearer ${token}`;
    //console.log(newConfig);
    return newConfig;
  }, (error) => {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(async (response) => {
    // Do something with response data
    //console.log(response);
    const newToken = response.headers['x-app-auth-token'];
    const isNew = response.headers['x-app-auth-0'];
    if (isNew === 'true' &&
    !_.isNull(newToken) &&
    !_.isEmpty(newToken) &&
    !_.isUndefined(newToken)) {
      //console.log('gotNewToken');
      await SetLoginToken(newToken);
    }
    return response;
  }, (error) => {
    // Do something with response error
    return Promise.reject(error);
  });
