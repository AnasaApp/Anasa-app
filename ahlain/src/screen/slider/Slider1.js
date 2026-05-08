import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  I18nManager,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import config from '../../config';
import {useTranslation} from 'react-i18next';

const Slider = props => {
  const {t, i18n} = useTranslation();
  const slides = [
    {
      key: 's1',
      text: ' ',
      image: require('../../assets/images/slide1.png'),
      text_en: 'Welcome!!',
      text_ar: 'مرحباً!!',
      backgroundColor: '#FAFAFA',
    },
    {
      key: 's2',
      text: ' ',
      image: require('../../assets/images/slide2.png'),
      text_en: 'All your fun party and gatherings  preparations are found here',
      text_ar: 'يمكنك العثور هنا على جميع تجهيزات الحفلات والتجمعات الممتعة',
      backgroundColor: '#FAFAFA',
    },
    {
      key: 's3',
      text: ' ',
      image: require('../../assets/images/slide3.png'),
      text_en:
        'Login to Anasa to plan your gatherings and parties through one application',
      text_ar:
        'قم بتسجيل الدخول إلى Anasa للتخطيط لتجمعاتك وحفلاتك من خلال تطبيق واحد',
      backgroundColor: '#FAFAFA',
    },
  ];

  const onDone = () => {
    props.navigation.navigate('AuthNavigation');
  };
  const onSkip = () => {
    props.navigation.navigate('AuthNavigation');
  };
  const RenderNextButton = () => {
    return (
      <View style={[styles.buttonCircle, {marginBottom: 20}]}>
        <Text style={styles.nextText}>{t('Next')}</Text>
        <Image
          style={styles.next_icon}
          resizeMode={'contain'}
          source={require('../../assets/images/nextIcon.png')}
        />
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={{alignItems: 'center', marginBottom: 50}}>
        <View style={styles.buttonCircle}>
          <Text style={styles.getstartText}>{t('Get Started')}</Text>
        </View>
      </View>
    );
  };
  const renderSkipButton = () => {
    return (
      <View>
        <Text style={styles.skipText}>{t('Skip')}</Text>
      </View>
    );
  };
  const RenderItem = ({item}) => {
    return (
      <View style={[styles.slideCss, {backgroundColor: item.backgroundColor}]}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Image
            style={styles.introImageStyle}
            resizeMode="contain"
            source={item.image}
          />
          <Text style={styles.introTextStyle}>{item.text}</Text>
          <Text style={styles.text1}>
            {I18nManager.isRTL ? item?.text_ar : item.text_en}
          </Text>
        </ScrollView>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
      }}>
      <AppIntroSlider
        data={slides}
        renderItem={RenderItem}
        onDone={onDone}
        showSkipButton={true}
        onSkip={onSkip}
        renderDoneButton={RenderDoneButton}
        renderNextButton={RenderNextButton}
        renderSkipButton={renderSkipButton}
        bottomButton
        dotStyle={{backgroundColor: '#9E9E9E', marginTop: 10}}
        activeDotStyle={{
          backgroundColor: '#4F74B0',
          height: 7,
          width: 22,
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideCss: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 15,
    // paddingBottom: 100,
  },
  logoImg: {
    alignSelf: 'center',
    height: 51,
    width: 130,
    marginTop: 20,
  },
  nextText: {
    fontSize: 16,
    textAlign: 'center',
    color: config.colors.white,
    fontFamily: config.fonts.Poppins_Medium,
  },
  introImageStyle: {
    width: 268,
    height: 264,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 0.5,
  },
  introTextStyle: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 25,
    color: '#000',
    fontFamily: config.fonts.Poppins_SemiBold,
  },
  text1: {
    color: config.colors.Black,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    marginTop: 15,
    fontFamily: config.fonts.Poppins_Regular,
  },
  buttonCircle: {
    width: 180,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: config.colors.buttonColor,
    alignSelf: 'center',
    // marginTop:10
  },
  next_icon: {
    marginHorizontal: 5,
    height: 8,
    width: 23,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
    // marginTop:5
  },
  skipText: {
    color: config.colors.Black,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_Medium,
  },
  getstartText: {
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
});
