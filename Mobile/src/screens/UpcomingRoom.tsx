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
  Share,
} from 'react-native';
import SearchBox from '../components/SearchBox';
import {topicAndPeopleStyle} from '../styles/topicandpeople';
import p4 from '../assets/img/p4.png';
import TopicBox from '../components/topicBox';
import {height, width} from '../styles/dimension';
import {styles} from '../styles/Welcome';
import BottomModal from 'react-native-raw-bottom-sheet';
import grp from '../assets/img/grp.png';
import recording from '../assets/img/recording.png';
import timer from '../assets/img/timer.png';
import write from '../assets/img/write.png';
import {infoStyle} from '../components/SearchBox/info.styles';
import Feather from 'react-native-vector-icons/Feather';
import {
  createRoom,
  fetchUser,
  fetchActiveRooms,
  fetchUpcomingRooms,
} from '../api/apis';
import {connect} from 'react-redux';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import * as Picker from 'react-native-image-picker';
import {shareLink, uploadToS3} from '../utils/utils';
import DatePicker from 'react-native-date-picker';
import {topicBoxStyle} from '../components/topicBox/topic.styles';
import moment from 'moment';
import Ion from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';

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

class UpcomingRoom extends Component<
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
      setDate: new Date().getTime(),
      fetchingRoom: false,
      loading: false,
    };
    this.handlePicker = this.handlePicker.bind(this);
  }

  handleRoomType = (i: number) => {
    this.setState({activeI: i});
  };
  componentDidMount() {
    this.handleFetchRoom();
  }
  handleFetchRoom = async () => {
    this.setState({fetchingRoom: true});
    const {id} = this.props.state.rootReducer;
    const res = await fetchUpcomingRooms(id);
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
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        textBody: 'Room is created',
        title: 'Room',
      });
      this.handleFetchRoom();
      this.modal.close();
      this.setState({localUri: '', fileName: '', roomDesc: '', roomTitle: ''});
      img = null;
    } else {
      this.setState({loading: false});
      return;
    }
    this.setState({loading: false});
  };
  checkIfProfile = (room: any) => {
    const user = room;
    if (user) {
      if (
        user &&
        Object.keys(user).includes('roomImage') &&
        user.roomImage.length > 0
      ) {
        return (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
            }}>
            <Image
              source={{
                uri: room.roomImage,
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 40,
              }}
            />
          </View>
        );
      } else {
        return (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: 'lightgrey',
            }}>
            <Image
              source={grp}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 40,
              }}
            />
          </View>
        );
      }
    }
  };

  async shareLink(roomId: any) {
    this.setState({loading: true});
    const link = await shareLink(roomId);
    this.setState({loading: false});
    Share.share({message: link});
  }
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <View style={topicAndPeopleStyle.container}>
        <SearchBox placeholder="Search" />
        {this.state.rooms ? (
          <ScrollView
            style={{marginBottom: 60, marginTop: 20}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.fetchingRoom}
                onRefresh={this.handleFetchRoom}
              />
            }>
            {this.state.rooms.map((room: any, i: any) => {
              return (
                <View
                  key={room._id}
                  style={{
                    ...topicBoxStyle.card,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      // alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',

                        borderBottomWidth: 2,
                        borderBottomColor: '#f4f4f4',
                        paddingBottom: 20,
                      }}>
                      {this.checkIfProfile(room)}
                      <View
                        style={{
                          // marginHorizontal: 10,
                          paddingHorizontal: 10,
                          // backgroundColor: 'red',

                          flex: 0.9,
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'p-500',
                          }}>
                          {room.title}
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'p-400',
                          }}>
                          {room.description}
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            fontFamily: 'p-500',
                          }}>
                          created by {room.createdBy.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        paddingTop: 20,
                      }}>
                      <Text
                        style={{
                          color: '#FBBC05',
                          textAlign: 'center',
                          fontFamily: 'p-500',
                        }}>
                        Schedule By
                      </Text>
                      <Text
                        style={{
                          color: '#000',
                          textAlign: 'center',
                          fontSize: 22,
                          fontFamily: 'p-500',
                        }}>
                        {moment(new Date(room.eventTime)).format(
                          'YYYY-MM-DD hh:mm A',
                        )}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.shareLink(room._id);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#DD6146',
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      marginLeft: 10,
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}>
                    <Ion name="ios-share-social" size={17} color={'#fff'} />
                  </TouchableOpacity>
                </View>
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

export default connect(mapStateToProps, {})(UpcomingRoom);
