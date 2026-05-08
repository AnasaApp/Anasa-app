import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ToastAndroid,
  Alert,
  I18nManager,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {
  ForgotPasswordReducer,
  LoginUserReducer,
  VerifyOtpReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const OtpVerification = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const verifyOtpResponse = useSelector(VerifyOtpReducer.selectVerifyOtpData);
  const verifyOtpErrorResponse = useSelector(
    VerifyOtpReducer.selectVerifyOtpResponse,
  );
  const ForgotPasswordResponse = useSelector(
    ForgotPasswordReducer.selectForgotPasswordData,
  );
  console.log('verifyOtpResponse', verifyOtpResponse);
  // console.log('userdata--_____________', route.params.userEmail);
  // console.log('userdata+++++++++++++++++++++++++', route.params.UserType);

  const otpInput = useRef(null);
  const [otp, setValue] = useState('');
  const [mins, setMins] = useState('00');
  const [secs, setSecs] = useState(40);

  const [emailUser, setEmailUser] = useState('');

  useEffect(() => {
    setEmailUser(route?.params?.userEmail);
  }, [route?.params?.from]);

  // useEffect(() => {
  //   Alert.alert(t('OTP'), `${t('Your otp is:')} ${route?.params?.userOtp}`, [
  //     // {
  //     //   text: 'Cancel',
  //     //   onPress: () => console.log('Cancel Pressed'),
  //     //   style: 'cancel',
  //     // },
  //     {text: t('Ok'), onPress: () => console.log('OK Pressed')},
  //   ]);
  // }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (secs <= 0) {
        //console.log('end')
      } else setSecs(s => s - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [secs]);

  useEffect(() => {
    if (ForgotPasswordResponse != null) {
      if (ForgotPasswordResponse?.error == false) {
        Toast.show(ForgotPasswordResponse?.message, Toast.LONG);

        // Alert.alert(
        //   t('OTP'),
        //   `${t('Your otp is:')} ${ForgotPasswordResponse?.results?.otp}`,
        //   [
        //     // {
        //     //   text: 'Cancel',
        //     //   onPress: () => console.log('Cancel Pressed'),
        //     //   style: 'cancel',
        //     // },
        //     {text: t('Ok'), onPress: () => console.log('OK Pressed')},
        //   ],
        // );
      }
    }
  }, [ForgotPasswordResponse]);
  useEffect(() => {
    if (verifyOtpResponse != null) {
      if (verifyOtpResponse?.error == false) {
        dispatch(VerifyOtpReducer.removeVerifyOtpResponse());
        if (route?.params?.from == 'passReset') {
          navigation.navigate(config.routes.UPDATE_PASSWORD, {
            userEmail: verifyOtpResponse?.results?.buyer?.email,
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
            JSON.stringify(verifyOtpResponse?.results),
          );
        }
      }
    }
  }, [verifyOtpResponse]);

  useEffect(() => {
    if (verifyOtpErrorResponse != null) {
      if (verifyOtpErrorResponse?.message != '') {
        Toast.show(verifyOtpErrorResponse?.message, Toast.LONG);
        dispatch(VerifyOtpReducer.removeVerifyOtpResponse());
      }
    }
  }, [verifyOtpErrorResponse]);
  const onResendPress = async () => {
    setValue('');
    otpInput.current.clear();
    
    // Start new timer with timestamp
    await startNewTimer();
    
    callResendOtpApi();
  };

  const callResendOtpApi = () => {
    const payload = {
      email: emailUser,
    };

    dispatch({
      type: SagaActions.FORGOT_PASSWORD,
      payload,
    });
  };
  const callVerifyOtpApi = () => {
    if (otp === '' || otp?.length < 4) {
      return Toast.show(t('Please Enter Valid OTP.'), Toast.LONG);
    }
    const payload = {
      email: emailUser,
      otp: otp,
    };
    dispatch({
      type: SagaActions.VERIFY_OTP,
      payload,
    });
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
          title={t('OTP Verification')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: config.fonts.Poppins_Bold,
            color: config.colors.Black,
            textAlign: 'left',
            marginTop: 20,
          }}>{`${t(`Enter code`)}`}</Text>
        <Text
          style={{
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 14,
            lineHeight: 24,
            textAlign: 'left',
          }}>
          {`${t(`We've sent a code to`)} ${route?.params?.userEmail}`}
        </Text>

        <View style={styles.Otp_Css}>
          <OTPTextInput
            ref={otpInput}
            inputCount={4}
            defaultValue={otp}
            handleTextChange={value => {
              setValue(value);
            }}
            tintColor={config.colors.orangeColor}
            textInputStyle={styles.Otpinput}
            containerStyle={styles.containerStyle}
          />
        </View>
        <View style={styles.resendContainer}>
          <Text
            onPress={() => secs === 0 && onResendPress()}
            style={[
              styles.resendText,
              {
                color:
                  secs === 0
                    ? config.colors.orangeColor
                    : config.colors.greyColor,
              },
            ]}>
            {t('Resend')}
          </Text>

          {secs > 0 && (
            <Text style={styles.timerText}>
              {t('in')} {mins}:{secs < 10 ? `0${secs}` : secs}
            </Text>
          )}
        </View>
        <AppButton
          text={t('Verify')}
          onPress={() => callVerifyOtpApi()}
          buttonStyle={{marginTop: 40}}
        />
      </ScrollView>
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    color: config.colors.BACKGROUNDCOLOR,
  },
  Otp_Css: {
    marginVertical: 20,
  },
  EnterOTP_txt: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    color: config.colors.Gray,
    marginTop: 10,
    fontFamily: config.fonts.Poppins_Regular,
  },
  Otpinput: {
    backgroundColor: '#ABABB61A',
    height: 70,
    fontSize: 30,
    color: config.colors.Black,
    width: '18%',
    borderWidth: 1,
    borderBottomWidth: 0.9,
    borderRadius: 10,
    // fontFamily:config.fonts.Poppins_Regular
  },
  containerStyle: {
    height: 67,
    alignSelf: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  TimeSecond_txt: {
    fontSize: 40,
    color: config.colors.Light_Black,
    textAlign: 'center',
    // marginVertical: 10,
    marginTop: 10,
    fontFamily: config.fonts.Poppins_ExtraLight,
  },
  SendAgain: {
    fontSize: 16,
    color: config.colors.buttonColor,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_Regular,
    // marginVertical: 10,
  },
  buttonCss: {
    marginHorizontal: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  resendText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    lineHeight: 25,
  },
  timerText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.orangeColor,
    marginHorizontal: 4,
  },
});
