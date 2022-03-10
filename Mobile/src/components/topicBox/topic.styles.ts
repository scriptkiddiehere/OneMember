import {StyleSheet} from 'react-native';

export const topicBoxStyle = StyleSheet.create({
  card: {
    backgroundColor: '#F7F9FC',
    padding: 12,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E7E8EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBox: {},
  detailBoxText: {
    color: '#191A1C',
    fontFamily: 'p-400',
    fontSize: 14,
    lineHeight: 22,
  },
  imageGrid: {
    marginLeft: 10,
    marginVertical: 15,
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: 'lightgreen',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -10,
  },
  moreImage: {
    backgroundColor: '#D7D8DB',
    height: 40,
    width: 40,
    borderRadius: 100,
    borderWidth: 2,
    marginLeft: -10,
    borderColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
