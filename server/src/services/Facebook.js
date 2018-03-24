const axios = require('axios');
const keys = require('../config/keys');

const VerifyAccessToken = (accessToken) => {

  return axios.get(`https://graph.facebook.com/v2.11/debug_token?input_token=${accessToken}&access_token=${keys.facebookAppID}|${keys.facebookClientSecret}`)
  .then((response) => {
    const debugInfo = response.data.data;
    if (debugInfo.is_valid === true && debugInfo.app_id === keys.facebookAppID) {
      return debugInfo;
    } else {
      //throw new Error({ httpCode: 401, msg: 'Unauthorized'});
      return false;
    }
  })
  .catch((error) => {
    console.error('TODO: ', error);
  });

};

const GetProfile = async (accessToken) => {
  console.log(accessToken);
  var config = {
    headers: {'Authorization': `Bearer ${accessToken}`}
  };
  //axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  return axios.get(`https://graph.facebook.com/v2.12/me?fields=id,name,email,first_name,last_name`,config)
    .then((response) => response.data)
    .catch((error) => {
      console.error('TODO: ', error);
    });
};

module.exports = {
  VerifyAccessToken,
  GetProfile
};
