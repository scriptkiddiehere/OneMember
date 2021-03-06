import {StyleSheet} from 'react-native';
import {height, width} from './dimension';

export const styles = StyleSheet.create({
  background: {
    height: height * 0.3,
    width: width,
  },
  usercontent: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  user: {
    position: 'absolute',
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'grey',
    top: -50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    marginTop: 60,
    fontSize: 18,
    fontFamily: 'p-600',
    fontStyle: 'normal',
    lineHeight: 26,
    color: '#191A1C',
  },
  userstatus: {
    fontSize: 14,
    color: '#939497',
    fontFamily: 'p-400',
    fontStyle: 'normal',
    lineHeight: 22,
  },
  maincontent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    alignItems: 'center',
  },
  followBox: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#E7E8EB',
    paddingVertical: 10,
    paddingHorizontal: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  followContent: {
    alignItems: 'center',
  },
  followdetail: {
    color: '#46B5DD',
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'p-500',
    fontStyle: 'normal',
  },
  seperator: {
    height: '80%',
    borderWidth: 1,
    borderColor: '#E7E8EB',
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  statusContainer: {
    marginTop: 10,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    // borderWidth: 2,
    paddingHorizontal: 30,
  },
  status: {
    color: '#191A1C',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'p-400',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  followButton: {
    width: 150,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2C9BCB',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  follow: {
    fontSize: 16,
    color: '#2C9BCB',
    fontFamily: 'p-500',
    fontStyle: 'normal',
    lineHeight: 24,
  },
});
