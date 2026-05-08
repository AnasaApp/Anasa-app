import {
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import Snackbar from 'react-native-snackbar';
import {goToLogin} from './NavigationRef';

const FooterComponent = ({from, navigation, notification_count}) => {
  const {t, i18n} = useTranslation();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (result == true) {
      setUserLoggedIn(true);
    } else {
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: config.colors.white,
      }}>
      <View
        style={{
          height: 60,
          backgroundColor: config.colors.white,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 1,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 2,
          // elevation: 20,
          borderTopWidth: Platform.OS == 'android' ? 0 : 1,
          borderColor: config.colors.borderColor,
          paddingVertical: 10,
        }}>
        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(config.routes.HOME_SCREEN);
            }}
            style={{
              alignItems: 'center',
              backgroundColor:
                from == 'home' ? config.colors.creamColor : config.colors.white,
              width: 44,
              height: 44,
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              style={{
                width: 24,
                height: 24,
                tintColor:
                  from == 'home' ? config.colors.blueColor : config.colors.Gray,
              }}
              source={require('../assets/images/homeIcon.png')}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(config.routes.CATEGORIES);
            }}
            style={{
              alignItems: 'center',
              backgroundColor:
                from == 'category'
                  ? config.colors.creamColor
                  : config.colors.white,
              width: 44,
              height: 44,
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor:
                  from == 'category'
                    ? config.colors.blueColor
                    : config.colors.Gray,
              }}
              source={require('../assets/images/categoryIcon.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (userLoggedIn) {
                navigation.navigate(config.routes.START_SERVICE_REQUEST);
              } else {
                // Snackbar.show({
                //   text: t('Please login as a user to perform this action'),
                //   duration: Snackbar.LENGTH_LONG,
                //   backgroundColor: config.colors.blackColor,
                //   fontFamily: config.fonts.Poppins_Medium,
                //   textColor: config.colors.white,
                //   rtl: I18nManager?.isRTL,
                //   action: {
                //     text: t(`Go to Login`),
                //     textColor: config.colors.orangeColor,

                //     onPress: () => {
                //       goToLogin(config.routes.AUTH_NAVIGATION);
                //     },
                //   },
                // });
                goToLogin(config.routes.AUTH_NAVIGATION);
              }
            }}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 50,
              height: 50,
              justifyContent: 'center',
              borderRadius: 50,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <Image
              style={{
                width: 28,
                height: 28,
              }}
              source={require('../assets/images/plusIcon.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(config.routes.ALL_VENDORS);
            }}
            style={{
              alignItems: 'center',
              backgroundColor:
                from == 'vendor'
                  ? config.colors.creamColor
                  : config.colors.white,
              width: 44,
              height: 44,
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor:
                  from == 'vendor'
                    ? config.colors.blueColor
                    : config.colors.Gray,
              }}
              source={require('../assets/images/vendorIcon.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '20%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(config.routes.SIDE_BAR);
            }}
            style={{
              alignItems: 'center',
              backgroundColor:
                from == 'profile'
                  ? config.colors.creamColor
                  : config.colors.white,
              width: 44,
              height: 44,
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                tintColor:
                  from == 'profile'
                    ? config.colors.blueColor
                    : config.colors.Gray,
              }}
              source={require('../assets/images/profileIcon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FooterComponent;

const styles = StyleSheet.create({});
