import React from 'react';
import {
  Platform,
  FlatList,
  RefreshControl,
  Keyboard,
  UIManager,
  KeyboardAvoidingView,
  LayoutAnimation
} from 'react-native';
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import Feather from 'react-native-vector-icons/Feather';
import SearchBar from '../components/SearchBar';
import ActivityItem from '../components/ActivityItem';
import { SearchActivities } from '../services/ActivityService';

import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity
} from '../actions/ActivityActions';

const iconColor = 'rgba(221,93,89,1)';
let ADD_ICON;
Feather.getImageSource('plus', 30, iconColor).then((source) => {
  ADD_ICON = source;
});

class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      activity: null,
      searchIds: [],
      isSearchOn: false,
      searchBarTopPadding: 0,
    };
    this.timeout = 0;
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    if (this.props.navigator) {
      // Feather.getImageSource('plus', 30, EStyleSheet.value('$iconColor')).then((source) => {
      //   this.props.navigator.setButtons({
      //     rightButtons: [{
      //       id: 'add',
      //       icon: source,
      //       disableIconTint: true, // disable default color,
      //     }]
      //   });
      // });
      // if you want to listen on navigator events, set this up
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
  }

  componentDidMount() {
    //this.props.getActivities();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  async componentDidUpdate(nextProps) {
    //console.log('componentDidUpdate', nextProps.activities.adding, this.props.activities.adding);
    if (nextProps.activities.adding === true &&
      this.props.activities.adding === false &&
      nextProps.activities.addingError === null) {
      await this.showSnackBar('Activity created!');
    } else if (nextProps.activities.adding === true &&
      this.props.activities.adding === false &&
      nextProps.activities.addingError !== null) {
      await this.showSnackBar('TODO:Network error');
    } else if (nextProps.activities.updating === true &&
      this.props.activities.updating === false &&
      nextProps.activities.updatingError === null) {
      await this.showSnackBar('Activity Updated!');
    } else if (nextProps.activities.updating === true &&
      this.props.activities.updating === false &&
      nextProps.activities.updatingError !== null) {
      await this.showSnackBar('TODO:Network error');
    } else if (nextProps.activities.deleting === true &&
      this.props.activities.deleting === false &&
      nextProps.activities.deletingError === null) {
      await this.showSnackBar('Activity deleted!');
    } else if (nextProps.activities.deleting === true &&
      this.props.activities.deleting === false &&
      nextProps.activities.deletingError !== null) {
      await this.showSnackBar('TODO:Network error');
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        this.props.navigator.showModal({
          screen: 'app.ActivityModal',
          title: 'Create Activity',
          passProps: {
            activity: null,
            activities: this.props.activities
          },
          navigatorStyle: {},
          animationType: 'slide-up'
        });
      }
    }
  };

  onEdit = (id) => {
    this.props.navigator.showModal({
      screen: 'app.ActivityModal',
      title: 'Update Activity',
      passProps: {
        activity: this.props.activities.byId[id],
        activities: this.props.activities
      },
      navigatorStyle: {},
      animationType: 'slide-up'
    });
  }

  onItemPress = (activityId) => {
    this.props.navigator.push({
      screen: 'app.TagsScreen',
      title: 'Tags',
      passProps: {
        activity: this.props.activities.byId[activityId]
      },
      navigatorButtons: {
        rightButtons: [{
          id: 'add',
          icon: ADD_ICON,
          disableIconTint: true, // disable default color,
        }]
      }
    });
  }

  onSearchBarFocus = () => {
    this.setState({
      searchBarTopPadding: 20
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'hidden', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onSearchCancel = () => {
    this.setState({
      searchBarTopPadding: 0
    }, () => {
      this.props.navigator.toggleNavBar({
        to: 'shown', // required, 'hidden' = hide , 'shown' = show
        animated: true
      });
    });
  }

  onRefresh = () => {
    this.props.getActivities();
  }

  showSnackBar = (msg) => {
    Snackbar.show({
        title: msg,
        duration: Snackbar.LENGTH_SHORT,
    });
  }

  keyboardDidShow = () => {
    //this.props.navigation.setParams({ hideHeader: true });
    //console.log('keyboardDidShow');
  }

  keyboardDidHide = () => {
    //this.props.navigation.setParams({ hideHeader: false });
    //console.log('keyboardDidHide');
  }


  handleSearchChangeText = (text) => {
    clearTimeout(this.timeout);
    if (text.length === 0) {
      this.setState({
        searchIds: [],
        isSearchOn: false
      });
    } else {
      let searchIds = [];
      this.timeout = setTimeout(() => {
        searchIds = SearchActivities(this.props.activities.byId, text);
        this.setState({
          searchIds,
          isSearchOn: true
        });
      }, 800);
    }
  }

  handleSearchOnClear = () => {
    this.setState({
      searchIds: [],
      isSearchOn: false
    });
  }

  scrollToIndex = (index) => {
    this.flatListRef.scrollToIndex({ animated: true, index });
  }

  renderListHeader = () => null;
  renderListFooter= () => null;
  renderRow = ({ item }) => {
    const { id, name, updatedAt } = this.props.activities.byId[item];
    return (
      <ActivityItem
        id={id}
        name={name}
        showEditIcon={!_.isUndefined(updatedAt)}
        onEdit={this.onEdit}
        onItemPress={this.onItemPress}
      />
    );
  };

  render() {
    const { activities } = this.props;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={20}
        ref="myRef"
      >

        <SearchBar
          outerContainerStyle={{
            backgroundColor: EStyleSheet.value('$backgroundColor'),
            paddingTop: this.state.searchBarTopPadding
          }}
          onChangeText={this.handleSearchChangeText}
          onClear={this.handleSearchOnClear}
          onFocus={this.onSearchBarFocus}
          onCancel={this.onSearchCancel}
        />
        <FlatList
          //removeClippedSubviews={false}
          keyboardShouldPersistTaps='always'
          ref={(ref) => { this.flatListRef = ref; }}
          extraData={activities}
          ListHeaderComponent={this.renderListHeader}
          keyExtractor={item => item}
          data={
            this.state.isSearchOn ? this.state.searchIds : activities.allIds
          }
          renderItem={this.renderRow}
          ListFooterComponent={this.renderListFooter}
          refreshControl={
            <RefreshControl
              refreshing={activities.loading}
              onRefresh={this.onRefresh}
            />
          }

        />
        <Spinner
          visible={
            this.props.activities.adding ||
            this.props.activities.updating ||
            this.props.activities.deleting
          }
          color={EStyleSheet.value('$textColor')}
          textContent={'Loading...'}
          textStyle={{ color: EStyleSheet.value('$textColor') }}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$backgroundColor',
  },
  icon: {
    color: '$iconColor'
  }
});

const mapStateToProps = (state) => {
  //console.log('ActivitiesScreen:mapStateToProps:', state);
  const { activities } = state;
  return {
    activities,
  };
};
export default connect(mapStateToProps, {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
})(ActivitiesScreen);
