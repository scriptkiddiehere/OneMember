import {StyleSheet} from 'react-native';
import {height, width} from './dimension';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  getStartModal: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // height: height * 0.47,
    flex: 1,
    width: width,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'p-500',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    color: '#fff',
    fontFamily: 'p-300',
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
    color: '#2C9BCB',
    fontSize: 18,
  },
  avatarAnimation: {
    height: height * 0.48,
    overflow: 'hidden',
  },
  avatar: {
    width: width / 3.5,
    height: width / 3.5,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#f5f5f5',
    marginHorizontal: 10,
  },
  splash: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 100,
    height: 100,
  },
  splashName: {
    fontFamily: 'p-500',
    marginTop: 8,
    fontSize: 20,
    color: '#000',
  },
});
