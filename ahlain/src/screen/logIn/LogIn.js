import React, {useState, useEffect} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {LoginUserReducer} from '../../redux/reducers';
import {showMessage} from 'react-native-flash-message';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';

import {useTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import {goToLogin} from '../../conponents/NavigationRef';

const LogIn = ({navigation}) => {
  const {t, i18n} = useTranslation();

  //Redux states
  const dispatch = useDispatch();

  const LoginUserResponse = useSelector(LoginUserReducer.selectLoginUser);
  const LoginUserErrorResponse = useSelector(
    LoginUserReducer.selectLoginErrorResponse,
  );

  console.log('LoginUserErrorResponse', LoginUserErrorResponse);
  const [phoneNumber, setphoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [active, setActive] = useState('');
  const [countryCode, setCountryCode] = useState('SA');
  const [callingCode, setCallingCode] = useState('966');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);
  const [seletion, setSelection] = useState({start: 0, end: 0});
  useEffect(() => {
    if (LoginUserResponse != null) {
      if (LoginUserResponse?.error == false) {
        if (LoginUserResponse?.results?.verifyAccount == true) {
          navigation.navigate(config.routes.OTP_VERIFICATION, {
            from: 'login',
            userEmail: LoginUserResponse?.results?.buyer?.email,
            userOtp: LoginUserResponse?.results?.buyer?.otp,
          });
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: config.routes.HOME_SCREEN}],
            }),
          );
          AsyncStorage.setItem(
            config.AsyncKeys.USER_LOGGED_IN,
            JSON.stringify(true),
          );
          AsyncStorage.setItem(
            config.AsyncKeys.USER_DATA,
            JSON.stringify(LoginUserResponse?.results),
          );
        }
      }
    }
  }, [LoginUserResponse]);
  useEffect(() => {
    if (LoginUserErrorResponse != null) {
      if (LoginUserErrorResponse?.message != '') {
        Toast.show(LoginUserErrorResponse?.message, Toast.LONG);

        dispatch(LoginUserReducer.removeLoginResponse());
      }
    }
  }, [LoginUserErrorResponse]);

  const callLoginApi = async () => {
    if (phoneNumber == '' || phoneNumber.length < 5) {
      return Toast.show(t('Please enter mobile number'), Toast.SHORT);
    }
    if (password == '') {
      return Toast.show(t('Please enter password'), Toast.SHORT);
    }

    // Validate Saudi phone number format
    if (countryCode === 'SA' && callingCode === '966') {
      const cleanNumber = phoneNumber.replace(/\s/g, '');
      if (!cleanNumber.startsWith('5')) {
        return Toast.show(
          t('Saudi mobile numbers must start with 5'),
          Toast.LONG,
        );
      }
      if (cleanNumber.length !== 9) {
        return Toast.show(
          t('Saudi mobile numbers must be exactly 9 digits'),
          Toast.LONG,
        );
      }
      // Validate full format: 5XXXXXXXX
      if (!/^5\d{8}$/.test(cleanNumber)) {
        return Toast.show(
          t('Please enter a valid Saudi mobile number'),
          Toast.LONG,
        );
      }
    }

    let token = '';
    token = await AsyncStorage.getItem('fcmToken');
    if (token != null) {token = JSON.parse(token);}

    const payload = {
      // email: I18nManager.isRTL? phoneNumber.replace(/\s/g, '').split('').reverse().join(''):phoneNumber.replace(/\s/g, ''),
      email: phoneNumber.replace(/\s/g, ''),
      password: password,
      country_code: callingCode,
      country_short_name: countryCode,
      deviceId: token,
      device_Id: await DeviceInfo?.getUniqueId(),
      deviceOS: Platform.OS,
      deviceName: await DeviceInfo?.getDeviceName(),
      OSVersion: await DeviceInfo?.getSystemVersion(),
      BuildNumber: await DeviceInfo?.getBuildNumber(),
    };
    console.log('payload', payload);

    dispatch({
      type: SagaActions.LOGIN_USER,
      payload,
    });
  };

  const onPress = () => {
    setActive(active => !active);
  };
  const handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (!I18nManager.isRTL) {return 1;}
    if (keyValue == 'Backspace') {
      setSelection({start: phoneNumber.length, end: phoneNumber.length});
    } else {
      setSelection({start: 0, end: 0});
    }
  };
  const onSelectCountry = country => {
    setCountryCode(country.cca2);
    setCallingCode(country?.callingCode[0]);
  };
  const changeNum = num => {
    const formatNum = num.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    setphoneNumber(formatNum);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={config.colors.BACKGROUNDCOLOR}
        translucent={false}
      />

      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="always">
        <View style={styles.subContainer}>
          <Text style={styles.welcomebacktxt}>{`${t('Hi, Welcome')}! 👋`}</Text>
          <Text style={styles.PleaseloginText}>
            {t('Please confirm your country code and enter your phone number.')}
          </Text>
          <View style={styles.inputCss}>
            <Text style={styles.labelText}>{t('Mobile Number')}</Text>
            <View style={styles.mobileInputContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsCalenderVisible(!isCalenderVisible)}
                style={styles.flagimageview}>
                {/* <Image
                    source={require('../../assets/images/FlagSaudi.png')}
                    style={styles.flagImage}
                  /> */}
                <CountryPicker
                  countryCode={countryCode}
                  withFilter={true}
                  withFlag={true}
                  withCountryNameButton={false}
                  withCallingCode={true}
                  withEmoji={true}
                  onSelect={onSelectCountry}
                  visible={isCalenderVisible}
                />
                <Image
                  source={require('../../assets/images/downArrow.png')}
                  style={styles.downArrowImage}
                />
              </TouchableOpacity>

              <View style={styles.textInputConatiner}>
                <Text style={styles.codecctext}>
                  {callingCode ? '+' + callingCode : ''}
                </Text>
                <TextInput
                  placeholder={'5XX XXX XXX'}
                  placeholderTextColor={config.colors.placeholderTextColor}
                  onChangeText={num => changeNum(num.replace(/[^0-9]/g, ''))}
                  value={phoneNumber}
                  keyboardType={'phone-pad'}
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  maxLength={20}
                  style={styles.txtInput}
                  // selection={I18nManager.isRTL&& seletion}
                  // onSelectionChange={handleSelectionChange}
                  // onKeyPress={handleKeyPress}
                />
              </View>
            </View>
          </View>
          <AppTextInput
            inputTextLabel={t('Password')}
            placeholder={t('Enter your Password')}
            onChangeText={val => setPassword(val)}
            value={password}
            secureTextEntry={secureEntry}
            viewStyle={{marginHorizontal: 0}}
            rightIcon={
              secureEntry == true
                ? require('../../assets/images/Hide.png')
                : require('../../assets/images/view.png')
            }
            rightIconPress={() => setSecureEntry(!secureEntry)}
          />
          <View style={styles.remberView}>
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.6}
              style={styles.checkView}>
              <Image
                source={
                  active == true
                    ? require('../../assets/images/Checkbox.png')
                    : require('../../assets/images/Uncheckbox.png')
                }
                style={styles.boxcheckimg}
                // resizeMode={FastImage.resizeMode.contain}
              />

              <Text style={styles.rembMeText}>{t('Remember Me')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setphoneNumber('');
                setPassword('');
                navigation.navigate(config.routes.FORGOT_PASSWORD);
              }}
              activeOpacity={0.6}
              style={styles.forgotPassword}>
              <Text style={styles.forgotpasstext}>{t('Forgot password?')}</Text>
            </TouchableOpacity>
          </View>
          <AppButton
            text={t('Login')}
            onPress={() => callLoginApi()}
            // onPress={() =>{navigation.navigate(config.routes.HOME_SCREEN)}}
            viewStyle={{marginTop: 30, marginHorizontal: 0}}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              console.log('Guest login pressed');
              try {
                // Mark as guest user in storage first
                await AsyncStorage.setItem(
                  config.AsyncKeys.USER_LOGGED_IN,
                  JSON.stringify(false),
                );
                await AsyncStorage.setItem(
                  'IS_GUEST_USER',
                  JSON.stringify(true),
                );
                console.log('Guest user flags set in AsyncStorage');

                // Guest login - navigate to home screen without auth
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: config.routes.HOME_SCREEN}],
                  }),
                );
                console.log('Navigation dispatched to HOME_SCREEN');
              } catch (error) {
                console.error('Guest login error:', error);
              }
            }}
            style={{
              marginTop: 10,
              alignSelf: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.orangeColor,
                fontSize: 14,
                textAlign: 'center',
              }}>
              {t('Login as a guest')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.alreadyAccountView}>
          <Text style={styles.accountTxtStyle}>{t('Create an account?')}</Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(config.routes.SIGN_UP);
            }}
            activeOpacity={0.8}>
            <Text
              style={{
                ...styles.accountTxtStyle,
                color: config.colors.orangeColor,
              }}>
              {' '}
              {t('Sign Up!')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  arrorimg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  txtInput: {
    width: '80%',
    height: 50,
    paddingHorizontal: 10,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    marginTop: 3,
    color: config.colors.Black,
    textAlign: 'left',
  },
  inputCss: {
    marginTop: 30,
  },
  labelText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
    textAlign: 'left',
  },
  subContainer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  welcomebacktxt: {
    fontSize: 24,
    fontFamily: config.fonts.Poppins_Bold,
    color: config.colors.Black,
    textAlign: 'left',
  },
  PleaseloginText: {
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'left',
  },
  mobileInputContainer: {
    borderColor: config.colors.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: config.colors.white,
  },
  flagimageview: {
    width: '18%',
    paddingHorizontal: 10,
    borderLeftColor: !I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderLeftWidth: !I18nManager.isRTL ? 0 : 1,
    borderRightColor: I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderRightWidth: I18nManager.isRTL ? 0 : 1,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  downArrowImage: {
    width: 14,
    height: 7,
    resizeMode: 'contain',
  },
  textInputConatiner: {
    width: '80%',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    // top: 2,
  },
  codecctext: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    color: config.colors.Black,
    marginTop: 2,
  },
  alreadyAccountView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  accountTxtStyle: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
  },
  remberView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  checkView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxcheckimg: {
    width: 22,
    height: 22,
    marginBottom: 3,
  },
  rembMeText: {
    marginLeft: 7,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 13,
    top: 1,
  },
  forgotPassword: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  forgotpasstext: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 14,
  },
});

export default LogIn;
