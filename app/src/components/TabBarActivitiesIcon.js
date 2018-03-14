import React from 'react';
import Icon from 'react-native-vector-icons/Feather';


class TabBarActivitiesIcon extends React.PureComponent {
  render() {
    return (
      <Icon name='heart' type='feather' size={25} color={this.props.color} />
    );
  }
}

export default TabBarActivitiesIcon;
