import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {VendorProfileReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import moment from 'moment';
import {Rating} from 'react-native-ratings';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {trackEvents} from '../../config/FCMEvents';
import AppImage from '../../conponents/AppImage';

const VendorDetails = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const VendorProfileResponse = useSelector(
    VendorProfileReducer.selectVendorProfileData,
  );

  const vendorId = route?.params?.vendor_id;

  const [vendorData, setVendorData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sortByPrice, setSortByPrice] = useState('');
  const [sortByName, setSortByName] = useState('');

  const getCategoryLabel = useCallback(
    category =>
      I18nManager.isRTL
        ? category?.name_ar || category?.name_en || ''
        : category?.name_en || category?.name_ar || '',
    [],
  );

  const callVendorProfileApi = useCallback(
    ({
      sortByPrice: priceSort = sortByPrice,
      sortByName: nameSort = sortByName,
      categoryId = selectedCategoryId,
    } = {}) => {
      if (!vendorId) {
        return;
      }

      const query = [
        `sort_by_price=${priceSort ?? ''}`,
        `sort_by_name=${nameSort ?? ''}`,
      ];
      if (categoryId) {
        query.push(`category=${categoryId}`);
      }

      const payload = {
        uri: `/${vendorId}?${query.join('&')}`,
      };

      trackEvents('vendor_profile', {
        vendor_id: vendorId,
        category_id: categoryId || 'all',
      });
      dispatch({type: SagaActions.GET_VENDOR_PROFILE, payload});
    },
    [vendorId, sortByPrice, sortByName, selectedCategoryId, dispatch],
  );

  useEffect(() => {
    if (VendorProfileResponse?.error !== false) {
      return;
    }

    const results = VendorProfileResponse?.results;
    if (results?.vendor) {
      setVendorData(results.vendor);
    }
    if (Array.isArray(results?.categories) && results.categories.length > 0) {
      setCategories(results.categories);
    }
    dispatch(VendorProfileReducer.removeVendorProfileResponse());
  }, [VendorProfileResponse, dispatch]);

  useEffect(() => {
    if (!vendorId) {
      return;
    }
    callVendorProfileApi({
      sortByPrice: '',
      sortByName: '',
      categoryId: null,
    });
    // Initial vendor profile load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const onSelectCategory = categoryId => {
    setSelectedCategoryId(categoryId);
    callVendorProfileApi({
      categoryId,
      sortByPrice,
      sortByName,
    });
  };

  const renderCategoryChip = (label, categoryId, isActive) => (
    <TouchableOpacity
      key={categoryId ?? 'all'}
      activeOpacity={0.85}
      onPress={() => onSelectCategory(categoryId)}
      style={[styles.categoryChip, isActive && styles.categoryChipActive]}>
      <Text
        numberOfLines={1}
        style={[
          styles.categoryChipText,
          isActive && styles.categoryChipTextActive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => {
    if (!categories.length) {
      return null;
    }

    return (
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}>
          {renderCategoryChip(t('All'), null, selectedCategoryId == null)}
          {categories.map(category =>
            renderCategoryChip(
              getCategoryLabel(category),
              category?._id,
              selectedCategoryId === category?._id,
            ),
          )}
        </ScrollView>
      </View>
    );
  };
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
  return (
    <View style={{flex: 1, backgroundColor: config.colors.BACKGROUNDCOLOR}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          resizeMode="cover"
          style={styles.bgImg}
          source={{
            uri: vendorData?.vendor?.shop_cover_image,
          }}>
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              position: 'absolute',
              top: 45,
              paddingHorizontal: 20,
              width: '100%',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={{
                width: 42,
                height: 42,
                backgroundColor: config.colors.BACKGROUNDCOLOR,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                padding: 10,
              }}>
              <Image
                source={require('../../assets/images/backArrowIcon.png')}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  transform: [{rotate: I18nManager?.isRTL ? '180deg' : '0deg'}],
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={{
                width: 42,
                height: 42,
                backgroundColor: config.colors.BACKGROUNDCOLOR,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                padding: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    color: config.colors.Black,
                    fontSize: 12,
                  }}>
                  {vendorData?.vendor?.rating}
                </Text>
                <Image
                  style={styles.startIcon}
                  resizeMode="contain"
                  source={require('../../assets/images/start.png')}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
        {vendorData && (
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'space-between',
              backgroundColor: config.colors.Light_Black,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/timeIcon.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 12,
                  color: config.colors.white,
                  lineHeight: 18,
                  marginLeft: 10,
                }}>
                {`${vendorData?.vendor?.shop_open_time} - ${vendorData?.vendor?.shop_close_time}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/deliveryIcon.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 12,
                  color: config.colors.white,
                  lineHeight: 18,
                  marginLeft: 10,
                }}>
                {`${vendorData?.vendor?.preparationTime} ${t(`hour`)}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/shippingIcon.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 12,
                  color: config.colors.white,
                  lineHeight: 18,
                  marginLeft: 10,
                }}>
                {`${vendorData?.vendor?.refundTime} ${t(`hour`)}`}
              </Text>
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1,
            backgroundColor: config.colors.BACKGROUNDCOLOR,
          }}>
          <View style={styles.productsHeaderRow}>
            <Text style={styles.serviceText}>{t('All Products')}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                  if (sortByPrice == 1) {
                    setSortByPrice(0);
                    callVendorProfileApi({
                      sortByPrice: 0,
                      sortByName: '',
                    });
                  } else {
                    setSortByPrice(1);
                    callVendorProfileApi({
                      sortByPrice: 1,
                      sortByName: '',
                    });
                  }
                  setSortByName('');
                }}>
                <Text style={styles.starText}>{t('SAR')}</Text>
                <Image
                  style={styles.SearchIcon}
                  resizeMode="contain"
                  source={require('../../assets/images/sort_by_price.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (sortByName == 1) {
                    callVendorProfileApi({
                      sortByPrice: '',
                      sortByName: 0,
                    });
                    setSortByName(0);
                  } else {
                    callVendorProfileApi({
                      sortByPrice: '',
                      sortByName: 1,
                    });
                    setSortByName(1);
                  }
                  setSortByPrice('');
                }}>
                <Image
                  style={styles.SearchIcon}
                  resizeMode="contain"
                  source={require('../../assets/images/sort_by_name.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          {renderCategoryFilter()}

          <View style={styles.productsGridWrap}>
            {vendorData?.services?.length === 0 ? (
              <View style={styles.emptyProductsWrap}>
                <Text style={styles.emptyProductsText}>
                  {selectedCategoryId
                    ? t('No products in this category')
                    : t('No products available')}
                </Text>
              </View>
            ) : null}
            {vendorData?.services?.map((item, index) => {
              return (
                <View key={index} style={styles.productCardCol}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.push(config.routes.SERVICE, {
                        service_id: item?._id,
                      })
                    }
                    style={styles.productCard}>
                    <AppImage
                      imageStyle={styles.productCardImage}
                      resizeMode={'cover'}
                      uri={item?.images[0]}
                    />
                    <View style={styles.productCardBody}>
                      <Text
                        numberOfLines={2}
                        style={styles.productCardTitle}>
                        {I18nManager.isRTL ? item?.name_ar : item.name_en}
                      </Text>
                      <Image
                        style={styles.productCartIcon}
                        resizeMode="contain"
                        source={require('../../assets/images/addCardtroly.png')}
                      />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={styles.productCardPrice}>
                      {item.price}
                      {' SAR'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          {vendorData?.ratings?.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.serviceText}>{t('Ratings & Reviews')}</Text>
              <FlatList
                data={vendorData?.ratings}
                keyExtractor={(item, idx) =>
                  item?._id ? String(item._id) : `rating-${idx}`
                }
                horizontal
                pagingEnabled
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.reviewsListContent}
                renderItem={({item: r}) => (
                  <View style={styles.reviewCard}>
                    <View style={styles.navedCss}>
                      <View style={styles.starCss}>
                        <Image
                          style={styles.navedImg}
                          resizeMode="contain"
                          source={
                            r?.buyer?.profile_image
                              ? {uri: r?.buyer?.profile_image}
                              : require('../../assets/images/user_icon.png')
                          }
                        />
                        <View style={styles.ballonCss}>
                          <Text style={styles.navedText}>{r?.buyer?.full_name}</Text>
                          <View style={styles.starCss}>
                            {getReviewStarRatingView(r?.rating)}
                          </View>
                        </View>
                      </View>
                      <Text style={styles.dayText}>
                        {moment(r?.createdAt).fromNow()}
                      </Text>
                    </View>
                    <Text numberOfLines={4} style={styles.reallyText}>
                      {r.feedback}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
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
  },
  bgImg: {
    width: '100%',
    height: config.constants.Height / 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: 150,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  bgImgView: {
    marginHorizontal: 15,
  },
  khanText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 16,
  },
  locationMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -5,
    alignSelf: 'flex-end',
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
    width: 10,
    height: 10,
    marginHorizontal: 1,
  },
  serviceCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  SearchIcon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  serviceText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 18,
    textAlign: 'left',
  },
  partyDecor: {
    height: 75,
    width: '24%',
    overflow: 'hidden',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  BalloondecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 14,
    textAlign: 'left',
  },
  Service: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 10,
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
    alignItems: 'center',
    // marginHorizontal: 5,
    marginTop: 10,
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
    width: '40%',
  },
  addCardCss: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  addCard: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 12,
  },
  navedImg: {
    height: 48,
    width: 48,
  },
  navedText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    textAlign: 'left',
  },
  dayText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
    textAlign: 'left',
  },
  reallyText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 13.5,
    // marginTop: 5,
    marginVertical: 12,
    paddingLeft: 8,
  },
  navedCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  viewAllCss: {
    width: 80,
    height: 30,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop:20
    marginLeft: 8,
  },
  viewAllText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#4F74B0',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'left',
  },
  categorySection: {
    marginBottom: 4,
    paddingHorizontal: 15,
  },
  categoryScrollContent: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: config.colors.white,
    borderWidth: 1,
    borderColor: config.colors.Gray + '40',
    marginRight: 8,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyProductsWrap: {
    width: '100%',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyProductsText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.Gray,
    textAlign: 'center',
  },
  categoryChipActive: {
    backgroundColor: config.colors.orangeColor,
    borderColor: config.colors.orangeColor,
  },
  categoryChipText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 13,
    color: config.colors.Black,
  },
  categoryChipTextActive: {
    color: config.colors.white,
    fontFamily: config.fonts.Poppins_SemiBold,
  },
  productsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  productsGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  productCardCol: {
    width: '48.6%',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: config.colors.white,
    borderRadius: 14,
    paddingBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productCardImage: {
    height: 132,
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  productCardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  productCardTitle: {
    flex: 1,
    minHeight: 40,
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  productCartIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    marginTop: 1,
  },
  productCardPrice: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.orangeColor,
    textAlign: 'left',
    marginHorizontal: 10,
    marginTop: 6,
  },
  reviewsSection: {
    marginTop: 10,
  },
  reviewsListContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  reviewCard: {
    width: config.constants.Width - 68,
    backgroundColor: config.colors.white,
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default VendorDetails;
