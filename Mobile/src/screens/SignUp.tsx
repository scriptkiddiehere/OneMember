import React, {Component} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {loginStyle} from '../styles/Login';
import Logo from '../assets/img/logo.png';
import {width} from '../styles/dimension';
import CheckBox from '@react-native-community/checkbox';
import {styles} from '../styles/Welcome';
import fb from '../assets/img/fb.png';
import google from '../assets/img/google.png';
import twitter from '../assets/img/twitter.png';
import Fa from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {setAuth} from '../redux/actions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {CallingCodePicker} from '@digieggs/rn-country-code-picker';
import baseUrl from '../api/baseUrl';
import {login, sendOtp} from '../api/apis';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

interface loginProps {
  setAuth: any;
  navigation: any;
}
interface loginState {
  checked: boolean;
  number: string;
  cCode: string;
  loading: boolean;
}

GoogleSignin.configure({
  webClientId:
    '997711395093-66p4stfe0ch866pnu02ia5rpunbph8r4.apps.googleusercontent.com',
});
class SignUp extends Component<loginProps, loginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      checked: false,
      number: '',
      cCode: '',
      loading: false,
    };
  }
  toggleCheckBox = () => {
    this.setState({checked: !this.state.checked});
  };

  handleLogin = async () => {
    try {
      this.setState({loading: true});
      const number = `+${this.state.cCode}${this.state.number}`;
      const loginRes = await login({username: number}, false);

      if (!loginRes?.data) {
        // const res = await sendOtp(number);
        const res = {data: {isSuccess: true}};
        if (res.data.isSuccess) {
          this.props.navigation.navigate('otp', {
            otp: '1234',
            phoneNumber: number,
            to: 'detail',
          });
          this.setState({loading: false});
        }
        console.log(res.data);
      } else {
        Toast.show({
          textBody: 'User Already Exist,Please Login',
          title: 'Sign Up',
          type: ALERT_TYPE.WARNING,
        });
        this.setState({loading: false});
        return;
      }
    } catch (error) {
      console.log(error.response);
      this.setState({loading: false});
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
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={65}
        style={loginStyle.container}>
        <View style={loginStyle.logoWrap}>
          <Fa
            onPress={() => {
              this.props.navigation.pop();
            }}
            name="angle-left"
            size={30}
            color={'#000'}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            width: width * 0.8,
          }}>
          <Text
            style={{
              fontSize: 30,
              color: '#2C9BCB',
              fontFamily: 'p-500',
            }}>
            Sign Up
          </Text>
          {/* <Text
            style={{
              fontFamily: 'p-400',
              color: '#000',
            }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor,
            deleniti?
          </Text> */}
        </View>
        <View style={loginStyle.formWrap}>
          <View
            style={{
              ...loginStyle.inputBox,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CallingCodePicker
              initialCountryCode="IN"
              onValueChange={val => {
                this.setState({cCode: val});
              }}
            />
            <TextInput
              style={{...loginStyle.input, flex: 1}}
              value={this.state.number}
              onChangeText={num => {
                this.setState({number: num});
              }}
              keyboardType="number-pad"
              placeholder="Phone Number"
              placeholderTextColor={'lightgrey'}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={
            !this.state.loading
              ? this.handleLogin
              : () => {
                  return;
                }
          }
          disabled={this.state.number.length < 10}
          style={{
            ...styles.startBtn,
            backgroundColor: '#1FBDBA',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Text style={{...styles.btnText, color: '#fff'}}>
            {this.state.loading ? 'Sending OTP...' : 'Proceed'}
          </Text>
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

export default connect(null, {setAuth})(SignUp);
