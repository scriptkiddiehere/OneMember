import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import baseUrl from './baseUrl';

export const sendOtp = async (phoneNumber: string) => {
  try {
    const res = await baseUrl.post('/sendOTP', {
      phoneNumber,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const signUp = async (data: any) => {
  console.log(data);

  try {
    const res = await baseUrl.post('/signUp', {
      ...data,
    });
    console.log(res);

    return res;
  } catch (error) {
    console.log(error.response);

    Toast.show({
      textBody: 'User already exist.please try to login',
      title: 'Sign Up',
      type: ALERT_TYPE.WARNING,
    });
    return;
  }
};
export const login = async (data: any, showError: boolean) => {
  try {
    const res = await baseUrl.post('/login', {
      ...data,
    });
    console.log(res.data);

    return res;
  } catch (error) {
    console.log('error', error.response.data);

    if (error.response.data.message === 'User not found' && showError) {
      Toast.show({
        textBody: 'User Does Not Exist,Create New Account',
        title: 'Sign Up',
        type: ALERT_TYPE.WARNING,
      });
    }
    return;
  }
};
export const fetchSuggestions = async (id: any) => {
  try {
    const res = await baseUrl.post('/suggestions', {
      userId: id,
      page: 1,
      records: 10,
    });
    return res;
  } catch (error) {
    if (error.response.data.message === 'User not found') {
      Toast.show({
        textBody: 'User Does Not Exist,Create New Account',
        title: 'Sign Up',
        type: ALERT_TYPE.WARNING,
      });
    }
    return;
  }
};
export const fetchUser = async (id: any, logUser: any) => {
  try {
    const res = await baseUrl.post('/fetchUser', {
      userToBeFetch: id,
      userId: logUser,
    });
    return res;
  } catch (error) {
    if (error.response.data.message === 'User not found') {
      Toast.show({
        textBody: 'User Does Not Exist,Create New Account',
        title: 'Sign Up',
        type: ALERT_TYPE.WARNING,
      });
    }
    return;
  }
};
export const interests = async (logUser: any) => {
  try {
    const res = await baseUrl.post('/allInterests', {
      userId: logUser,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const followUnfollow = async (
  logUser: any,
  userToFollowUnfollow: any,
  action: string,
) => {
  try {
    const res = await baseUrl.post('/followUnfollow', {
      userId: logUser,
      userToFollowUnfollow,
      action: action,
    });
    return res;
  } catch (error) {
    console.log(error.response.data);
    return error;
  }
};
export const createRoom = async (data: any) => {
  try {
    const res = await baseUrl.post('/createRoom', {
      ...data,
    });
    return res;
  } catch (error) {
    console.log(error.response.data);
    return error;
  }
};
export const updateInterests = async (logUser: any, interest: any) => {
  try {
    const res = await baseUrl.post('/updateInterests', {
      userId: logUser,
      interests: interest,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const fetchActiveRooms = async (logUser: any) => {
  try {
    const res = await baseUrl.post('/activeRooms', {
      userId: logUser,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const fetchUpcomingRooms = async (logUser: any) => {
  try {
    const res = await baseUrl.post('/upcomingEvents', {
      userId: logUser,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const fetchRoomById = async (id: any) => {
  try {
    const res = await baseUrl.post('/roomById', {
      roomId: id,
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
