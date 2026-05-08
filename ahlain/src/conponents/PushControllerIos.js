import React, {useEffect} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screen/splash/Splash';
import {goToRoute} from './NavigationRef';
import config from '../config';

export const CancelLocalNotificationsIOS = id => {
  console.log('NOTISCHEDULE cancel with id ' + JSON.stringify(id));
  PushNotificationIOS.removePendingNotificationRequests([JSON.stringify(id)]);
};
const PushControllerIos = props => {
  useEffect(() => {
    requestNotificationPermission();
    registeredNotificationEvent();
    //checkFcmPermission();

    return () => {
      PushNotificationIOS.removeEventListener('register');
      PushNotificationIOS.removeEventListener('registrationError');
      PushNotificationIOS.removeEventListener('notification');
      PushNotificationIOS.removeEventListener('localNotification');
    };
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage((remoteMessage) => {
  //     console.log("handle in foreground", remoteMessage)
  //     const { notification, messageId } = remoteMessage
  //     PushNotificationIOS.addNotificationRequest({
  //       id: messageId,
  //       body: notification.body,
  //       title: notification.title,
  //       sound: 'default'
  //     });
  //   })
  //   return unsubscribe
  // }, [])

  const getTokenFromFirebase = async () => {
    // messaging().setAPNSToken('app-all')
    await messaging()
      .getToken()
      .then(token => {
        console.log('firebase ios token', token);
        storeFirebaseTokenApi(token);
      });
    // PushNotificationIOS.addNotificationRequest({
    //   id: '12',
    //   body: 'notification.body',
    //   title: 'notification.title',
    //   subtitle: 'notification.tsubitle',
    //   sound: 'default',
    //   fireDate:new Date(Date.now()+10000)
    // });

    messaging()
      .subscribeToTopic('app-all')
      .then(() => console.log('Subscribed to topic with ios!'));
  };
  const requestNotificationPermission = () => {
    PushNotificationIOS.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
      critical: true,
    }).then(
      data => {
        getTokenFromFirebase();
        console.log('PushNotificationIOS.requestPermissions', data);
      },
      data => {
        console.log('PushNotificationIOS.requestPermissions failed', data);
      },
    );
  };

  const registeredNotificationEvent = () => {
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener(
      'registrationError',
      onRegistrationError,
    );
    PushNotificationIOS.addEventListener('notification', onRemoteNotification);
    PushNotificationIOS.addEventListener(
      'localNotification',
      onLocalNotification,
    );
  };

  const storeFirebaseTokenApi = async fcmToken => {
    await AsyncStorage.setItem('fcmToken', JSON.stringify(fcmToken));
  };
  const onRegistered = deviceToken => {
    console.log('deviceTokenIOS', deviceToken);
  };

  const onRegistrationError = error => {
    console.log('error', error);
  };

  const onLocalNotification = notification => {
    console.log('local notification', notification);
    // let click_action = notification.data.click_action;
    // let click_data = notification.data.click_data;
  };
  const onRemoteNotification = notification => {
    const isClicked = notification.getData().userInteraction === 1;
    AsyncStorage.setItem('notification_status', 'true');

    if (isClicked) {
      // Navigate user to another screen
      let type = notification?.getData()?.type;
      if (type == 'Booking') {
        setTimeout(function () {
          goToRoute(config.routes.BOOKING_DETAILS, {
            booking_id: notification?.getData()?.bookingId,
          });
        }, 3100);
      } else if (type == 'AdminReply') {
        setTimeout(function () {
          goToRoute(config.routes.CHAT_SCREEN, {
            ticket_id: notification?.getData()?.ticket_id,
          });
        }, 3100);
      } else if (type == 'ProceedPayment') {
        setTimeout(function () {
          goToRoute(config.routes.CREATE_SERVICE_REQUEST, {
            request_id: notification?.getData()?.eventId,
          });
        }, 3100);
      }
    } else {
      // Do something else with push notification
    }
  };

  return <Splash {...props} />;
};

export default PushControllerIos;
