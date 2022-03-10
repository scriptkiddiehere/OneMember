import {StyleSheet} from 'react-native';
import {width} from '../../styles/dimension';

export const infoStyle = StyleSheet.create({
  wrap: {
    width: width * 0.9,
    paddingVertical: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    borderColor: '#E7E8EB',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
  },
});
