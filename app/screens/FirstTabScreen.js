import React, { Component } from 'react';
import { Text, View } from 'react-native';
import axios from 'axios';

class FirstTabScreen extends Component {
  async componentDidMount() {
    // try {
    //   console.log(123);
    //   const resp = await axios.post('http://192.168.0.9:3000/api/public/login', {
    //     loginType: 'facebook',
    //     accessToken: 'asdfadfadfs'
    //   });
    //   console.log(resp);
    // } catch (error) {
    //   console.error(error);
    // }
    axios.get('http://192.168.0.9:3000').then((res)=>{
      console.log(res.response);
    }).catch((error)=>{
      console.log(error.response);
    });
  }
  render() {
    return (
      <View>
        <Text>
          FirstTabScreen
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}

export default FirstTabScreen
