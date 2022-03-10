import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import {useSelector} from 'react-redux';
import SignUp from '../screens/SignUp';
import SignUp2 from '../screens/SignUp2';
import Verification from '../screens/Verification';
import {Root} from 'react-native-alert-notification';
import Interest from '../screens/Interest';

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Root theme="dark">
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={SignUp} />
        <Stack.Screen name="signup2" component={SignUp2} />
        <Stack.Screen name="otp" component={Verification} />
      </Stack.Navigator>
    </Root>
  );
};

export default AuthStack;
