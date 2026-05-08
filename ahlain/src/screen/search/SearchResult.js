import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  I18nManager,
} from 'react-native';
import config from '../../config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {SearchResultReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import NoData from '../../conponents/NoData';

const SearchResult = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const SearchResultResponse = useSelector(
    SearchResultReducer.selectSearchResultData,
  );
  console.log('route?.params?.search_result', route?.params?.search_result);
  console.log(
    'SearchResultResponse',
    JSON.stringify(SearchResultResponse?.results?.suggestions),
  );
  useEffect(() => {
    dispatch({
      type: SagaActions.SEARCH_RESULT,
      payload: {search: route?.params?.search_result?._id},
    });
  }, []);

  //   useEffect(() => {
  //     if (SearchResultResponse != null) {
  //       if (SearchResultResponse?.error == false) {
  //         Toast.show(SearchResultResponse?.message, Toast.LONG);
  //       }
  //     }
  //   }, [SearchResultResponse]);

  const getReviewStarRatingView = rating => {
    let view = [];
    for (let index = 0; index < rating; index++) {
      view.push(
        <Image
          style={styles.startIcon}
          resizeMode="contain"
          source={require('../../assets/images/start.png')}
        />,
      );
    }
    return view;
  };
  const renderSearchItem = ({item, index}) => {
    return (
      <View style={{marginBottom: 10}} key={index}>
        <TouchableOpacity
          style={styles.mainCss}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(config.routes.VENDOR_DETAILS, {
              vendor_id: item.vendor._id,
            });
          }}>
          <ImageBackground
            resizeMode="cover"
            style={styles.bgImg}
            source={{uri: item?.vendor?.shop_cover_image}}>
            <LinearGradient
              colors={['transparent', 'transparent', '#000']}
              style={styles.linearGradient}>
              <View style={styles.bgImgView}>
                <Text style={styles.khanText}>{item.vendor.shop_name}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={styles.locationCss}>
                    <Image
                      style={styles.locationIcon}
                      resizeMode="contain"
                      source={require('../../assets/images/Location.png')}
                    />
                    <Text style={styles.locationText}>
                      {item.vendor.city}
                      {item.vendor.country}
                    </Text>
                  </View>
                  <View style={styles.locationCss}>
                    <Image
                      style={styles.startIcon}
                      resizeMode="contain"
                      source={require('../../assets/images/start.png')}
                    />
                    <Text style={styles.locationText}>
                      {item.vendor?.rating}
                      {'/5'}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>

          {/* <View style={styles.topview} /> */}
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 10}}>
          {item?.services?.map((sItem, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(config.routes.SERVICE, {
                    service_id: sItem?._id,
                  });
                }}
                style={styles.flatlistCss}
                key={index}>
                <Image
                  resizeMode="cover"
                  style={styles.partyImg}
                  source={{uri: sItem?.images[0]}}
                />
                <View style={styles.secondCss}>
                  <Text numberOfLines={2} style={styles.partyText}>
                    {I18nManager.isRTL ? sItem.name_ar : sItem.name_en}
                  </Text>
                  <View style={styles.infoCss}>
                    <Image
                      resizeMode="contain"
                      style={styles.InfoImg}
                      source={require('../../assets/images/Info.png')}
                    />
                    <Text numberOfLines={2} style={styles.InfoText}>
                      {I18nManager.isRTL
                        ? sItem.description_ar
                        : sItem.description_en}
                    </Text>
                  </View>
                  <View style={styles.sarCss}>
                    <Text style={styles.sarText}>
                      {sItem.price}
                      {' SAR'}
                    </Text>
                    <View style={styles.addCardCss}>
                      <Text style={styles.addCard}>{t('Details')}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCss}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.BackIcon}
            resizeMode="contain"
            source={require('../../assets/images/backArrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.tittle}>
          {I18nManager.isRTL
            ? route?.params?.search_result.name_ar
            : route?.params?.search_result.name_en}
        </Text>
        <TouchableOpacity activeOpacity={0.5}>
          {/* <Image
            style={styles.searchIcon}
            resizeMode="contain"
            source={require('../../assets/images/Search2.png')}
          /> */}
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {SearchResultResponse?.results?.suggestions?.length > 0 ? (
          <FlatList
            data={SearchResultResponse?.results?.suggestions}
            renderItem={renderSearchItem}
          />
        ) : (
          <NoData visible={true} text={t('No Data Found')} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  headerCss: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    // backgroundColor: 'pink',
    paddingTop: 2,
  },
  BackIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  tittle: {
    fontFamily: config.fonts.Poppins_Bold,
    color: '#333333',
    fontSize: 18,
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  mainCss: {
    marginHorizontal: 15,
  },
  linearGradient: {
    height: 150,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  bgImg: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
    borderRadius: 10,
    // justifyContent: 'flex-end',
    marginTop: 10,
  },
  bgImgView: {
    marginHorizontal: 20,
  },
  khanText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'left',
  },
  locationCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -5,
  },
  locationIcon: {
    width: 10,
    height: 12,
    tintColor: '#fff',
  },
  locationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.white,
    fontSize: 11,
    marginLeft: 5,
    marginTop: 2,
    textAlign: 'left',
  },
  startIcon: {
    width: 12,
    height: 12,
  },
  flatlistCss: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
    padding: 8,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: '#fff',
    width: 300,
  },
  partyImg: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    borderRadius: 10,
  },
  secondCss: {
    marginLeft: 10,
    flex: 1,
  },
  partyText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
    textAlign: 'left',
  },
  infoCss: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  InfoImg: {
    height: 10,
    width: 10,
  },
  InfoText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#E35829',
    fontSize: 9,
    marginLeft: 4,
    width: '70%',
    textAlign: 'left',
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  sarText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 13,
    textAlign: 'left',
  },
  addCardCss: {
    height: 25,
    width: 70,
    backgroundColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  addCard: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 10,

    textAlign: 'left',
  },
  startIcon: {
    width: 13,
    height: 12,
    marginHorizontal: 2,
  },
});

export default SearchResult;
