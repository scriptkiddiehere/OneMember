import {StyleSheet} from 'react-native';
import {height, width} from './dimension';

export const userSuggestionStyle = StyleSheet.create({
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
    marginBottom: 70,
  },

  proceedBtn: {
    position: 'absolute',
    bottom: 0,
    width: width,
    elevation: 40,
    backgroundColor: '#fff',
    height: 70,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
