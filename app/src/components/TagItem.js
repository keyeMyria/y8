import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
//import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class TagItem extends React.PureComponent {
  static defaultProps = {
    showEditIcon: false
  }
  static getDerivedStateFromProps(nextProps) {
    return {
      showCheck: nextProps.isChecked
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      showCheck: false
    };
  }
  // componentWillMount() {
  //   // this.setState({
  //   //   showCheck: this.props.isChecked
  //   // });
  // }
  onPress = () => {
    this.setState({
      showCheck: !this.state.showCheck
    }, () => {
      this.props.onItemPress(this.state.showCheck, this.props.id);
    });
  }
  onEdit = () => {
    this.props.onEdit(this.props.id);
  }
  render() {
    const { name } = this.props;
    return (
      <TouchableHighlight
        underlayColor='#F4F4F4'
        onPress={this.onPress}
      >
        <View style={[styles.outerContainer]}>
          <View style={{ width: 10 }} />
          <View style={[styles.innerContainer]}>
            <View
              style={{
                backgroundColor: this.state.showCheck ? 'gray' : '#ffffff',
                height: 23,
                width: 23,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: 'gray',
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                this.state.showCheck &&
                <Ionicons
                  name='ios-checkmark'
                  size={23} color='#ffffff'
                  style={{ backgroundColor: 'transparent' }}
                />
              }

            </View>
            <View style={[styles.textContainer]}>
              <Text style={[styles.text]}>{name}</Text>
            </View>

            <View style={[styles.rightContainer]}>
              {
                this.props.showEditIcon &&
                <TouchableOpacity
                  onPress={this.onEdit}
                  style={[styles.moreButton]}
                >
                  <Ionicons
                    name='ios-information-circle-outline'
                    size={25} color={EStyleSheet.value('$iconColor')}
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

const styles = EStyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
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

  },
  text: {
    //backgroundColor: 'lightpink',
    fontSize: 18,
    color: '$textColor',
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
export default TagItem;
