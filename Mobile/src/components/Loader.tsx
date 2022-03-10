import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export default function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <ActivityIndicator color={'#2C9BCB'} size={'large'} />
    </View>
  );
}
