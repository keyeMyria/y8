import Snackbar from 'react-native-snackbar';

const showSnackBar = (msg) => {
  if (msg !== '') {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }
};

export default showSnackBar;
