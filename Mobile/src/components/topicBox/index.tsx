import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {topicBoxStyle} from './topic.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import User from 'react-native-vector-icons/AntDesign';

interface TopicAndSuggestionProps {
  navigation: any;
  room: any;
  handleFetchRoom: any;
}
export default class TopicBox extends Component<TopicAndSuggestionProps, {}> {
  checkIfProfile = (room: any) => {
    const user = room;
    if (user) {
      if (
        user &&
        Object.keys(user).includes('profileImage') &&
        user.profileImage.length > 0
      ) {
        return (
          <Image
            key={user._id}
            source={{
              uri: user.profileImage,
            }}
            style={topicBoxStyle.image}
          />
        );
      } else {
        return (
          <View
            key={user._id}
            style={{
              ...topicBoxStyle.image,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 25,
              }}>
              {room.name.length > 0 ? String(room.name[0]) : 'U'}
            </Text>
          </View>
        );
      }
    }
  };
  render() {
    return (
      <View style={topicBoxStyle.card}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('roomscreen', {
              roomData: this.props.room,
              handleFetchRoom: this.props.handleFetchRoom,
            });
          }}>
          <View style={topicBoxStyle.cardHeader}>
            <Text
              style={{
                fontFamily: 'p-600',
                fontSize: 13,
                color: '#191A1C',
              }}>
              {this.props.room.roomTitle}
            </Text>
            <Text
              style={{
                fontFamily: 'p-600',
                fontSize: 13,
                color: '#46B5DD',
              }}>
              {Math.floor(
                (new Date().getTime() - this.props.room.eventTime) / 60000,
              )}{' '}
              Min
            </Text>
          </View>
          <View style={topicBoxStyle.imageGrid}>
            {this.props.room.members.map((m: any, i: any) => {
              if (i < 8) {
                return this.checkIfProfile(m);
              } else {
                return;
                // break;
              }
            })}
            {this.props.room.members.length > 8 ? (
              <View style={topicBoxStyle.moreImage}>
                <Text
                  style={{
                    color: '#000000',
                    fontFamily: 'p-600',
                    fontSize: 13,
                  }}>
                  {this.props.room.members.length}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={topicBoxStyle.detailBox}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={topicBoxStyle.detailBoxText}>Zarie Saris </Text>
              <Icon
                style={{
                  marginLeft: 5,
                }}
                name="chatbubble-ellipses-outline"
                color="#60C2E1"
                size={15}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={topicBoxStyle.detailBoxText}>Emery Kenter </Text>
              <Icon
                style={{
                  marginLeft: 5,
                }}
                name="chatbubble-ellipses-outline"
                color="#60C2E1"
                size={15}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={topicBoxStyle.detailBoxText}>Makenna Culhane </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <User name="user" color="#60C2E1" size={15} />
                  <Text style={topicBoxStyle.detailBoxText}>
                    {this.props.room.members.length}
                  </Text>
                </View>
                {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="chatbubble-ellipses-outline"
                    color="#60C2E1"
                    size={15}
                  />
                  <Text style={topicBoxStyle.detailBoxText}>23</Text>
                </View> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
