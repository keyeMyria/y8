import { AsyncStorage } from 'react-native';
//import axios from 'axios';

const LOGIN_TOKEN_KEY = 'yactivity_login_token';

const ClearLoginToken = async () => SetLoginToken('');

const SetLoginToken = async (token) => {
  try {
    await AsyncStorage.setItem(LOGIN_TOKEN_KEY, token);
    // set bearer token to axios
    //axios.defaults.headers.common.TMPAUTH = 'naveen1@gmail.com';
    //axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return true;
  } catch (error) {
    // Error retrieving data
    console.log('TODO:', error);
  }
  return null;
};

const GetLoginToken = async () => {
  try {
    const token = await AsyncStorage.getItem(LOGIN_TOKEN_KEY);
    if (token !== null) {
      return token;
    }
  } catch (error) {
    // Error retrieving data
    console.log('TODO:', error);
  }
  return null;
};

export {
  SetLoginToken,
  GetLoginToken,
  ClearLoginToken
};
