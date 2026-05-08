import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
  I18nManager,
  Share,
  StatusBar,
  Linking,
} from 'react-native';
import config from '../../config';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddToCartReducer,
  GetServicesReducer,
  ServiceDetailReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useTranslation} from 'react-i18next';
import {trackEvents} from '../../config/FCMEvents';
import {check} from 'react-native-permissions';
import {AppButton} from '../../conponents';
import MapView, {Marker} from 'react-native-maps';
import {useIsFocused} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {goToLogin} from '../../conponents/NavigationRef';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeltonLoader from '../../conponents/SkeltonLoader';

const Service = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const ServiceDetailResponse = useSelector(
    ServiceDetailReducer.selectServiceDetailData,
  );
  const AddToCartResponse = useSelector(AddToCartReducer.selectAddToCartData);
  const AddToCartErrorResponse = useSelector(
    AddToCartReducer.selectAddToCartResponse,
  );

  const GetServicesResponse = useSelector(
    GetServicesReducer.selectGetServicesData,
  );
  const {onSelectCustomization} = route?.params;

  const refRBSheet = useRef();
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedPackageList, setSelectedPackageList] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedServiceTab, setSelectedServiceTab] = useState('Details');

  const [recommendedList, setRecommendedList] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (GetServicesResponse != null && isFocused) {
      if (GetServicesResponse?.error == false) {
        setRecommendedList(GetServicesResponse?.results?.services);

        dispatch(GetServicesReducer.removeGetServicesResponse());
      }
    }
  }, [GetServicesResponse]);
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
    if (ServiceDetailResponse != null) {
      if (ServiceDetailResponse?.error == false) {
        setSelectedImage(ServiceDetailResponse?.results?.service?.images);
        setSelectedPrice(ServiceDetailResponse?.results?.service?.price);
        setSelectedName(
          I18nManager.isRTL
            ? ServiceDetailResponse?.results?.service?.name_ar
            : ServiceDetailResponse?.results?.service?.name_en,
        );
      }
    }
  }, [ServiceDetailResponse]);
  useEffect(() => {
    dispatch(ServiceDetailReducer.removeServiceDetailResponse());

    const payload = {
      uri: '/' + route?.params?.service_id,
    };
    dispatch({type: SagaActions.GET_SERVICE_DETAIL, payload});
  }, []);

  const callGetServicesApi = (pageNo, categoryId, subCategoryId) => {
    const payload = {
      page: pageNo,
      pageSize: 10,
      category: categoryId,
      subCategory: subCategoryId == 'All' ? '' : subCategoryId,
    };
    dispatch({
      type: SagaActions.GET_SERVICES,
      payload,
    });
  };
  const onChange = val => {
    if (val?._id != selectedPackage) {
      setSelectedPackage(val);
      setSelectedImage([val?.image]);
      setSelectedPrice(val?.price);
      setSelectedName(
        I18nManager.isRTL
          ? ServiceDetailResponse?.results?.service?.name_ar +
              ' (' +
              val?.name_ar +
              ')'
          : ServiceDetailResponse?.results?.service?.name_en +
              ' (' +
              val?.name_en +
              ')',
      );
    } else {
      setSelectedPackage('');
      setSelectedImage(ServiceDetailResponse?.results?.service?.images);
      setSelectedPrice(ServiceDetailResponse?.results?.service?.price);
      setSelectedName(
        I18nManager.isRTL
          ? ServiceDetailResponse?.results?.service?.name_ar
          : ServiceDetailResponse?.results?.service?.name_en,
      );
    }
  };
  function isCustomizeRequired(data) {
    for (let attribute of data) {
      if (attribute.is_required) {
        const matchingPackage = selectedPackageList.find(
          packageItem => packageItem._id === attribute?._id,
        );
        console.log('matchingPackage', matchingPackage);
        if (!matchingPackage) {
          return `${t('Please Choose')} ${
            I18nManager?.isRTL
              ? attribute.customized_option_title_ar
              : attribute.customized_option_title_en
          } ${t('option')}`;
        }
      }
    }
    return false;
  }
  const onPressAddToCart = async () => {
    // if (route?.params?.withInBuyerRadius) {
    //   if (!route?.params?.withInBuyerRadius)
    //     return Toast.show(
    //       t('Vendor is not available in your selected location'),
    //       Toast.LONG,
    //     );
    // } else {
    //   if (!ServiceDetailResponse?.results?.service?.withInBuyerRadius) {
    //     return Toast.show(
    //       t('Vendor is not available in your selected location'),
    //       Toast.LONG,
    //     );
    //   }
    // }

    // if (
    //   select == '' &&
    //   ServiceDetailResponse?.results?.service?.packages?.length > 0
    // ) {
    //   return Toast.show('Please select package', Toast.LONG);
    // }
    // refRBSheet.current.close();

    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (!result) {
      // Snackbar.show({
      //   text: t('Please login as a user to perform this action'),
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: config.colors.blackColor,
      //   fontFamily: config.fonts.Poppins_Medium,
      //   textColor: config.colors.white,
      //   rtl: I18nManager?.isRTL,
      //   action: {
      //     text: t(`Go to Login`),
      //     textColor: config.colors.orangeColor,

      //     onPress: () => {
      //       goToLogin(config.routes.AUTH_NAVIGATION);
      //     },
      //   },
      // });
      goToLogin(config.routes.AUTH_NAVIGATION);
      return;
    }
    if (
      isCustomizeRequired(ServiceDetailResponse?.results?.service?.packages) !=
      ''
    ) {
      return Toast.show(
        isCustomizeRequired(ServiceDetailResponse?.results?.service?.packages),
        Toast.SHORT,
      );
    }
    const payload = {
      serviceId: ServiceDetailResponse?.results?.service?._id,
      packageId: selectedPackageList,
      price: selectedPrice,
    };
    if (route?.params?.from == 'select_customization') {
      onSelectCustomization({
        package: selectedPackageList,
        service_id: ServiceDetailResponse?.results?.service?._id,
        customize_price:
          selectedPrice - ServiceDetailResponse?.results?.service?.price,
      });
      return navigation.goBack();
    }
    trackEvents('add_to_cart', payload);

    dispatch({type: SagaActions.ADD_TO_CART, payload});
  };
  const getReviewStarRatingView = rating => {
    const totalStars = 5;
    let view = [];

    for (let index = 0; index < rating; index++) {
      view.push(
        <Image
          key={`filled-${index}`}
          style={styles.startIcon}
          resizeMode="contain"
          source={require('../../assets/images/starFillIcon.png')}
        />,
      );
    }

    for (let index = rating; index < totalStars; index++) {
      view.push(
        <Image
          key={`unfilled-${index}`}
          style={styles.startIcon}
          resizeMode="contain"
          source={require('../../assets/images/starUnFillIcon.png')} // You need to have this image for the unfilled star
        />,
      );
    }

    return view;
  };
  const RenderServiceImageItem = ({item}) => {
    return (
      <Image
        source={{uri: item}}
        style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
      />
    );
  };
  const callShareApi = async id => {
    // const getLink = await generateLink();
    const link = 'https://anasa.site:2053/service/' + id;
    try {
      Share.share({
        message: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };
  const setCustomizedItem = (customizeItem, option) => {
    var tempArray = [...selectedPackageList];

    var newIndex = tempArray?.findIndex(
      item => item?._id === customizeItem?._id,
    );

    if (newIndex !== -1) {
      var newSubIndex = tempArray[newIndex].options?.findIndex(
        item => item === option,
      );

      if (newSubIndex !== -1) {
        tempArray[newIndex].options = [...tempArray[newIndex].options];

        tempArray[newIndex].options.splice(newSubIndex, 1);
        if (tempArray[newIndex].options?.length == 0) {
          tempArray.splice(newIndex, 1);
        }
        setSelectedPrice(prevState => prevState - option?.price);
      } else {
        if (customizeItem?.option_select_count > 0) {
          if (
            tempArray[newIndex].options?.length + 1 >
            customizeItem?.option_select_count
          ) {
            return Toast.show(
              `${t('You can select only')} ${
                customizeItem?.option_select_count
              } ${t('options')}`,
              Toast.SHORT,
            );
          }
          tempArray[newIndex].options = [...tempArray[newIndex].options];

          tempArray[newIndex].options.push(option);

          setSelectedPrice(prevState => prevState + option?.price);
        } else {
          tempArray[newIndex].options = [...tempArray[newIndex].options];

          tempArray[newIndex].options.push(option);

          setSelectedPrice(prevState => prevState + option?.price);
        }
      }
    } else {
      let temp = {...customizeItem};
      temp.options = [option];
      tempArray.push(temp);
      setSelectedPrice(prevState => prevState + option?.price);
    }

    console.log('tempArray', JSON.stringify(tempArray));
    setSelectedPackageList(tempArray);
  };
  const getCustomizedItem = (customize_id, option) => {
    var newIndex = selectedPackageList?.findIndex(
      item => item?._id === customize_id,
    );
    let check = false;
    if (newIndex !== -1) {
      var newSubIndex = selectedPackageList[newIndex].options?.findIndex(
        item => item === option,
      );
      if (newSubIndex !== -1) {
        check = true;
      }
    } else {
      check = false;
    }

    return check;
  };

  const openGoogleMap = (name, lat, lng) => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:' + url, err),
    );
    // Linking.canOpenURL(url).then(supported => {
    //   if (supported) {
    //     Linking.openURL(url);
    //   } else {
    //     console.log("Don't know how to open URI: " + url);
    //   }
    // });
  };

  const SkeltonView = () => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 20}}>
          <View style={{marginVertical: 10}} />

          <SkeltonLoader
            variant={t('rectangle')}
            width={t('100%')}
            height={200}
          />
          <View style={{marginVertical: 10}} />

          <SkeltonLoader
            variant={t('rectangle_multiple')}
            width={t('100%')}
            height={140}
            count={4}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      {ServiceDetailResponse?.results?.service ? (
        <>
          {selectedImage.length > 0 && (
            <AppIntroSlider
              style={styles.bgImg}
              data={selectedImage}
              renderItem={RenderServiceImageItem}
              showDoneButton={false}
              showNextButton={false}
              showPrevButton={false}
              showSkipButton={false}
              dotStyle={{
                backgroundColor: '#fff',
                marginBottom: 10,
                height: 5,
                width: 10,
              }}
              activeDotStyle={{
                backgroundColor: '#4F74B0',
                height: 5,
                width: 15,
                marginBottom: 10,
              }}
            />
          )}

          <TouchableOpacity
            style={styles.backIconCss}
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              resizeMode="contain"
              style={styles.backIcon}
              source={require('../../assets/images/backArrowIcon.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightIconCss}
            activeOpacity={0.5}
            onPress={() => {
              callShareApi(ServiceDetailResponse?.results?.service?._id);
            }}>
            <Image
              resizeMode="contain"
              style={styles.rightcon}
              source={require('../../assets/images/share_icon.png')}
            />
          </TouchableOpacity>

          <View style={styles.Css}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.ballonCss}>
                <Text style={styles.ballonText}>{selectedName}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (ServiceDetailResponse?.results?.service?.vendor) {
                    navigation.push(config.routes.VENDOR_DETAILS, {
                      vendor_id:
                        ServiceDetailResponse?.results?.service?.vendor?._id,
                    });
                  }
                }}
                style={{
                  backgroundColor: config.colors.orangeColor + 80,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginBottom: 5,
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'cover',
                    borderRadius: 20,
                  }}
                  resizeMode="cover"
                  source={{
                    uri: ServiceDetailResponse?.results?.service?.vendor
                      ?.shop_cover_image,
                  }}
                />

                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    fontSize: 12,
                    color: config.colors.white,
                    marginHorizontal: 4,
                  }}>
                  {I18nManager?.isRTL
                    ? ServiceDetailResponse?.results?.service?.vendor
                        ?.shop_name_ar
                    : ServiceDetailResponse?.results?.service?.vendor
                        ?.shop_name}
                </Text>
              </TouchableOpacity>
              {ServiceDetailResponse?.results?.service?.rating > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 2,
                  }}>
                  {getReviewStarRatingView(
                    ServiceDetailResponse?.results?.service?.rating,
                  )}
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      fontSize: 14,
                      color: config.colors.blueColor,
                    }}>{`( ${
                    ServiceDetailResponse?.results?.service?.rating
                  } ${t('Reviews')} )`}</Text>
                </View>
              )}
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  fontSize: 20,
                  color: config.colors.orangeColor,
                  textAlign: 'left',
                }}>{`${ServiceDetailResponse?.results?.service?.price} SAR`}</Text>
              <ScrollView
                style={{alignSelf: 'flex-start'}}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedServiceTab('Details');
                    }}
                    style={{
                      borderBottomWidth:
                        selectedServiceTab == 'Details' ? 2 : 0,
                      borderBottomColor: config.colors.blueColor,
                      borderEndRadius: 4,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 14,
                        color:
                          selectedServiceTab == 'Details'
                            ? config.colors.Black
                            : config.colors.Gray,
                      }}>
                      {t('Details')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedServiceTab('Reviews');
                    }}
                    style={{
                      borderBottomWidth:
                        selectedServiceTab == 'Reviews' ? 2 : 0,
                      borderBottomColor: config.colors.blueColor,
                      borderEndRadius: 4,
                      marginLeft: config.constants.Width / 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 14,
                        color:
                          selectedServiceTab == 'Reviews'
                            ? config.colors.Black
                            : config.colors.Gray,
                      }}>
                      {t('Reviews')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedServiceTab('Map');
                    }}
                    style={{
                      borderBottomWidth: selectedServiceTab == 'Map' ? 2 : 0,
                      borderBottomColor: config.colors.blueColor,
                      borderEndRadius: 4,
                      marginLeft: config.constants.Width / 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 14,
                        color:
                          selectedServiceTab == 'Map'
                            ? config.colors.Black
                            : config.colors.Gray,
                      }}>
                      {t('Map')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedServiceTab('Recommended');
                      callGetServicesApi(
                        1,
                        ServiceDetailResponse?.results?.service?.category?._id,
                        ServiceDetailResponse?.results?.service?.subCategory
                          ?._id,
                      );
                    }}
                    style={{
                      borderBottomWidth:
                        selectedServiceTab == 'Recommended' ? 2 : 0,
                      borderBottomColor: config.colors.blueColor,
                      borderEndRadius: 4,
                      marginLeft: config.constants.Width / 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 14,
                        color:
                          selectedServiceTab == 'Recommended'
                            ? config.colors.Black
                            : config.colors.Gray,
                      }}>
                      {t('Recommended')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              {selectedServiceTab == 'Details' && (
                <View>
                  <Text style={styles.lorenText}>
                    {I18nManager.isRTL
                      ? ServiceDetailResponse?.results?.service?.description_ar
                      : ServiceDetailResponse?.results?.service?.description_en}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',

                      paddingVertical: 10,
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
                          tintColor: config.colors.Gray,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Regular,
                          fontSize: 12,
                          color: config.colors.Black,
                          lineHeight: 18,
                          marginLeft: 10,
                        }}>
                        {`${ServiceDetailResponse?.results?.service?.vendor?.shop_open_time} - ${ServiceDetailResponse?.results?.service?.vendor?.shop_close_time}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <Image
                        source={require('../../assets/images/deliveryIcon.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: config.colors.Gray,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Regular,
                          fontSize: 12,
                          color: config.colors.Black,
                          lineHeight: 18,
                          marginLeft: 10,
                        }}>
                        {`${
                          ServiceDetailResponse?.results?.service
                            ?.preparationTime
                        } ${t('hour')}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <Image
                        source={require('../../assets/images/shippingIcon.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: config.colors.Gray,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Regular,
                          fontSize: 12,
                          color: config.colors.Black,
                          lineHeight: 18,
                          marginLeft: 10,
                        }}>
                        {`${
                          ServiceDetailResponse?.results?.service?.vendor
                            ?.refundTime
                        } ${t('hour')}`}
                      </Text>
                    </View>
                  </View>
                  {ServiceDetailResponse?.results?.service?.packages?.length >
                    0 && (
                    <View style={{marginVertical: 10}}>
                      {ServiceDetailResponse?.results?.service?.packages?.map(
                        (item, index) => {
                          return (
                            <View style={{}} key={index}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: config.colors.Black,
                                  fontFamily: config.fonts.Poppins_Medium,
                                  textAlign: 'left',
                                }}>
                                {`${t('Choose')} `}
                                {I18nManager.isRTL
                                  ? item?.customized_option_title_ar
                                  : item?.customized_option_title_en}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                }}>
                                {item?.options?.map((oItem, oIndex) => {
                                  return (
                                    <TouchableOpacity
                                      key={oIndex}
                                      style={{
                                        borderWidth: 1,
                                        borderColor: getCustomizedItem(
                                          item?._id,
                                          oItem,
                                        )
                                          ? config.colors.buttonColor
                                          : config.colors.Gray,
                                        borderRadius: 10,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        width: '40%',
                                        margin: 5,
                                      }}
                                      activeOpacity={0.5}
                                      onPress={() => {
                                        const {options, ...newData} = item;
                                        setCustomizedItem(newData, oItem);
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 13,
                                          color: config.colors.Black,
                                          fontFamily:
                                            config.fonts.Poppins_Regular,
                                          textAlign: 'left',
                                        }}>
                                        {I18nManager.isRTL
                                          ? oItem?.option_ar
                                          : oItem?.option_en}
                                      </Text>
                                      {oItem?.price > 0 && (
                                        <Text
                                          style={{
                                            fontSize: 10,
                                            color: config.colors.Gray,
                                            fontFamily:
                                              config.fonts.Poppins_Medium,
                                            textAlign: 'left',
                                          }}>
                                          {`${oItem?.price} SAR`}
                                        </Text>
                                      )}
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                          );
                        },
                      )}
                    </View>
                  )}
                </View>
              )}
              {selectedServiceTab == 'Reviews' && (
                <View>
                  <Text style={styles.lorenText}>{t('No Comment')}</Text>
                </View>
              )}
              {selectedServiceTab == 'Map' && (
                <View style={{marginTop: 15, borderRadius: 20}}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(
                        ServiceDetailResponse?.results?.service?.vendor
                          ?.latitude ?? 0,
                      ),
                      longitude: parseFloat(
                        ServiceDetailResponse?.results?.service?.vendor
                          ?.longitude ?? 0,
                      ),
                      latitudeDelta: 0.003,
                      longitudeDelta: 0.003,
                    }}
                    pitchEnabled={false}
                    scrollEnabled={false}

                    // minZoomLevel={10}
                    // onRegionChange={onAnnotationPress()}
                    // provider={PROVIDER_GOOGLE}

                    // zoomEnabled={true}
                    // mapType={'satellite'}

                    // showsUserLocation = {true}
                  >
                    <Marker
                      onPress={() => {
                        openGoogleMap(
                          I18nManager?.isRTL
                            ? ServiceDetailResponse?.results?.service?.vendor
                                ?.shop_name_ar
                            : ServiceDetailResponse?.results?.service?.vendor
                                ?.shop_name,
                          ServiceDetailResponse?.results?.service?.vendor
                            ?.latitude,
                          ServiceDetailResponse?.results?.service?.vendor
                            ?.longitude,
                        );
                      }}
                      coordinate={{
                        latitude: parseFloat(
                          ServiceDetailResponse?.results?.service?.vendor
                            ?.latitude ?? 0,
                        ),
                        longitude: parseFloat(
                          ServiceDetailResponse?.results?.service?.vendor
                            ?.longitude ?? 0,
                        ),
                      }}>
                      <Image
                        style={{
                          height: 24,
                          width: 24,
                        }}
                        source={require('../../assets/images/markerIcon.png')}
                      />
                    </Marker>
                  </MapView>
                </View>
              )}
              {selectedServiceTab == 'Recommended' && (
                <View>
                  {recommendedList?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          backgroundColor: config.colors.white,
                          marginTop: 15,
                          borderRadius: 12,
                          flexDirection: 'row',
                          overflow: 'hidden',
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.push(config.routes.SERVICE, {
                            service_id: item?._id,
                          });
                        }}>
                        <View>
                          <Image
                            style={{
                              width: 120,
                              flex: 1,
                              resizeMode: 'cover',
                            }}
                            resizeMode="cover"
                            source={{
                              uri:
                                item?.images?.length > 0 ? item?.images[0] : '',
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            marginLeft: 10,
                          }}>
                          <Text
                            style={{
                              fontFamily: config.fonts.Poppins_Regular,
                              fontSize: 12,
                              color: config.colors.Black,
                              marginLeft: 5,
                            }}>
                            <Image
                              style={{
                                width: 12,
                                height: 12,
                                resizeMode: 'contain',
                              }}
                              resizeMode="contain"
                              source={require('../../assets/images/starFillIcon.png')}
                            />
                            {` ${item?.rating}`}
                          </Text>
                          <Text
                            style={{
                              fontFamily: config.fonts.Poppins_Medium,
                              fontSize: 12,
                              color: config.colors.Black,
                              lineHeight: 18,
                            }}>
                            {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
                          </Text>
                          <Text
                            style={{
                              fontFamily: config.fonts.Poppins_Medium,
                              fontSize: 14,
                              lineHeight: 22,
                              color: config.colors.orangeColor,
                              marginHorizontal: 4,
                            }}>
                            {`${item?.price} SAR`}
                          </Text>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              navigation.navigate(
                                config.routes.VENDOR_DETAILS,
                                {
                                  vendor_id: item.vendor._id,
                                },
                              );
                            }}
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 50,
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignSelf: 'flex-start',
                              marginTop: 10,
                              borderWidth: 1,
                              borderColor: config.colors.borderColor,
                            }}>
                            <Image
                              style={{
                                width: 24,
                                height: 24,
                                resizeMode: 'cover',
                                borderRadius: 20,
                              }}
                              resizeMode="cover"
                              source={{uri: item?.vendor?.shop_cover_image}}
                            />

                            <Text
                              style={{
                                fontFamily: config.fonts.Poppins_Medium,
                                fontSize: 12,
                                color: config.colors.Black,
                                marginHorizontal: 4,
                              }}>
                              {I18nManager?.isRTL
                                ? item?.vendor?.shop_name_ar
                                : item.vendor?.shop_name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>
            {route?.params?.from != 'banner' &&
              (route?.params?.from == 'select_customization' ? (
                <AppButton
                  text={t('Process')}
                  onPress={() => onPressAddToCart()}
                  buttonStyle={{marginVertical: 20, marginHorizontal: 0}}
                />
              ) : (
                <AppButton
                  text={t('Add to Cart')}
                  onPress={() => {
                    onPressAddToCart();
                  }}
                  buttonStyle={{marginVertical: 20, marginHorizontal: 0}}
                />
              ))}
          </View>
        </>
      ) : (
        <SkeltonView />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  bgImg: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  backIconCss: {
    width: 40,
    height: 40,
    backgroundColor: config.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    position: 'absolute',
    top: Platform.OS == 'ios' ? 75 : 45,
    left: 15,
  },
  backIcon: {
    width: 20,
    height: 20,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
    // tintColor:'#f2f2f2'
  },
  rightIconCss: {
    width: 40,
    height: 40,
    backgroundColor: config.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: Platform.OS == 'ios' ? 75 : 45,
    right: 15,
  },
  rightcon: {
    width: 20,
    height: 20,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
    // tintColor:'#f2f2f2'
  },
  Css: {
    height: Dimensions.get('window').height / 2,
    marginTop: -30,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    // backgroundColor:'pink'
  },
  ballonCss: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ballonText: {
    fontSize: 24,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
    width: '80%',
    textAlign: 'left',
  },
  startCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '20%',
  },
  starText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
    marginLeft: 5,
    marginTop: 2,
  },
  startIcon: {
    width: 14,
    height: 14,
  },
  lorenText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'left',

    // lineHeight:19
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
  },
  priceText: {
    fontSize: 12,
    color: config.colors.Gray,
    fontFamily: config.fonts.Poppins_Regular,
    marginBottom: -10,
    textAlign: 'left',
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 35,
    fontFamily: config.fonts.Poppins_Medium,
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
  bottomCss: {
    marginHorizontal: 15,
    flex: 1,
  },
  packageMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  packageText: {
    fontSize: 13,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    width: '60%',
    textAlign: 'left',
  },
  packagePriceText: {
    fontSize: 13,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    marginHorizontal: 10,
    width: '30%',
    textAlign: 'center',
  },
  packageCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: config.colors.Gray,
    borderRadius: 6,
  },
  buttonCss2: {
    padding: 15,
  },
  map: {
    height: 200,
    borderRadius: 20,
  },
});

export default Service;
