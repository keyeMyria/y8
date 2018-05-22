import React from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

class TimeHistoryIconButton extends React.PureComponent {

  onTimeHistoryPress = () => {
    const { activityId, groupId, activityName, sentence } = this.props;
    this.props.onTimeHistoryPress(activityId, groupId, activityName, sentence);
  }
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.offlineMode}
        onPress={this.onTimeHistoryPress}
        style={[styles.outerContainer, this.props.outerContainer]}
      >
        <View style={[styles.container, this.props.style]}>
          <Icon
            type={'materialIcons'}
            name={'history'}
            size={20}
            color={
              !this.props.offlineMode ?
              EStyleSheet.value('$iconColor') : EStyleSheet.value('$subTextColor')
            }
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  outerContainer: {

  },
  container: {
    //flex: 1,
    padding: 2,
    height: 25,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    //backgroundColor: 'lightpink'
  }
});

export default TimeHistoryIconButton;
