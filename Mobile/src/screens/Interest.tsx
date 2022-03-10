import React, {Component} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBox from '../components/SearchBox';
import {Intereststyles} from '../styles/Interest';
import Fa from 'react-native-vector-icons/FontAwesome';
import {height, width} from '../styles/dimension';
import {interests, updateInterests} from '../api/apis';
import Loader from '../components/Loader';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../styles/Welcome';

interface InterestProps {
  state: any;
  navigation: any;
  route: any;
}

interface InterestState {
  interests: any;
  loading: boolean;
  selectedItems: string[];
}

class Interest extends Component<InterestProps, InterestState> {
  constructor(props: InterestProps) {
    super(props);
    this.state = {
      interests: [],
      selectedItems: [],
      loading: false,
    };
    this.toggleSelected = this.toggleSelected.bind(this);
    this.proceed = this.proceed.bind(this);
  }
  async componentDidMount() {
    const {id} = this.props.state.rootReducer;
    this.setState({loading: true});
    const res = await interests(id);
    this.setState({interests: res?.data.data});
    var selectedInterest: any[] = [];
    for (const interestCategory of res.data.data) {
      for (const eachInterest of interestCategory.interests) {
        if (eachInterest.isSelected === 1) {
          selectedInterest.push(eachInterest._id);
        }
      }
    }
    this.setState({selectedItems: selectedInterest});

    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
  }
  toggleSelected(interest: any) {
    if (this.state.selectedItems.includes(interest._id)) {
      this.setState({
        selectedItems: [
          ...this.state.selectedItems.filter(
            (eachInterest: any) => eachInterest !== interest._id,
          ),
        ],
      });
    } else {
      this.state.selectedItems.push(interest._id);
      this.setState({selectedItems: [...this.state.selectedItems]});
    }
  }

  async proceed() {
    const {id} = this.props.state.rootReducer;
    this.setState({loading: true});
    const res = await updateInterests(id, this.state.selectedItems);
    await AsyncStorage.setItem('interest', 'true');
    this.setState({loading: false});
    this.props.navigation.navigate('userSuggest');
  }

  render() {
    const {id} = this.props.state.rootReducer;
    console.log(id);

    if (this.state.loading) {
      <Loader />;
    }

    return (
      <View style={Intereststyles.container}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: height * 0.17,
          }}>
          <View style={Intereststyles.header}>
            <Fa name="angle-left" size={30} color={'#000'} />
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'p-500',
                  fontSize: 20,
                  color: '#000',
                }}>
                Interest
              </Text>
            </View>
          </View>
          <SearchBox placeholder="Find Interest" />
        </View>

        {this.state.loading ? (
          <ActivityIndicator
            style={{
              marginTop: 50,
            }}
            size={'large'}
          />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={Intereststyles.users}>
              {this.state.interests.map((topic: any) => {
                return (
                  <View
                    key={topic.name}
                    style={{
                      marginVertical: 15,
                    }}>
                    <Text style={Intereststyles.topicHeader}>{topic.name}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 10,
                        maxWidth: width * 4,
                      }}>
                      {topic.interests.map((t: any) => {
                        return (
                          <TouchableOpacity
                            key={t._id}
                            style={
                              !this.state.selectedItems.includes(t._id)
                                ? {...Intereststyles.interestUnSelected}
                                : {...Intereststyles.interestSelected}
                            }
                            onPress={() => {
                              this.toggleSelected(t);
                            }}>
                            {/* {console.log(t.isSelected)} */}
                            <Text
                              style={
                                !this.state.selectedItems.includes(t._id)
                                  ? {
                                      ...Intereststyles.interestName,
                                      color: '#191A1C',
                                    }
                                  : {
                                      ...Intereststyles.interestName,
                                      color: '#fff',
                                    }
                              }>
                              {t.name}
                            </Text>
                            {this.state.selectedItems.includes(t._id) ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.toggleSelected(t);
                                }}>
                                <Text style={Intereststyles.cross}>X</Text>
                              </TouchableOpacity>
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                display: 'flex',
                backgroundColor: '#fff',
                width: width,
                elevation: 10,
                position: 'absolute',
                bottom: 0,
                height: 70,
                paddingHorizontal: 30,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                  // width: '50%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({selectedItems: []});
                  }}>
                  <Text
                    style={{
                      fontFamily: 'p-500',
                      fontSize: 16,
                      lineHeight: 24,
                      fontStyle: 'normal',
                      color: '#191A1C',
                    }}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    ...styles.startBtn,
                    width: width * 0.6,
                    backgroundColor: '#2C9BCB',
                  }}
                  onPress={() => {
                    this.proceed();
                  }}>
                  <Text style={{...styles.btnText, color: '#fff'}}>
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    state,
  };
};
export default connect(mapStateToProps, {})(Interest);
