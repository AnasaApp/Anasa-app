import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import Toast from 'react-native-simple-toast';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {ChangePasswordReducer} from '../../redux/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import * as Progress from 'react-native-progress';

const ChangePassword = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const ChangePasswordResponse = useSelector(
    ChangePasswordReducer.selectChangePasswordData,
  );
  const ChangePasswordErrorResponse = useSelector(
    ChangePasswordReducer.selectChangePasswordResponse,
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(true);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isValidLength, setIsValidLength] = useState(false);
  useEffect(() => {
    if (ChangePasswordResponse != null) {
      if (ChangePasswordResponse?.error == false) {
        Toast.show(ChangePasswordResponse.message, Toast.LONG);
        navigation.navigate(config.routes.SETTINGS);
        dispatch(ChangePasswordReducer.removeChangePasswordResponse());
      }
    }
  }, [ChangePasswordResponse]);

  useEffect(() => {
    if (ChangePasswordErrorResponse != null) {
      if (ChangePasswordErrorResponse?.status == false) {
        Toast.show(ChangePasswordErrorResponse.message, Toast.LONG);
        dispatch(ChangePasswordReducer.removeChangePasswordResponse());
      }
    }
  }, [ChangePasswordErrorResponse]);
  const onChangePassword = text => {
    const minLengthRegex = /^.{8,}$/; // Checks for minimum 8 characters
    const lowercaseRegex = /[a-z]/; // Checks for lowercase letters
    const uppercaseRegex = /[A-Z]/; // Checks for uppercase letters
    const digitRegex = /\d/; // Checks for digits
    const specialCharRegex = /[@#$!%*?&]/; // Checks for special characters

    // Validate each condition
    const isValidLength = minLengthRegex.test(text);
    const hasLowercase = lowercaseRegex.test(text);
    const hasUppercase = uppercaseRegex.test(text);
    const hasDigit = digitRegex.test(text);
    const hasSpecialChar = specialCharRegex.test(text);

    let progress = 0;
    // Reset the state for visual feedback
    setHasDigit(false);
    setHasLowercase(false);
    setHasUppercase(false);
    setHasSpecialChar(false);
    setIsValidLength(false);

    // Calculate progress based on password validity
    if (hasLowercase) {
      progress += 0.2;
      setHasLowercase(true);
    }
    if (hasUppercase) {
      progress += 0.2;
      setHasUppercase(true);
    }
    if (hasDigit) {
      progress += 0.2;
      setHasDigit(true);
    }
    if (hasSpecialChar) {
      progress += 0.2;
      setHasSpecialChar(true);
    }
    if (isValidLength) {
      progress += 0.2;
      setIsValidLength(true);
    }

    // Ensure progress doesn't exceed 100%
    progress = Math.min(progress, 1);

    // Set the progress percentage and password value
    setProgressPercentage(progress);
    setPassword(text);
  };
  const onPressSave = () => {
    if (oldPassword === '') {
      return Toast.show(t('Old Password should not be empty'), Toast.LONG);
    }
    if (password === '') {
      return Toast.show(t('Password should not be empty'), Toast.LONG);
    }
    if (progressPercentage < 1) {
      return Toast.show(
        t(
          'Password must be 8 characters long contains lowercase, uppercase and numeric letters',
        ),
        Toast.LONG,
      );
    }
    if (password != confirmPassword) {
      return Toast.show(
        t('Password and Confirm Password should be same'),
        Toast.LONG,
      );
    }

    const payload = {
      oldPassword: oldPassword,
      newPassword: password,
    };
    dispatch({
      type: SagaActions.CHANGE_PASSWORD,
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
          title={t('Change Password')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 15}}
        showsVerticalScrollIndicator={false}>
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
            }}>
            {t('Reset Password')}
          </Text>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Old Password')}
              placeholder={t('Old Password')}
              onChangeText={val => setOldPassword(val)}
              value={oldPassword}
              secureTextEntry={isOldPasswordVisible}
              viewStyle={{marginHorizontal: 0}}
              rightIcon={
                isOldPasswordVisible == true
                  ? require('../../assets/images/Hide.png')
                  : require('../../assets/images/view.png')
              }
              rightIconPress={() =>
                setIsOldPasswordVisible(!isOldPasswordVisible)
              }
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('New Password')}
              placeholder={t('Enter New Password')}
              onChangeText={val => onChangePassword(val)}
              value={password}
              secureTextEntry={isPasswordVisible}
              viewStyle={{marginHorizontal: 0}}
              rightIcon={
                isPasswordVisible == true
                  ? require('../../assets/images/Hide.png')
                  : require('../../assets/images/view.png')
              }
              rightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Confirm New Password')}
              placeholder={t('Enter Confirm Password')}
              onChangeText={val => setConfirmPassword(val)}
              value={confirmPassword}
              viewStyle={{marginHorizontal: 0}}
              secureTextEntry={isConfirmPasswordVisible}
              rightIcon={
                isConfirmPasswordVisible == true
                  ? require('../../assets/images/Hide.png')
                  : require('../../assets/images/view.png')
              }
              rightIconPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            />
          </View>
          <View>
            {password && (
              <View style={{marginTop: 15}}>
                <Progress.Bar
                  color={config.colors.orangeColor}
                  borderColor={config.colors.orangeColor}
                  unfilledColor={config.colors.white}
                  borderRadius={10}
                  progress={progressPercentage}
                  width={config.constants.Width - 80}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                }}
                source={
                  isValidLength
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
              <Text
                style={{
                  fontFamily: config.fonts.MontserratMedium,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 18,
                  marginLeft: 10,
                  width: '90%',
                  textAlign: 'left',
                }}>
                {t('Minimum of 8 characters')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                }}
                source={
                  hasLowercase
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
              <Text
                style={{
                  fontFamily: config.fonts.MontserratMedium,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 18,
                  marginLeft: 10,
                  width: '90%',
                  textAlign: 'left',
                }}>
                {t('At least one lowercase letter (a-z)')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                }}
                source={
                  hasUppercase
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
              <Text
                style={{
                  fontFamily: config.fonts.MontserratMedium,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 18,
                  marginLeft: 10,
                  width: '90%',
                  textAlign: 'left',
                }}>
                {t('At least one uppercase letter (A-Z)')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                }}
                source={
                  hasDigit
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
              <Text
                style={{
                  fontFamily: config.fonts.MontserratMedium,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 18,
                  marginLeft: 10,
                  width: '90%',
                  textAlign: 'left',
                }}>
                {t('At least one number (0-9)')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{
                  width: 18,
                  height: 18,
                  resizeMode: 'contain',
                }}
                source={
                  hasSpecialChar
                    ? require('../../assets/images/Tick.png')
                    : require('../../assets/images/Untick.png')
                }
              />
              <Text
                style={{
                  fontFamily: config.fonts.MontserratMedium,
                  fontSize: 14,
                  color: config.colors.blackColor,
                  lineHeight: 18,
                  marginLeft: 10,
                  width: '90%',
                  textAlign: 'left',
                }}>
                {t('At least one special character (e.g., @, #, $, %, &, *)')}
              </Text>
            </View>
          </View>
          <AppButton
            text={t('Save')}
            onPress={() => onPressSave()}
            viewStyle={{marginHorizontal: 15, marginVertical: 15}}
            buttonStyle={{
              backgroundColor: config.colors.blueColor,
            }}
          />
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
    // marginTop: 15,
  },
  inputCss: {
    marginTop: 10,
  },
  nameText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: '#ABABB6',
    fontSize: 14,
  },
});

export default ChangePassword;
