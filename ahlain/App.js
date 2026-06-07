import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
import {Linking, Platform, StatusBar, AppState} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './src/config/store';
import Apploader from './src/conponents/AppLoader';
import RootNavigation from './src/navigation/RootNavigation';
import './src/translations/index';
import config from './src/config';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {trackEvents} from './src/config/FCMEvents';
import {hydratePartyMetaCache} from './src/utils/partyHelpers';
import {bootstrapAppLanguage} from './src/utils/languageHelpers';

const App = () => {
  const appState = useRef(AppState.currentState);
  const [languageReady, setLanguageReady] = useState(false);

  if (__DEV__ && global.ErrorUtils?.setGlobalHandler) {
    const defaultHandler = global.ErrorUtils.getGlobalHandler?.();
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      // Log full stack to help identify blank-screen crashes in dev
      console.error(error?.stack || error);
      defaultHandler?.(error, isFatal);
    });
  }

  useEffect(() => {
    bootstrapAppLanguage()
      .catch(error => {
        console.log('Language bootstrap error:', error);
      })
      .finally(() => {
        setLanguageReady(true);
      });
  }, []);

  useEffect(() => {
    hydratePartyMetaCache();
  }, []);

  // Handle app lifecycle to prevent crash on background resume
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        console.log('App resumed from background');
        crashlytics().log('App resumed from background');
        
        // Track app resume event
        trackEvents('app_resume', {
          platform: Platform.OS,
          previousState: appState.current,
        });
      } else if (nextAppState === 'background') {
        // App is going to background
        console.log('App going to background');
        crashlytics().log('App going to background');
      }

      appState.current = nextAppState;
      console.log('AppState:', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    try {
      crashlytics().setCrashlyticsCollectionEnabled(true).catch(e => console.log('Crashlytics init error:', e));
      crashlytics().log('App mounted.').catch(e => console.log('Crashlytics log error:', e));
      trackEvents('app_launch', {
        platform: Platform.OS,
      }).catch(e => console.log('Analytics init error:', e));
    } catch (error) {
      console.log('App initialization error:', error);
    }
  }, []);
  const getQueryParam = (url, param) => {
    const regex = new RegExp(`[?&]${param}=([^&]+)`);
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app

      const initialUrl = await Linking.getInitialURL();
      console.log('initialUrl', initialUrl);
      if (initialUrl) {
        const serviceId = getQueryParam(initialUrl, 'serviceId');
        const comboId = getQueryParam(initialUrl, 'comboId');

        if (serviceId) {
          global.NOTIFICATION_TYPE = 'deepLink_service';
          global.NOTIFICATION_DATA = serviceId;
        }
        if (comboId) {
          global.NOTIFICATION_TYPE = 'deepLink_combo';
          global.NOTIFICATION_DATA = comboId;
        }
      }
    };

    getUrlAsync();
  }, []);
  useEffect(() => {
    Linking.addEventListener('url', async url => {
      console.log('addEventListener', url);
      const initialUrl = url?.url;

      if (initialUrl) {
        const serviceId = getQueryParam(initialUrl, 'serviceId');
        const comboId = getQueryParam(initialUrl, 'comboId');

        if (serviceId) {
          global.NOTIFICATION_TYPE = 'deepLink_service';
          global.NOTIFICATION_DATA = serviceId;
        }
        if (comboId) {
          global.NOTIFICATION_TYPE = 'deepLink_combo';
          global.NOTIFICATION_DATA = comboId;
        }
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);
  useEffect(() => {
    if (Platform.OS == 'ios') {
      const unsubscribe = messaging().onMessage(remoteMessage => {
        console.log('handle in foreground', remoteMessage);
        const {notification, messageId} = remoteMessage;
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: notification.body,
          title: notification.title,
          sound: 'default',
        });
      });
      return unsubscribe;
    }
  }, []);
  if (!languageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={config.colors.white}
          translucent={false}
        />
        <RootNavigation />
        <Apploader />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
