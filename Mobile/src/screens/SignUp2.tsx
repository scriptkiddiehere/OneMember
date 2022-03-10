import React, {Component} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {loginStyle} from '../styles/Login';

import {connect} from 'react-redux';
import {setAuth} from '../redux/actions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Ion from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles/Verification';
import {signUp} from '../api/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import DatePicker from 'react-native-date-picker';

interface loginProps {
  setAuth: any;
  navigation: any;
  route: any;
}
interface loginState {
  checked: boolean;
  username: string;
  fullName: string;
  showDate: boolean | null;
  setDate: any;
}

GoogleSignin.configure({
  webClientId:
    '997711395093-66p4stfe0ch866pnu02ia5rpunbph8r4.apps.googleusercontent.com',
});
class SignUp2 extends Component<loginProps, loginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: false,
      username: '',
      fullName: '',
      setDate: new Date(),
      showDate: null,
    };
  }
  toggleCheckBox = () => {
    this.setState({checked: !this.state.checked});
  };

  handleLogin = async () => {
    const {phoneNumber} = this.props.route.params;
    const values = {
      loginVia: 'mobile',
      phoneNumber,
      username: this.state.username,
      name: this.state.fullName,
      dob: new Date(this.state.setDate).getTime(),
    };
    const res = await signUp(values);
    console.log(res?.data);

    if (res?.data && res.data.data._id) {
      await AsyncStorage.setItem('_id', res.data.data._id);
      this.props.setAuth(res.data.data._id);
      Toast.show({
        title: 'Sign Up',
        textBody: 'Account Created Successfully',
        type: ALERT_TYPE.SUCCESS,
      });
    }
  };

  handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = auth().signInWithCredential(googleCredential);
      console.log(res);
    } catch (error) {
      console.log(error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else {
        return;
      }
    }
  };
  render() {
    console.log(this.state.setDate);
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={65}
        style={loginStyle.container}>
        <View style={styles.header}>
          <Ion
            name="chevron-back"
            size={22}
            color={'black'}
            style={styles.back}
            onPress={() => {
              this.props.navigation.pop();
            }}
          />
          <Text
            style={{
              color: '#191A1C',
              fontSize: 20,
              lineHeight: 28,
              fontFamily: 'p-500',
              fontStyle: 'normal',
            }}>
            Details
          </Text>
        </View>
        <View style={loginStyle.formWrap}>
          <View style={loginStyle.inputBox}>
            <TextInput
              style={loginStyle.input}
              placeholderTextColor={'lightgrey'}
              maxLength={16}
              onChangeText={val => {
                this.setState({username: val});
              }}
              placeholder="username"
            />
          </View>
          <View style={loginStyle.inputBox}>
            <TextInput
              style={loginStyle.input}
              onChangeText={val => {
                this.setState({fullName: val});
              }}
              placeholderTextColor={'lightgrey'}
              placeholder="Full Name"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({showDate: !this.state.showDate});
            }}
            style={{
              ...loginStyle.inputBox,
              paddingVertical: 16,
              paddingHorizontal: 10,
            }}>
            <>
              <Text
                style={{
                  color: '#000',
                }}>
                {!this.state.setDate
                  ? 'YYYY/DD/MM'
                  : `${new Date(
                      this.state.setDate,
                    ).getUTCFullYear()}/${new Date(
                      this.state.setDate,
                    ).getDate()}/${
                      new Date(this.state.setDate).getUTCMonth() + 1
                    }`}
              </Text>
            </>
            {this.state.showDate ? (
              <DatePicker
                maximumDate={new Date()}
                modal={true}
                open={this.state.showDate}
                onConfirm={date => {
                  this.setState({showDate: false, setDate: date});
                }}
                onCancel={() => {
                  this.setState({showDate: false});
                }}
                mode="date"
                date={this.state.setDate}
                onDateChange={(date: any) => {
                  console.log(date);
                }}
              />
            ) : null}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={this.handleLogin}
          disabled={
            !this.state.fullName || !this.state.setDate || !this.state.username
          }
          style={{
            ...styles.startBtn,
            backgroundColor: '#1FBDBA',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Text style={{...styles.btnText, color: '#fff'}}>Sign Up</Text>
        </TouchableOpacity>
        <View style={loginStyle.note}>
          <Text
            style={{
              fontFamily: 'p-500',
              color: '#000',
            }}>
            Already member?
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('login');
            }}>
            <Text
              style={{
                fontFamily: 'p-500',
                color: '#1FBDBA',
                marginLeft: 3,
              }}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(null, {setAuth})(SignUp2);
