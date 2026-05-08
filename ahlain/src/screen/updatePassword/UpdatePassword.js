import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {UpdatePasswordReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';

const UpdatePassword = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const UpdatePasswordResponse = useSelector(
    UpdatePasswordReducer.selectUpdatePasswordData,
  );
  const UpdatePasswordErrorResponse = useSelector(
    UpdatePasswordReducer.selectUpdatePasswordResponse,
  );

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  // const [email, setEmail] = useState('');

  useEffect(() => {
    if (UpdatePasswordResponse != null) {
      if (UpdatePasswordResponse?.error == false) {
        Toast.show(UpdatePasswordResponse.message, Toast.LONG);
        dispatch(UpdatePasswordReducer.removeUpdatePasswordResponse());

        navigation.navigate(config.routes.CONFIRMATION);
      }
    }
  }, [UpdatePasswordResponse]);

  useEffect(() => {
    if (UpdatePasswordErrorResponse != null) {
      if (UpdatePasswordErrorResponse?.error == true) {
        Toast.show(UpdatePasswordErrorResponse.message, Toast.LONG);
        dispatch(UpdatePasswordReducer.removeUpdatePasswordResponse());
      }
    }
  }, [UpdatePasswordErrorResponse]);

  const onPressSave = () => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[$@$!%*?&.])[a-zA-Z0-9!#$%&?@]{6,}$/.test(
        password,
      );

    if (password == '') {
      return Toast.show(t('Please enter new password'), Toast.LONG);
    }
    if (confirmpassword == '') {
      return Toast.show(t('Please enter confirm password'), Toast.LONG);
    }
    if (password === '' || passwordRegex == false) {
      Toast.show(
        t(
          'Password must be 6 characters long (atleast 1 numerical, 1 alphabet, 1 special character).',
        ),
        Toast.LONG,
      );
    } else {
      {
        if (confirmpassword === '' || passwordRegex == false) {
          Toast.show(
            t(
              'Password must be 6 characters long (atleast 1 numerical, 1 alphabet, 1 special character).',
            ),
            Toast.LONG,
          );
        } else if (password !== confirmpassword) {
          // alert("Passwords don't match");
          Toast.show(
            t("New Password or confirm Password don't match"),
            Toast.LONG,
          );
        } else {
          const payload = {
            email: route?.params?.userEmail,
            password: password,
          };
          console.log('payload', payload);
          dispatch({
            type: SagaActions.UPDATE_PASSWORD,
            payload,
          });
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader navigation={navigation} onPress={() => navigation.goBack()} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.subContainer}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: config.fonts.Poppins_Bold,
              color: config.colors.Black,
              textAlign: 'left',
            }}>{`${t('Reset password')}`}</Text>
          <Text
            style={{
              color: config.colors.Black,
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 14,
              lineHeight: 24,
              textAlign: 'left',
            }}>
            {t('Please type something you\'ll remember')}
          </Text>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('New Password')}
              placeholder={t('Enter New Password')}
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
            <Text
              style={{
                fontSize: 11,
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.Gray,
                marginVertical: 5,
                textAlign: 'left',
              }}>
              {t(
                'Password must be 6 characters long (atleast 1 numerical, 1 alphabet, 1 special character).',
              )}
            </Text>

            <AppTextInput
              inputTextLabel={t('Confirm New Password')}
              placeholder={t('Enter Confirm Password')}
              onChangeText={val => setConfirmpassword(val)}
              value={confirmpassword}
              secureTextEntry={true}
              viewStyle={{marginHorizontal: 0}}
            />
          </View>
          <AppButton
            text={t('Reset password')}
            onPress={() => onPressSave()}
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
    backgroundColor: config.colors.BACKGROUNDCOLOR,
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

export default UpdatePassword;
