import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Pressable,
  Modal,
  I18nManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  DeleteAccountReducer,
  LoginUserReducer,
  LogoutUserReducer,
  MyProfileReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import FooterComponent from '../../conponents/FooterComponent';
import {goToLogin} from '../../conponents/NavigationRef';

const Sidebar = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const selectLogoutUserData = useSelector(
    LogoutUserReducer.selectLogoutUserData,
  );
  const DeleteAccountResponse = useSelector(
    DeleteAccountReducer.selectDeleteAccountData,
  );

  console.log('selectLogoutUserData', selectLogoutUserData);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  console.log('MyProfileResponse', JSON.stringify(MyProfileResponse));
  useEffect(() => {
    if (DeleteAccountResponse != null) {
      if (DeleteAccountResponse?.error == false) {
        dispatch(LoginUserReducer.signOutAction());
        setModalVisible(false);

        AsyncStorage.removeItem(config.AsyncKeys.USER_LOGGED_IN);
        AsyncStorage.removeItem(config.AsyncKeys.USER_DATA);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: config.routes.AUTH_NAVIGATION}],
          }),
        );
        dispatch(DeleteAccountReducer.removeDeleteAccountResponse());
      }
    }
  }, [DeleteAccountResponse]);
  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (result == true) {
      setUserLoggedIn(true);
      dispatch({type: SagaActions.MY_PROFILE, payload: ''});
    } else {
    }
  };
  const callLogoutApi = async () => {
    dispatch({type: SagaActions.LOGOUT_USER, payload: ''});
    dispatch(LoginUserReducer.signOutAction());
    setModalVisible(false);

    await AsyncStorage.removeItem(config.AsyncKeys.USER_LOGGED_IN);
    await AsyncStorage.removeItem(config.AsyncKeys.USER_DATA);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: config.routes.AUTH_NAVIGATION}],
      }),
    );
  };
  const callDeleteAccountApi = async () => {
    dispatch({type: SagaActions.DELETE_ACCOUNT, payload: ''});
  };
  const SignOutModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{width: 40, height: 40}}
              source={require('../../assets/images/signOut1.png')}
            />
            <Text style={styles.modalText}>{t('Sign out from Anasa')}</Text>
            <Text style={styles.modalText1}>
              {t(
                'Are you sure you would like to sign out of your Anasa account?',
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Pressable
                style={{
                  borderRadius: 10,
                  padding: 10,
                  elevation: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: config.colors.orangeColor,
                  width: '48%',
                }}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: config.fonts.Poppins_Medium,
                  }}>
                  {t('Cancel')}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  borderRadius: 10,
                  padding: 10,
                  elevation: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: config.colors.white,
                  borderWidth: 1,
                  borderColor: config.colors.orangeColor,
                  width: '48%',
                }}
                onPress={() => callLogoutApi()}>
                <Text
                  style={{
                    color: config.colors.orangeColor,
                    fontSize: 16,
                    fontFamily: config.fonts.Poppins_Medium,
                  }}>
                  {t('Sign Out')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const DeleteAccountModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteAccountModalVisible}
        onRequestClose={() => {
          setDeleteAccountModalVisible(!deleteAccountModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{width: 40, height: 40}}
              source={require('../../assets/images/signOut1.png')}
            />
            <Text style={styles.modalText}>{t('Account Deletion')}</Text>
            <Text style={styles.modalText1}>
              {t('Are you sure to delete your Anasa account?')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>
                  setDeleteAccountModalVisible(!deleteAccountModalVisible)
                }>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontFamily: config.fonts.Poppins_Medium,
                  }}>
                  {t('Cancel')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => callDeleteAccountApi()}>
                <Text
                  style={{
                    color: '#4F74B0',
                    fontSize: 16,
                    fontFamily: config.fonts.Poppins_Medium,
                  }}>
                  {t('Yes')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View style={styles.container}>
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
          title={t('Profile')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <View style={{flex: 1, paddingHorizontal: 15}}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 10}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.bgI}>
            {MyProfileResponse?.results?.buyer?.profile_image == '' ||
            MyProfileResponse?.results?.buyer?.profile_image == null ? (
              <Image
                source={require('../../assets/images/user_icon.png')}
                style={styles.profile}
              />
            ) : (
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                <Image
                  source={{
                    uri: MyProfileResponse?.results?.buyer?.profile_image,
                  }}
                  style={styles.profile}
                />
              </View>
            )}

            <Text style={styles.nametext}>
              {MyProfileResponse?.results?.buyer?.full_name ?? t('Guest')}
            </Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.Gray,
                fontSize: 14,
                lineHeight: 22,
              }}>
              {MyProfileResponse?.results?.buyer?.email ?? ''}
            </Text>
          </View>
          {userLoggedIn ? (
            <>
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
                  {t('My Account')}
                </Text>

                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.EDIT_PROFILE);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/profileIcon.png')}
                    />
                    <Text style={styles.MyBookingtext}>
                      {t('Personal information')}
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.USER_ADDRESS, {
                      from: 'SavedAddress',
                    });
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/MySavedAddress.png')}
                    />
                    <Text style={styles.MyBookingtext}>
                      {t('My Saved Address')}
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.MY_EARNINGS);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/myearn.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('My Wallet')}</Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.SETTINGS);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/SettingSidebar.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('Settings')}</Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
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
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_SemiBold,
                    fontSize: 16,
                    lineHeight: 26,
                    marginTop: 10,
                    textAlign: 'left',
                  }}>
                  {t('Booking')}
                </Text>

                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.MY_BOOKINGS);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/MyBooking.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('My Bookings')}</Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.SERVICE_REQUEST);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/MyBooking.png')}
                    />
                    <Text style={styles.MyBookingtext}>
                      {t('Plan My Party Orders')}
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
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
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_SemiBold,
                    fontSize: 16,
                    lineHeight: 26,
                    marginTop: 10,
                    textAlign: 'left',
                  }}>
                  {t('More')}
                </Text>

                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.HELP_AND_SUPPORT);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/Help&Support.png')}
                    />
                    <Text style={styles.MyBookingtext}>
                      {t('Help & Support')}
                    </Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/signOut.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('Log Out')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  backgroundColor: config.colors.white,
                  borderRadius: 12,
                  padding: 15,
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.SETTINGS);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/SettingSidebar.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('Settings')}</Text>
                  </View>
                  <Image
                    resizeMode="contain"
                    style={styles.nextIcon}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.MyBookingMainCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    goToLogin(config.routes.AUTH_NAVIGATION);
                  }}>
                  <View style={styles.MyBookingCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.MyBooking}
                      source={require('../../assets/images/signOut.png')}
                    />
                    <Text style={styles.MyBookingtext}>{t('Login')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
        <SafeAreaView>
          <TouchableOpacity
            style={{
              backgroundColor: config.colors.BACKGROUNDCOLOR,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.5}
            onPress={() => {
              setDeleteAccountModalVisible(true);
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.Gray,
                fontSize: 14,
              }}>
              {t('Delete Account')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
      {SignOutModal()}
      {DeleteAccountModal()}
      <FooterComponent from={'profile'} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  bgI: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  nametext: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 16,
    marginTop: 5,
  },
  mainCss: {
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#ffffff',
  },
  MyBookingMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  MyBookingCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  MyBooking: {
    height: 30,
    width: 30,
  },
  MyBookingtext: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    marginLeft: 15,
  },
  nextIcon: {
    height: 24,
    width: 24,
    tintColor: config.colors.Black,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: '#D3D6D9',
    width: '48%',
    height: 50,
  },
  buttonClose: {
    backgroundColor: '#4F74B0',
    width: '48%',
    height: 50,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginVertical: 10,
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
  },
  modalText1: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'left',
  },
});

export default Sidebar;
