import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  I18nManager,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {SignUpUserReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal';
import {useTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

const SignUp = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const SignUpUserResponse = useSelector(
    SignUpUserReducer.selectSignUpUserData,
  );
  const SignUpUserErrorResponse = useSelector(
    SignUpUserReducer.selectSignUpUserResponse,
  );

  console.log('SignUpUserResponse', SignUpUserResponse);

  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [confirmSecureEntry, setConfirmSecureEntry] = useState(true);
  const [agree, setAgree] = useState(false);
  const [countryCode, setCountryCode] = useState('SA');
  const [callingCode, setCallingCode] = useState('966');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);
  const [seletion, setSelection] = useState({start: 0, end: 0});
  useEffect(() => {
    if (SignUpUserResponse != null) {
      if (SignUpUserResponse?.error == false) {
        navigation.navigate(config.routes.OTP_VERIFICATION, {
          from: 'signup',
          userEmail: SignUpUserResponse?.results?.buyer?.email,
          userOtp: SignUpUserResponse?.results?.buyer?.otp,
        });
        dispatch(SignUpUserReducer.removeSignUpUserResponse());
      }
    }
  }, [SignUpUserResponse]);
  const handleSelectionChange = ({nativeEvent: {selection}}) => {
    console.log('selection.start', selection);

    setSelection({start: phoneNumber.length, end: phoneNumber.length});
  };
  const handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (!I18nManager.isRTL) {return 1;}
    if (keyValue == 'Backspace') {
      setSelection({start: phoneNumber.length, end: phoneNumber.length});
    } else {
      setSelection({start: 0, end: 0});
    }
  };
  useEffect(() => {
    if (SignUpUserErrorResponse != null) {
      if (SignUpUserErrorResponse?.message != '') {
        Toast.show(SignUpUserErrorResponse.message, Toast.LONG);
        dispatch(SignUpUserReducer.removeSignUpUserResponse());
      }
    }
  }, [SignUpUserErrorResponse]);
  const changeNum = num => {
    const formatNum = num.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    setphoneNumber(formatNum);
  };

  const onPressSignUp = async () => {
    var emailRegex = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/;
    const result = emailRegex.test(email);
    const passwordRegex1 =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    const passwordRegex2 =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[$@$!%*?&.])[a-zA-Z0-9!#$%&?@]{6,}$/.test(
        password,
      );
    if (fullName?.trim() === '' || fullName?.trim().length < 3) {
      return Toast.show(t('Please Enter Name.'), Toast.LONG);
    }
    if (fullName.length < 3) {
      return Toast.show(t('Please Enter Valid Name.'), Toast.LONG);
    }
    if (phoneNumber === '' || phoneNumber?.length < 5) {
      return Toast.show(t('Please enter mobile number.'), Toast.LONG);
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

    if (email == '' || result == false) {
      return Toast.show(t('Please enter valid email address.'), Toast.LONG);
    }
    if (password === '') {
      return Toast.show(t('Password should not be empty.'), Toast.LONG);
    }
    if (passwordRegex1 == false && passwordRegex2 == false) {
      return Toast.show(
        t(
          'Password must be 8 characters long contains lowercase, uppercase and numeric letters.',
        ),
        Toast.LONG,
      );
    }
    if (!agree) {
      return Toast.show(t('Please Agree with Terms & Conditions'), Toast.LONG);
    }
    let token = '';
    token = await AsyncStorage.getItem('fcmToken');
    if (token != null) {token = JSON.parse(token);}

    const payload = {
      email: email,
      full_name: fullName?.trim(),
      password: password,
      // phone_number: I18nManager.isRTL? phoneNumber.replace(/\s/g, '').split('').reverse().join(''):phoneNumber.replace(/\s/g, ''),
      phone_number: phoneNumber.replace(/\s/g, ''),
      country_code: callingCode,
      country_short_name: countryCode,
      deviceId: token,
      device_Id: await DeviceInfo?.getUniqueId(),
      deviceOS: Platform.OS,
      deviceName: await DeviceInfo?.getDeviceName(),
      OSVersion: await DeviceInfo?.getSystemVersion(),
      BuildNumber: await DeviceInfo?.getBuildNumber(),
    };

    dispatch({type: SagaActions.SIGNUP_USER, payload});
  };
  const onSelectCountry = country => {
    setCountryCode(country.cca2);
    setCallingCode(country?.callingCode[0]);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <AppHeader navigation={navigation} onPress={() => navigation.goBack()} /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{flex: 1}}>
          <View style={styles.subContainer}>
            <Text style={styles.createAccount}>{t('Sign Up')}</Text>
            <AppTextInput
              inputTextLabel={t('Full Name')}
              placeholder={t('Enter your name')}
              onChangeText={val =>
                // setfullName(
                //   I18nManager.isRTL
                //     ? val.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF ]/g, '')
                //     : val.replace(/[^a-zA-Z ]/g, ''),
                // )
                setfullName(val)
              }
              value={fullName?.trimStart()}
              viewStyle={{marginHorizontal: 0}}
              maxLength={50}
            />

            <View style={styles.mobileView}>
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
              inputTextLabel={t('Email Address')}
              onChangeText={val => setEmail(val?.toLowerCase())}
              value={email}
              placeholder={t('Enter your email')}
              viewStyle={{marginHorizontal: 0}}
              keyboardType="email-address"
            />

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
            <AppTextInput
              inputTextLabel={t('Confirm Password')}
              placeholder={t('Enter your Password')}
              onChangeText={val => setConfirmPassword(val)}
              value={confirmPassword}
              secureTextEntry={confirmSecureEntry}
              viewStyle={{marginHorizontal: 0}}
              rightIcon={
                confirmSecureEntry == true
                  ? require('../../assets/images/Hide.png')
                  : require('../../assets/images/view.png')
              }
              rightIconPress={() => setConfirmSecureEntry(!confirmSecureEntry)}
            />

            <View style={styles.remberView}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                activeOpacity={0.6}
                style={styles.checkView}>
                <Image
                  source={
                    agree == true
                      ? require('../../assets/images/Checkbox.png')
                      : require('../../assets/images/Uncheckbox.png')
                  }
                  style={{
                    width: 22,
                    height: 22,
                    marginBottom: 3,
                  }}
                />

                <Text style={styles.rembMeText}>{t('I agree with')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(config.routes.TERMS_AND_CONDITIONS);
                }}
                activeOpacity={0.6}>
                <Text style={styles.forgotpasstext}>
                  {' '}
                  {t('Terms & Conditions')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonCss}>
              <AppButton
                text={t('Create Account')}
                onPress={() => onPressSignUp()}
              />
            </View>
          </View>
        </View>
        <View style={styles.alreadyAccountView}>
          <Text style={styles.accountTxtStyle}>
            {t('Already have an account?')}
          </Text>

          <TouchableOpacity
            style={{marginLeft: 5}}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(config.routes.LOG_IN);
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: config.fonts.Poppins_SemiBold,
                color: config.colors.Black,
              }}>
              {t('Login')}
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
  txtInput: {
    width: '80%',
    height: 50,
    paddingLeft: 10,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    marginTop: 3,
    color: config.colors.Black,
    textAlign: 'left',
  },
  labelText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
    textAlign: 'left',
  },
  subContainer: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  createAccount: {
    fontSize: 24,
    fontFamily: config.fonts.Poppins_Bold,
    color: config.colors.Black,
    textAlign: 'left',
  },
  mobileView: {
    marginTop: 10,
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
    top: 2,
  },
  codecctext: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    color: config.colors.Black,
    marginTop: 2,
    textAlign: 'left',
  },
  alreadyAccountView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 20,
  },
  accountTxtStyle: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
  },
  remberView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 14,
    // top:1
  },
  forgotpasstext: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.orangeColor,
    fontSize: 14,
  },
  buttonCss: {
    marginTop: '10%',
  },
});

export default SignUp;
