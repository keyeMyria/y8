import React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';

class StatsIconButton extends React.PureComponent {

  onStatsPress = () => {
    const { activity } = this.props;
    this.props.onStatsPress(activity);
  }
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.offlineMode}
        onPress={this.onStatsPress}
        style={[styles.outerContainer, this.props.outerContainer]}
      >
        <View style={[styles.container, this.props.style]}>
          <Icon
            type={'ionicons'}
            name={'ios-stats'}
            size={18}
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

export default StatsIconButton;
