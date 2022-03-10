import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
  AppState,
} from 'react-native';
import SearchBox from '../components/SearchBox';
import {topicAndPeopleStyle} from '../styles/topicandpeople';
import p4 from '../assets/img/p4.png';
import TopicBox from '../components/topicBox';
import {height, width} from '../styles/dimension';
import {styles} from '../styles/Welcome';
import BottomModal from 'react-native-raw-bottom-sheet';
import room from '../assets/img/room.png';
import recording from '../assets/img/recording.png';
import timer from '../assets/img/timer.png';
import write from '../assets/img/write.png';
import {infoStyle} from '../components/SearchBox/info.styles';
import Feather from 'react-native-vector-icons/Feather';
import {
  createRoom,
  fetchUser,
  fetchActiveRooms,
  fetchRoomById,
} from '../api/apis';
import {connect} from 'react-redux';
import {ALERT_TYPE, Toast, Dialog} from 'react-native-alert-notification';
import * as Picker from 'react-native-image-picker';
import {uploadToS3} from '../utils/utils';
import DatePicker from 'react-native-date-picker';
import WebrtcCallHandler from '../utils/WebrtcCallHandler';
import {roomIdFromUrl} from '../utils/utils';
import moment from 'moment';

interface TopicAndSuggestionProps {
  navigation: any;
  state: any;
}
interface TopicAndSuggestionState {
  showModal: boolean;
  activeI: number;
  roomTitle: string;
  roomDesc: string;
  roomImg: any;
  localUri: any;
  fileName: any;
  rooms: any;
  showDate: boolean | null;
  setDate: any;
  fetchingRoom: boolean;
  loading: boolean;
}

class ActiveRoom extends Component<
  TopicAndSuggestionProps,
  TopicAndSuggestionState
> {
  modal: any;
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
      activeI: 1,
      roomTitle: '',
      roomDesc: '',
      roomImg: '',
      localUri: '',
      fileName: '',
      rooms: null,
      showDate: false,
      setDate: new Date(),
      fetchingRoom: false,
      loading: false,
    };
    this.checkIfDeepLinkHasUrl = this.checkIfDeepLinkHasUrl.bind(this);
    this.handlePicker = this.handlePicker.bind(this);
  }

  handleRoomType = (i: number) => {
    this.setState({activeI: i});
  };
  async componentDidMount() {
    AppState.addEventListener('change', nextState => {
      console.log(nextState);
      if(nextState === "active"){
        this.checkIfDeepLinkHasUrl();
      }
    });
    await this.checkIfDeepLinkHasUrl();
    this.handleFetchRoom();
  }

  async checkIfDeepLinkHasUrl() {
    if (WebrtcCallHandler.deepLinkUrl) {
      const roomId = await roomIdFromUrl(WebrtcCallHandler.deepLinkUrl);
      const roomInfo: any = await fetchRoomById(roomId);
      if (roomId && roomId !== null) {
        console.log('room', roomInfo.data.data._id);

        if (
          roomInfo.data.data._id &&
          new Date(roomInfo.data.data.eventTime).getDate() <=
            new Date().getDate()
        ) {
          this.goToRoom(roomInfo.data.data, true);
        } else if (
          roomInfo.data.data._id &&
          new Date(roomInfo.data.data.eventTime).getDate() >
            new Date().getDate()
        ) {
          Dialog.show({
            title: 'Room',
            textBody: `This Room is scheduled at: ${moment(
              roomInfo.data.data.eventTime,
            ).format('YYYY-MM-DD hh:mm A')}`,
            type: ALERT_TYPE.WARNING,
          });
        } else {
          Dialog.show({
            title: 'Room',
            textBody: 'this Room is not available',
            type: ALERT_TYPE.DANGER,
          });
        }
      }

      WebrtcCallHandler.deepLinkUrl = undefined;
    }
  }
  handleFetchRoom = async () => {
    const {id} = this.props.state.rootReducer;
    console.log('fetching rooms');
    // Alert.alert('dawdwa')
    this.setState({fetchingRoom: true});
    const res = await fetchActiveRooms(id);
    this.setState({rooms: [...res.data.data]});
    this.setState({fetchingRoom: false});
  };
  async handlePicker() {
    try {
      const options: any = {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
      };

      await Picker.launchImageLibrary(options, async (res: any) => {
        this.setState({
          localUri: res.assets[0].uri,
          fileName: res.assets[0].fileName,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  fetchProfile = async () => {
    const {id} = this.props.state.rootReducer;
    console.log(id);
    this.props.navigation.navigate('profile', {
      id,
      logUser: id,
    });
  };
  handleCreateRoom = async () => {
    this.setState({loading: true});
    const {id} = this.props.state.rootReducer;
    const {roomTitle, roomDesc, activeI, roomImg} = this.state;
    if (!roomTitle || !roomDesc) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        textBody: 'Room Title and Room Description are required',
        title: 'Room',
      });
      this.setState({loading: false});
      return;
    }

    let img =
      this.state.localUri &&
      (await uploadToS3(this.state.localUri, this.state.fileName));
    const res = await createRoom({
      roomTitle,
      description: roomDesc,
      userId: id,
      roomType: activeI === 1 ? 'public' : 'private',
      roomImage: img || '',
      eventTime: new Date(this.state.setDate).getTime(),
    });
    if (res.data.isSuccess) {
      this.setState({loading: false});
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: 'Room is created',
        title: 'Room',
      });
      this.handleFetchRoom();
      this.modal.close();
      if (new Date(res.data.data.eventTime).getDate() <= new Date().getDate()) {
        this.goToRoom(res.data.data, true);
      }
      this.setState({localUri: '', fileName: '', roomDesc: '', roomTitle: ''});
      img = null;
    } else {
      this.setState({loading: false});
      return;
    }
    this.setState({loading: false});
    console.log(res.data);
  };

  goToRoom = (data: any, redirect: any) => {
    this.props.navigation.navigate('roomscreen', {
      roomData: data,
      redirect: redirect,
      handleFetchRoom: this.handleFetchRoom,
    });
  };
  render() {
    return (
      <View style={topicAndPeopleStyle.container}>
        <SearchBox placeholder="Search" />
        {this.state.rooms ? (
          <ScrollView
            style={{marginBottom: 60, marginTop: 20}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.fetchingRoom}
                onRefresh={this.handleFetchRoom}
              />
            }
            showsVerticalScrollIndicator={false}>
            {this.state.rooms.map((room: any, i: any) => {
              return (
                <TopicBox
                  room={room}
                  key={room._id}
                  handleFetchRoom={this.handleFetchRoom}
                  navigation={this.props.navigation}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator />
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: '#fff',
            width: width,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
          }}>
          <BottomModal
            ref={ref => (this.modal = ref)}
            closeOnDragDown
            height={height * 0.88}
            customStyles={{
              container: {
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
            }}>
            <View style={topicAndPeopleStyle.modalWrap}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: this.state.loading ? 'flex' : 'none',
                  zIndex: 100,
                }}>
                <ActivityIndicator
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
              <>
                <View style={topicAndPeopleStyle.modalPicWrap}>
                  {this.state.localUri.length > 0 ? (
                    <Image
                      source={{uri: this.state.localUri}}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                      }}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://reactjs.org/logo-og.png',
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 100,
                      }}
                    />
                  )}

                  <TouchableOpacity
                    style={topicAndPeopleStyle.modalPen}
                    onPress={this.handlePicker}>
                    <Image source={write} />
                  </TouchableOpacity>
                </View>
                <View style={topicAndPeopleStyle.actions}>
                  <Image source={recording} />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({showDate: !this.state.showDate});
                    }}>
                    <Image source={timer} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    marginTop: 15,

                    justifyContent: 'space-between',
                  }}>
                  <View style={{...infoStyle.wrap}}>
                    <TextInput
                      style={{
                        fontFamily: 'p-400',
                        fontSize: 15,
                        width: '90%',
                        color: '#000',
                      }}
                      onChangeText={val => {
                        this.setState({roomTitle: val});
                      }}
                      placeholderTextColor={'lightgrey'}
                      placeholder="Type Room Title"
                    />
                  </View>
                  <View
                    style={{
                      ...infoStyle.wrap,
                    }}>
                    <TextInput
                      style={{
                        fontFamily: 'p-400',
                        fontSize: 15,
                        width: '90%',
                        color: '#000',
                      }}
                      onChangeText={val => {
                        this.setState({roomDesc: val});
                      }}
                      textAlignVertical="top"
                      placeholderTextColor={'lightgrey'}
                      multiline
                      numberOfLines={6}
                      placeholder="Type Room Description"
                    />
                  </View>
                  <View style={topicAndPeopleStyle.chooseType}>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleRoomType(1);
                      }}
                      style={{
                        ...topicAndPeopleStyle.typeOption,
                        backgroundColor:
                          this.state.activeI === 1 ? '#1FBDBA' : 'transparent',
                      }}>
                      <Feather
                        size={17}
                        color={this.state.activeI === 1 ? '#fff' : '#000'}
                        name="lock"
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          color: this.state.activeI === 1 ? '#fff' : '#000',
                        }}>
                        Open
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleRoomType(2);
                      }}
                      style={{
                        ...topicAndPeopleStyle.typeOption,
                        backgroundColor:
                          this.state.activeI === 2 ? '#1FBDBA' : 'transparent',
                      }}>
                      <Feather
                        size={17}
                        color={this.state.activeI === 2 ? '#fff' : '#000'}
                        name="unlock"
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          color: this.state.activeI === 2 ? '#fff' : '#000',
                        }}>
                        Private
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    ...styles.startBtn,
                    backgroundColor: '#1FBDBA',
                    marginTop: 20,
                  }}
                  onPress={() => {
                    this.handleCreateRoom();
                  }}>
                  <Text style={{...styles.btnText, color: '#fff'}}>
                    Host a Room
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          </BottomModal>
          <TouchableOpacity
            style={{
              ...styles.startBtn,
              backgroundColor: '#1FBDBA',
              flexDirection: 'row',
            }}
            onPress={() => {
              this.modal.open();
            }}>
            <Feather name="plus" size={26} color={'#fff'} />
            <Text style={{...styles.btnText, color: '#fff', marginLeft: 5}}>
              Start Room
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.showDate ? (
          <DatePicker
            modal={true}
            open={this.state.showDate}
            onConfirm={date => {
              this.setState({showDate: false, setDate: date});
            }}
            onCancel={() => {
              this.setState({showDate: false});
            }}
            mode="datetime"
            date={new Date()}
            onDateChange={(date: any) => {
              console.log(date);
            }}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    state,
  };
};

export default connect(mapStateToProps, {})(ActiveRoom);
