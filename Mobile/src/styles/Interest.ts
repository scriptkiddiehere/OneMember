import {StyleSheet} from 'react-native';
import {height, width} from './dimension';

export const Intereststyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  users: {
    marginTop: 15,
    marginBottom: 60,
  },
  topicHeader: {
    fontFamily: 'p-500',
    fontSize: 17,
    lineHeight: 24,
    fontStyle: 'normal',
    color: '#191A1C',
  },
  interestSelected: {
    backgroundColor: '#2C9BCB',
    flexDirection: 'row',
    height: 45,
    width: 'auto',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestUnSelected: {
    borderWidth: 1,
    borderColor: '#D7D8DB',
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 45,
    width: 'auto',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestName: {
    fontSize: 14,
    fontFamily: 'p-400',
    fontStyle: 'normal',
    lineHeight: 24,
    // color: '#ffffff',
  },
  cross: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'p-500',
    fontStyle: 'normal',
    lineHeight: 24,
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
  },
  clearAllContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAll: {
    fontFamily: 'p-500',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'normal',
    color: '#191A1C',
  },
  proceedBtn: {
    // position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    width: '75%',
    backgroundColor: '#2C9BCB',
    height: 50,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'p-500',
    color: '#fff',
    fontSize: 18,
  },
});
