import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


class TabBarFeedIcon extends React.PureComponent {
  render() {
    return (
      <Icon name='feed' type='fontAwesome' size={25} color={this.props.color} />
    );
  }
}

export default TabBarFeedIcon;
