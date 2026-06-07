import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import config from '../../config';
import {useTranslation} from 'react-i18next';
import {applyLanguageAndRestart} from '../../utils/languageHelpers';

const Language = () => {
  const {t} = useTranslation();

  const [selectLanguage, setSelectLanguage] = useState('');

  const changeLanguageApi = async lang => {
    if (lang === selectLanguage) {
      return;
    }
    setSelectLanguage(lang);
    try {
      await applyLanguageAndRestart(lang);
    } catch (error) {
      console.log('Language change error:', error);
    }
  };

  return (
    <View style={styles.bgImg}>
      <View style={styles.firstCss}>
        <Image
          style={styles.anasaLogo}
          resizeMode="contain"
          source={require('../../assets/images/anasaLogo.png')}
        />
        <Text style={styles.welcomeTitle}>{t('Welcome to Anasa')}</Text>
        <Text style={styles.welcomeSubtitle}>
          {t("Let's plan your moment")}
        </Text>
      </View>
      <View style={styles.secondCss}>
        <Text style={styles.chooseLanguageText}>
          {t('Please select your preferred language')}
        </Text>
        <View style={styles.flagMainCss}>
          <TouchableOpacity
            onPress={() => changeLanguageApi('English')}
            style={[
              styles.langButton,
              selectLanguage === 'English' && styles.langButtonSelected,
            ]}>
            <Text
              style={[
                styles.languageText,
                selectLanguage === 'English' && styles.languageTextSelected,
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
            style={[
              styles.langButton,
              selectLanguage === 'Arabic' && styles.langButtonSelected,
            ]}>
            <Text
              style={[
                styles.languageText,
                selectLanguage === 'Arabic' && styles.languageTextSelected,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  anasaLogo: {
    height: 144,
    width: 144,
  },
  welcomeTitle: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 30,
    marginTop: 20,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
  },
  secondCss: {
    backgroundColor: config.colors.white,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  chooseLanguageText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
  },
  flagMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  langButton: {
    width: '48%',
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 6,
  },
  langButtonSelected: {
    backgroundColor: config.colors.buttonColor,
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
    color: config.colors.Black,
  },
  languageTextSelected: {
    color: config.colors.white,
  },
});
