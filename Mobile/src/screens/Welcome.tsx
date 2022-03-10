import React, {Component} from 'react';
import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../styles/Welcome';

import p1 from '../assets/img/p1.png';
import p2 from '../assets/img/p2.png';
import p3 from '../assets/img/p3.png';
import p7 from '../assets/img/p7.png';
import p5 from '../assets/img/p5.png';
import p6 from '../assets/img/p6.png';
import p4 from '../assets/img/p4.png';
import p8 from '../assets/img/p8.png';
import p9 from '../assets/img/p9.png';
import p10 from '../assets/img/p10.png';
import p11 from '../assets/img/p11.png';
import p12 from '../assets/img/p12.png';
import p13 from '../assets/img/p13.png';
import {height} from '../styles/dimension';

interface WelcomeProps {
  navigation: any;
}
export default class Welcome extends Component<WelcomeProps, {}> {
  scrollView: any;
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          // flex: 1,
          minHeight: height,
        }}>
        <View style={styles.container}>
          <View style={styles.avatarAnimation}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal
              ref={ref => (this.scrollView = ref)}>
              <Image source={p1} style={styles.avatar} />
              <Image source={p2} style={styles.avatar} />
              <Image source={p3} style={styles.avatar} />
              <Image source={p7} style={styles.avatar} />
              <Image source={p5} style={styles.avatar} />
              <Image source={p6} style={styles.avatar} />
            </ScrollView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal
              ref={ref => (this.scrollView = ref)}>
              <Image source={p13} style={styles.avatar} />
              <Image source={p12} style={styles.avatar} />
              <Image source={p9} style={styles.avatar} />
              <Image source={p10} style={styles.avatar} />
              <Image source={p4} style={styles.avatar} />
              <Image source={p8} style={styles.avatar} />
            </ScrollView>
            <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal
              ref={ref => (this.scrollView = ref)}>
              <Image source={p11} style={styles.avatar} />
              <Image source={p13} style={styles.avatar} />
              <Image source={p7} style={styles.avatar} />
              <Image source={p9} style={styles.avatar} />
              <Image source={p7} style={styles.avatar} />
              <Image source={p10} style={styles.avatar} />
            </ScrollView>
          </View>
          <LinearGradient
            style={styles.getStartModal}
            colors={['#2C9BCB', '#1FBDBA']}>
            <Text style={styles.title}>Welcome</Text>
            <Text ellipsizeMode="clip" style={styles.subtitle}>
              OneMembr is a safe space on the internet where you can join or
              start a conversation, establishing a culture of inclusivity. Host
              a room of your own, meet amazing people, discover rooms with
              fascinating conversations, listen-in and share your thoughts.
              OneMembr is all about people sharing their amazing culture around
              the world.
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => {
                this.props.navigation.navigate('login');
              }}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}
