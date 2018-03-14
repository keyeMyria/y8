import React from 'react';
import Icon from 'react-native-vector-icons/Feather';


class TabBarMoreIcon extends React.PureComponent {
  render() {
    return (
      <Icon name='menu' type='feather' size={25} color={this.props.color} />
    );
  }
}

export default TabBarMoreIcon;
