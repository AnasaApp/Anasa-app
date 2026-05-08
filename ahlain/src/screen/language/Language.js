import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import {useTranslation} from 'react-i18next';
import {ChangeLanguageReducer} from '../../redux/reducers';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {useDispatch, useSelector} from 'react-redux';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Language = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const ChangeLanguageResponse = useSelector(
    ChangeLanguageReducer.selectChangeLanguageData,
  );
  const [selectLanguage, setSelectLanguage] = useState('');

  const slider = () => {
    navigation.navigate(config.routes.SLIDER);
  };

  useEffect(() => {
    getUserLanguage();
  }, []);
  const getUserLanguage = async () => {
    const lang = await AsyncStorage.getItem('user_language');
    if (lang) {
      setSelectLanguage(lang);
    } else {
      setSelectLanguage('');
    }
  };

  const changeLanguageApi = async lang => {
    setSelectLanguage(lang);
    await AsyncStorage.setItem('user_language', lang);

    const language = lang == 'Arabic' ? 'ar' : 'en';

    i18n
      .changeLanguage(language)
      .then(() => {
        if (language == 'ar') {
          I18nManager.forceRTL(true);
          setTimeout(() => {
            RNRestart.Restart();
          }, 500);
        } else {
          I18nManager.forceRTL(false);
          setTimeout(() => {
            RNRestart.Restart();
          }, 500);
        }
      })
      .catch(err => {
        console.log('something went wrong while applying RTL');
      });
    // dispatch({type: SagaActions.CHANGE_LANGUAGE, payload: {language: lang}});
  };

  return (
    <View style={styles.bgImg}>
      <View style={styles.firstCss}>
        <Image
          style={styles.anasaLogo}
          resizeMode="contain"
          source={require('../../assets/images/anasaLogo.png')}
        />
        <Text
          style={{
            fontSize: 22,
            textAlign: 'center',
            lineHeight: 30,
            marginTop: 20,
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_SemiBold,
          }}>
          {t('Welcome to Anasa')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 22,
            marginTop: 10,
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_Regular,
          }}>
          {t('Let’s plane your moment')}
        </Text>
      </View>
      <View style={styles.secondCss}>
        <View style={styles.chooselanguageCss}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 26,
              marginTop: 20,
              color: config.colors.Black,
              fontFamily: config.fonts.Poppins_Regular,
            }}>
            {t('Please select your preferred language')}
          </Text>
        </View>
        <View style={styles.flagMainCss}>
          <TouchableOpacity
            onPress={() => changeLanguageApi('English')}
            style={{
              width: '48%',
              backgroundColor:
                selectLanguage == 'English'
                  ? config.colors.buttonColor
                  : config.colors.BACKGROUNDCOLOR,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 55,
              borderRadius: 6,
            }}>
            <Text
              style={[
                styles.languageText,
                {color: selectLanguage == 'English' ? '#FFFFFF' : '#000000'},
              ]}>
              English
            </Text>
            <Image
              style={styles.flag}
              resizeMode="cover"
              source={require('../../assets/images/EnglishFlag.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeLanguageApi('Arabic')}
            style={{
              width: '48%',
              backgroundColor:
                selectLanguage == 'Arabic'
                  ? config.colors.buttonColor
                  : config.colors.BACKGROUNDCOLOR,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 55,
              borderRadius: 6,
            }}>
            <Text
              style={[
                styles.languageText,
                {color: selectLanguage == 'Arabic' ? '#FFFFFF' : '#000000'},
              ]}>
              Arabic
            </Text>
            <Image
              style={styles.flag}
              resizeMode="cover"
              source={require('../../assets/images/FlagSaudi.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  firstCss: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anasaLogo: {
    height: 144,
    width: 144,
  },
  secondCss: {
    flex: 0.4,
    backgroundColor: config.colors.white,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 20,
  },
  chooselanguageCss: {
    paddingVertical: 10,
  },
  chooselanguageText: {
    fontSize: 22,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#70707033',
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
  },
  flagMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    marginBottom: 50,
  },
  flagCss: {
    marginTop: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    width: 150,
    height: 120,
    justifyContent: 'center',
  },
  flag: {
    height: 24,
    width: 24,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  languageText: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginHorizontal: 10,
  },
});
