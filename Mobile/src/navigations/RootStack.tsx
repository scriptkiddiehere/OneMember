import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {connect, useSelector} from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAuth, setUser} from '../redux/actions';
import Loader from '../components/Loader';
import {fetchUser} from '../api/apis';
// import SplashScreen from 'react-native-splash-screen'

function RootStack(props: any) {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const {rootReducer} = useSelector(state => state);
  useEffect(() => {
    getItem();
  }, []);
  const getItem = async () => {
    setLoading(true);
    const _id = await AsyncStorage.getItem('_id');
    props.setAuth(_id);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  // SplashScreen.hide();

  if (loading) {
    return <Loader />;
  }
  return <>{rootReducer.id ? <MainStack /> : <AuthStack />}</>;
}

export default connect(null, {setAuth, setUser})(RootStack);
