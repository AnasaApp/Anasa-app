import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, useRef} from 'react';
import {
  BackHandler,
  Image,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
} from 'react-native';
import config from '../../config';
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
  IAUInstallStatus,
} from 'sp-react-native-in-app-updates';
import {AppButton} from '../../conponents';
import {useTranslation} from 'react-i18next';

const Splash = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const hasNavigated = useRef(false); // Prevent multiple navigation calls

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const inAppUpdates = new SpInAppUpdates(false); // isDebug flag
  
  useEffect(() => {
    checkForUpdate();
  }, [navigation]);

  const checkUserLoggedIn = async () => {
    // Prevent multiple navigation calls
    if (hasNavigated.current) {
      return;
    }

    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    const lang = await AsyncStorage.getItem('user_language');
    const isGuestRes = await AsyncStorage.getItem('IS_GUEST_USER');
    const isGuest = JSON.parse(isGuestRes);

    // Use InteractionManager to wait for animations to complete
    InteractionManager.runAfterInteractions(() => {
      setTimeout(function () {
        if (hasNavigated.current) {return;} // Double check
        hasNavigated.current = true;

        // If guest user, always go to home screen
        if (isGuest === true) {
          console.log('Guest user detected, navigating to home');
          navigation.replace(config.routes.HOME_SCREEN);
          return;
        }

        if (lang) {
          if (result == true) {
            navigation.replace(config.routes.HOME_SCREEN);
          } else {
            navigation.replace(config.routes.SLIDER);
          }
        } else {
          if (result == true) {
            navigation.replace(config.routes.HOME_SCREEN);
          } else {
            navigation.replace(config.routes.LANGUAGE);
          }
        }
      }, 3000);
    });
  };
  const checkForUpdate = async () => {
    try {
      // Check if an update is needed
      const result = await inAppUpdates.checkNeedsUpdate();
      if (result.shouldUpdate) {
        if (Platform.OS == 'android') {
          setIsUpdateModalVisible(true);
        } else {
          callAppUpdateUi();
        }
      } else {
        setIsUpdateModalVisible(false);
        checkUserLoggedIn();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      checkUserLoggedIn();
    }
  };
  const callAppUpdateUi = async () => {
    let updateOptions = {};

    if (Platform.OS === 'android') {
      // Configure for Android
      updateOptions = {
        updateType: IAUUpdateKind.IMMEDIATE,
      };
    } else if (Platform.OS === 'ios') {
      // Configure for iOS
      updateOptions = {
        title: t('New Update is Available'),
        message: t(
          'Please update your app for the best experience and latest features.',
        ),
        buttonUpgradeText: t('Update'),
        buttonCancelText: t('Cancel'),
        forceUpgrade: true,
      };
    }

    // Add listener for download status updates
    const updateListener = downloadStatus => {
      console.log('Download status:', downloadStatus);

      if (downloadStatus.status === IAUInstallStatus.DOWNLOADED) {
        console.log('Update downloaded');
        inAppUpdates.installUpdate();
        inAppUpdates.removeStatusUpdateListener(updateListener);
      }
    };

    inAppUpdates.addStatusUpdateListener(updateListener);

    // Start the update process
    await inAppUpdates.startUpdate(updateOptions);
  };
  const UpdateModalView = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isUpdateModalVisible}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(60, 61, 62, 0.8)"
        />
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(60, 61, 62, 0.8)',
          }}>
          <View
            style={{
              width: '80%',
              borderRadius: 12,
              backgroundColor: config.colors.white,
              padding: 10,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 20,
                color: config.colors.blackColor,
                textAlign: 'center',
                lineHeight: 22,
                marginVertical: 10,
              }}>
              {t(`New Update is Available`)}
            </Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 14,
                color: config.colors.greyColor,
                alignSelf: 'center',
                textAlign: 'center',
                lineHeight: 18,
                width: '80%',
                marginTop: 5,
              }}>
              {t(
                `Please update your app for the best experience and latest features.`,
              )}
            </Text>
            <AppButton
              buttonStyle={{
                marginTop: 20,
                width: '80%',
                alignSelf: 'center',
              }}
              onPress={() => {
                setIsUpdateModalVisible(false);

                setTimeout(() => {
                  callAppUpdateUi();
                }, 500);
              }}
              text={t('Update Now')}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                BackHandler.exitApp();

                setIsUpdateModalVisible(false);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 22,
                }}>
                {t(`No Thanks! Close the app`)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <SafeAreaView style={styles.bgImg}>
      {/* <StatusBar barStyle = "light-content" hidden = {false} translucent = {true}/> */}
      {/* <TouchableOpacity 
      onPress={()=>navigation.navigate(config.routes.LANGUAGE)}
      > */}
      <Image
        style={styles.logoimg}
        resizeMode="contain"
        source={require('../../assets/images/anasaLogo.png')}
      />
      {/* </TouchableOpacity> */}
      {UpdateModalView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: config.colors.white,
  },
  logoimg: {
    height: 144,
    width: 144,
  },
});

export default Splash;
