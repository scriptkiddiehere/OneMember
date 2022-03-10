import {StyleSheet} from 'react-native';
import {width} from './dimension';

export const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  logoWrap: {
    width: width,
  },

  formWrap: {
    width: '100%',
    marginTop: 40,
  },
  inputBox: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E7E8EB',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  input: {
    fontFamily: 'p-400',
    fontSize: 15,
    color: '#000',
  },

  optionWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  orLine: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '35%',
    borderRadius: 10,
  },
  socialLoginWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcons: {
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  note: {
    width,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
