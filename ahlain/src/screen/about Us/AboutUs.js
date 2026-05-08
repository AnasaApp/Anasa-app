import React, {useEffect} from 'react';
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

const AboutUs = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const AboutUsResponse = useSelector(GetAboutUsReducer.selectGetAboutUsData);
  console.log('AboutUsResponse', JSON.stringify(AboutUsResponse));
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
          title={t('About Us')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCss}>
          <Text style={styles.dataText}>
            {I18nManager.isRTL
              ? AboutUsResponse?.results?.about[0]?.description_ar
              : AboutUsResponse?.results?.about[0]?.description_en}
            {/* These Client Terms of Service ("Client Terms") describe your
            rights and responsibilities when using our online client portal or
            other platforms (the "Services"). If you are a Client or an
            Authorized User (defined below), these Client Terms govern your
            access and use of the Services. "Client" is the organization that
            you represent in agreeing to the Contract (e.g. your employer).
            These Client Terms form a binding "Contract" between Client and us. */}
          </Text>
          {/* <View style={styles.secondTextCss}>
            <Text style={styles.dataText}>
              Individuals authorized by Client to access the Services (an
              "Authorized User") may submit content to the Services, such as
              textual data or files ("Client Data"). Client Will: Individuals
              authorized by Client to access the Services (an "Authorized User")
              may submit content to the Services, such as textual data.
            </Text>
          </View> */}
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

export default AboutUs;
