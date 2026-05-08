import React, {useEffect, useRef} from 'react';
import PushNotification, {Importance} from 'react-native-push-notification';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screen/splash/Splash';
import config from '../config';
import { goToRoute } from './NavigationRef';


export const LocalNotification = () => {
  console.log('NOTI');
  PushNotification.localNotification({
    channelId: 'anasabuyer',
    autoCancel: true,
    bigText:
      'This is local notification demo in React Native app. Only shown, when expanded.',
    subText: 'Local Notification Demo',
    title: 'Local Notification Title',
    message: 'Expand me to see more',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: '["Yes", "No"]',
  });
};
export const LocalScheduleNotification = (
  id,
  time,
  title,
  message,
  action,
  data
) => {
  console.log('NOTISCHEDULE with id ' + id);
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: JSON.stringify(id),
    title: title,
    data: {body: message, click_action: action, click_data: data, title: title},
    message: message, // (required)
    date: new Date(Date.now() + time), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    onlyAlertOnce: true,
    playSound: true,
    soundName: 'default',
    channelId: 'anasabuyer',
    autoCancel: true,

    /* Android Only Properties */
    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
  });
};
export const getScheduleNotification = () => {
  PushNotification.getScheduledLocalNotifications(info =>
    console.log('ffffffffffff', info),
  );
};

export const CancelLocalNotifications = id => {
  console.log('NOTISCHEDULE cancel with id ' + JSON.stringify(id));
  PushNotification.cancelLocalNotification(JSON.stringify(id));
};
const storeFirebaseTokenApi = async fcmToken => {
  await AsyncStorage.setItem('fcmToken', JSON.stringify(fcmToken));

};


const PushController = props => {
  const permissionRequested = useRef(false); // Prevent duplicate requests

  useEffect(() => {
    PushNotification.subscribeToTopic('app-all');

    // Only request permission once
    if (!permissionRequested.current) {
      permissionRequested.current = true;
      requestNotificationPermission();
    }

    //PushNotificationIOS.addEventListener('notification', onRemoteNotification);

    PushNotification.createChannel(
      {
        channelId: 'anasabuyer', // (required)
        channelName: 'Anasa Buyer', // (required)
        channelDescription: 'Anasa Buyer Notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.getChannels(function (channel_ids) {
      console.log('channel_ids', channel_ids); // ['channel_id_1']
    });
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('PushController Token:', token.token);
        storeFirebaseTokenApi(token.token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('PushNoti:', notification);

        if (notification.foreground) {


          //showAlert(notification.title, notification.body);
        } else {

          let type = notification.data.type;
          if (type == 'Booking') {
            setTimeout(function () {
              goToRoute(config.routes.BOOKING_DETAILS,{booking_id:notification.data.bookingId});

            }, 3100);

          }else if(type == 'AdminReply'){
            setTimeout(function () {
              goToRoute(config.routes.CHAT_SCREEN,{ticket_id:notification?.data?.ticket_id});

            }, 3100);

          }else if(type == 'ProceedPayment'){
            setTimeout(function () {
              goToRoute(config.routes.CREATE_SERVICE_REQUEST,{request_id:notification?.data?.eventId});

            }, 3100);
          }

        }
        AsyncStorage.setItem('notification_status', 'true');

        // required on iOS only
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: '753155372306',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);
  const requestNotificationPermission = async() => {
    try {
      const res = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (res === 'granted') {

        console.log('You can use notification');
      } else if (res === 'denied') {

        const res2 = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (res2 === 'blocked') {
          alert('Please enable notification permission from app setting');
        }
        console.log('res', res2);
      } else if (res === 'blocked') {
        alert('Please enable notification permission from app setting');
      }
    } catch (err) {
      console.warn(err);
    }
    };
  return <Splash {...props} />;
};

export default PushController;
