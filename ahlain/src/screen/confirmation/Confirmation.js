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

const Confirmation = ({navigation}) => {
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 20,
        }}>
        <Image
          style={{width: 100, height: 100, resizeMode: 'contain'}}
          source={require('../../assets/images/Tick.png')}
        />
        <Text
          style={{
            fontSize: 24,
            fontFamily: config.fonts.Poppins_Bold,
            color: config.colors.Black,
            textAlign: 'center',
            marginTop: 10,
          }}>{`${t('Password changed')}`}</Text>
        <Text
          style={{
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 14,
            lineHeight: 24,
            textAlign: 'center',
            width: '70%',
          }}>
          {t('Your password has been changed succesfully')}
        </Text>
        <AppButton
          text={t('Back to login')}
          onPress={() => goToLogin(config.routes.AUTH_NAVIGATION)}
          viewStyle={{marginTop: 30, width: '100%'}}
        />
      </View>
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

export default Confirmation;
