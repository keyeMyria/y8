import React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Feather';

class ShareIconButton extends React.PureComponent {

  onSharePress = () => {
    const { groupId, activity, sentence, started } = this.props;
    this.props.onSharePress(groupId, activity, sentence, started);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={this.onSharePress}
      >
        <View style={[styles.container, this.props.style]}>
          <Icon
            type={this.props.type}
            name={this.props.name}
            size={this.props.size}
            color={this.props.color}
          />
          <Text
            style={{ color: EStyleSheet.value('$textColor'), padding: 3 }}
          >
            {this.props.sharedWith}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    //flex: 1,
    padding: 5,
    height: 25,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
    //backgroundColor: 'red'
  }
});

export default ShareIconButton;
