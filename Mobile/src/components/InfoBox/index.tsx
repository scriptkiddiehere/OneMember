import React, {Component} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {InfoBoxStyle} from './info.style';
import user from '../../assets/img/user.png';

interface InfoBoxProps {
  following: any;
  name: string;
  about: string;
  navigation: any;
  id: any;
  route: any;
  logUser: any;
  suggestUserId: any;
  HandlefollowUnfollow: any;
  profileImg: any;
  handleFetchSuggestion: any;
}

export default class InfoBox extends Component<InfoBoxProps, {}> {
  constructor(props: InfoBoxProps) {
    super(props);
  }

  checkIfProfile = () => {
    const {profileImg} = this.props;
    if (profileImg) {
      return (
        <Image
          source={{
            uri: profileImg,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            borderWidth: 1.5,
            borderColor: '#939497',
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            borderWidth: 1.5,
            borderColor: '#939497',
            alignItems: 'center',
            justifyContent: 'center',
            // padding:2
          }}>
          <Image
            source={user}
            style={{
              width: '90%',
              height: '90%',
              borderRadius: 100,
              borderColor: '#939497',
              padding: 10,
            }}
          />
        </View>
      );
    }
  };
  render() {
    return (
      <Pressable
        onPress={() => {
          this.props.navigation.navigate('profile', {
            id: this.props.id,
            logUser: this.props.logUser,
            handleFetchSuggestion: this.props.handleFetchSuggestion,
          });
        }}
        style={InfoBoxStyle.infoWrap}>
        <View style={InfoBoxStyle.left}>
          {this.checkIfProfile()}
          <View style={InfoBoxStyle.info}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                maxWidth: 160,
                fontFamily: 'p-500',
                color: '#000',
              }}>
              {this.props.name}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                fontFamily: 'p-400',
                color: '#939497',
                textAlign: 'left',
                // width: '',
              }}>
              {this.props.about}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.HandlefollowUnfollow(
                this.props.suggestUserId,
                this.props.following == 1 ? 'unfollow' : 'follow',
              );
            }}
            style={{
              ...InfoBoxStyle.btn,
              backgroundColor: this.props.following == 1 ? '#1FBDBA' : '#fff',
              borderWidth: this.props.following == 1 ? 0 : 1.5,
            }}>
            <Text
              style={{
                fontFamily: 'p-500',
                textAlign: 'center',
                color: this.props.following == 1 ? '#fff' : '#000',
              }}>
              {this.props.following == 1 ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  }
}
