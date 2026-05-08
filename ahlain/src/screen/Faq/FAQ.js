import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {useDispatch, useSelector} from 'react-redux';
import {GetAboutUsReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';

const FAQ = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const [faqItem, setFAQItem] = useState(route?.params?.faqItem ?? '');
  useEffect(() => {
    dispatch({type: SagaActions.GET_ABOUT_US, payload: ''});
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
          title={t('FAQ')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCss}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 16,
              lineHeight: 24,
              marginTop: 10,
            }}>
            {I18nManager?.isRTL ? faqItem?.title_ar : faqItem?.title_en}
          </Text>
          <Text style={styles.dataText}>
            {I18nManager.isRTL
              ? faqItem?.description_ar
              : faqItem?.description_en}
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
  mainCss: {
    marginHorizontal: 15,
    flex: 1,
  },
  dataText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13.5,
    color: '#313450',
    marginTop: 10,
    lineHeight: 24,
    textAlign: 'left',
  },
  secondTextCss: {
    marginTop: 20,
  },
});

export default FAQ;
