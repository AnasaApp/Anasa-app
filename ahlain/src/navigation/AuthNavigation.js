import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import config from '../config';
import ChangePassword from '../screen/changePassword/ChangePassword';
import ForgotPassword from '../screen/forgotPassword/ForgotPassword';
import LogIn from '../screen/logIn/LogIn';
import OtpVerification from '../screen/otpVerify/OtpVerification';
import SignUp from '../screen/singUp/SignUp';
import TermsAndConditions from '../screen/term&Condition/TermsAndConditions';
import UpdatePassword from '../screen/updatePassword/UpdatePassword';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => (
  <Stack.Navigator
  initialRouteName={config.routes.LOG_IN}
  screenOptions={{headerShown: false}}>
    <Stack.Screen component={SignUp}
    name={config.routes.SIGN_UP}
    />
    <Stack.Screen
      component={TermsAndConditions}
      name={config.routes.TERMS_AND_CONDITIONS}
    />
    <Stack.Screen
      component={OtpVerification}
      name={config.routes.OTP_VERIFICATION}
    />
    <Stack.Screen component={LogIn}
    name={config.routes.LOG_IN}
    />
    <Stack.Screen
      component={ForgotPassword}
      name={config.routes.FORGOT_PASSWORD}
    />
    <Stack.Screen component={UpdatePassword}
    name={config.routes.UPDATE_PASSWORD}
    />
    <Stack.Screen component={ChangePassword}
    name={config.routes.CHANGE_PASSWORD}
    />
  </Stack.Navigator>
);

export default AuthNavigation;
