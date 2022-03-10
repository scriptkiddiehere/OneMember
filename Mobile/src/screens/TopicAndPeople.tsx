import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {topicAndPeopleStyle} from '../styles/topicandpeople';
import ActiveRoom from './ActiveRoom';
import UpcomingRoom from './UpcomingRoom';
import {connect} from 'react-redux';
import p4 from '../assets/img/p4.png';
import {fetchUser} from '../api/apis';
import {setUser} from '../redux/actions';
const Tab = createMaterialTopTabNavigator();
interface TopicAndSuggestionProps {
  navigation: any;
  state: any;
  setUser: any;
}
interface TopicAndSuggestionState {
  user: any;
}
class TopicAndSuggestion extends Component<
  TopicAndSuggestionProps,
  TopicAndSuggestionState
> {
  modal: any;
  constructor(props: any) {
    super(props);
    this.state = {
      user: null,
    };
  }

  async componentDidMount() {
    const {id} = this.props.state.rootReducer;
    const user = await fetchUser(id, id);
    console.log(user?.data);
    this.props.setUser(user?.data.data);
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    console.log(res);
  }
  fetchProfile = async () => {
    const {id} = this.props.state.rootReducer;
    console.log(id);
    this.props.navigation.navigate('profile', {
      id,
      logUser: id,
    });
  };
  checkIfProfile = (user: any) => {
    // const {user} = this.state;
    if (user) {
      if (
        user &&
        Object.keys(user).includes('profileImage') &&
        user.profileImage.length > 0
      ) {
        return (
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#2C9BCB',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: user.profileImage,
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 50,
              }}
            />
          </View>
        );
      } else {
        return (
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#2C9BCB',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 30,
              }}>
              {String(user.name[0])}
            </Text>
          </View>
        );
      }
    }
  };
  render() {
    console.log('stae', this.props.state);
    const {user} = this.props.state.rootReducer;
    return (
      <>
        <View
          style={{
            // width: 'auto',
            backgroundColor: '#fff',
          }}>
          <TouchableOpacity
            onPress={this.fetchProfile}
            style={topicAndPeopleStyle.headerContainer}>
            {user && this.checkIfProfile(user)}
            <Text numberOfLines={1} style={topicAndPeopleStyle.headerText}>
              {user?.name}
            </Text>
          </TouchableOpacity>
        </View>
        <Tab.Navigator>
          <Tab.Screen name="Hallway" component={ActiveRoom} />
          <Tab.Screen name="Upcoming Event" component={UpcomingRoom} />
        </Tab.Navigator>
      </>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    state,
  };
};

export default connect(mapStateToProps, {setUser})(TopicAndSuggestion);
