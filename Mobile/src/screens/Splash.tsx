import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from '../styles/Welcome';

export default class Splash extends Component {
  render() {
    return (
      <View style={styles.splash}>
        <Image
          style={styles.splashLogo}
          source={require('../assets/img/logo.png')}
        />
        <Text style={styles.splashName}>OneMembr</Text>
      </View>
    );
  }
}
