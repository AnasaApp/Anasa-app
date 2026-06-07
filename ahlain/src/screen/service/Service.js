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
  Modal,
  FlatList,
} from 'react-native';
import moment from 'moment';
import config from '../../config';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddToCartReducer,
  CreatePartyServiceReducer,
  GetMyOccasionsReducer,
  GetServicesReducer,
  ServiceDetailReducer,
} from '../../redux/reducers';
import {getPartyDisplayName, getPartyTypeLabel} from '../../utils/partyHelpers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useTranslation} from 'react-i18next';
import {trackEvents} from '../../config/FCMEvents';
import {check} from 'react-native-permissions';
import {AppButton} from '../../conponents';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {buildMapRegion, isValidCoordinate} from '../../utils/mapHelpers';
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
  const GetMyOccasionsResponse = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsData,
  );
  const CreatePartyServiceResponse = useSelector(
    CreatePartyServiceReducer.selectCreatePartyServiceData,
  );
  const CreatePartyServiceError = useSelector(
    CreatePartyServiceReducer.selectCreatePartyServiceResponse,
  );
  const {onSelectCustomization, partyId: routePartyId} = route?.params;

  const refRBSheet = useRef();
  const lastSelectedPartyRef = useRef(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedPackageList, setSelectedPackageList] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedServiceTab, setSelectedServiceTab] = useState('Details');
  const [showOccasionModal, setShowOccasionModal] = useState(false);

  const partiesForModal = GetMyOccasionsResponse?.results?.parties ?? [];

  const isCustomizationFlow = route?.params?.from === 'select_customization';
  const serviceTabs = [
    {id: 'Details', label: t('Details')},
    {id: 'Reviews', label: t('Reviews')},
    {id: 'Map', label: t('Map')},
    {id: 'Recommended', label: t('Recommended')},
  ];

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
    if (CreatePartyServiceResponse != null) {
      if (CreatePartyServiceResponse?.error === false) {
        Toast.show(
          CreatePartyServiceResponse?.message ?? t('Added to occasion'),
          Toast.LONG,
        );
        const party = lastSelectedPartyRef.current;
        dispatch(CreatePartyServiceReducer.removeCreatePartyServiceResponse());
        setShowOccasionModal(false);
        if (party?._id) {
          navigation.navigate(config.routes.OCCASION_VIEW, {occasion: party});
        }
      }
    }
  }, [CreatePartyServiceResponse]);

  useEffect(() => {
    if (CreatePartyServiceError != null) {
      Toast.show(
        CreatePartyServiceError?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(CreatePartyServiceReducer.removeCreatePartyServiceResponse());
    }
  }, [CreatePartyServiceError]);

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

  // Open the "Add to Occasion" picker. Guests are redirected to login;
  // logged-in users get a freshly fetched list of their occasions.
  const onPressAddToOccasion = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (!result) {
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
    dispatch({
      type: SagaActions.GET_MY_OCCASIONS,
      payload: {page: 1, pageSize: 50},
    });
    setShowOccasionModal(true);
  };

  const onSelectOccasion = party => {
    lastSelectedPartyRef.current = party;
    const serviceId = ServiceDetailResponse?.results?.service?._id;
    if (!serviceId) {
      return Toast.show(t('Service not found'), Toast.SHORT);
    }
    const payload = {
      party: party?._id,
      service: serviceId,
      package: selectedPackageList || [],
      quantity: 1,
      price: Number(selectedPrice) || 0,
      deliveryType: 'PickUp',
    };
    trackEvents('add_to_occasion', payload);
    setShowOccasionModal(false);
    dispatch({type: SagaActions.CREATE_PARTY_SERVICE, payload});
  };

  const onAddToPartyDirect = () => {
    if (routePartyId) {
      onSelectOccasion({_id: routePartyId});
      return;
    }
    onPressAddToOccasion();
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
    const link = `${config.constants.PUBLIC_WEB_ORIGIN}/service/${id}`;
    try {
      Share.share({
        message: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };
  const isSameCustomizationOption = (a, b) => {
    if (a == null || b == null) {
      return false;
    }
    if (a === b) {
      return true;
    }
    const aId = a?._id ?? a?.id;
    const bId = b?._id ?? b?.id;
    return aId != null && bId != null && String(aId) === String(bId);
  };

  const isOptionSelected = (groupId, option) => {
    const group = selectedPackageList.find(item => item?._id === groupId);
    if (!group?.options?.length) {
      return false;
    }
    return group.options.some(o => isSameCustomizationOption(o, option));
  };

  const setCustomizedItem = (customizeItem, option) => {
    var tempArray = [...selectedPackageList];

    var newIndex = tempArray?.findIndex(
      item => item?._id === customizeItem?._id,
    );

    if (newIndex !== -1) {
      var newSubIndex = tempArray[newIndex].options?.findIndex(item =>
        isSameCustomizationOption(item, option),
      );

      if (newSubIndex !== -1) {
        tempArray[newIndex].options = [...tempArray[newIndex].options];
        const removed = tempArray[newIndex].options.splice(newSubIndex, 1)[0];
        if (tempArray[newIndex].options?.length == 0) {
          tempArray.splice(newIndex, 1);
        }
        setSelectedPrice(prevState => prevState - (Number(removed?.price) || 0));
      } else {
        const maxCount = Number(customizeItem?.option_select_count) || 0;
        if (maxCount === 1 && tempArray[newIndex].options?.length === 1) {
          const previous = tempArray[newIndex].options[0];
          setSelectedPrice(
            prevState =>
              prevState -
              (Number(previous?.price) || 0) +
              (Number(option?.price) || 0),
          );
          tempArray[newIndex].options = [option];
        } else if (maxCount > 0) {
          if (tempArray[newIndex].options?.length + 1 > maxCount) {
            return Toast.show(
              `${t('You can select only')} ${maxCount} ${t('options')}`,
              Toast.SHORT,
            );
          }
          tempArray[newIndex].options = [...tempArray[newIndex].options, option];
          setSelectedPrice(
            prevState => prevState + (Number(option?.price) || 0),
          );
        } else {
          if (customizeItem?.is_required) {
            const previous = tempArray[newIndex].options?.[0];
            setSelectedPrice(
              prevState =>
                prevState -
                (Number(previous?.price) || 0) +
                (Number(option?.price) || 0),
            );
            tempArray[newIndex].options = [option];
          } else {
            tempArray[newIndex].options = [...tempArray[newIndex].options, option];
            setSelectedPrice(
              prevState => prevState + (Number(option?.price) || 0),
            );
          }
        }
      }
    } else {
      let temp = {...customizeItem};
      temp.options = [option];
      tempArray.push(temp);
      setSelectedPrice(prevState => prevState + (Number(option?.price) || 0));
    }

    setSelectedPackageList(tempArray);
  };

  const getCustomizedItem = (customize_id, option) =>
    isOptionSelected(customize_id, option);

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

          <View style={styles.detailPanel}>
            <ScrollView
              style={styles.detailScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailScrollContent}>
              <Text style={styles.serviceTitle}>{selectedName}</Text>
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
                style={styles.vendorChip}>
                <Image
                  style={styles.vendorChipImage}
                  resizeMode="cover"
                  source={{
                    uri: ServiceDetailResponse?.results?.service?.vendor
                      ?.shop_cover_image,
                  }}
                />
                <Text style={styles.vendorChipText}>
                  {I18nManager?.isRTL
                    ? ServiceDetailResponse?.results?.service?.vendor
                        ?.shop_name_ar
                    : ServiceDetailResponse?.results?.service?.vendor
                        ?.shop_name}
                </Text>
              </TouchableOpacity>
              {ServiceDetailResponse?.results?.service?.rating > 0 && (
                <View style={styles.ratingRow}>
                  {getReviewStarRatingView(
                    ServiceDetailResponse?.results?.service?.rating,
                  )}
                  <Text style={styles.ratingText}>{`( ${
                    ServiceDetailResponse?.results?.service?.rating
                  } ${t('Reviews')} )`}</Text>
                </View>
              )}
              <Text style={styles.servicePrice}>{`${selectedPrice} ${t('SAR')}`}</Text>

              {isCustomizationFlow ? (
                <Text style={styles.customizationHint}>
                  {t('Select your customization options below')}
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tabRow}>
                  {serviceTabs.map(tab => (
                    <TouchableOpacity
                      key={tab.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedServiceTab(tab.id);
                        if (tab.id === 'Recommended') {
                          callGetServicesApi(
                            1,
                            ServiceDetailResponse?.results?.service?.category
                              ?._id,
                            ServiceDetailResponse?.results?.service?.subCategory
                              ?._id,
                          );
                        }
                      }}
                      style={[
                        styles.tabItem,
                        selectedServiceTab === tab.id && styles.tabItemActive,
                      ]}>
                      <Text
                        style={[
                          styles.tabText,
                          selectedServiceTab === tab.id && styles.tabTextActive,
                        ]}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {(isCustomizationFlow || selectedServiceTab == 'Details') && (
                <View>
                  <Text style={styles.lorenText}>
                    {I18nManager.isRTL
                      ? ServiceDetailResponse?.results?.service?.description_ar
                      : ServiceDetailResponse?.results?.service?.description_en}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Image
                        source={require('../../assets/images/timeIcon.png')}
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {`${ServiceDetailResponse?.results?.service?.vendor?.shop_open_time} - ${ServiceDetailResponse?.results?.service?.vendor?.shop_close_time}`}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Image
                        source={require('../../assets/images/deliveryIcon.png')}
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {`${ServiceDetailResponse?.results?.service?.preparationTime} ${t('hour')}`}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Image
                        source={require('../../assets/images/shippingIcon.png')}
                        style={styles.metaIcon}
                      />
                      <Text style={styles.metaText}>
                        {`${ServiceDetailResponse?.results?.service?.vendor?.refundTime} ${t('hour')}`}
                      </Text>
                    </View>
                  </ScrollView>
                  {ServiceDetailResponse?.results?.service?.packages?.length >
                    0 && (
                    <View style={styles.customizationSection}>
                      {ServiceDetailResponse?.results?.service?.packages?.map(
                        (item, index) => (
                          <View style={styles.customizationGroup} key={index}>
                            <Text style={styles.customizationGroupTitle}>
                              {`${t('Choose')} `}
                              {I18nManager.isRTL
                                ? item?.customized_option_title_ar
                                : item?.customized_option_title_en}
                            </Text>
                            <View style={styles.optionGrid}>
                              {item?.options?.map((oItem, oIndex) => {
                                const isSelected = isOptionSelected(
                                  item?._id,
                                  oItem,
                                );
                                return (
                                  <TouchableOpacity
                                    key={oIndex}
                                    style={[
                                      styles.optionCard,
                                      isSelected && styles.optionCardSelected,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                      const {options, ...newData} = item;
                                      setCustomizedItem(newData, oItem);
                                    }}>
                                    {isSelected ? (
                                      <View style={styles.optionSelectedBadge}>
                                        <Text style={styles.optionSelectedCheck}>
                                          ✓
                                        </Text>
                                      </View>
                                    ) : null}
                                    <Text
                                      style={[
                                        styles.optionCardTitle,
                                        isSelected &&
                                          styles.optionCardTitleSelected,
                                      ]}
                                      numberOfLines={2}>
                                      {I18nManager.isRTL
                                        ? oItem?.option_ar
                                        : oItem?.option_en}
                                    </Text>
                                    {oItem?.price > 0 && (
                                      <Text
                                        style={[
                                          styles.optionCardPrice,
                                          isSelected &&
                                            styles.optionCardPriceSelected,
                                        ]}>
                                        {`${oItem?.price} ${t('SAR')}`}
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View>
                        ),
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
                <View style={{marginTop: 15, borderRadius: 20, overflow: 'hidden'}}>
                  {isValidCoordinate(
                    ServiceDetailResponse?.results?.service?.vendor?.latitude,
                    ServiceDetailResponse?.results?.service?.vendor?.longitude,
                  ) ? (
                    <MapView
                      provider={
                        Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined
                      }
                      style={styles.map}
                      initialRegion={buildMapRegion(
                        ServiceDetailResponse?.results?.service?.vendor
                          ?.latitude,
                        ServiceDetailResponse?.results?.service?.vendor
                          ?.longitude,
                      )}
                      pitchEnabled={false}
                      scrollEnabled={false}>
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
                          latitude: Number(
                            ServiceDetailResponse?.results?.service?.vendor
                              ?.latitude,
                          ),
                          longitude: Number(
                            ServiceDetailResponse?.results?.service?.vendor
                              ?.longitude,
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
                  ) : (
                    <Text style={styles.lorenText}>
                      {t('Location not available')}
                    </Text>
                  )}
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
            {route?.params?.from != 'banner' && (
              <View style={styles.detailFooter}>
                {isCustomizationFlow ? (
                  <AppButton
                    text={t('Confirm Selection')}
                    onPress={() => onPressAddToCart()}
                    buttonStyle={styles.confirmSelectionBtn}
                  />
                ) : (
                  <View style={styles.bottomActionRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.addToOccasionBtn}
                      onPress={onAddToPartyDirect}>
                      <Text style={styles.addToOccasionText}>
                        {t('Add to Occasion')}
                      </Text>
                    </TouchableOpacity>
                    <AppButton
                      text={t('Add to Cart')}
                      onPress={() => {
                        onPressAddToCart();
                      }}
                      buttonStyle={styles.addToCartBtn}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </>
      ) : (
        <SkeltonView />
      )}

      {/* "Add to Occasion" picker modal */}
      <Modal
        visible={showOccasionModal}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowOccasionModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.occasionModalOverlay}
          onPress={() => setShowOccasionModal(false)}>
          <View
            style={styles.occasionSheet}
            onStartShouldSetResponder={() => true}>
            <View style={styles.occasionSheetHandle} />
            <Text style={styles.occasionSheetTitle}>
              {t('Add to Occasion')}
            </Text>
            <Text style={styles.occasionSheetSubtitle}>
              {t('Choose an occasion to add this service to')}
            </Text>

            {partiesForModal.length > 0 ? (
              <FlatList
                data={partiesForModal}
                keyExtractor={(item, idx) => (item?._id ?? idx).toString()}
                style={{maxHeight: 360}}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  const accentColors = [
                    config.colors.orangeColor,
                    config.colors.buttonColor,
                    config.colors.yellowColor,
                  ];
                  const displayName = getPartyDisplayName(item);
                  const typeLabel = getPartyTypeLabel(item?.type);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onSelectOccasion(item)}
                      style={styles.occasionRow}>
                      <View
                        style={[
                          styles.occasionRowAccent,
                          {backgroundColor: accentColors[index % 3]},
                        ]}
                      />
                      <View style={styles.occasionRowIcon}>
                        <Text style={{fontSize: 20}}>🎂</Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.occasionRowName} numberOfLines={1}>
                          {displayName}
                        </Text>
                        <Text style={styles.occasionRowDate}>
                          {typeLabel}
                        </Text>
                      </View>
                      <Text style={styles.occasionRowArrow}>›</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View style={styles.occasionEmptyWrap}>
                <Text style={styles.occasionEmptyEmoji}>🎈</Text>
                <Text style={styles.occasionEmptyTitle}>
                  {t("You haven't created any occasions yet")}
                </Text>
                <Text style={styles.occasionEmptySubtitle}>
                  {t('Create one to add this service to it')}
                </Text>
              </View>
            )}

            <AppButton
              text={t('Create New Occasion')}
              onPress={() => {
                setShowOccasionModal(false);
                navigation.navigate(config.routes.CREATE_OCCASION);
              }}
              buttonStyle={styles.occasionCreateBtn}
            />
            <TouchableOpacity
              onPress={() => setShowOccasionModal(false)}
              style={styles.occasionCancelBtn}>
              <Text style={styles.occasionCancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  // ── Bottom action row (Add to Occasion + Add to Cart) ──
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  addToOccasionBtn: {
    flex: 1,
    borderRadius: 10,
    height: 48,
    borderWidth: 1.5,
    borderColor: config.colors.orangeColor,
    backgroundColor: config.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addToOccasionText: {
    color: config.colors.orangeColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_SemiBold,
    lineHeight: 22,
  },
  addToCartBtn: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  // ── Add-to-Occasion modal ──
  occasionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  occasionSheet: {
    backgroundColor: config.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  occasionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: config.colors.borderColor,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  occasionSheetTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    textAlign: 'center',
    marginBottom: 4,
  },
  occasionSheetSubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  occasionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  occasionRowAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    left: 0,
  },
  occasionRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 8,
  },
  occasionRowName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    lineHeight: 20,
  },
  occasionRowDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
    marginTop: 2,
  },
  occasionRowArrow: {
    fontSize: 22,
    color: config.colors.Gray,
    paddingHorizontal: 6,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  occasionEmptyWrap: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  occasionEmptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  occasionEmptyTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  occasionEmptySubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  occasionCreateBtn: {
    marginTop: 10,
    marginHorizontal: 0,
  },
  occasionCancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 2,
  },
  occasionCancelText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.Gray,
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
  detailPanel: {
    flex: 1,
    marginTop: -30,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    paddingBottom: 16,
  },
  detailFooter: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderTopColor: config.colors.borderColor,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  serviceTitle: {
    fontSize: 22,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    lineHeight: 30,
    marginTop: 20,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  vendorChip: {
    backgroundColor: config.colors.orangeColor + 'CC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 6,
  },
  vendorChipImage: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
  vendorChipText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 12,
    color: config.colors.white,
    marginHorizontal: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.blueColor,
  },
  servicePrice: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 20,
    color: config.colors.orangeColor,
    marginTop: 8,
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  customizationHint: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 20,
  },
  tabItem: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: config.colors.blueColor,
  },
  tabText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.Gray,
  },
  tabTextActive: {
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
    paddingRight: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 220,
  },
  metaIcon: {
    width: 18,
    height: 18,
    tintColor: config.colors.Gray,
  },
  metaText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Black,
    lineHeight: 18,
    marginLeft: 8,
    flexShrink: 1,
  },
  customizationSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  customizationGroup: {
    marginBottom: 16,
  },
  customizationGroupTitle: {
    fontSize: 16,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionCard: {
    width: '48%',
    minHeight: 72,
    marginHorizontal: '1%',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: config.colors.borderColor,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: config.colors.white,
    position: 'relative',
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: config.colors.orangeColor,
    backgroundColor: config.colors.creamColor,
  },
  optionSelectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: config.colors.orangeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelectedCheck: {
    color: config.colors.white,
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Bold,
    lineHeight: 14,
  },
  optionCardTitle: {
    fontSize: 13,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  optionCardTitleSelected: {
    color: config.colors.orangeColor,
    fontFamily: config.fonts.Poppins_SemiBold,
  },
  optionCardPrice: {
    fontSize: 11,
    color: config.colors.Gray,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: 'center',
    marginTop: 4,
  },
  optionCardPriceSelected: {
    color: config.colors.orangeColor,
  },
  confirmSelectionBtn: {
    marginHorizontal: 0,
    marginVertical: 0,
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
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
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
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
});

export default Service;
