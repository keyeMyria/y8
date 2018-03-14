import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  globalTextColor,
} from '../styles/Global';

class ActivityItem extends React.PureComponent {
  static defaultProps = {
    showEditIcon: false,
    onItemPress: () => null
  }

  onItemPress = () => {
    this.props.onItemPress(this.props.id);
  }
  onEdit = () => {
    this.props.onEdit(this.props.id);
  }
  render() {
    const { name } = this.props;
    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
        onPress={this.onItemPress}
      >
        <View style={[styles.outerContainer]}>
          <View style={{ width: 20 }} />
          <View style={[styles.innerContainer]}>

            <View style={[styles.textContainer]}>
              <Text style={[styles.text]}>{name}</Text>
            </View>
            {
              // this.props.showEditIcon &&
              // <View>
              //   <TouchableOpacity
              //     onPress={this.onEdit}
              //     style={[styles.moreButton]}
              //   >
              //     <MaterialIcons name="edit" size={20} color='rgba(0,122,255,0.8)' />
              //   </TouchableOpacity>
              // </View>
            }
            <View style={[styles.rightContainer]}>
              {
                this.props.showEditIcon &&
                <TouchableOpacity
                  onPress={this.onEdit}
                  style={[styles.moreButton]}
                >
                  <Ionicons
                    name='ios-information-circle-outline'
                    size={28} color='rgba(0,122,255,0.8)'
                  />
                </TouchableOpacity>
              }
              {
                !this.props.showEditIcon &&
                <Ionicons
                  name='ios-arrow-forward'
                  size={25} color='lightgray'
                  style={{ paddingRight: 20 }}
                />
              }

            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.25,
    borderColor: 'gray',
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    //backgroundColor: 'skyblue',
    //height: 60,
    justifyContent: 'center',
    //alignItems: 'flex-start'
    //paddingBottom: 3

  },
  text: {
    //backgroundColor: 'lightpink',
    fontSize: 21,
    color: globalTextColor
    //justifyContent: 'flex-start',
    //alignItems: 'flex-end'
  },
  moreButton: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 5,
    justifyContent: 'center',
    //backgroundColor: 'lightpink',
  },
  rightContainer: {

    //backgroundColor: 'lightblue',
    paddingHorizontal: 0,
    //marginRight: 15,
    justifyContent: 'center',
  }

});

export default ActivityItem;
