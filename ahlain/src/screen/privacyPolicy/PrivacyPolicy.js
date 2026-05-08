import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import {useDispatch, useSelector} from 'react-redux';
import {GetPrivacyPolicyReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';

const PrivacyPolicy = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetPrivacyPolicyResponse = useSelector(
    GetPrivacyPolicyReducer.selectGetPrivacyPolicyData,
  );
  console.log(
    'GetPrivacyPolicyResponse',
    JSON.stringify(GetPrivacyPolicyResponse),
  );
  useEffect(() => {
    dispatch({type: SagaActions.GET_PRIVACY_POLICY, payload: ''});
  }, []);
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
          title={t('Privacy Policy')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main_Css}>
          <Text style={styles.txt}>
            {/* {`Individuals authorized by Client to access the Services (an "Authorzed User") may submit content to the Services, such as textual data or files ("Client Data"). Client Will:`} */}

            {I18nManager.isRTL
              ? GetPrivacyPolicyResponse?.results?.privacy[0]?.description_ar
              : GetPrivacyPolicyResponse?.results?.privacy[0]?.description_en}
          </Text>
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
  main_Css: {
    marginHorizontal: 20,
  },
  txt: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Regular,
    lineHeight: 25,
    color: config.colors.Black,
    marginTop: 20,
    textAlign: 'left',
  },
});

export default PrivacyPolicy;
