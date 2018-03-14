import axios from 'axios';

const ApiRequest = (payload) => {
  const { data, apiUrl, method } = payload;
  if (method === 'get') {
    return axios.get(apiUrl, data);
  } else if (method === 'post') {
    return axios.post(apiUrl, data);
  } else if (method === 'put') {
    return axios.put(apiUrl, data);
  } else if (method === 'delete') {
    return axios.delete(apiUrl, data);
  }
};

export default ApiRequest;
