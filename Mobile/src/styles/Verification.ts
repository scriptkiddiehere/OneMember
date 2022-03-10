import {StyleSheet} from 'react-native';
import {height, width} from './dimension';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  codeContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  codeBox: {
      width: '90%',
      paddingVertical: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  codecontent: {
      height: 55,
      borderWidth: 2,
      borderColor: '#2C9BCB',
      borderRadius: 6,
      fontFamily: 'p-600',
      fontStyle: 'normal',
      fontSize: 18,
      color: '#191A1C',
      alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#fff',
    width: width * 0.9,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  btnText: {
    fontFamily: 'p-500',
    color: '#fff',
    fontSize: 18,
  },
});
