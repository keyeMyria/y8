import Toast from 'react-native-root-toast';
// https://github.com/magicismight/react-native-root-toast

export const showMsg = (msg) => (
  Toast.show(msg, {
    duration: Toast.durations.SHORT, //LONG
    position: Toast.positions.BOTTOM
  })
);

export const showError = (msg) => (
  Toast.show(msg, {
    duration: Toast.durations.SHORT, //LONG
    position: Toast.positions.BOTTOM,
    backgroundColor: 'red'
  })
);
