import React, {Component} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBox from '../components/SearchBox';
import {userSuggestionStyle} from '../styles/usersuggestion';
import Fa from 'react-native-vector-icons/FontAwesome';
import {height} from '../styles/dimension';
import InfoBox from '../components/InfoBox';
import {styles} from '../styles/Welcome';
import {connect} from 'react-redux';
import {fetchSuggestions, followUnfollow} from '../api/apis';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSuggestionProps {
  state: any;
  navigation: any;
  route: any;
}
interface UserSuggestionState {
  suggestions: any;
  loading: boolean;
}
class UserSuggestion extends Component<
  UserSuggestionProps,
  UserSuggestionState
> {
  constructor(props: UserSuggestionProps) {
    super(props);
    this.state = {
      suggestions: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.handleFetchSuggestion();
  }

  handleFetchSuggestion = async () => {
    const {id} = this.props.state.rootReducer;
    this.setState({loading: true});
    const res = await fetchSuggestions(id);
    this.setState({suggestions: res?.data.data, loading: false});
  };

  HandlefollowUnfollow = async (followUnfollowId: any, action: any) => {
    const {id} = this.props.state.rootReducer;
    const res = await followUnfollow(id, followUnfollowId, action);
    if (res.data.isSuccess) {
      this.handleFetchSuggestion();
    } else {
      return;
    }
  };
  render() {
    const {id} = this.props.state.rootReducer;

    if (this.state.loading) {
      <Loader />;
    }
    return (
      <View style={userSuggestionStyle.container}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: height * 0.17,
          }}>
          <View style={userSuggestionStyle.header}>
            <Fa name="angle-left" size={30} color={'#000'} />
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'p-500',
                  fontSize: 20,
                  color: '#000',
                }}>
                Suggestion
              </Text>
            </View>
          </View>
          <SearchBox placeholder="Search" />
        </View>
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={userSuggestionStyle.users}>
            {this.state.suggestions[0] ? (
              this.state.suggestions.map((suggestion: any, i: any) => {
                return (
                  <InfoBox
                    route={this.props.route.params}
                    key={i}
                    id={suggestion._id}
                    logUser={id}
                    about={suggestion.about}
                    name={suggestion.name}
                    profileImg={suggestion.profileImage}
                    suggestUserId={suggestion._id}
                    following={suggestion.isFollowing}
                    navigation={this.props.navigation}
                    handleFetchSuggestion={this.handleFetchSuggestion}
                    HandlefollowUnfollow={this.HandlefollowUnfollow}
                  />
                );
              })
            ) : (
              <ActivityIndicator />
            )}
          </ScrollView>
        </>
        <View style={userSuggestionStyle.proceedBtn}>
          <TouchableOpacity
            style={{
              ...styles.startBtn,
              backgroundColor: '#2C9BCB',
              width: '90%',
            }}
            onPress={async () => {
              await AsyncStorage.setItem('suggestion', 'true');
              this.props.navigation.navigate('topic');
            }}>
            <Text style={{...styles.btnText, color: '#fff'}}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    state,
  };
};
export default connect(mapStateToProps, {})(UserSuggestion);
