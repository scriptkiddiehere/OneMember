import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
  BackHandler,
  Share,
  AppState,
} from 'react-native';
import {roomStyle} from '../styles/room.style';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ion from 'react-native-vector-icons/Ionicons';
import p1 from '../assets/img/p1.png';
import mic from '../assets/img/mic.png';
import {width} from '../styles/dimension';
import {FlatGrid, SectionGrid} from 'react-native-super-grid';
import HeadphoneDetection from 'react-native-headphone-detection';
import InCallManager from 'react-native-incall-manager';
import {connect} from 'react-redux';
import baseUrl from '../api/baseUrl';
import Loader from '../components/Loader';
import WebrtcCallHandler from '../utils/WebrtcCallHandler';
import { shareLink} from '../utils/utils';

interface RoomScreenProps {
  navigation: any;
  state: any;
  route: any;
}

interface RoomScreenState {
  moderators: any[];
  listners: any[];
  isSpeakerEnable: boolean;
  isOnBluetooth: boolean;
  isOnWiredHeadset: boolean;
  loading: boolean;
  micOff: boolean;
  appState: any;
}
class RoomScreen extends Component<RoomScreenProps, RoomScreenState> {
  num: any;
  roomData: any;
  lastAudioRoute: any;
  selfData: any;
  appState: any;
  constructor(props: any) {
    super(props);
    WebrtcCallHandler.getInstance().cleanUp();
    console.log('props.route.params');

    console.log(props.route.params);
    this.roomData = props.route.params.roomData;
    this.selfData = props.state.user;
    this.state = {
      moderators: [],
      listners: [],
      isSpeakerEnable: false,
      isOnBluetooth: false,
      isOnWiredHeadset: false,
      loading: false,
      micOff: false,
      appState: AppState.currentState,
    };
    this.lastAudioRoute = null;

    this.permissionError = this.permissionError.bind(this);
    this.onParticipants = this.onParticipants.bind(this);
    this.permissionApproved = this.permissionApproved.bind(this);
    this.registerCallBack = this.registerCallBack.bind(this);
    this.onUserLeft = this.onUserLeft.bind(this);
    this.unregisterCallBack = this.unregisterCallBack.bind(this);
    this.onTrack = this.onTrack.bind(this);
    this.startWebrtc = this.startWebrtc.bind(this);
    this.onUserJoined = this.onUserJoined.bind(this);
    this.onSocketConnected = this.onSocketConnected.bind(this);
    this.checkIfCurentUserIsListner =
      this.checkIfCurentUserIsListner.bind(this);
    this.startWebrtc = this.startWebrtc.bind(this);
    this.getUserRole = this.getUserRole.bind(this);
    this.onHandRaised = this.onHandRaised.bind(this);
    this.onNewMessage = this.onNewMessage.bind(this);
    this.shareLinkFun = this.shareLinkFun.bind(this);
    this.onParticipantDataUpdated = this.onParticipantDataUpdated.bind(this);
  }

  componentDidMount() {
    this.appState = AppState.addEventListener('change', nextState => {
      console.log(nextState);
    });

    InCallManager.setKeepScreenOn(true);
    this.props.navigation.addListener('beforeRemove', () => {
      console.log('beforeRemove');

      WebrtcCallHandler.getInstance().cleanUp();
    });
    this.registerCallBack();
    this.startWebrtc();
    this.setState({loading: true});
  }

  componentWillUnmount() {
    this.appState.remove();
    this.unregisterCallBack();
    InCallManager.stop();
    if (HeadphoneDetection.remove) {
      HeadphoneDetection.remove();
    }

    WebrtcCallHandler.getInstance().cleanUp();
    InCallManager.setKeepScreenOn(false);
  }

  registerCallBack() {
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'permissionApproved',
      this.permissionApproved,
      true,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'permissionError',
      this.permissionError,
      true,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onUserJoined',
      this.onUserJoined,
      false,
    );

    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onTrack',
      this.onTrack,
      false,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'refershTrack',
      this.onTrack,
      false,
    );

    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onConnected',
      this.onSocketConnected,
      false,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onUserLeft',
      this.onUserLeft,
      false,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'participants',
      this.onParticipants,
      false,
    );

    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onNewChatMessageReceived',
      this.onNewMessage,
      true,
    );
    WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      'onParticipantDataUpdated',
      this.onParticipantDataUpdated,
      true,
    );
  }
  unregisterCallBack() {
    WebrtcCallHandler.getInstance().removeExtraListener(
      'onConnected',
      this.onSocketConnected,
    );

    WebrtcCallHandler.getInstance().removeExtraListener(
      'permissionError',
      this.permissionError,
    );
    WebrtcCallHandler.getInstance().removeExtraListener(
      'permissionApproved',
      this.permissionApproved,
    );

    WebrtcCallHandler.getInstance().removeExtraListener(
      'onTrack',
      this.onTrack,
    );
    WebrtcCallHandler.getInstance().removeExtraListener(
      'refershTrack',
      this.onTrack,
    );
    WebrtcCallHandler.getInstance().removeExtraListener(
      'onUserLeft',
      this.onUserLeft,
    );
    WebrtcCallHandler.getInstance().removeExtraListener(
      'participants',
      this.onParticipants,
    );

    WebrtcCallHandler.getInstance().removeExtraListener(
      'onNewChatMessageReceived',
      this.onNewMessage,
    );
    WebrtcCallHandler.getInstance().removeExtraListener(
      'onParticipantDataUpdated',
      this.onParticipantDataUpdated,
    );
  }
  permissionError() {
    alert('Please Allow Audio Permission to continue');
    InCallManager.stop();

    WebrtcCallHandler.getInstance().cleanUp();

    InCallManager.setKeepScreenOn(false);
  }
  onUserLeft(participant: any) {
    this.setState({
      listners: [
        ...this.state.listners.filter(
          user => user.userId !== participant.userId,
        ),
      ],
    });
    this.setState({
      moderators: [
        ...this.state.moderators.filter(
          user => user.userId !== participant.userId,
        ),
      ],
    });

    if (participant.isAdmin) {
    }
  }

  onHandRaised() {
    const admin = this.state.moderators.find(user => user.isAdmin === true);
    if (admin) {
      const messagePayload = WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .newMessageObject(admin.userId, 'RaiseHand');
      messagePayload.type = 'RaiseHand';
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .sendMessage(messagePayload);
    }
  }

  async onEndMeetingTapped() {
    // Alert.alert('awdawdwa');
    this.setState({loading: true});
    const res = await baseUrl.post('/deleteRoom', {
      roomId: this.roomData._id,
    });
    console.log(res);

    const messagePayload = WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .newMessageObject('all', 'RaiseHandApproved');
    messagePayload.type = 'EndMeeting';
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .sendMessage(messagePayload);
    setTimeout(() => {
      this.props.route.params.handleFetchRoom();
      WebrtcCallHandler.getInstance().cleanUp();
      this.props.navigation.pop();
      this.setState({loading: false});
    }, 500);
  }
  onNewMessage(messagePayload: any) {
    console.log(messagePayload);
    if (messagePayload.type === 'RaiseHand') {
      const participant = WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .participantByUserId(messagePayload.sender);
      if (participant) {
        Alert.alert(
          'Access Requsted',
          participant.userData.name + ' asked to speak',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                const messagePayload = WebrtcCallHandler.getInstance()
                  .getMeetingHandler()
                  .newMessageObject(participant.userId, 'RaiseHandApproved');
                messagePayload.type = 'RaiseHandApproved';
                WebrtcCallHandler.getInstance()
                  .getMeetingHandler()
                  .sendMessage(messagePayload);
              },
            },
          ],
        );
        // alert(participant.userData.name + "Asked to speak")
      }
    } else if (messagePayload.type === 'RaiseHandApproved') {
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .startLocalStream(false, true);
      const selfParticipant = WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .participantByUserId(
          WebrtcCallHandler.getInstance().getMeetingRequest().userId,
        );
      if (selfParticipant) {
        selfParticipant.userData.userType = 'moderator';
        WebrtcCallHandler.getInstance()
          .getMeetingHandler()
          .updateParticipantData(selfParticipant);
        this.onUserJoined(selfParticipant);
      }
    } else if (messagePayload.type === 'EndMeeting') {
      WebrtcCallHandler.getInstance().cleanUp();
      this.props.route.params.handleFetchRoom();
      Alert.alert('Room Closed', 'Admin closed the room', [
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.pop();
          },
        },
      ]);
    }
  }

  permissionApproved() {
    console.log('permissionApproved');
    WebrtcCallHandler.getInstance().removeExtraListener(
      'permissionApproved',
      this.permissionApproved,
    );

    WebrtcCallHandler.getInstance().getMeetingHandler().checkSocket();
  }
  joinUpdateUser = async () => {
    const res = await baseUrl.post('/joinUpdateUserInRoom', {
      roomId: this.roomData._id,
      userId: this.selfData._id,
      role: this.getUserRole(),
    });
  };
  onSocketConnected() {
    WebrtcCallHandler.getInstance().removeExtraListener(
      'onConnected',
      this.onSocketConnected,
    );
    this.joinUpdateUser();
    WebrtcCallHandler.getInstance().getMeetingHandler().startMeeting();
    console.log('On startMeeting');
    InCallManager.start({media: 'video'});
    this.setState({loading: false});
    HeadphoneDetection.isAudioDeviceConnected().then(connection => {
      this.lastAudioRoute = connection;
      if (connection.bluetooth === true || connection.audioJack === true) {
        this.setState({isSpeakerEnable: false});
        InCallManager.setForceSpeakerphoneOn(false);
      }

      this.setState({
        isOnBluetooth: connection.bluetooth,
        isOnWiredHeadset: connection.audioJack,
      });
    });
    HeadphoneDetection.addListener(connection => {
      if (Platform.OS === 'ios') {
        if (
          this.lastAudioRoute !== null &&
          connection.bluetooth === this.lastAudioRoute.bluetooth &&
          connection.audioJack === this.lastAudioRoute.audioJack
        ) {
          return;
        }
      }
      this.lastAudioRoute = connection;
      if (connection.bluetooth === true || connection.audioJack === true) {
        this.setState({isSpeakerEnable: false});
        InCallManager.setForceSpeakerphoneOn(false);
      } else {
        this.setState({isSpeakerEnable: true});
        InCallManager.setForceSpeakerphoneOn(true);
      }
      this.setState({
        isOnBluetooth: connection.bluetooth,
        isOnWiredHeadset: connection.audioJack,
      });
    });
  }
  onTrack(track: any) {
    console.log('onTrack');
  }
  onUserJoined(participant: any) {
    if (participant.isAdmin || participant.userData.userType !== 'listner') {
      const userInModerator = this.state.moderators.find(
        user => user.userId === participant.userId,
      );
      if (!userInModerator) {
        this.state.moderators.push(participant);
        this.setState({moderators: [...this.state.moderators]});
        this.setState({
          listners: [
            ...this.state.listners.filter(
              user => user.userId !== participant.userId,
            ),
          ],
        });
      } else {
        Object.assign(userInModerator, participant);
      }
    } else {
      const userInListner = this.state.listners.find(
        user => user.userId === participant.userId,
      );
      if (!userInListner) {
        this.state.listners.push(participant);
        this.setState({listners: [...this.state.listners]});
        this.setState({
          moderators: [
            ...this.state.moderators.filter(
              user => user.userId !== participant.userId,
            ),
          ],
        });
      } else {
        Object.assign(userInListner, participant);
      }
    }
  }

  onParticipantDataUpdated(participant: any) {
    this.onUserJoined(participant);
  }

  onParticipants(allParticipants: any) {
    for (const participant of allParticipants) {
      this.onUserJoined(participant);
    }

    setTimeout(() => {
      var selfParticipant = this.state.listners.find(
        listener => listener.userId === this.selfData._id,
      );
      if (!selfParticipant) {
        selfParticipant = this.state.moderators.find(
          listener => listener.userId === this.selfData._id,
        );
        if (!selfParticipant) {
          this.onUserJoined(
            WebrtcCallHandler.getInstance()
              .getMeetingHandler()
              .participantByUserId(
                WebrtcCallHandler.getInstance().getMeetingRequest().userId,
              ),
          );
        }
      }
    }, 400);
  }

  getUserRole() {
    for (const member of this.roomData.members) {
      if (member._id === this.selfData._id) return member.role;
    }
    return 'listner';
  }
  checkIfCurentUserIsListner() {
    for (const member of this.roomData.members) {
      if (member._id === this.selfData._id && member.role === 'admin')
        return false;
    }
    return true;
  }
  startWebrtc(): void {
    console.log('selfData', this.selfData);
    WebrtcCallHandler.getInstance().setup(
      this.roomData._id,
      this.selfData._id + '_' + Math.random(),
      this.selfData,
      !this.checkIfCurentUserIsListner(),
      this.getUserRole(),
    );
    WebrtcCallHandler.getInstance().getMeetingHandler().init();
    if (this.checkIfCurentUserIsListner()) {
      WebrtcCallHandler.getInstance().getMeetingHandler().checkSocket();
    } else {
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .startLocalStream(false, true);
    }
  }
  checkIfProfile = (user: any) => {
    if (user) {
      if (
        user &&
        Object.keys(user).includes('profileImage') &&
        user.profileImage.length > 0
      ) {
        return (
          <>
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
          </>
        );
      } else {
        return (
          <>
            <Text
              style={{
                color: '#fff',
                fontSize: 30,
              }}>
              {String(user.name[0])}
            </Text>
          </>
        );
      }
    }
  };

  async shareLinkFun() {
    console.log(this.roomData);
    
    const link = await shareLink(this.roomData._id)
    Share.share({message: 'Join Room ' + link});
  }

  handleMic = () => {
    if (this.state.micOff) {
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .resumeStreamWithoutAdding(
          'audio',
          WebrtcCallHandler.getInstance().getMeetingRequest().userId,
        );
      this.setState({micOff: false});
    } else {
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .pauseStreamWithoutStopping(
          'audio',
          WebrtcCallHandler.getInstance().getMeetingRequest().userId,
        );

      this.setState({micOff: true});
    }
  };
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <View style={roomStyle.container}>
        <AntDesign
          name="down"
          size={26}
          color={'#000'}
          style={roomStyle.header}
          onPress={() => {
            this.props.navigation.pop();
          }}
        />
        <View style={roomStyle.wrap}>
          <Text
            style={{
              color: '#939497',
              fontFamily: 'p-400',
              marginBottom: 5,
            }}>
            {this.roomData.roomTitle}
          </Text>
          <Text
            style={{
              color: '#000',
              fontFamily: 'p-400',
              marginBottom: 5,
            }}>
            {this.roomData.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '23%',
              justifyContent: 'space-between',
            }}>
            {/* <Text>
              41
              <Icon
                style={{
                  marginLeft: 5,
                }}
                name="chatbubble-ellipses-outline"
                color="#60C2E1"
                size={15}
              />
            </Text> */}
            <Text>
              {this.state.moderators.length + this.state.listners.length + ' '}
              <AntDesign
                style={{
                  marginLeft: 5,
                }}
                name="user"
                color="#60C2E1"
                size={15}
              />
            </Text>
          </View>
          <View style={roomStyle.firstBox}>
            <SectionGrid
              itemDimension={(width - 120) / 3}
              sections={[
                {
                  title: 'Moderator',
                  data: this.state.moderators,
                },
                {
                  title: 'Listeners',
                  data: this.state.listners,
                },
              ]}
              showsVerticalScrollIndicator={false}
              renderItem={(item: any, section: any, index: any) => {
                return (
                  <View
                    style={{
                      marginBottom: 20,
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('profile', {
                          id: item.item.userData._id,
                          logUser: this.selfData._id,
                          // handleFetchSuggestion: this.props.handleFetchSuggestion,
                        });
                      }}
                      key={item.userId}
                      style={roomStyle.userBox}>
                      {this.checkIfProfile(item.item.userData)}
                      {item.item.isAudioEnable ? (
                        <Image source={mic} style={roomStyle.boxMic} />
                      ) : null}
                    </TouchableOpacity>
                    <Text
                      style={{
                        // textAlign: 'center',
                        fontFamily: 'p-500',
                      }}
                      numberOfLines={1}>
                      {item.item.userData.name}
                      {/* dwadada aw awdaww wa dwawa daw w dwadadd */}
                    </Text>
                  </View>
                );
              }}
              renderSectionHeader={({section}) => {
                return (
                  <Text
                    style={{
                      marginBottom: 10,
                      marginLeft: 10,
                      fontFamily: 'p-500',
                      color: '#46B5DD',
                    }}>
                    {section.title}
                  </Text>
                );
              }}
            />
          </View>
          <View style={roomStyle.bottom}>
            <TouchableOpacity
              onPress={() => {
                WebrtcCallHandler.getInstance().cleanUp();
                this.props.navigation.pop();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#DD6146',
                width: 100,
                height: 40,
                borderRadius: 16,
              }}>
              <Ion name="ios-exit-outline" size={17} color={'#fff'} />
              <Text
                style={{
                  color: '#fff',
                  marginLeft: 5,
                  fontSize: 15,
                  fontFamily: 'p-500',
                }}>
                Leave
              </Text>
            </TouchableOpacity>
            {!this.checkIfCurentUserIsListner() ? (
              <TouchableOpacity
                onPress={() => {
                  this.onEndMeetingTapped();

                  this.props.route.params.handleFetchRoom();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#DD6146',
                  width: 100,
                  height: 40,
                  borderRadius: 16,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    marginLeft: 5,
                    fontSize: 15,
                    fontFamily: 'p-500',
                  }}>
                  End Room
                </Text>
              </TouchableOpacity>
            ) : null}
            {this.getUserRole() === 'listner' ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.onHandRaised();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#DD6146',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    // marginLeft: 20,
                  }}>
                  <Ion name="ios-hand-left-outline" size={17} color={'#fff'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.shareLinkFun}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#DD6146',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginLeft: 10,
                  }}>
                  <Ion name="ios-share-social" size={17} color={'#fff'} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{
                width:'30%'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    this.handleMic();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#DD6146',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    // marginLeft: 20,
                  }}>
                  <Ion
                    name={this.state.micOff ? 'ios-mic-off' : 'mic'}
                    size={17}
                    color={'#fff'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.shareLinkFun}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#DD6146',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginLeft: 10,
                  }}>
                  <Ion name="ios-share-social" size={17} color={'#fff'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    state: state.rootReducer,
  };
};

export default connect(mapStateToProps, {})(RoomScreen);
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
