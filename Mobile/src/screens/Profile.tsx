import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from '../styles/profile';
import bg from '../assets/img/bg.jpg';
import user from '../assets/img/p6.png';
import {height, width} from '../styles/dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fetchUser, followUnfollow} from '../api/apis';
import write from '../assets/img/write.png';
import * as Picker from 'react-native-image-picker';
import Loader from '../components/Loader';
import {uploadToS3} from '../utils/utils';
import baseUrl from '../api/baseUrl';
import {setUser} from '../redux/actions';
import {connect} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import BottomModal from 'react-native-raw-bottom-sheet';
import {infoStyle} from '../components/SearchBox/info.styles';

interface ProfileProps {
  navigation: any;
  route: any;
  setAuth: any;
  setUser: any;
}

interface ProfileState {
  user: any;
  loading: boolean;
  aboutText: string;
}
class Profile extends Component<ProfileProps, ProfileState> {
  modal: any;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      aboutText: '',
    };
  }
  async componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    const {id, logUser} = this.props.route.params;
    this.setState({loading: true});
    const user = await fetchUser(id, logUser);
    this.setState({
      user: user?.data.data,
      loading: false,
      aboutText: user?.data.data.about,
    });
    if (id === logUser) {
      this.props.setUser(user?.data.data);
    }
  };

  async handlePicker(type: any) {
    const {id, logUser} = this.props.route.params;
    console.log(id);
    try {
      const options: any = {
        mediaType: 'photo',
      };
      let img = null;
      await Picker.launchImageLibrary(options, async (res: any) => {
        const localUri = res.assets[0].uri;
        const fileName = res.assets[0].fileName;
        this.setState({loading: true});
        img = await uploadToS3(localUri, fileName);
        if (type === 'profile') {
          console.log('profile', img);
          await baseUrl.post('/updateUser', {
            profileImage: img,
            userId: id,
          });
          this.fetchUser();
          // this.setState({loading: false});
        } else if (type === 'cover') {
          console.log('cover');
          await baseUrl.post('/updateUser', {
            backdropImage: img,
            userId: id,
          });
          this.fetchUser();
          // this.setState({loading: false});
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  checkIfProfile = () => {
    const {user} = this.state;
    if (user) {
      if (
        user &&
        Object.keys(user).includes('profileImage') &&
        user.profileImage.length > 0
      ) {
        return (
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
        );
      } else {
        return (
          <Text
            style={{
              color: '#fff',
              fontSize: 30,
            }}>
            {String(user.name[0])}
          </Text>
        );
      }
    }
  };

  checkIfBackProfile = () => {
    const {user} = this.state;
    if (user) {
      if (
        user &&
        Object.keys(user).includes('backdropImage') &&
        user.backdropImage.length > 0
      ) {
        return (
          <Image
            source={{
              uri: user.backdropImage,
            }}
            style={styles.background}
          />
        );
      } else {
        return <ImageBackground style={styles.background} source={bg} />;
      }
    }
  };

  updateBio = async () => {
    const {id} = this.props.route.params;
    this.setState({loading: true});
    await baseUrl.post('/updateUser', {
      about: this.state.aboutText,
      userId: id,
    });
    this.fetchUser();
    this.modal.close();
  };
  HandlefollowUnfollow = async (action: any) => {
    const {id, logUser, handleFetchSuggestion} = this.props.route.params;
    const res = await followUnfollow(logUser, id, action);
    if (res.data.isSuccess) {
      this.fetchUser();
      handleFetchSuggestion && handleFetchSuggestion();
    } else {
      return;
    }
  };
  render() {
    console.log(this.state.user);

    const {id, logUser} = this.props.route.params;
    return (
      <SafeAreaView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {this.state.loading && (
          <View
            style={{
              position: 'absolute',
              width: width,
              height: '100%',
              top: 0,
              zIndex: 1000,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <ActivityIndicator size={'large'} />
            </View>
          </View>
        )}
        <>
          {user ? (
            this.checkIfBackProfile()
          ) : (
            <ImageBackground style={styles.background} source={bg} />
          )}
          {id === logUser ? (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 18,
                top: 50,
                zIndex: 100,
              }}
              onPress={() => this.handlePicker('cover')}>
              <Image source={write} />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              position: 'absolute',
              top: 50,
              left: 18,
            }}>
            <AntDesign
              name="close"
              color={'#000'}
              size={30}
              onPress={() => {
                this.props.navigation.pop();
              }}
            />
          </View>
          <View style={{height: height, width: width}}>
            <View style={styles.usercontent}>
              <View style={styles.user}>
                {this.checkIfProfile()}
                {id === logUser ? (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: -8,
                      bottom: -8,
                      zIndex: 10,
                    }}
                    onPress={() => this.handlePicker('profile')}>
                    <Image source={write} />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.username}>{this.state.user?.name}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'p-500',
                  color: '#000',
                }}>
                @{this.state.user?.username}
              </Text>
              <Text style={styles.userstatus}>Veteran Member</Text>
            </View>
            <View style={styles.maincontent}>
              <View style={styles.followBox}>
                <View style={styles.followContent}>
                  <Text style={styles.followdetail}>
                    {this.state.user?.totalFollowers}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(0,0,0,0.5)',
                      fontFamily: 'p-500',
                    }}>
                    Follower
                  </Text>
                </View>
                <View style={styles.seperator}></View>
                <View style={styles.followContent}>
                  <Text style={styles.followdetail}>
                    {this.state.user?.totalFollowing}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(0,0,0,0.5)',
                      fontFamily: 'p-500',
                    }}>
                    Following
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.statusContainer}
                onPress={() => {
                  if (id === logUser) this.modal.open();
                  else return;
                }}>
                <Text style={styles.status}>{this.state.user?.about}</Text>
              </TouchableOpacity>
              {this.state.user &&
              Object.keys(this.state.user).includes('isFollowing') ? (
                this.state.user.isFollowing == 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.HandlefollowUnfollow('unfollow');
                    }}>
                    <View style={styles.followButton}>
                      <Text style={styles.follow}>Following</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      this.HandlefollowUnfollow('follow');
                    }}>
                    <View style={styles.followButton}>
                      <Text style={styles.follow}>Follow</Text>
                    </View>
                  </TouchableOpacity>
                )
              ) : null}
              <View
                style={{
                  width: width * 0.35,
                  height: width * 0.35,
                  marginTop: 30,
                }}>
                <Image
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  source={require('../assets/img/qr.jpg')}
                />
              </View>
            </View>
          </View>
          <BottomModal
            ref={ref => (this.modal = ref)}
            closeOnDragDown
            height={height * 0.25}
            customStyles={{
              container: {
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                alignItems: 'center',
              },
            }}>
            <View style={{...infoStyle.wrap}}>
              <TextInput
                style={{
                  fontFamily: 'p-400',
                  fontSize: 15,
                  width: '90%',
                  color: '#000',
                }}
                // editable={this.state.user.about !== this.state.aboutText}
                value={this.state.aboutText}
                onChangeText={val => {
                  this.setState({aboutText: val});
                }}
                placeholderTextColor={'lightgrey'}
                placeholder="Edit Your Bio"
              />
            </View>
            <TouchableOpacity onPress={this.updateBio}>
              <View style={{...styles.followButton, marginTop: 10}}>
                <Text style={styles.follow}>Done</Text>
              </View>
            </TouchableOpacity>
          </BottomModal>
        </>
      </SafeAreaView>
    );
  }
}

export default connect(null, {setUser})(Profile);
