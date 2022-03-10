import {StyleSheet} from 'react-native';
import {width} from '../../styles/dimension';

export const InfoBoxStyle = StyleSheet.create({
  infoWrap: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.45,
    // justifyContent: 'space-between',
  },
  info: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  btn: {
    borderWidth: 1.5,
    borderColor: '#939497',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
