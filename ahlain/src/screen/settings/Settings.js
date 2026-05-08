import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  Switch,
  I18nManager,
  StatusBar,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  ChangeLanguageReducer,
  ChangeNotificationReducer,
  MyProfileReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart'; // Import package from node modules

const Settings = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const ChangeNotificationResponse = useSelector(
    ChangeNotificationReducer.selectChangeNotificationData,
  );
  const ChangeLanguageResponse = useSelector(
    ChangeLanguageReducer.selectChangeLanguageData,
  );
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);

  console.log(
    'ChangeNotificationResponse',
    MyProfileResponse?.results?.buyer?.notification_status,
  );

  const [isNotf, setisNotf] = useState(
    MyProfileResponse?.results?.buyer?.notification_status,
  );
  const [select, setSelect] = useState(
    MyProfileResponse?.results?.buyer?.userLanguage ?? 'English',
  );
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    if (ChangeLanguageResponse != null) {
      if (ChangeLanguageResponse?.error == false) {
        Toast.show(ChangeLanguageResponse.message, Toast.LONG);
        AsyncStorage.setItem('user_language', select);

        const language = select == 'Arabic' ? 'ar' : 'en';

        i18n
          .changeLanguage(language)
          .then(() => {
            if (language == 'ar') {
              I18nManager.forceRTL(true);
              setTimeout(() => {
                RNRestart.Restart();
              }, 500);
            } else {
              I18nManager.forceRTL(false);
              setTimeout(() => {
                RNRestart.Restart();
              }, 500);
            }
          })
          .catch(err => {
            console.log('something went wrong while applying RTL');
          });

        dispatch(ChangeLanguageReducer.removeChangeLanguageResponse());
      }
    }
  }, [ChangeLanguageResponse]);
  useEffect(() => {
    if (ChangeNotificationResponse != null) {
      if (ChangeNotificationResponse?.error == false) {
        Toast.show(ChangeNotificationResponse.message, Toast.LONG);
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
        dispatch(ChangeNotificationReducer.removeChangeNotificationResponse());
      }
    }
  }, [ChangeNotificationResponse]);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const changeNotificationApi = () => {
    setisNotf(!isNotf);
    dispatch({type: SagaActions.CHANGE_NOTIFICATION, payload: ''});
  };
  const changeLanguageApi = val => {
    if (userLoggedIn) {
      setSelect(val);
      dispatch({type: SagaActions.CHANGE_LANGUAGE, payload: {language: val}});
    } else {
      AsyncStorage.setItem('user_language', val);
      const language = val == 'Arabic' ? 'ar' : 'en';
      setSelect(val);
      i18n
        .changeLanguage(language)
        .then(() => {
          if (language == 'ar') {
            I18nManager.forceRTL(true);
            setTimeout(() => {
              RNRestart.Restart();
            }, 500);
          } else {
            I18nManager.forceRTL(false);
            setTimeout(() => {
              RNRestart.Restart();
            }, 500);
          }
        })
        .catch(err => {
          console.log('something went wrong while applying RTL');
        });
    }
  };
  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (result == true) {
      setUserLoggedIn(true);
    } else {
      const res = await AsyncStorage.getItem('user_language');
      console.log('res', res);
      setSelect(res);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: config.colors.BACKGROUNDCOLOR}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={config.colors.orangeColor}
        translucent={false}
      />
      <View
        style={{
          backgroundColor: config.colors.orangeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('Settings')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCss}>
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 16,
                lineHeight: 26,
                marginTop: 10,
                textAlign: 'left',
              }}>
              {t('Language')}
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={0.5}
              onPress={() => {
                changeLanguageApi('English');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Light_Black,
                    fontSize: 16,
                    marginLeft: 15,
                  }}>
                  {t('English (UK)')}
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                }}
                source={
                  select == 'English'
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={0.5}
              onPress={() => {
                changeLanguageApi('Arabic');
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Light_Black,
                    fontSize: 16,
                    marginLeft: 15,
                  }}>
                  {t('العربية')}
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                }}
                source={
                  select == 'Arabic'
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            {userLoggedIn && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    source={require('../../assets/images/notificationBlue.png')}
                  />
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      color: config.colors.Light_Black,
                      fontSize: 16,
                      marginLeft: 15,
                    }}>
                    {t('Notifications')}
                  </Text>
                </View>
                <Switch
                  thumbColor={config.colors.buttonColor}
                  onValueChange={() => changeNotificationApi()}
                  value={isNotf}
                />
              </View>
            )}
            {userLoggedIn && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 15,
                  marginTop: 10,
                }}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.navigate(config.routes.CHANGE_PASSWORD);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    source={require('../../assets/images/changePasswordIcon.png')}
                  />
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      color: config.colors.Light_Black,
                      fontSize: 16,
                      marginLeft: 15,
                    }}>
                    {t('Change Password')}
                  </Text>
                </View>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                    tintColor: config.colors.Black,
                    transform: [
                      {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                    ],
                  }}
                  source={require('../../assets/images/next.png')}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
                marginTop: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(config.routes.PRIVACY_POLICY);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                  }}
                  source={require('../../assets/images/privacyPolicy.png')}
                />
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Light_Black,
                    fontSize: 16,
                    marginLeft: 15,
                  }}>
                  {t('Privacy Policy')}
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: config.colors.Black,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
                marginTop: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(config.routes.ABOUT_US);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                  }}
                  source={require('../../assets/images/aboutus.png')}
                />
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Light_Black,
                    fontSize: 16,
                    marginLeft: 15,
                  }}>
                  {t('About Us')}
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: config.colors.Black,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
                marginTop: 10,
              }}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(config.routes.TERMS_AND_CONDITIONS);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 24,
                    width: 24,
                  }}
                  source={require('../../assets/images/termsConditions.png')}
                />
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Light_Black,
                    fontSize: 16,
                    marginLeft: 15,
                  }}>
                  {t('Terms & Conditions')}
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: config.colors.Black,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    paddingBottom: 10,
  },
  mainCss: {
    marginHorizontal: 15,
    flex: 1,
    // marginTop: 10,
  },
  iconCss: {
    height: 60,
    backgroundColor: config.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5E5F770F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  nameCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 30,
    width: 30,
  },
  name: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 16,
    marginLeft: 20,
  },
  selectIcon: {
    height: 18,
    width: 18,
  },
  languageMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
  },
});

export default Settings;
