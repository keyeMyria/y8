import React from 'react';
import Icon from 'react-native-vector-icons/Feather';


class TabBarFriendsIcon extends React.PureComponent {
  render() {
    return (
      <Icon name='users' type='feather' size={25} color={this.props.color} />
    );
  }
}

export default TabBarFriendsIcon;
