import {StyleSheet} from 'react-native';
import {width} from './dimension';

export const topicAndPeopleStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContainer: {
    width: width * 0.6,
    paddingVertical: 10,
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  headerText: {
    fontFamily: 'p-600',
    // fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    color: '#000',
  },
  modalWrap: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalPicWrap: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'lightgrey',
  },
  modalPen: {
    position: 'absolute',
    bottom: 8,
    left: 88,
    zIndex: 100,
  },
  actions: {
    flexDirection: 'row',
  },
  chooseType: {
    backgroundColor: '#F7F9FC',
    width: '70%',
    borderRadius: 16,
    height: 60,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  typeOption: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
