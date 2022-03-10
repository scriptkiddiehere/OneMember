import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserSuggestion from '../screens/UserSuggestion';
import TopicAndSuggestion from '../screens/TopicAndPeople';
import RoomScreen from '../screens/RoomScreen';
import Profile from '../screens/Profile';
import Interest from '../screens/Interest';
import {Root} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState(null);
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    getItem();
  }, []);
  const getItem = async () => {
    setLoading(true);
    const _suggestion = await AsyncStorage.getItem('suggestion');
    const _interest = await AsyncStorage.getItem('interest');
    setInterest(_interest);
    setSuggestion(_suggestion);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <Root>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!interest ? (
          <Stack.Screen name="interest" component={Interest} />
        ) : null}
        {!suggestion ? (
          <Stack.Screen name="userSuggest" component={UserSuggestion} />
        ) : null}
        <Stack.Screen name="topic" component={TopicAndSuggestion} />
        <Stack.Screen name="roomscreen" component={RoomScreen} />
        <Stack.Screen name="profile" component={Profile} />
      </Stack.Navigator>
    </Root>
  );
};

export default MainStack;
