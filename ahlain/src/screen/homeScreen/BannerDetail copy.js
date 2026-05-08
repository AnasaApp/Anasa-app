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
  Share,
} from 'react-native';
import config from '../../config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {AddToCartReducer, GetComboDetailReducer, SearchResultReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AppHeader from '../../conponents/AppHeader';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {trackEvents} from '../../config/FCMEvents';

const BannerDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
   const GetComboDetailResponse = useSelector(
      GetComboDetailReducer.selectGetComboDetailData,
    );
  const AddToCartResponse = useSelector(AddToCartReducer.selectAddToCartData);
  const AddToCartErrorResponse = useSelector(
    AddToCartReducer.selectAddToCartResponse,
  );
  const [bannerItem, setBannerItem] = useState('');
  useEffect(() => {
    if (GetComboDetailResponse != null) {
      if (GetComboDetailResponse?.error == false) {
      setBannerItem(GetComboDetailResponse?.results?.advertisement);
        dispatch(GetComboDetailReducer.removeGetComboDetailResponse());
      }
    }
  }, [GetComboDetailResponse]);
  useEffect(() => {
    if (AddToCartResponse != null) {
      if (AddToCartResponse?.error == false) {
        Toast.show(AddToCartResponse?.message, Toast.LONG);

        navigation.navigate(config.routes.CART);
        dispatch(AddToCartReducer.removeAddToCartResponse());
      }
    }
  }, [AddToCartResponse]);
  useEffect(() => {
    if (AddToCartErrorResponse != null) {
      Toast.show(AddToCartErrorResponse?.message, Toast.LONG);

      dispatch(AddToCartReducer.removeAddToCartResponse());
    }
  }, [AddToCartErrorResponse]);
  useEffect(() => {
    dispatch({
      type: SagaActions.GET_COMBO_DETAIL,
      payload: {
        uri: '/' + route?.params?.banner_id,
      },
    });
  }, []);

  function isCustomizeRequired(data) {
    for (let attribute of data) {
      if (attribute?.service?.packages?.length > 0) {
        const matchingPackage = bannerItem?.type.find(
          item => item._id === attribute?._id,
        );
        if (!matchingPackage?.package) {
          return `${t('Please Choose')} ${
            I18nManager?.isRTL
              ? attribute?.service?.name_ar
              : attribute?.service?.name_en
          } ${t('option')}`;
        }
      }
    }
    return false;
  }
  const onPressAddToCart = () => {
    if (isCustomizeRequired(bannerItem?.type) != '') {
      return Toast.show(isCustomizeRequired(bannerItem?.type), Toast.SHORT);
    }
    const payload = {
      combo: bannerItem?._id,
      price: bannerItem?.comboPrice,
      comboServices: bannerItem?.type,
    };

    // trackEvents('add_to_cart', payload);
    dispatch({type: SagaActions.ADD_TO_CART, payload});
  };
  const handleReceiveCustomization = receivedData => {
    var newIndex = bannerItem?.type?.findIndex(
      item => item?.service?._id === receivedData?.service_id,
    );
    if (newIndex != -1) {
      const temp = {...bannerItem};
      temp.type = [...bannerItem.type];
      temp.type[newIndex] = {
        ...temp.type[newIndex],
        package: receivedData?.package,
        price: receivedData?.customize_price,
      };

      setBannerItem(temp);
    }
  };
  const callShareApi = async id => {
    // const getLink = await generateLink();
    const link = 'https://anasa.site:2053/combo/' + id;
    try {
      Share.share({
        message: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={
          I18nManager?.isRTL
            ? bannerItem.name_ar
            : bannerItem?.name_en
        }
        rightimg={require('../../assets/images/share_icon.png')}
        onRightPress={() => {
          callShareApi(bannerItem?._id);
        }}
        rightImageStyle={{
          width: 20,
          height: 20,
          transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
        }}
      />

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 20}}>
        {bannerItem && (
          <>
            {bannerItem?.type?.map((banner_itm, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate(config.routes.SERVICE, {
                      service_id: banner_itm?.service?._id,
                      from: 'banner',
                    });
                  }}
                  key={index}
                  style={{marginBottom: 10}}>
                  <View style={styles.flatlistMainCss}>
                    <Image
                      style={styles.partyDecor}
                      source={{uri: banner_itm?.service?.images[0]}}
                    />
                    <View style={styles.ballonCss}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={styles.BalloondecorText} numberOfLines={1}>
                          {I18nManager?.isRTL
                            ? banner_itm?.service.name_ar
                            : banner_itm?.service.name_en}
                        </Text>
                      </View>

                      <Text style={styles.Service}>
                        {I18nManager?.isRTL
                          ? banner_itm?.service.description_ar
                          : banner_itm?.service.description_en}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 5,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Image
                            style={{width: 32, height: 32, borderRadius: 40}}
                            source={{uri: banner_itm?.vendor?.shop_cover_image}}
                          />
                          <Text style={styles.Service}>
                            {I18nManager?.isRTL
                              ? banner_itm?.vendor?.shop_name
                              : banner_itm?.vendor?.shop_name_ar}
                          </Text>
                        </View>
                        <View>
                          <Image
                            style={{width: 32, height: 32, borderRadius: 40}}
                            source={{uri: banner_itm?.category?.image}}
                          />
                          <Text style={styles.Service}>
                            {I18nManager?.isRTL
                              ? banner_itm?.category?.name_ar
                              : banner_itm?.category?.name_en}
                          </Text>
                        </View>
                      </View>
                      {banner_itm?.service?.packages?.length > 0 && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            navigation.navigate(config.routes.SERVICE, {
                              service_id: banner_itm?.service?._id,
                              from: 'select_customization',
                              onSelectCustomization: handleReceiveCustomization,
                            });
                          }}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: config.colors.buttonColor,
                            borderRadius: 12,
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontFamily: config.fonts.Poppins_Regular,
                              color: config.colors.buttonColor,
                              fontSize: 11,
                            }}>
                            {t('Select Customization')}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {banner_itm?.package?.length > 0 && (
                        <View style={{marginTop: 4}}>
                          {banner_itm?.package?.map((p, ind) => {
                            return (
                              <Text
                                key={ind}
                                style={{
                                  fontFamily: config.fonts.Poppins_Medium,
                                  color: config.colors.Light_Black,
                                  fontSize: 10,
                                  textAlign: 'left',
                                }}>
                                {`${
                                  I18nManager.isRTL
                                    ? p?.customized_option_title_ar
                                    : p?.customized_option_title_en
                                } : ${p?.options
                                  ?.map(op =>
                                    I18nManager?.isRTL
                                      ? op.option_ar
                                      : op.option_en,
                                  )
                                  .join(', ')
                                  .toString()
                                  .toLowerCase()}`}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
      <View style={styles.mainCss}>
        <View>
          <Text style={styles.priceText}>{t('Price')}</Text>
          <View style={styles.sarCss}>
            <Text style={styles.numberText}>{bannerItem?.comboPrice}</Text>
            <Text style={styles.sarText}>SAR</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.buttonCss]}
          activeOpacity={0.5}
          onPress={() => {
            onPressAddToCart();
          }}>
          <Image
            resizeMode="contain"
            style={styles.plusIcon}
            source={require('../../assets/images/plus.png')}
          />
          <Text style={styles.buttonText}>{t('Add to cart')}</Text>
        </TouchableOpacity>
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
  },
  startIcon: {
    width: 12,
    height: 12,
  },
  serviceText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
  },
  partyDecor: {
    height: 70,
    width: '24%',
    overflow: 'hidden',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  BalloondecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 16,
    textAlign: 'left',
  },
  Service: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
    textAlign: 'left',
  },
  sartxt: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#4F74B0',
    fontSize: 14,
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 12,
    marginHorizontal: 5,
  },
  flatlistMainCss: {
    flexDirection: 'row',
    // marginHorizontal: 5,
    backgroundColor: config.colors.white,
    elevation: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 10,
    width: '100%',
  },
  flatlistCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ballonCss: {
    marginLeft: 10,
    width: '70%',
  },
  addCardCss: {
    height: 35,
    width: 100,
    backgroundColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  flatlistCss: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: '#fff',
  },
  partyImg: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    borderRadius: 10,
  },
  secondCss: {
    marginLeft: 10,
  },
  partyText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
  },
  infoCss: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  InfoImg: {
    height: 10,
    width: 10,
  },
  InfoText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#E35829',
    fontSize: 10,
    marginLeft: 5,
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sarText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
  },

  addCard: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 12,
  },
  plusIcon: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    marginRight: 10,
  },
  mainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: config.colors.white,
    paddingHorizontal: 15,
    paddingTop: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  priceText: {
    fontSize: 12,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: 'left',
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    textAlign: 'left',
  },
  sarText: {
    fontSize: 12,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginLeft: 2,
  },
  buttonCss: {
    backgroundColor: '#4F74B0',
    height: 50,
    borderRadius: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: config.colors.white,
    fontFamily: config.fonts.Poppins_Medium,
  },
});

export default BannerDetail;
