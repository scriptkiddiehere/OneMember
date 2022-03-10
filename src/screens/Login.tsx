import React, { Component } from "react";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "../styles/login";
export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.getStartModal}
        >
          <Text>Welcome</Text>
        </LinearGradient>
      </View>
    );
  }
}
