import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  I18nManager,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import config from '../../config';
import {useTranslation} from 'react-i18next';
import {goToLogin} from '../../conponents/NavigationRef';

const Slider = props => {
  const {t, i18n} = useTranslation();

  const scrollViewRef = useRef(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = [
    {
      key: 's1',
      text: 'Organize Your Events with Ease',
      subText: 'Everything you need to create a memorable event in one place.',
      image: require('../../assets/images/slide1.jpg'),
    },
    {
      key: 's2',
      text: 'Design Your Dream Party',
      subText:
        'Customize every detail of your celebration - to perfectly reflect your style.',
      image: require('../../assets/images/slide2.jpg'),
    },
    {
      key: 's3',
      text: 'Make Your Gathering Easier',
      subText:
        'You can organize meeting with ease and efficiency, making every moment ',
      image: require('../../assets/images/slide3.jpg'),
    },
  ];
  const scrollToIndex = index => {
    if (scrollViewRef.current) {
      if (index > 2) {
        goToLogin(config.routes.HOME_SCREEN);
      } else {
        scrollViewRef.current.scrollToIndex({index, animated: true});
      }
    }
  };
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    // Check if viewableItems array is not empty
    if (viewableItems.length > 0) {
      // Get the index of the first viewable item
      const index = viewableItems[0].index;
      // Update the currentIndex state
      setCurrentSlideIndex(index);
    }
  }).current;

  const RenderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          height: Dimensions.get('screen').height,
          width: Dimensions.get('screen').width,
          paddingHorizontal: 20,
        }}>
        <Image
          style={{
            opacity: 0.5,
            position: 'absolute',
            resizeMode: 'cover',
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
          }}
          resizeMode="cover"
          source={item?.image}
        />
        <Text
          onPress={() => {
            goToLogin(config.routes.HOME_SCREEN);
          }}
          style={{
            fontSize: 14,
            lineHeight: 25,
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_SemiBold,
            marginTop: 50,
            alignSelf: 'flex-end',
          }}>
          {t('Skip')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: 120,
            paddingHorizontal: 20,
          }}>
          <View style={{marginHorizontal: 10, width: '80%'}}>
            <Text
              style={{
                fontSize: 24,
                lineHeight: 32,
                color: config.colors.Black,
                fontFamily: config.fonts.Poppins_SemiBold,
              }}>
              {t(item?.text)}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: config.colors.Black,
                fontFamily: config.fonts.Poppins_Regular,
                marginTop: 10,
              }}>
              {t(item?.subText)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                scrollToIndex(currentSlideIndex + 1);
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: config.colors.white,
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: config.colors.Black,
                    transform: [
                      {
                        rotate: I18nManager.isRTL ? '180deg' : '0deg',
                      },
                    ],
                  }}
                  resizeMode={'contain'}
                  source={require('../../assets/images/next.png')}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              {slides.length > 1 &&
                slides.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.dot,
                      i === currentSlideIndex
                        ? {
                            backgroundColor: config.colors.buttonColor,
                            width: 10,
                          }
                        : {backgroundColor: config.colors.Gray},
                    ]}
                    onPress={() => scrollToIndex(i)}
                  />
                ))}
            </View>
          </View>
        </View>

        {/* <_renderPagination /> */}
      </View>
    );
  };
  const _renderPagination = () => {
    const activeIndex = currentSlideIndex;
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {slides.length > 1 &&
            slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? {
                        backgroundColor: config.colors.buttonColor,
                        width: 20,
                      }
                    : {backgroundColor: config.colors.Gray},
                ]}
                onPress={() => scrollToIndex(i)}
              />
            ))}
        </View>
        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              scrollToIndex(currentSlideIndex + 1);
            }}
            style={[styles.buttonCircle, {marginBottom: 30}]}>
            <Text style={styles.nextText}>{t('Next')}</Text>
            <Image
              style={styles.next_icon}
              resizeMode={'contain'}
              source={require('../../assets/images/nextIcon.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              scrollToIndex(currentSlideIndex + 1);
            }}
            style={{alignItems: 'center', marginBottom: 30}}>
            <View style={styles.buttonCircle}>
              <Text style={styles.getstartText}>{t('Get Started')}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.navigate('AuthNavigation');
          }}
          style={{
            marginBottom: 30,
          }}>
          <Text style={styles.skipText}>{t('Skip')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={'transparent'}
        translucent={true}
      />
      <FlatList
        ref={scrollViewRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        renderItem={RenderItem} />
      {/*<AppIntroSlider
        data={slides}
        renderItem={RenderItem}
        ref={slider}
        onSlideChange={(index, lastIndex) => {
          setCurrentSlideIndex(index);
        }}
        renderPagination={_renderPagination}
      /> */}
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
    backgroundColor: config.colors.white,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
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
    color: config.colors.blackColor,
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
    color: config.colors.blackColor,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_Medium,
  },
  getstartText: {
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'center',
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 5,
    right: 10,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
