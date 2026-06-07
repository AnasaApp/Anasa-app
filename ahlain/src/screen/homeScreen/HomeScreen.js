import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
  Modal,
  Pressable,
  I18nManager,
  RefreshControl,
  Animated,
  Easing,
  useColorScheme,
  AppState,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import config from '../../config';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

import {
  ChangeLanguageReducer,
  EventDateTimeReducer,
  GetCategoriesReducer,
  GetMarketingOffersReducer,
  GetMyCartReducer,
  GetMyOccasionsReducer,
  GetOccasionsReducer,
  GetRecommendedReducer,
  MyProfileReducer,
  PopularCategoriesReducer,
  TopRatedReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from '@codegv/react-native-fast-image';
import SwiperFlatList from 'react-native-swiper-flatlist';
import FooterComponent from '../../conponents/FooterComponent';
import {AppButton, AppTextInput} from '../../conponents';
import AppImage from '../../conponents/AppImage';
import SkeltonLoader from '../../conponents/SkeltonLoader';
import Snackbar from 'react-native-snackbar';
import {goToLogin} from '../../conponents/NavigationRef';
import OccasionDateStatusTag from '../../conponents/OccasionDateStatusTag';
import {
  getPartyDisplayName,
  getPartyTypeEmoji,
  getPartyTypeLabel,
  formatPartyDatesLine,
  enrichPartyWithCachedMeta,
  getPartyDateStatus,
  isPartyDateExpired,
} from '../../utils/partyHelpers';
import usePartyMetaCache from '../../utils/usePartyMetaCache';

const RECOMMENDED_PAGE_SIZE = 4;
const HEADER_SKELETON_COLOR = 'rgba(255,255,255,0.35)';
const SCREEN_WIDTH = Dimensions.get('window').width;

const isApiLoading = (data, error) => data == null && error == null;

const HomeScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const GetCategoriesResponse = useSelector(
    GetCategoriesReducer.selectGetCategoriesData,
  );
  const PopularCategoriesResponse = useSelector(
    PopularCategoriesReducer.selectPopularCategoriesData,
  );
  const TopRatedResponse = useSelector(TopRatedReducer.selectTopRatedData);
  const TopRatedError = useSelector(TopRatedReducer.selectTopRatedResponse);
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const MyProfileError = useSelector(MyProfileReducer.selectMyProfileResponse);
  const EventDateTimeResponse = useSelector(
    EventDateTimeReducer.selectEventDateTimeData,
  );
  const GetMarketingOffersResponse = useSelector(
    GetMarketingOffersReducer.selectGetMarketingOffersData,
  );
  const GetMarketingOffersError = useSelector(
    GetMarketingOffersReducer.selectGetMarketingOffersResponse,
  );
  const ChangeLanguageResponse = useSelector(
    ChangeLanguageReducer.selectChangeLanguageData,
  );

  const GetRecommendedResponse = useSelector(
    GetRecommendedReducer.selectGetRecommendedData,
  );
  const GetRecommendedError = useSelector(
    GetRecommendedReducer.selectGetRecommendedResponse,
  );
  const GetOccasionsResponse = useSelector(
    GetOccasionsReducer.selectGetOccasionsData,
  );
  const GetOccasionsError = useSelector(
    GetOccasionsReducer.selectGetOccasionsResponse,
  );
  const anasaOccasionsList = GetOccasionsResponse?.results?.occasions ?? [];
  const recommendedServicesList =
    GetRecommendedResponse?.results?.services ?? [];
  const anasaOccasionsLoading = isApiLoading(
    GetOccasionsResponse,
    GetOccasionsError,
  );
  const recommendedLoading = isApiLoading(
    GetRecommendedResponse,
    GetRecommendedError,
  );
  const marketingOffersLoading = isApiLoading(
    GetMarketingOffersResponse,
    GetMarketingOffersError,
  );
  const topRatedLoading = isApiLoading(TopRatedResponse, TopRatedError);
  const GetMyOccasionsResponse = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsData,
  );
  const GetMyOccasionsError = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsResponse,
  );

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(
    RECOMMENDED_PAGE_SIZE,
  );

  const profileBuyer = MyProfileResponse?.results?.buyer;
  const isProfileLoading =
    userLoggedIn &&
    !MyProfileError &&
    (MyProfileResponse == null || !profileBuyer?.full_name);
  const myOccasionsLoading =
    userLoggedIn &&
    isApiLoading(GetMyOccasionsResponse, GetMyOccasionsError);

  // Run `action` if logged in, otherwise bounce to the auth flow.
  // Used by sections (e.g. My Occasions) that are visible to guests but
  // require an authenticated user to actually perform the action.
  const requireAuth = action => () => {
    if (userLoggedIn) {
      action();
    } else {
      goToLogin(config.routes.AUTH_NAVIGATION);
    }
  };

  const partyMetaVersion = usePartyMetaCache();

  // User-created parties (getParties). Anasa Occasions catalog uses getOccasions.
  const myOccasionsList = useMemo(
    () =>
      (GetMyOccasionsResponse?.results?.parties ?? []).map(
        enrichPartyWithCachedMeta,
      ),
    [GetMyOccasionsResponse, partyMetaVersion],
  );

  const openOccasion = party => {
    navigation.navigate(config.routes.OCCASION_VIEW, {occasion: party});
  };

  const fetchMyParties = useCallback(() => {
    if (userLoggedIn) {
      dispatch({
        type: SagaActions.GET_MY_OCCASIONS,
        payload: {page: 1, pageSize: 50},
      });
    }
  }, [userLoggedIn, dispatch]);

  const colorScheme = useColorScheme();
  const appState = useRef(AppState.currentState);

  const spinValue = new Animated.Value(0);
  const spinLoader = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spinLoader());
  };

  const animatedBorderColor = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [config.colors.buttonColor + 40, config.colors.buttonColor],
  });
  useEffect(() => {
    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup function
    return () => {
      subscription.remove();
    };
  }, []);

  // Function to handle app state changes
  const handleAppStateChange = async nextAppState => {
    console.log('nextAppState', nextAppState);
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      navigateForNotification();
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;

    console.log('AppState', appState.current);
  };
  useEffect(() => {
    callHomePageApi();
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    fetchMyParties();
  }, [userLoggedIn, fetchMyParties]);

  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    setUserLoggedIn(result);
    if (result == true) {
      changeLanguageApi();
      callMyProfileApi();
      dispatch({
        type: SagaActions.GET_MY_OCCASIONS,
        payload: {page: 1, pageSize: 50},
      });
    } else {
      dispatch(GetMyCartReducer.removeGetMyCartResponse());
      dispatch(GetMyOccasionsReducer.removeGetMyOccasionsResponse());
      dispatch(GetOccasionsReducer.removeGetOccasionsResponse());
      dispatch(MyProfileReducer.removeMyProfileResponse());
    }
  };
  const callHomePageApi = () => {
    // dispatch({type: SagaActions.GET_CATEGORIES, payload: ''});
    dispatch({type: SagaActions.TOP_RATED, payload: ''});
    dispatch({type: SagaActions.GET_MARKETING_OFFERS, payload: ''});
    // dispatch({type: SagaActions.POPULAR_CATEGORIES, payload: ''});
    dispatch({
      type: SagaActions.GET_RECOMMENDATION,
      payload: {page: 1, pageSize: 20},
    });
    dispatch({
      type: SagaActions.GET_OCCASIONS,
      payload: {page: 1, pageSize: 20},
    });
  };
  useEffect(() => {
    if (ChangeLanguageResponse != null) {
      if (ChangeLanguageResponse?.error == false) {
        dispatch(ChangeLanguageReducer.removeChangeLanguageResponse());
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
      }
    }
  }, [ChangeLanguageResponse]);
  const changeLanguageApi = async () => {
    const lang = await AsyncStorage.getItem('user_language');
    if (lang) {
      dispatch({type: SagaActions.CHANGE_LANGUAGE, payload: {language: lang}});
    } else {
      dispatch({
        type: SagaActions.CHANGE_LANGUAGE,
        payload: {language: 'English'},
      });
      AsyncStorage.setItem('user_language', 'English');
    }
  };

  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(true);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [schedule_from_date, setScheduleFromDate] = useState('');
  const [schedule_from_time, setScheduleFromTime] = useState('');
  const [schedule_end_date, setScheduleEndDate] = useState('');
  const [schedule_end_time, setScheduleEndTime] = useState('');
  const [show_from_time, setShowFromTime] = useState(false);
  const [show_end_time, setShowEndTime] = useState(false);
  const [notification_status, setNotfcationStatus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      requestLocationPermission();
      navigateForNotification();
      fetchMyParties();
    }, [fetchMyParties]),
  );

  const callMyProfileApi = () => {
    dispatch({type: SagaActions.MY_PROFILE, payload: ''});
  };

  useEffect(() => {
    if (userLoggedIn) {
      callMyProfileApi();
    }
  }, [userLoggedIn]);
  useEffect(() => {
    if (MyProfileResponse != null) {
      if (MyProfileResponse?.error == false) {
        if (MyProfileResponse?.results?.provideDefaultAddress == true) {
          setEventDetailModalVisible(false);
          Toast.show(t('Please add your address first'), Toast.LONG);
          navigation.navigate(config.routes.USER_ADDRESS, {
            from: 'Location',
          });
        }
      }
    }
  }, [MyProfileResponse]);
  const handleLocationPermission = async () => {
    const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (res === 'granted') {
      await setCurrentLocation();
      console.log('You can use ios location');
    } else if (res === 'denied') {
      const res2 = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (res === 'blocked') {
      alert(t('Please enable location permission from app setting'));
    }
  };

  const navigateForNotification = () => {
    let type = global.NOTIFICATION_TYPE;
    let dataId = global.NOTIFICATION_DATA;
    if (type) {
      setEventDetailModalVisible(false);

      if (type == 'deepLink_service') {
        global.NOTIFICATION_TYPE = '';
        global.NOTIFICATION_DATA = '';

        return setTimeout(function () {
          navigation.navigate(config.routes.SERVICE, {
            service_id: dataId,
          });
        }, 2500);
      }

      if (type == 'deepLink_combo') {
        global.NOTIFICATION_TYPE = '';
        global.NOTIFICATION_DATA = '';

        return setTimeout(function () {
          navigation.navigate(config.routes.Banner_Detail, {
            banner_id: dataId,
          });
        }, 2500);
      }

      global.NOTIFICATION_TYPE = '';
      global.NOTIFICATION_DATA = '';
    }

    global.NOTIFICATION_TYPE = '';
    global.NOTIFICATION_DATA = '';
  };
  const requestLocationPermission = async () => {
    let noti = await AsyncStorage.getItem('notification_status');
    if (noti) {
      setNotfcationStatus(true);
    } else {
      setNotfcationStatus(false);
    }
    // ask for PermissionAndroid as written in your code
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        await setCurrentLocation();
      }
    } else {
      try {
        const res = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (res === 'granted') {
          await setCurrentLocation();
          console.log('You can use location');
        } else if (res === 'denied') {
          const res2 = request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        } else if (res === 'blocked') {
          alert(t('Please enable location permission from app setting'));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  async function setCurrentLocation() {
    Geolocation.getCurrentPosition(
      async position => {
        console.log('home screen====>>', position);
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        await AsyncStorage.setItem(
          config.AsyncKeys.USER_LOCATION,
          JSON.stringify(payload),
        );
        userLoggedIn &&
          dispatch({type: SagaActions.UPDATE_LAT_LONG, payload: payload});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }
  const showFromDatePicker = () => {
    setFromDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    if (schedule_from_date == '') {
      return Toast.show('Please confirm event start date first', Toast.LONG);
    }
    setEndDatePickerVisibility(true);
  };

  const hideFromDatePicker = () => {
    setFromDatePickerVisibility(false);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const handleFromDateConfirm = date => {
    setScheduleFromDate(date);
    hideFromDatePicker();
  };
  const handleEndDateConfirm = date => {
    const daydiff = moment(schedule_from_date).diff(
      moment(date).format('YYYY-MM-DD'),
      'days',
    );
    if (daydiff > 0) {
      hideEndDatePicker();

      return Toast.show(
        t('End date should not be less than event start date'),
        Toast.LONG,
      );
    }
    setScheduleEndDate(date);
    hideEndDatePicker();
  };
  const showFromTimePicker = () => {
    if (schedule_from_date == '') {
      return Toast.show('Please confirm event start date first', Toast.LONG);
    }
    setShowFromTime(true);
  };
  const showEndTimePicker = () => {
    if (schedule_end_date == '') {
      return Toast.show('Please confirm event end date first', Toast.LONG);
    }
    setShowEndTime(true);
  };
  const showFromTimeConfirm = time => {
    const currentTimeDiff = moment().diff(time, 'minutes');
    const currentDateDiff = moment().calendar(schedule_from_date, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD MMM YY',
    });
    if (currentDateDiff == 'Today') {
      if (currentTimeDiff >= 0) {
        cancelFromtime();
        setTimeout(() => {
          Toast.show(t('Please select valid start time'), Toast.LONG);
        }, 500);
        return true;
      }
    }
    console.log('timmme...', time + '    -- - - ' + currentTimeDiff);

    setScheduleFromTime(time);
    cancelFromtime();
  };
  const showEndTimeConfirm = time => {
    const currentTimeDiff = moment().diff(time, 'minutes');
    const currentDateDiff = moment().calendar(schedule_end_date, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD MMM YY',
    });

    if (currentDateDiff == 'Today') {
      if (currentTimeDiff >= 0) {
        cancelEndtime();
        setTimeout(() => {
          Toast.show(t('Please select valid end time'), Toast.LONG);
        }, 500);
        return true;
      }
    }

    setScheduleEndTime(time);
    cancelEndtime();
  };
  const cancelFromtime = () => {
    setShowFromTime(false);
  };
  const cancelEndtime = () => {
    setShowEndTime(false);
  };
  useEffect(() => {
    if (EventDateTimeResponse != null) {
      if (EventDateTimeResponse?.error == false) {
        if (!MyProfileResponse?.results?.buyer?.preferredStartDate) {
          Toast.show(EventDateTimeResponse?.message, Toast.LONG);
        }

        setEventDetailModalVisible(false);
        userLoggedIn && dispatch({type: SagaActions.MY_PROFILE, payload: ''});
      }
    }
  }, [EventDateTimeResponse]);
  const confirmEventDateTimeApi = () => {
    // if (schedule_from_date == '') {
    //   return Toast.show(t('Please confirm event start date'), Toast.LONG);
    // }
    // if (schedule_from_time == '') {
    //   return Toast.show('Please confirm event start time', Toast.LONG);
    // }
    // if (schedule_end_date == '') {
    //   return Toast.show('Please confirm event end date', Toast.LONG);
    // }
    // if (schedule_end_time == '') {
    //   return Toast.show('Please conf]irm event end time', Toast.LONG);
    // }
    // const startEndDateDiff = moment(schedule_end_date).diff(
    //   schedule_from_date,
    //   'days',
    // );
    //   // start time and end time
    // var startTime = moment(schedule_from_time, 'HH:mm A');
    // var endTime = moment(schedule_end_time, 'HH:mm A');

    // // calculate total duration
    // var duration = moment.duration(endTime.diff(startTime));

    // // duration in hours
    // const startEndTimeDiff = parseInt(duration.asMinutes());

    // if (startEndDateDiff == 0 && startEndTimeDiff <= 0) {
    //   return Toast.show(
    //     'Start event and End event timings should be valid',
    //     Toast.LONG,
    //   );
    // }

    // if (startEndDateDiff < 0) {
    //   return Toast.show(
    //     'End event date can not be less than from start date',
    //     Toast.LONG,
    //   );
    // }
    const payload = {
      startDate:
        schedule_from_date == ''
          ? moment().format('YYYY-MM-DD')
          : moment(schedule_from_date).format('YYYY-MM-DD'), // startTime: moment(schedule_from_time).format('hh:mm A'),
      // endDate: moment(schedule_end_date).format('YYYY-MM-DD'),
      // endTime: moment(schedule_end_time).format('hh:mm A'),
    };
    dispatch({type: SagaActions.EVENT_DATE_TIME, payload});
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

  const renderItem = ({item, index}) => {
    item = item?.vendor;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() =>
          navigation.navigate(config.routes.VENDOR_DETAILS, {
            vendor_id: item?._id,
          })
        }
        style={{
          marginLeft: I18nManager?.isRTL ? 15 : 0,
          marginRight: I18nManager?.isRTL ? 0 : 15,
          flexDirection: 'row',
          backgroundColor: config.colors.creamColor,
          borderRadius: 12,
          alignItems: 'center',
        }}>
        <View>
          <Image
            style={{
              height: 110,
              width: 115,
              resizeMode: 'stretch',
              borderRadius: 12,
            }}
            source={{uri: item?.shop_cover_image}}
          />
        </View>
        <View style={{flex: 1, marginHorizontal: 20}}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 24,
              color: config.colors.yellowColor,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {index + 1 > 9 ? index + 1 : '0' + (index + 1)}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              fontSize: 14,
              color: config.colors.blueColor,
              textTransform: 'capitalize',
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {I18nManager?.isRTL ? item?.shop_name_ar : item?.shop_name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 12,
              color: config.colors.Gray,
              textTransform: 'capitalize',
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {item?.building_name}
          </Text>
          <View style={[styles.NotificationCss, {alignSelf: 'center'}]}>
            <Image
              style={styles.startIcon}
              resizeMode="contain"
              source={require('../../assets/images/start.png')}
            />
            <Text style={styles.ratingText}>
              {item?.rating}
              {'/5'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderAnasaOccasionItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() =>
          navigation.navigate(config.routes.VIEW_OCCASION, {
            occasionItem: item,
          })
        }
        style={{
          marginLeft: I18nManager?.isRTL ? 15 : 0,
          marginRight: I18nManager?.isRTL ? 0 : 15,
          backgroundColor: config.colors.white,
          width: 150,
          borderRadius: 12,
        }}>
        <AppImage
          imageStyle={{
            height: 130,
            width: 150,
            resizeMode: 'cover',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          resizeMode={'cover'}
          uri={item?.image}
        />
        <Text
          numberOfLines={2}
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            fontSize: 14,
            color: config.colors.Black,
            textTransform: 'capitalize',
            textAlign: 'center',
            alignSelf: 'center',
            marginVertical: 5,
            paddingHorizontal: 6,
          }}>
          {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderRecommendItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flexBasis: '50%',
          paddingHorizontal: 5,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(config.routes.SERVICE, {
              service_id: item?._id,
            })
          }
          style={{
            backgroundColor: config.colors.white,
            borderRadius: 12,
            paddingBottom: 10,
            marginBottom: 15,
          }}>
          <AppImage
            imageStyle={{
              height: 130,
              width: '100%',
              resizeMode: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            resizeMode={'cover'}
            uri={item?.images[0]}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 14,
                color: config.colors.Black,
                textTransform: 'capitalize',
                width: '70%',
                textAlign: 'left',
              }}>
              {I18nManager.isRTL ? item?.name_ar : item.name_en}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                resizeMode="contain"
                source={require('../../assets/images/addCardtroly.png')}
              />
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 14,
              color: config.colors.orangeColor,
              textAlign: 'left',
              marginHorizontal: 10,
              marginTop: 5,
            }}>
            {item.price}
            {' SAR'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderCategoryItem = ({item, index}) => {
    item = item?.category;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() =>
          navigation.navigate(config.routes.SEARCH_RESULT, {
            search_result: item,
          })
        }
        style={{
          marginLeft: I18nManager?.isRTL ? 15 : 0,
          marginRight: I18nManager?.isRTL ? 0 : 15,
        }}>
        <View
          style={{
            overflow: 'hidden',
            backgroundColor: '#fff',
            elevation: 0.5,
            borderRadius: 10,
            width: 165,
          }}>
          <Image style={styles.decorImg} source={{uri: item.image}} />
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Light_Black,
              fontSize: 14,
              padding: 10,
            }}>
            {I18nManager.isRTL ? item?.name_ar : item.name_en}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const EventDetailModal = () => {
    return (
      <View
        style={{
          flex: 1,

          backgroundColor: 'rgba(0,0,0,0.2)',
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={eventDetailModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <View
              style={{
                margin: 15,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    fontSize: 16,
                    color: config.colors.Black,
                    textAlign: 'left',
                  }}>
                  {t('Confirm Event Date')}
                </Text>
                <Text
                  onPress={() => {
                    setEventDetailModalVisible(false);

                    setTimeout(() => {
                      confirmEventDateTimeApi();
                    }, 500);
                  }}
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    fontSize: 14,
                    color: config.colors.Gray,
                    textAlign: 'left',
                  }}>
                  {t('Skip')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View style={{width: '98%'}}>
                  {/* <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      fontSize: 14,
                      color: config.colors.Black,
                      marginVertical: 5,
                    }}>
                    From
                  </Text> */}
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#ABABB680',
                      borderRadius: 10,
                      height: 45,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      showFromDatePicker();
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                      source={require('../../assets/images/calender.png')}
                    />
                    <Text style={styles.dateText}>
                      {' '}
                      {schedule_from_date == ''
                        ? 'dd/mm/yy'
                        : moment(schedule_from_date).format('DD/MM/YY')}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={{width: '48%'}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      fontSize: 14,
                      color: config.colors.Black,
                      marginVertical: 5,
                    }}>
                    {' '}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#ABABB680',
                      borderRadius: 10,
                      height: 45,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      showFromTimePicker();
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                      source={require('../../assets/images/time.png')}
                    />
                    <Text style={styles.dateText}>
                      {' '}
                      {schedule_from_time == ''
                        ? 'hh:mm'
                        : moment(schedule_from_time).format('hh:mm A')}
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View style={{width: '48%'}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      fontSize: 14,
                      color: config.colors.Black,
                      marginVertical: 5,
                    }}>
                    To
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#ABABB680',
                      borderRadius: 10,
                      height: 45,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      showEndDatePicker();
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                      source={require('../../assets/images/calender.png')}
                    />
                    <Text style={styles.dateText}>
                      {' '}
                      {schedule_end_date == ''
                        ? 'dd/mm/yy'
                        : moment(schedule_end_date).format('DD/MM/YY')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '48%'}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      fontSize: 14,
                      color: config.colors.Black,
                      marginVertical: 5,
                    }}>
                    {' '}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: '#ABABB680',
                      borderRadius: 10,
                      height: 45,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                      showEndTimePicker();
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{width: 30, height: 30}}
                      source={require('../../assets/images/time.png')}
                    />
                    <Text style={styles.dateText}>
                      {' '}
                      {schedule_end_time == ''
                        ? 'hh:mm'
                        : moment(schedule_end_time).format('hh:mm A')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => confirmEventDateTimeApi()}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: config.colors.buttonColor,
                  height: 50,
                  width: 160,
                  borderRadius: 10,
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 14,
                    color: config.colors.white,
                    marginVertical: 5,
                  }}>
                  {t('Confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={isFromDatePickerVisible}
            mode="date"
            date={
              schedule_from_date
                ? new Date(schedule_from_date)
                : new Date()
            }
            onConfirm={handleFromDateConfirm}
            onCancel={hideFromDatePicker}
            minimumDate={new Date()}
            maximumDate={new Date(moment().add('2', 'years'))}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}
          />
          <DateTimePickerModal
            isVisible={show_from_time}
            mode="time"
            display="spinner"
            date={new Date()}
            onConfirm={showFromTimeConfirm}
            onCancel={cancelFromtime}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}

            // minimumDate={new Date()}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            date={
              schedule_end_date
                ? new Date(schedule_end_date)
                : new Date()
            }
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
            minimumDate={new Date()}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}
          />
          <DateTimePickerModal
            isVisible={show_end_time}
            mode="time"
            display="spinner"
            date={new Date()}
            onConfirm={showEndTimeConfirm}
            onCancel={cancelEndtime}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}

            // minimumDate={new Date()}
          />
        </Modal>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={config.colors.orangeColor}
        translucent={false}
      />
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={[config.colors.orangeColor, config.colors.orangeColor]}
              onRefresh={() => {
                callHomePageApi();
                callHomePageApi();
                fetchMyParties();
                if (userLoggedIn) {
                  callMyProfileApi();
                }
              }}
            />
          }>
          <View
            style={{
              backgroundColor: config.colors.orangeColor,
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: Platform.OS == 'ios' ? 60 : 20,
              paddingBottom: 12,
              zIndex: 10,
              elevation: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {isProfileLoading ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <SkeltonLoader
                      noSafeArea
                      variant="circle"
                      width={42}
                      height={42}
                      skeletonColor={HEADER_SKELETON_COLOR}
                    />
                    <View style={{marginLeft: 15}}>
                      <SkeltonLoader
                        noSafeArea
                        variant="rectangle"
                        width={72}
                        height={14}
                        skeletonColor={HEADER_SKELETON_COLOR}
                      />
                      <View style={{marginTop: 8}}>
                        <SkeltonLoader
                          noSafeArea
                          variant="rectangle"
                          width={130}
                          height={18}
                          skeletonColor={HEADER_SKELETON_COLOR}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate(config.routes.SIDE_BAR);
                      }}>
                      <Image
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 25,
                          resizeMode: 'cover',
                        }}
                        resizeMode="cover"
                        source={
                          profileBuyer?.profile_image
                            ? {uri: profileBuyer.profile_image}
                            : require('../../assets/images/user_icon.png')
                        }
                      />
                    </TouchableOpacity>
                    <View style={{marginLeft: 15}}>
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Regular,
                          fontSize: 14,
                          lineHeight: 22,
                          color: config.colors.white + 70,
                          textAlign: 'left',
                        }}>
                        {`${t(`Hello`)}!`}
                      </Text>
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_SemiBold,
                          fontSize: 16,
                          lineHeight: 24,
                          color: config.colors.white,
                          textAlign: 'left',
                        }}>
                        {profileBuyer?.full_name ?? `${t(`Guest`)}!`}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (userLoggedIn) {
                      navigation.navigate(config.routes.NOTIFICATION);
                    } else {
                      // Snackbar.show({
                      //   text: t(
                      //     'Please login as a user to perform this action',
                      //   ),
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
                    }
                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: config.colors.creamColor,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    borderRadius: 50,
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/Notification.png')}
                  />
                  {notification_status && (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        backgroundColor: config.colors.orangeColor,
                        borderRadius: 10,
                        position: 'absolute',
                        right: 8,
                        top: 8,
                      }}></View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (userLoggedIn) {
                      navigation.navigate(config.routes.CART);
                    } else {
                      // Snackbar.show({
                      //   text: t(
                      //     'Please login as a user to perform this action',
                      //   ),
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
                    }
                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: config.colors.creamColor,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    borderRadius: 50,
                    marginLeft: 10,
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/addCardtroly.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: config.colors.white + 70,
                marginVertical: 12,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(config.routes.SEARCH);
              }}>
              <AppTextInput
                inputTextLabelVisible={false}
                inputTextLabel={''}
                placeholder={t('Search')}
                leftIcon={require('../../assets/images/Search.png')}
                editable={false}
                pressable={true}
                viewStyle={{marginHorizontal: 0}}
                textInputStyle={{
                  flex: 1,
                  color: config.colors.Gray,
                  paddingTop: 15,
                }}
              />
            </TouchableOpacity>
          </View>

          {marketingOffersLoading ? (
            <View style={{marginTop: -14, paddingHorizontal: 16}}>
              <SkeltonLoader
                noSafeArea
                variant="rectangle"
                width={SCREEN_WIDTH - 32}
                height={Dimensions.get('screen').height / 4}
                borderRadius={12}
                borderColor={config.colors.Gray}
                borderWidth={1}
                borderStyle={{borderRadius: 12}}
                skeletonColor={config.colors.placeHolderColor}
              />
            </View>
          ) : GetMarketingOffersResponse?.results?.offer?.length > 0 ? (
            <View
              style={{
                height: Dimensions.get('screen').height / 3.9,
                marginTop: 12,
              }}>
              <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                showPagination
                paginationStyleItemActive={{
                  width: 22,
                  height: 8,
                  borderRadius: 10,
                  backgroundColor: config.colors.orangeColor,
                  marginHorizontal: 3,
                }}
                paginationStyleItemInactive={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: config.colors.placeholderTextColor,
                  marginHorizontal: 3,
                }}
                paginationStyle={
                  {
                    // marginBottom: Dimensions.get('screen').height / 3.8,
                    // alignSelf: 'flex-end',
                  }
                }
                data={GetMarketingOffersResponse?.results?.offer}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={index}
                      style={{
                        overflow: 'hidden',
                      }}
                      onPress={() => {
                        navigation.navigate(config.routes.Banner_Detail, {
                          banner_id: item?._id,
                        });
                      }}>
                      <FastImage
                        style={{
                          width: Dimensions.get('screen').width,
                          height: Dimensions.get('screen').height / 4,
                          borderTopLeftRadius: 24,
                          borderTopRightRadius: 24,
                        }}
                        source={{
                          uri: item?.image,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : null}

          {topRatedLoading ? (
            <>
              <View style={[styles.categoriesCss, {marginTop: 20}]}>
                <SkeltonLoader
                  noSafeArea
                  variant="rectangle"
                  width={120}
                  height={18}
                />
              </View>
              <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                <SkeltonLoader
                  noSafeArea
                  variant="rectangle_multiple"
                  direction="row"
                  count={3}
                  width={110}
                  height={130}
                />
              </View>
            </>
          ) : TopRatedResponse?.results?.newVendor?.length > 0 ? (
            <>
              <View style={styles.categoriesCss}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_SemiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: config.colors.Black,
                  }}>
                  {t('Top Vendors')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.ALL_VENDORS);
                  }}>
                  <Text style={styles.showAllText}>{t('Show All')}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={TopRatedResponse?.results?.newVendor}
                renderItem={renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 10, paddingTop: 12}}
                style={{
                  alignSelf: 'flex-start',
                }}
              />
            </>
          ) : null}
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 24,
              paddingHorizontal: 15,
              paddingVertical: 10,
              marginTop: 20,
              marginHorizontal: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_SemiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: config.colors.Black,
                    textAlign: 'left',
                  }}>
                  {t(`Plan my party`)}
                </Text>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 14,
                    lineHeight: 22,
                    colorL: config.colors.Gray,
                    textAlign: 'left',
                  }}>
                  {t(`We handle the details, so you can enjoy the moment.`)}
                </Text>
              </View>
              <Image
                style={{
                  width: 110,
                  height: 110,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/partyImage.png')}
              />
            </View>
            <AppButton
              text={t('Start Now')}
              onPress={() => {
                if (userLoggedIn) {
                  navigation.navigate(config.routes.START_SERVICE_REQUEST);
                } else {
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
                }
              }}
              viewStyle={{marginTop: 15, marginHorizontal: 0}}
            />
          </View>
          {/* ── My Occasions Section ── */}
          {/* Always rendered; guest users get bounced to login when they
              tap any action inside (handled via requireAuth). */}
          <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_SemiBold,
                    fontSize: 16,
                    lineHeight: 24,
                    color: config.colors.Black,
                  }}>
                  {t('My Occasions')}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={requireAuth(() =>
                    navigation.navigate(config.routes.MY_OCCASIONS),
                  )}
                  style={styles.myOccasionOutlineBtn}>
                  <Text style={styles.myOccasionOutlineBtnText}>
                    {t('View All')}
                  </Text>
                </TouchableOpacity>
              </View>

              {myOccasionsLoading ? (
                <View style={{paddingHorizontal: 16, paddingBottom: 4}}>
                  <SkeltonLoader
                    noSafeArea
                    variant="rectangle_multiple"
                    direction="row"
                    count={2}
                    width={168}
                    height={130}
                  />
                </View>
              ) : myOccasionsList?.length > 0 ? (
                <FlatList
                  data={myOccasionsList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, idx) => (item?._id ?? idx).toString()}
                  contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 4}}
                  style={{alignSelf: 'flex-start'}}
                  renderItem={({item, index}) => {
                    const party = enrichPartyWithCachedMeta(item);
                    const displayName = getPartyDisplayName(party);
                    const typeLabel = getPartyTypeLabel(party?.type);
                    const emoji = getPartyTypeEmoji(party?.type);
                    const dateLabel = formatPartyDatesLine(party);
                    const dateStatus = getPartyDateStatus(party);
                    const isExpired = isPartyDateExpired(party);
                    const accentColors = [
                      config.colors.orangeColor,
                      config.colors.buttonColor,
                      config.colors.yellowColor,
                    ];
                    const accentColor = isExpired
                      ? config.colors.Gray
                      : accentColors[index % 3];
                    return (
                      <View
                        key={index}
                        style={[
                          styles.myOccasionCard,
                          isExpired && styles.myOccasionCardExpired,
                        ]}>
                        <View
                          style={[
                            styles.myOccasionCardAccent,
                            {backgroundColor: accentColor},
                          ]}
                        />
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={requireAuth(() => openOccasion(party))}
                          style={styles.myOccasionCardBody}>
                          <View style={styles.myOccasionCardHeader}>
                            <View
                              style={[
                                styles.myOccasionIconWrap,
                                {borderColor: accentColor + '30'},
                              ]}>
                              <Text style={styles.myOccasionEmoji}>{emoji}</Text>
                            </View>
                            {dateStatus ? (
                              <OccasionDateStatusTag
                                party={party}
                                status={dateStatus}
                                style={styles.myOccasionStatusTag}
                              />
                            ) : null}
                          </View>
                          <Text
                            numberOfLines={1}
                            style={styles.myOccasionName}>
                            {displayName}
                          </Text>
                          {typeLabel ? (
                            <View style={styles.myOccasionTypePill}>
                              <Text
                                numberOfLines={1}
                                style={styles.myOccasionTypeText}>
                                {typeLabel}
                              </Text>
                            </View>
                          ) : null}
                          {dateLabel ? (
                            <View style={styles.myOccasionDateRow}>
                              <Image
                                source={require('../../assets/images/calender.png')}
                                style={[
                                  styles.myOccasionDateIcon,
                                  isExpired && styles.myOccasionDateIconExpired,
                                ]}
                              />
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.myOccasionDateText,
                                  isExpired && styles.myOccasionDateTextExpired,
                                ]}>
                                {dateLabel}
                              </Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={requireAuth(() =>
                    navigation.navigate(config.routes.CREATE_OCCASION),
                  )}
                  style={{
                    marginHorizontal: 16,
                    backgroundColor: config.colors.white,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: config.colors.orangeColor,
                    borderStyle: 'dashed',
                    padding: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: config.colors.creamColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}>
                    <Text style={{fontSize: 22}}>+</Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_SemiBold,
                        fontSize: 14,
                        color: config.colors.Black,
                        lineHeight: 20,
                      }}>
                      {t('Add New Occasion')}
                    </Text>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 12,
                        color: config.colors.Gray,
                        lineHeight: 18,
                      }}>
                      {t('Birthdays, Weddings & more')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Add New button below cards when occasions exist */}
              {myOccasionsList?.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={requireAuth(() =>
                    navigation.navigate(config.routes.CREATE_OCCASION),
                  )}
                  style={[styles.myOccasionOutlineBtn, styles.myOccasionAddBtn]}>
                  <Text style={styles.myOccasionOutlineBtnText}>
                    {'+ ' + t('Add New')}
                  </Text>
                </TouchableOpacity>
              )}
            </>

          {/* ── Anasa Occasions Section ── */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 16,
                lineHeight: 24,
                color: config.colors.Black,
              }}>
              {t('Anasa Occasions')}
            </Text>
          </View>
          {anasaOccasionsLoading ? (
            <View style={{paddingHorizontal: 10, paddingTop: 10}}>
              <SkeltonLoader
                noSafeArea
                variant="rectangle_multiple"
                direction="row"
                count={4}
                width={150}
                height={170}
              />
            </View>
          ) : anasaOccasionsList.length > 0 ? (
            <FlatList
              data={anasaOccasionsList}
              renderItem={renderAnasaOccasionItem}
              keyExtractor={(item, index) =>
                item?._id ? String(item._id) : `occasion-${index}`
              }
              horizontal={true}
              nestedScrollEnabled={true}
              removeClippedSubviews={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
              style={{alignSelf: 'flex-start'}}
            />
          ) : (
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 13,
                color: config.colors.Gray,
                paddingHorizontal: 20,
                paddingTop: 10,
              }}>
              {t('No Data available')}
            </Text>
          )}

          {/* ── Anasa Recommends Section ── */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 15,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 16,
                lineHeight: 24,
                color: config.colors.Black,
              }}>
              {t('Anasa Recommends')}
            </Text>
          </View>
          {recommendedLoading ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 10,
                paddingTop: 4,
              }}>
              {[0, 1, 2, 3].map(i => (
                <View
                  key={i}
                  style={{
                    width: SCREEN_WIDTH / 2 - 15,
                    paddingHorizontal: 5,
                    marginBottom: 12,
                  }}>
                  <SkeltonLoader
                    noSafeArea
                    variant="rectangle"
                    width={SCREEN_WIDTH / 2 - 25}
                    height={180}
                  />
                </View>
              ))}
            </View>
          ) : recommendedServicesList.length > 0 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                }}>
                {recommendedServicesList
                  .slice(0, recommendedVisibleCount)
                  .map((item, index) => renderRecommendItem({item, index}))}
              </View>
              {recommendedServicesList.length > recommendedVisibleCount && (
                <AppButton
                  text={t('Load More')}
                  onPress={() =>
                    setRecommendedVisibleCount(
                      prev => prev + RECOMMENDED_PAGE_SIZE,
                    )
                  }
                  buttonStyle={{
                    marginHorizontal: 20,
                    marginTop: 10,
                  }}
                />
              )}
            </>
          ) : (
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 13,
                color: config.colors.Gray,
                paddingHorizontal: 20,
                paddingTop: 4,
              }}>
              {t('No Data available')}
            </Text>
          )}
        </ScrollView>
      </View>
      {/* {EventDetailModal()} */}
      <FooterComponent from={`home`} navigation={navigation} />
    </View>
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
    paddingHorizontal: 10,
    height: 55,
    // backgroundColor: 'pink',
  },
  menuIcon: {
    width: 32,
    height: 32,
  },
  locationMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  locationIcon: {
    width: 18,
    height: 18,
    marginHorizontal: 5,
    marginBottom: 3,
  },
  locationText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 12,
  },
  locationText2: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Black,
    fontSize: 12,
  },
  NotificationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCardtrolyIcon: {
    width: 20,
    height: 20,
  },
  mainView: {
    flex: 1,
  },
  InputCss: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    height: 50,
    borderRadius: 26,
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  input: {
    width: '80%',
    borderRightWidth: 1,
    paddingVertical: 0,
    borderRightColor: '#D0D0D0',
    marginRight: 5,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  filterIcon: {
    width: 15,
    height: 15,
  },
  todayOffer: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  wrapper: {
    height: Dimensions.get('screen').height / 4,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#97CAE5',
    borderRadius: 9,
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#92BBD9',
    borderRadius: 9,
  },
  OfferImg: {
    height: 170,
    width: '100%',
    borderRadius: 10,
  },
  categoriesCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  showAllText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Gray,
    fontSize: 12,
  },
  DecorationsMainCss: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  DecorationsCss: {
    alignItems: 'center',
    // backgroundColor:'red',
    width: '25%',
    height: 105,
  },
  DecorationsImg: {
    width: 65,
    height: 65,
  },
  DecorationsText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#191919',
    fontSize: 12,
    marginTop: 7,
    textAlign: 'center',
  },
  FlatlistCss: {
    backgroundColor: '#fff',
    elevation: 0.5,
    borderRadius: 10,
    marginRight: 12,
    width: 170,
  },
  decorImg: {
    height: 150,
    width: 165,
    resizeMode: 'stretch',
  },
  PartyDecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
    textAlign: 'left',
  },
  DecorationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Gray,
    fontSize: 11,
    marginLeft: 5,
    textAlign: 'left',
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  StarImg: {
    height: 12,
    width: 12,
    marginHorizontal: 5,
  },
  ratingText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#474747',
    fontSize: 12,
    marginRight: 10,
    top: 2,
  },
  dateText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
  },
  startIcon: {
    width: 10,
    height: 10,
    marginHorizontal: 1,
  },
  myOccasionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: config.colors.white,
    borderWidth: 1,
    borderColor: config.colors.orangeColor,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  myOccasionOutlineBtnText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 13,
    color: config.colors.orangeColor,
  },
  myOccasionAddBtn: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 10,
  },
  myOccasionCard: {
    backgroundColor: config.colors.white,
    borderRadius: 14,
    marginRight: 12,
    width: 168,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: config.colors.borderColor,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    position: 'relative',
  },
  myOccasionCardAccent: {
    height: 3,
    width: '100%',
  },
  myOccasionCardBody: {
    padding: 14,
  },
  myOccasionCardExpired: {
    backgroundColor: '#FAFAFA',
  },
  myOccasionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  myOccasionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: config.colors.creamColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  myOccasionEmoji: {
    fontSize: 20,
  },
  myOccasionStatusTag: {
    flexShrink: 0,
    marginLeft: 8,
    maxWidth: 96,
  },
  myOccasionName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    lineHeight: 20,
    marginBottom: 6,
  },
  myOccasionTypePill: {
    alignSelf: 'flex-start',
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  myOccasionTypeText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 10,
    color: config.colors.Light_Black,
    textTransform: 'capitalize',
  },
  myOccasionDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myOccasionDateIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 5,
    tintColor: config.colors.orangeColor,
  },
  myOccasionDateText: {
    flex: 1,
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 11,
    color: config.colors.Gray,
    lineHeight: 16,
  },
  myOccasionDateTextExpired: {
    color: '#B91C1C',
  },
  myOccasionDateIconExpired: {
    tintColor: '#B91C1C',
  },
});

export default HomeScreen;
