import React, {Component} from 'react';
import {Image, Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../styles/Verification';
import Ion from 'react-native-vector-icons/Ionicons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {loginStyle} from '../styles/Login';
import smsRetriver from 'react-native-otp-verify';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {setAuth} from '../redux/actions';
interface VerificationProps {
  navigation: any;
  route: any;
  setAuth: any;
}

interface VerificationState {
  otp: any;
}
class Verification extends Component<VerificationProps, VerificationState> {
  otpInput: any;
  constructor(props: any) {
    super(props);
    this.state = {
      otp: '1234',
    };
  }
  componentDidMount() {
    smsRetriver.getHash().then(hash => {
      console.log(hash);
    });

    smsRetriver
      .getOtp()
      .then(() => {
        smsRetriver.addListener(this.otpHandler);
      })
      .catch(err => {
        console.log(err);
      });
    setTimeout(() => {
      this.otpInput.focusField(0);
    }, 200);
  }
  componentWillUnmount() {
    smsRetriver.removeListener();
  }
  otpHandler = (message: string) => {
    const otp = /(\d{4})/g.exec(message)[1];
    console.log('otp', otp);
    this.setState({otp: '1234'}, this.verifyOtp);
    Keyboard.dismiss();
  };

  verifyOtp = async () => {
    const {phoneNumber, to, _id, otp} = this.props.route.params;
    if (this.props.route.params.otp == this.state.otp && to == 'detail') {
      this.props.navigation.navigate('signup2', {
        phoneNumber,
      });
    } else if (this.props.route.params.otp == this.state.otp && to == 'home') {
      Toast.show({
        title: 'Welcome',
        textBody: 'Successfully Signed In',
        type: ALERT_TYPE.SUCCESS,
      });
      await AsyncStorage.setItem('_id', _id);
      console.log('success');
      this.props.setAuth(_id);
    } else {
      Toast.show({
        title: 'OTP',
        textBody: 'Invalid OTP',
        type: ALERT_TYPE.DANGER,
      });
      return;
    }
  };
  render() {
    return (
      <View style={styles.container}>
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
            Verification
          </Text>
        </View>
        <View style={styles.codeContainer}>
          <Text
            style={{
              color: '#939497',
              fontSize: 14,
              lineHeight: 22,
              fontFamily: 'p-400',
              fontStyle: 'normal',
            }}>
            Verify your account by entering 4 digit code.
          </Text>
          <View style={styles.codeBox}>
            <OTPInputView
              pinCount={4}
              ref={ref => (this.otpInput = ref)}
              code={this.state.otp}
              onCodeChanged={val => {
                this.setState({otp: val});
              }}
              onCodeFilled={() => {
                // this.verifyOtp();
              }}
              editable
              style={{
                width: '80%',
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.codecontent}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#191A1C',
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'p-400',
                fontStyle: 'normal',
              }}>
              Don't Get Code?{' '}
            </Text>
            <Text
              style={{
                color: '#2C9BCB',
                fontSize: 14,
                lineHeight: 22,
                fontFamily: 'p-400',
                fontStyle: 'normal',
              }}>
              {' '}
              Resend via Call
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            ...styles.startBtn,
            backgroundColor: '#1FBDBA',
          }}
          disabled={this.state.otp.length < 4}
          onPress={() => {
            this.verifyOtp();
          }}>
          <Text style={styles.btnText}>Verify</Text>
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
      </View>
    );
  }
}

export default connect(null, {setAuth})(Verification);
