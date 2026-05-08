import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {ForgotPasswordReducer} from '../../redux/reducers';
import {useTranslation} from 'react-i18next';
const ForgotPassword = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const ForgotPasswordResponse = useSelector(
    ForgotPasswordReducer.selectForgotPasswordData,
  );
  const ForgotPasswordErrorResponse = useSelector(
    ForgotPasswordReducer.selectForgotPasswordResponse,
  );

  const [email, setEmail] = useState('');
  useEffect(() => {
    if (ForgotPasswordResponse != null) {
      if (ForgotPasswordResponse?.error == false) {
        Toast.show(ForgotPasswordResponse?.message, Toast.LONG);

        navigation.navigate(config.routes.OTP_VERIFICATION, {
          from: 'passReset',
          userEmail: email,
          userOtp: ForgotPasswordResponse?.results?.otp,
        });
        dispatch(ForgotPasswordReducer.removeForgotPasswordResponse());
      }
    }
  }, [ForgotPasswordResponse]);

  useEffect(() => {
    if (ForgotPasswordErrorResponse != null) {
      if (ForgotPasswordErrorResponse?.message != '') {
        Toast.show(ForgotPasswordErrorResponse?.message, Toast.LONG);
        dispatch(ForgotPasswordReducer.removeForgotPasswordResponse());
      }
    }
  }, [ForgotPasswordErrorResponse]);

  const onPressPassword = () => {
    var emailRegex = /^([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/;
    const result = emailRegex.test(email);
    if (email == '') {
      Toast.show(t('Please enter email address.'), Toast.LONG);
    } else if (email !== '' && result == false) {
      Toast.show(t('Please enter the vaild email address.'), Toast.LONG);
    }
    // navigation.navigate(config.routes.NEW_PASSWORD);
    else {
      const payload = {
        email: email,
      };

      dispatch({
        type: SagaActions.FORGOT_PASSWORD,
        payload,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        backgroundColor={config.colors.BACKGROUNDCOLOR}
        navigation={navigation}
        onPress={() => navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.subContainer}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: config.fonts.Poppins_Bold,
              color: config.colors.Black,
              textAlign: 'left',
            }}>{`${t('Forgot password?')}`}</Text>
          <Text
            style={{
              color: config.colors.Black,
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 14,
              lineHeight: 24,
              textAlign: 'left',
            }}>
            {t('Please confirm your country code and enter your phone number.')}
          </Text>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Email Address')}
              onChangeText={val => setEmail(val?.toLowerCase())}
              value={email}
              placeholder={t('Enter your email')}
              viewStyle={{marginHorizontal: 0}}
              keyboardType="email-address"
            />
          </View>
          <AppButton
            text={t('Next')}
            onPress={() => onPressPassword()}
            viewStyle={{marginTop: 30, marginHorizontal: 0}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: config.colors.BACKGROUNDCOLOR,
  },
  subContainer: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  forgotText: {
    fontSize: 20,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    textAlign: 'left',
  },
  PleaseEnterText: {
    color: config.colors.TextColor,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    marginTop: 5,
    lineHeight: 24,
    textAlign: 'left',
  },
  inputCss: {
    marginTop: 20,
  },
});

export default ForgotPassword;
