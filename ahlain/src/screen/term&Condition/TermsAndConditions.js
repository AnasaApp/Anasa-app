import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {GetTandCReducer} from '../../redux/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';

const TermsAndConditions = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetTandCResponse = useSelector(GetTandCReducer.selectGetTandCData);
  console.log('GetTandCResponse', JSON.stringify(GetTandCResponse));
  useEffect(() => {
    dispatch({type: SagaActions.GET_T_AND_C, payload: ''});
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
          title={t('Terms & Conditions')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main_Css}>
          <Text style={styles.txt}>
            {/* {`Individuals authorized by Client to access the Services (an "Authorzed User") may submit content to the Services, such as textual data or files ("Client Data"). Client Will:`} */}

            {I18nManager.isRTL
              ? GetTandCResponse?.results?.TandC[0]?.description_ar
              : GetTandCResponse?.results?.TandC[0]?.description_en}
          </Text>
          {/*
          <View
            style={{
              margin: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                marginTop: 6,
                backgroundColor: config.colors.Black,
              }}></View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: config.fonts.Poppins_Regular,
                lineHeight: 25,
                color: config.colors.Black,
                paddingLeft: 10,
              }}>
              {`Individuals authorized by Client to access the Services (an "Authorzed User") may submit content to the Services, such as textual data or files ("Client Data"). Client Will:`}
            </Text>
          </View>
          <View
            style={{
              margin: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                marginTop: 6,
                backgroundColor: config.colors.Black,
              }}></View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: config.fonts.Poppins_Regular,
                lineHeight: 25,
                color: config.colors.Black,
                paddingLeft: 10,
              }}>
              {`Authorized by Client to access the Services (an "Authorized User") may submit content to the Services.`}
            </Text>
          </View>
          <View
            style={{
              margin: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                marginTop: 6,
                backgroundColor: config.colors.Black,
              }}></View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: config.fonts.Poppins_Regular,
                lineHeight: 25,
                color: config.colors.Black,
                paddingLeft: 10,
              }}>
              {`Authorized by Client to access the Services (an "Authorized User") may submit content to the Services.`}
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

export default TermsAndConditions;
