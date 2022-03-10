import { Dimensions } from 'react-native';
import MeetingHandler from 'com.vanimeeting.demo';
const {height, width} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

var EventEmitter = require('events');

class WebrtcCallHandler {
  static instance : WebrtcCallHandler | null = new WebrtcCallHandler();
   static deepLinkUrl? : string;
  meetingRequest: any;
  messages: never[];
  eventEmitter: any;

  static getInstance() {
    if (WebrtcCallHandler.instance === null) {
      WebrtcCallHandler.instance = new WebrtcCallHandler();
    }
    return WebrtcCallHandler.instance;
  }

  constructor() {
    this.getMeetingRequest = this.getMeetingRequest.bind(this);
    this.meetingRequest = null;
    this.messages = [];
    this.eventEmitter = new EventEmitter();
    // this.updateArchieveMessages = this.updateArchieveMessages.bind(this);

    // this.sendMessage = this.sendMessage.bind(this);
    // this.onNewChatMessageReceived = this.onNewChatMessageReceived.bind(this);

  }
  cleanUp() {
    // WebrtcCallHandler.getInstance().removeExtraListener(
    //   'onNewChatMessageReceived',
    //   this.onNewChatMessageReceived,
    // );
    this.getMeetingHandler().endAndDestory();
    this.meetingRequest = null;
    this.eventEmitter.removeAllListeners();
    this.eventEmitter = null;
    WebrtcCallHandler.instance = null;
  }

  async setup(roomId : string, userId : string, userData : any , isAdmin : boolean , userType : string) {

    if (this.meetingRequest == null) {
      this.meetingRequest = this.getMeetingHandler().meetingStartRequestObject(
        roomId,
        userId,
       "OneMembr"
      );
      this.meetingRequest.isMobileApp = true;
      this.meetingRequest.numberOfUsers = 12;
      this.meetingRequest.isAdmin = isAdmin;
      userData.joiningTime = new Date().getTime()
      userData.userType = userType;
      this.meetingRequest.userData = userData;
      this.meetingRequest.wssUrl = "wss://meetingserver.onemembr.com/?connection=";
      this.meetingRequest.apiData = {}
      this.meetingRequest.apiData.data = {roomId : roomId , userId : userData._id}
      this.meetingRequest.apiData.userLeftUrl = "https://api.onemembr.com/api/leaveRoom"
      // this.meetingRequest.videoCaptureHeight = height / 2;
      // this.meetingRequest.videoCaptureWidth = width / 2;
      // WebrtcCallHandler.getInstance().addExtraListenerWithForcefullyAdded(
      //   'onNewChatMessageReceived',
      //   this.onNewChatMessageReceived,
      //   true,
      // );
    }
  }


  getMeetingHandler() {
    return MeetingHandler;
  }

  getMeetingRequest() {
    return this.meetingRequest;
  }

  addExtraListener(event: any, listner: any) {
    if (WebrtcCallHandler.getInstance().getMeetingHandler() != null) {
      if (
        WebrtcCallHandler.getInstance()
          .getMeetingHandler()
          .eventEmitter.listenerCount(event) > 0
      ) {
        return;
      }
      WebrtcCallHandler.getInstance()
        .getMeetingHandler()
        .eventEmitter.on(event, listner);
    }
  }

  addExtraListenerWithForcefullyAdded(event: string, listner: any, forceFullyAdd: boolean) {
    if (forceFullyAdd === false) {
      this.addExtraListener(event, listner);
      return;
    }
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .eventEmitter.on(event, listner);
  }

  removeExtraListener(event: string, listner: any) {
    WebrtcCallHandler.getInstance()
      .getMeetingHandler()
      .eventEmitter.off(event, listner);
  }

  // sendMessage(message: string | any[]) {
  //   if (message.length > 0) {
  //     let messagePayload = WebrtcCallHandler.getInstance()
  //       .getMeetingHandler()
  //       .newMessageObject('all', message);
  //     WebrtcCallHandler.getInstance()
  //       .getMeetingHandler()
  //       .sendMessage(messagePayload);
  //     messagePayload.participant = WebrtcCallHandler.getInstance()
  //       .getMeetingHandler()
  //       .participantByUserId(messagePayload.sender);
  //     messagePayload.id = this.messages.length + '';

  //     this.messages.unshift(messagePayload);
  //     this.sendMessageToAPI(message);
  //   }

  //   return this.messages;
  // }

  // async sendMessageToAPI(message: any) {
  //   const data = {
  //     body: message,
  //     clientId: this.appointment.clientId,
  //     counsellorId: this.appointment.counsellorId,
  //     appointmentId: this.appointment.id,
  //     senderId: this.getMeetingRequest().userData.id,
  //   };

  //   this.saveChatMethod(data);
  // }
}

export default WebrtcCallHandler;
