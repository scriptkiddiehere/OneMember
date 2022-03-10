import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AuthStack from './src/navigations/AuthStack';
import MainStack from './src/navigations/MainStack';
import { Provider, useSelector } from 'react-redux';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './src/redux/reducers';
import RootStack from './src/navigations/RootStack';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import SplashScreen from 'react-native-splash-screen';
import WebrtcCallHandler from './src/utils/WebrtcCallHandler';

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const store = createStore(reducers);

  const handleDynamicLink = (link: { url: string }) => {
    // Hanrdle dynamic link inside your own application
    if (link && link !== null) {
      console.log(link!.url);
      WebrtcCallHandler.deepLinkUrl = link!.url;

    }

  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    SplashScreen.hide();
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link !== null) {
          console.log("app.js", link!.url);

          WebrtcCallHandler.deepLinkUrl = link!.url;

        }
      });
  }, []);

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      <Provider store={store}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </Provider>
    </>
  );
};

export default App;
