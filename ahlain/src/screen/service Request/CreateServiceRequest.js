import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  PermissionsAndroid,
  Alert,
  I18nManager,
  useColorScheme,
  StatusBar,
  Switch,
  ActivityIndicator,
} from 'react-native';
import config from '../../config';

import {useDispatch, useSelector} from 'react-redux';
import {
  AddPacakageToCartReducer,
  CreateServiceEligiblityReducer,
  CreateRequestReducer,
  EditRequestReducer,
  MakePaymentReducer,
  MyProfileReducer,
  ViewRequestReducer,
  GetCategoriesListReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AppButton from '../../conponents/AppButton';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import ImagePicker from '../../utils/ImagePicker';

import {PERMISSIONS, check, request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Apiloader from '../../conponents/ApiLoader';
import {AppTextInput} from '../../conponents';
import {goToLogin} from '../../conponents/NavigationRef';
import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppImage from '../../conponents/AppImage';

let finalPackageArray = [];

const CreateServiceRequest = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const refRBSheet = useRef(null);

  const GetCategoriesListResponse = useSelector(
    GetCategoriesListReducer.selectGetCategoriesListData,
  );
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const CreateRequestResponse = useSelector(
    CreateRequestReducer.selectCreateRequestData,
  );
  const ViewRequestResponse = useSelector(
    ViewRequestReducer.selectViewRequestData,
  );
  const EditRequestResponse = useSelector(
    EditRequestReducer.selectEditRequestData,
  );
  const AddPacakageToCartResponse = useSelector(
    AddPacakageToCartReducer.selectAddPacakageToCartData,
  );
  const MakePaymentResponse = useSelector(
    MakePaymentReducer.selectMakePaymentData,
  );
  const CreateServiceEligiblityResponse = useSelector(
    CreateServiceEligiblityReducer.selectCreateServiceEligiblityData,
  );
  const CreateServiceEligiblityErrorResponse = useSelector(
    CreateServiceEligiblityReducer.selectCreateServiceEligiblityResponse,
  );

  const [descriptionEn, setDescriptionEn] = useState('');

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [requestPacakages, setRequestPackages] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [serviceAmount, setServiceAmount] = useState(0);
  const [stepCount, setStepCount] = useState(route?.params?.stepCount ?? 1);

  const [event_name, setEventName] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategoriesList, setSelectedCategoriesList] = useState([]);
  const [searchCategoryText, setSearchCategoryText] = useState([]);
  const [event_budget_cost, setEventBudgetCost] = useState('');
  const [event_no_of_guests, setEventNoOfGuests] = useState('');
  const [comment, setComment] = useState('');
  const [imageArray, setImageArray] = useState([]);
  const [location_id, setLocationId] = useState(route?.params?.location_id);
  const [schedule_start_date, setSchedulStartDate] = useState('');
  const [schedule_start_time, setScheduleStartTime] = useState('');
  const [schedule_end_date, setScheduleEndDate] = useState('');
  const [schedule_end_time, setScheduleEndTime] = useState('');

  const [city, setCity] = useState(null);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [searchCityText, setSearchCityText] = useState('');
  const [isCategoryShow, setIsCategoryShow] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const [viewRequestData, setViewRequestData] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (MyProfileResponse?.results?.buyer?.preferredStartDate) {
      // setSchedulStartDate(
      //   MyProfileResponse?.results?.buyer?.preferredStartDate,
      // );
    }
    if (MyProfileResponse?.results?.buyer?.preferredStartTime) {
      // setScheduleStartTime(
      //   MyProfileResponse?.results?.buyer?.preferredStartTime,
      // );
    }
    if (MyProfileResponse?.results?.buyer?.preferredEndDate) {
      // setScheduleEndDate(MyProfileResponse?.results?.buyer?.preferredEndDate);
    }
    if (MyProfileResponse?.results?.buyer?.preferredEndTime) {
      // setScheduleEndTime(MyProfileResponse?.results?.buyer?.preferredEndTime);
    }
  }, [MyProfileResponse]);
  useEffect(() => {
    if (CreateRequestResponse != null) {
      if (CreateRequestResponse?.error == false) {
        Toast.show(CreateRequestResponse?.message, Toast.LONG);
        navigation.goBack();
        dispatch(CreateRequestReducer.removeCreateRequestResponse());
      }
    }
  }, [CreateRequestResponse]);
  useEffect(() => {
    if (GetCategoriesListResponse != null && isFocused) {
      if (GetCategoriesListResponse?.error == false) {
        setCategoriesList([
          ...categoriesList,
          ...GetCategoriesListResponse?.results?.categories,
        ]);
        setPageNo(pageNo + 1);
        setTotalPageNo(GetCategoriesListResponse?.results?.totalPage);
        dispatch(GetCategoriesListReducer.removeGetCategoriesListResponse());
      }
    }
  }, [GetCategoriesListResponse]);
  useEffect(() => {
    if (AddPacakageToCartResponse != null) {
      if (AddPacakageToCartResponse?.error == false) {
        Toast.show(AddPacakageToCartResponse?.message, Toast.LONG);
        navigation.replace(config.routes.CART);
        dispatch(AddPacakageToCartReducer.removeAddPacakageToCartResponse());
      }
    }
  }, [AddPacakageToCartResponse]);
  useEffect(() => {
    if (EditRequestResponse != null) {
      if (EditRequestResponse?.error == false) {
        Toast.show(EditRequestResponse?.message, Toast.LONG);
        navigation.goBack();
        dispatch(EditRequestReducer.removeEditRequestResponse());
      }
    }
  }, [EditRequestResponse]);
  useEffect(() => {
    if (route?.params?.request_id) {
      const payload = {
        uri: '/' + route?.params?.request_id,
      };
      dispatch({type: SagaActions.VIEW_REQUEST, payload});
    }
    finalPackageArray = [];
    dispatch(ViewRequestReducer.removeViewRequestResponse());
  }, []);
  useEffect(() => {
    if (route?.params?.request_id) {
      if (ViewRequestResponse?.results?.event?.startDate) {
        setSchedulStartDate(ViewRequestResponse?.results?.event?.startDate);
      }
      if (ViewRequestResponse?.results?.event?.startTime) {
        setScheduleStartTime(ViewRequestResponse?.results?.event?.startTime);
      }
      if (ViewRequestResponse?.results?.event?.endDate) {
        setScheduleEndDate(ViewRequestResponse?.results?.event?.endDate);
      }
      if (ViewRequestResponse?.results?.event?.endTime) {
        setScheduleEndTime(ViewRequestResponse?.results?.event?.endTime);
      }
      if (ViewRequestResponse?.results?.event?.description) {
        setDescriptionEn(ViewRequestResponse?.results?.event?.description);
      }
      if (ViewRequestResponse?.results?.event?.event_location) {
        setLocationId(ViewRequestResponse?.results?.event?.event_location);
      }
      if (ViewRequestResponse?.results?.event?.eventName) {
        setEventName(ViewRequestResponse?.results?.event?.eventName);
      }
      if (ViewRequestResponse?.results?.event?.category?.length > 0) {
        setSelectedCategoriesList(
          ViewRequestResponse?.results?.event?.category,
        );
      }
      if (ViewRequestResponse?.results?.event?.budget_cost) {
        setEventBudgetCost(
          '' + ViewRequestResponse?.results?.event?.budget_cost,
        );
      }
      if (ViewRequestResponse?.results?.event?.no_of_guests) {
        setEventNoOfGuests(
          '' + ViewRequestResponse?.results?.event?.no_of_guests,
        );
      }
      if (ViewRequestResponse?.results?.event?.comment) {
        setComment(ViewRequestResponse?.results?.event?.comment);
      }
      if (ViewRequestResponse?.results?.event?.images) {
        setImageArray(ViewRequestResponse?.results?.event?.images);
      }
    }
    setViewRequestData(ViewRequestResponse?.results?.event);
  }, [ViewRequestResponse]);
  useEffect(() => {
    if (CreateServiceEligiblityResponse != null) {
      if (CreateServiceEligiblityResponse?.error == false) {
        setServiceAmount(CreateServiceEligiblityResponse?.results?.amount);
        dispatch(
          CreateServiceEligiblityReducer.removeCreateServiceEligiblityResponse(),
        );
      }
    }
  }, [CreateServiceEligiblityResponse]);
  useEffect(() => {
    if (CreateServiceEligiblityErrorResponse != null) {
      Alert.alert(
        t('Notes'),
        `${CreateServiceEligiblityErrorResponse?.message}`,
        [
          // {
          //   text: 'Cancel',
          //   onPress: () => console.log('Cancel Pressed'),
          //   style: 'cancel',
          // },
          {text: t('Ok'), onPress: () => console.log('OK Pressed')},
        ],
      );
      dispatch(
        CreateServiceEligiblityReducer.removeCreateServiceEligiblityResponse(),
      );
    }
  }, [CreateServiceEligiblityErrorResponse]);
  useEffect(() => {
    if (MakePaymentResponse != null) {
      if (MakePaymentResponse?.error == false) {
        if (MakePaymentResponse?.results?.resp?.link) {
          var formData = new FormData();
          formData.append('location_id', location_id?._id);
          formData.append('eventName', event_name?.trim());
          formData.append(
            'startDate',
            moment(schedule_start_date).format('YYYY-MM-DD'),
          );
          formData.append('startTime', schedule_start_time);
          formData.append(
            'endDate',
            moment(schedule_end_date).format('YYYY-MM-DD'),
          );
          formData.append('endTime', schedule_end_time);
          formData.append('description', descriptionEn?.trim());
          formData.append('comment', comment);
          formData.append('budget_cost', event_budget_cost);
          formData.append('no_of_guests', event_no_of_guests);

          imageArray.forEach(element => {
            formData.append('images', element);
          });
          navigation.replace(config.routes.CHECK_PAYMENT, {
            transactionID: MakePaymentResponse?.results?.resp?.transactionID,
            link: MakePaymentResponse?.results?.resp?.link,
            requestEventFormData: formData,
            from: 'createServiceRequest',
            request_id: route?.params?.request_id,
          });
        }

        dispatch(MakePaymentReducer.removeMakePaymentResponse());
      }
    }
  }, [MakePaymentResponse]);

  useEffect(() => {
    setCategoriesList([]);
    setTotalPageNo(1);
    setPageNo(1);
    callGetCategoriesApi(1, '');
  }, []);
  const callGetCategoriesApi = (pageNo, searchText) => {
    const payload = {
      page: pageNo,
      pageSize: 10,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_CATEGORIES_LIST, payload});
  };
  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      if (text != '') {
        callGetCategoriesApi(1, text);
      }
    }, 500),
    [],
  );
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const handleStartDateConfirm = date => {
    setSchedulStartDate(date);
    setScheduleEndDate(date);
    hideStartDatePicker();
  };
  const handleEndDateConfirm = date => {
    const daydiff = moment(schedule_start_date).diff(
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
  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };
  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };
  const handleStartTimeConfirm = time => {
    const currentTimeDiff = moment().diff(time, 'minutes');
    const currentDateDiff = moment().calendar(schedule_start_date, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD MMM YY',
    });
    if (currentDateDiff == 'Today') {
      if (currentTimeDiff >= 0) {
        hideStartTimePicker();
        setTimeout(() => {
          Toast.show(t('Please select valid start time'), Toast.LONG);
        }, 500);
        return true;
      }
    }
    console.log('timmme...', time + '    -- - - ' + currentTimeDiff);

    setScheduleStartTime(moment(time).format('hh:mm A'));
    hideStartTimePicker();
  };
  const handleEndTimeConfirm = time => {
    const currentTimeDiff = moment().diff(time, 'minutes');
    const endTimeDiff = moment(schedule_start_time).diff(time, 'minutes');
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
        hideEndTimePicker();
        setTimeout(() => {
          Toast.show(t('Please select valid end time'), Toast.LONG);
        }, 500);
        return true;
      }
    }

    console.log('timmme...', time + '    -- - - ' + currentTimeDiff);

    setScheduleEndTime(moment(time).format('hh:mm A'));
    hideEndTimePicker();
  };
  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };
  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleCameraPermission = async index => {
    const res = await check(PERMISSIONS.IOS.CAMERA);
    if (res === 'granted') {
      Upload_Image();
      console.log('You can use ios camera');
    } else if (res === 'denied') {
      const res2 = request(PERMISSIONS.IOS.CAMERA);
    } else if (res === 'blocked') {
      alert('Please enable camera permission from app setting');
    }
  };
  const requestCameraPermission = async index => {
    // ask for PermissionAndroid as written in your code
    if (Platform.OS === 'ios') {
      handleCameraPermission(index);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t('Anasa Camera Permission'),
            message: t(
              'Anasa needs access to your camera so you can Upload pictures.',
            ),
            buttonNeutral: t('Ask Me Later'),
            buttonNegative: t('Cancel'),
            buttonPositive: t('Ok'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Upload_Image();
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const Upload_Image = () =>
    Alert.alert(t('Upload'), t('Please Uplaod Image'), [
      {
        text: t('Gallery'),
        onPress: () => openGallery(''),
      },
      {text: t('Camera'), onPress: () => openCamera('')},
      {
        text: t('Cancel'),
        onPress: () => console.log(''),
      },
    ]);

  const openCamera = () => {
    let options = {
      quality: 0.4,
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
    };
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          let imgObj = {
            uri: image.path,
            type: 'image/jpeg',
            name: Date.now() + 'image1.jpeg',
          };
          setImageArray([...imageArray, imgObj]);
        })
        .catch(e => console.log('e', e));
    }, 500);
  };

  const openGallery = () => {
    let options = {
      quality: 0.2,
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
    };
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          let imgObj = {
            uri: image.path,
            type: 'image/jpeg',
            name: Date.now() + 'image1.jpeg',
          };
          setImageArray([...imageArray, imgObj]);
        })
        .catch(e => console.log('e', e));
    }, 500);
  };
  const onButtonPress = async stepNo => {
    if (stepNo == 1) {
      if (event_name?.trim() == '') {
        return Toast.show(t('Please enter event name'), Toast.LONG);
      }
      if (selectedCategoriesList?.length == 0) {
        return Toast.show(t('Please select type of service'), Toast.LONG);
      }
      if (event_no_of_guests < 1) {
        return Toast.show(t('Please enter no of guests'), Toast.LONG);
      }
      if (event_budget_cost < 1) {
        return Toast.show(t('Please enter event budget cost'), Toast.LONG);
      }
      // if (event_budget_cost < 2000) {
      //   return Toast.show(t('Min budget for event 2000 SAR'), Toast.LONG);
      // }

      if (comment?.trim() == '') {
        return Toast.show(t('Please enter event description'), Toast.LONG);
      }
      setStepCount(2);
      return;
    }
    if (stepNo == 2) {
      if (!location_id) {
        return Toast.show(t('Please enter event location'), Toast.LONG);
      }
      if (schedule_start_date == '') {
        return Toast.show(t('Please select event start date'), Toast.LONG);
      }
      if (schedule_end_date == '') {
        return Toast.show(t('Please select event end date'), Toast.LONG);
      }
      if (schedule_start_time == '') {
        return Toast.show(t('Please select event start time'), Toast.LONG);
      }

      if (schedule_end_time == '') {
        return Toast.show(t('Please select event end time'), Toast.LONG);
      }
      const startEndDateDiff = moment(schedule_end_date).diff(
        schedule_start_date,
        'days',
      );
      // start time and end time
      var startTime = moment(schedule_start_time, 'HH:mm A');
      var endTime = moment(schedule_end_time, 'HH:mm A');

      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));

      // duration in minutes
      var startEndTimeDiff = parseInt(duration.asMinutes());
      if (startEndDateDiff == 0 && startEndTimeDiff <= 0) {
        return Toast.show(
          t('Start event and End event timings should be valid'),
          Toast.LONG,
        );
      }

      if (startEndDateDiff < 0) {
        return Toast.show(
          t('End event date can not be less than from start date'),
          Toast.LONG,
        );
      }
      if (imageArray?.length == 0) {
        return Toast.show(t('Please upload atleast one image'), Toast.LONG);
      }
      setStepCount(3);
      callCreateServiceEligiblityApi();
      return;
    }
  };
  const callCreateServiceEligiblityApi = async () => {
    const payload = {
      location_id: location_id?._id,
      eventName: event_name?.trim(),
      category: JSON.stringify(selectedCategoriesList?.map(c => c?._id)),
      startDate: moment(schedule_start_date).format('YYYY-MM-DD'),
      startTime: schedule_start_time,
      endDate: moment(schedule_end_date).format('YYYY-MM-DD'),
      endTime: schedule_end_time,
      description: descriptionEn?.trim(),
      comment: comment,
      images: JSON.stringify(imageArray),
      budget_cost: event_budget_cost,
      no_of_guests: event_no_of_guests,
    };

    dispatch({
      type: SagaActions.CREATE_SERVICE_ELIGIBILITY,
      payload: payload,
    });

    console.log('payload', payload);
  };
  const removeServiceImage = index => {
    let tempArray = [...imageArray];
    var newindex = tempArray.indexOf(index);

    if (newindex !== -1) {
      tempArray.splice(newindex, 1);
    }
    setImageArray(tempArray);
  };
  const handleReceiveCustomization = receivedData => {
    var newIndex = viewRequestData?.packages?.findIndex(
      item => item?.service?._id === receivedData?.service_id,
    );
    if (newIndex != -1) {
      const temp = {...viewRequestData};
      temp.packages = [...viewRequestData.packages];
      temp.packages[newIndex] = {
        ...temp.packages[newIndex],
        customize_package: receivedData?.package,
        customize_price: receivedData?.customize_price,
      };
      setViewRequestData(temp);
    }
  };
  function isCustomizeRequired(data) {
    for (let attribute of data) {
      if (attribute?.service?.packages?.length > 0) {
        const matchingPackage = viewRequestData?.packages.find(
          item => item._id === attribute?._id,
        );
        console.log('matchingPackage', matchingPackage);
        if (!matchingPackage?.customize_package) {
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
  const onServiceItemPress = (item, index) => {
    // const presentIndex = finalPackageArray.findIndex(
    //   i => i?.service === item?.service?._id,
    // );
    setRequestPackages(Date.now() + index);

    const presentIndex = index;
    let a = finalPackageArray[presentIndex];

    if (a) {
      // finalPackageArray.splice(presentIndex, 1);
      finalPackageArray[presentIndex] = undefined;
    } else {
      const packageObj = {
        service: item?.service?._id,
        package: '',
      };
      finalPackageArray[presentIndex] = packageObj;
    }
  };
  const onPacakageItemPress = (service_id, item, index) => {
    // const presentIndex = finalPackageArray.findIndex(
    //   i => i?.package === item?._id,
    //   );
    setRequestPackages(Date.now() + index);
    const presentIndex = index;
    let a = finalPackageArray[presentIndex];
    if (a) {
      finalPackageArray[presentIndex] = undefined;
    } else {
      const packageObj = {
        service: service_id,
        package: item?._id,
      };
      finalPackageArray[presentIndex] = packageObj;
      console.log(finalPackageArray);
    }
  };
  const addServiceTocart = () => {
    if (isCustomizeRequired(viewRequestData?.packages) != '') {
      return Toast.show(
        isCustomizeRequired(viewRequestData?.packages),
        Toast.SHORT,
      );
    }
    const payload = {
      packages: viewRequestData?.packages,
      isAddedByAdmin: true,
      totalAmount: viewRequestData?.totalAmount,
    };
    dispatch({type: SagaActions.Add_PACKAGE_TO_CART, payload});
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.cakeCss}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate(config.routes.SUBCATEGORIES, {
            cate: item,
          })
        }>
        <Image
          style={{width: 80, height: 80, borderRadius: 40}}
          source={{uri: item.image}}
        />
        <Text style={styles.cakeText}>{item.name_en}</Text>
      </TouchableOpacity>
    );
  };
  function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i)
      {result += chars[Math.floor(Math.random() * chars.length)];}
    return result;
  }

  const callCreateServiceRequestApi = async () => {
    let url = config.constants.BASE_API_URL + 'buyer/requestEvent';
    if (route?.params?.request_id) {
      url =
        config.constants.BASE_API_URL +
        'buyer/editRequestedEvent/' +
        route?.params?.request_id;
    }
    var formData = new FormData();
    formData.append('location_id', location_id?._id);
    formData.append('eventName', event_name?.trim());
    formData.append(
      'startDate',
      moment(schedule_start_date).format('YYYY-MM-DD'),
    );
    formData.append('startTime', schedule_start_time);
    formData.append('endDate', moment(schedule_end_date).format('YYYY-MM-DD'));
    formData.append('endTime', schedule_end_time);
    formData.append('description', descriptionEn?.trim());
    formData.append('comment', comment);
    formData.append('budget_cost', event_budget_cost);
    formData.append('no_of_guests', event_no_of_guests);
    formData.append(
      'category',
      JSON.stringify(selectedCategoriesList?.map(c => c?._id)),
    );

    imageArray.forEach(element => {
      formData.append('images', element);
    });
    setIsApiLoading(true);
    const userData = JSON.parse(
      await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
    );
    let language = 'English';
    language = await AsyncStorage.getItem('user_language');
    console.log('formData' + url, formData);
    axios({
      method: 'post',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'x-auth-token-buyer': userData && userData?.token,
        'x-buyer-language': language,
      },
      data: formData,
    })
      .then(res => {
        setIsApiLoading(false);
        console.log('res?.data', res?.data);
        Toast.show(res?.data?.message, Toast.LONG);
        goToLogin(config.routes.HOME_SCREEN);
      })
      .catch(e => {
        setIsApiLoading(false);
        console.log('e', e);
      });
  };
  const onMakePaymentApi = serviceAmount => {
    console.log(
      'ViewRequestResponse?.results?.event?.status',
      viewRequestData?.status,
    );
    const status = viewRequestData?.status;
    if (status == 'ReadyForPayment') {
      const payload = {
        customerEmail: MyProfileResponse?.results?.buyer?.email,
        email: MyProfileResponse?.results?.buyer?.email,
        amount: serviceAmount,
        firstName: MyProfileResponse?.results?.buyer?.full_name,
        country: 'SA',
        referenceId: randomString(
          24,
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ),
      };
      console.log('payload', payload);
      dispatch({type: SagaActions.MAKE_PAYMENT, payload});
    } else {
      callCreateServiceRequestApi();
    }
  };
  const Step1Component = stepCount => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 40,
              height: 40,
              justifyContent: 'center',
              borderRadius: 50,
            }}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
              flex: 1,
            }}>
            {t('Create Request')}
          </Text>
          <View
            style={{
              backgroundColor: config.colors.blueColor,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.white,
                fontSize: 10,
              }}>
              {`${stepCount} of 03`}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            color: config.colors.blueColor,
            fontSize: 16,
            textAlign: 'left',
          }}>
          {t('Enter the details below to create your event')}
        </Text>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Event Title *')}
              placeholder={t('Enter event title')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              onChangeText={val => setEventName(val)}
              value={event_name?.trimStart()}
            />
          </View>
          <View style={styles.inputCss}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.Black,
                fontSize: 14,
                textAlign: 'left',
              }}>
              {t('Category *')}
            </Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.Gray,
                fontSize: 12,
                textAlign: 'left',
              }}>
              {t('Select the type of your service')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 50,
                marginVertical: 5,
                paddingHorizontal: 10,
                borderColor: config.colors.borderColor,
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: config.colors.white,
              }}
              onPress={() => {
                setTimeout(() => {
                  setIsCategoryShow(!isCategoryShow);
                }, 100);
                setCategoryDropdown(!categoryDropdown);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexWrap: 'wrap',
                }}>
                {selectedCategoriesList?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: config.colors.borderColor,
                        borderRadius: 6,
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        margin: 5,
                      }}
                      onPress={() => {
                        if (selectedCategoriesList?.includes(item)) {
                          var tempArray = [...selectedCategoriesList];

                          var newIndex = tempArray.indexOf(item);
                          if (newIndex !== -1) {
                            tempArray.splice(newIndex, 1);
                          } else {
                          }

                          setSelectedCategoriesList(tempArray);
                        } else {
                          setSelectedCategoriesList([
                            ...selectedCategoriesList,
                            item,
                          ]);
                        }
                        setCategoryDropdown(false);
                        setIsCategoryShow(false);
                      }}>
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Regular,
                          color: config.colors.Black,
                          fontSize: 12,
                          marginHorizontal: 4,
                        }}>
                        {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
                      </Text>
                      <Image
                        style={{
                          width: 10,
                          height: 10,
                          resizeMode: 'contain',
                          tintColor: config.colors.Black,
                        }}
                        resizeMode="contain"
                        source={require('../../assets/images/closeIcon.png')}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Image
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                  transform: [{rotate: categoryDropdown ? '180deg' : '0deg'}],
                }}
                resizeMode="contain"
                source={require('../../assets/images/downArrowIcon.png')}
              />
            </TouchableOpacity>

            {categoryDropdown && (
              <View
                style={{
                  maxHeight: 350,
                  borderWidth: 1,
                  borderColor: config.colors.Gray,
                  borderRadius: 12,
                  backgroundColor: config.colors.white,
                }}>
                <AppTextInput
                  textInputStyle={{
                    flex: 1,
                  }}
                  onChangeText={val => {
                    setCategoriesList([]);
                    setPageNo(1);
                    setTotalPageNo(1);
                    setSearchCategoryText(val);
                    debouncedCallGetSearchSuggestions(val);
                  }}
                  value={searchCategoryText}
                  placeholder={`${t('Search Here')}`}
                  returnKeyType="done"
                  maxLength={30}
                  rightIcon={
                    searchCategoryText != '' &&
                    require('../../assets/images/closeIcon.png')
                  }
                  rightIconPress={() => {
                    setSearchCategoryText('');
                    setCategoriesList([]);
                    setPageNo(1);
                    setTotalPageNo(1);
                    callGetCategoriesApi(1, '');
                  }}
                  rightIconStyle={{
                    width: 16,
                    height: 16,
                    tintColor: config.colors.blackColor,
                  }}
                  viewStyle={{
                    marginHorizontal: 10,
                  }}
                />
                <FlatList
                  nestedScrollEnabled
                  keyboardShouldPersistTaps={'handled'}
                  data={categoriesList}
                  keyExtractor={item => item._id.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        key={index}
                        style={{
                          paddingVertical: 10,
                          borderBottomWidth: 0.5,
                          borderBottomColor: config.colors.greyColor,
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          if (selectedCategoriesList?.includes(item)) {
                            var tempArray = [...selectedCategoriesList];

                            var newIndex = tempArray.indexOf(item);
                            if (newIndex !== -1) {
                              tempArray.splice(newIndex, 1);
                            } else {
                            }

                            setSelectedCategoriesList(tempArray);
                          } else {
                            setSelectedCategoriesList([
                              ...selectedCategoriesList,
                              item,
                            ]);
                          }
                          setCategoryDropdown(false);
                          setIsCategoryShow(false);
                        }}>
                        <Text
                          style={{
                            fontFamily: config.fonts.MontserratMedium,
                            fontSize: 12,
                            color: config.colors.blackColor,
                            lineHeight: 22,
                            // textTransform: 'capitalize',
                            textAlign: 'left',
                          }}>
                          {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  onEndReached={() => {
                    if (totalPageNo >= pageNo) {
                      callGetCategoriesApi(pageNo, searchCityText);
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    loading ? (
                      <ActivityIndicator
                        style={{margin: 20}}
                        color={config.colors.buttonColor}
                      />
                    ) : null
                  }
                  ListEmptyComponent={
                    !loading && !citiesList.length ? (
                      <Text
                        style={{
                          fontFamily: config.fonts.InterMediumFont,
                          fontSize: 12,
                          color: config.colors.blackColor,
                          lineHeight: 22,
                          margin: 20,
                          textAlign: 'center',
                        }}>
                        {t('No Data Found')}
                      </Text>
                    ) : null
                  }
                />
              </View>
            )}
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('No. of Guests *')}
              placeholder={t('Enter Number of guests')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              onChangeText={val => {
                setEventNoOfGuests(val?.replace(/[^0-9]/g, ''));
              }}
              value={event_no_of_guests}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Event Budget Cost *')}
              placeholder={t('Enter Cost in SAR')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              onChangeText={val => {
                setEventBudgetCost(val?.replace(/[^0-9]/g, ''));
              }}
              value={event_budget_cost}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Comment *')}
              placeholder={t('Enter Comment')}
              textAlignVertical={'top'}
              textInputStyle={{
                flex: 1,
                height: 120,
                textAlign: 'left',
                color: config.colors.Black,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              viewStyle={{marginHorizontal: 0, height: 120}}
              multiline={true}
              returnKeyType={'next'}
              onChangeText={val => {
                setComment(val);
              }}
              value={comment}
            />
          </View>
        </ScrollView>
        <AppButton
          text={t('Continue')}
          onPress={() => {
            onButtonPress(1);
          }}
          viewStyle={{
            marginTop: 30,
            width: '100%',
          }}
          buttonStyle={{
            backgroundColor: config.colors.buttonColor,
          }}
        />
      </View>
    );
  };
  const Step2Component = stepCount => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 40,
              height: 40,
              justifyContent: 'center',
              borderRadius: 50,
            }}
            onPress={() => setStepCount(1)}>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
              flex: 1,
            }}>
            {t('Create Request')}
          </Text>
          <View
            style={{
              backgroundColor: config.colors.blueColor,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.white,
                fontSize: 10,
              }}>
              {`${stepCount} of 03`}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            color: config.colors.blueColor,
            fontSize: 16,
            textAlign: 'left',
          }}>
          {t('Enter the Date and Location')}
        </Text>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputCss}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.Black,
                  fontSize: 14,
                }}>
                {t('Select Address *')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setLocationId('');
                  navigation.navigate(config.routes.USER_ADDRESS, {
                    from: 'Cart',
                    setLocationId,
                  });
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: config.colors.orangeColor,
                  borderRadius: 40,
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    color: config.colors.white,
                    fontSize: 10,
                  }}>
                  {t('Click to Choose')}
                </Text>
              </TouchableOpacity>
            </View>

            <AppTextInput
              inputTextLabel={''}
              inputTextLabelVisible={false}
              placeholder={t('Select Address')}
              textAlignVertical={'top'}
              textInputStyle={{
                flex: 1,
                height: 80,
                textAlign: 'left',
                color: config.colors.Black,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingTop: 10,
              }}
              editable={false}
              value={
                location_id
                  ? `${location_id?.house_number}, ${location_id?.building_name}, ${location_id?.locality}`
                  : ''
              }
              viewStyle={{marginHorizontal: 0, height: 80}}
              multiline={true}
              returnKeyType={'next'}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              route?.params?.request_id
                ? ViewRequestResponse?.results?.event?.status == 'Pending'
                  ? showStartDatePicker()
                  : null
                : showStartDatePicker();
            }}
            style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Start date *')}
              placeholder={t('Select Date')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              leftIcon={require('../../assets/images/calendarIcon.png')}
              editable={false}
              value={
                schedule_start_date == ''
                  ? 'dd/mm/yy'
                  : moment(schedule_start_date).format('DD/MM/YY')
              }
            />
          </TouchableOpacity>
          {/* <View
            style={{
              marginTop: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.Black,
                fontSize: 12,
              }}>
              {t('Same as start date')}
            </Text>
            <Switch
              thumbColor={config.colors.blueColor}
              style={{
                marginLeft: 10,
              }}
              trackColor={config.colors.BACKGROUNDCOLOR}
              // onValueChange={() => changeNotificationApi()}
              value={false}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('End date *')}
              placeholder={t('Select Date')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              leftIcon={require('../../assets/images/calendarIcon.png')}
            />
          </View> */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              route?.params?.request_id
                ? viewRequestData?.status == 'Pending'
                  ? showStartTimePicker()
                  : null
                : showStartTimePicker();
            }}
            style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Start Time *')}
              placeholder={t('Select Time')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              leftIcon={require('../../assets/images/time.png')}
              editable={false}
              value={schedule_start_time == '' ? 'hh:mm' : schedule_start_time}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              route?.params?.request_id
                ? viewRequestData?.status == 'Pending'
                  ? showEndTimePicker()
                  : null
                : showEndTimePicker();
            }}
            style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('End Time *')}
              placeholder={t('Select Time')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              leftIcon={require('../../assets/images/time.png')}
              editable={false}
              value={schedule_end_time == '' ? 'hh:mm' : schedule_end_time}
            />
          </TouchableOpacity>
          <View style={{}}>
            {imageArray.length > 0 ? (
              <>
                {imageArray?.map((img, i) => {
                  {
                    return (
                      <TouchableOpacity
                        key={i}
                        activeOpacity={0.8}
                        onPress={() => requestCameraPermission()}
                        style={{
                          height: 200,
                          backgroundColor: config.colors.borderColor,
                          borderRadius: 12,
                          marginTop: 15,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                            borderRadius: 12,
                          }}
                          resizeMode="cover"
                          borderRadius={12}
                          source={{uri: img?.uri ? img?.uri : img}}
                        />

                        {viewRequestData?.status != 'Completed' && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: 15,
                            }}
                            onPress={() => removeServiceImage(img)}>
                            <Image
                              style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',

                                tintColor: '#fff',
                              }}
                              source={require('../../assets/images/closeIcon.png')}
                            />
                          </TouchableOpacity>
                        )}
                      </TouchableOpacity>
                    );
                  }
                })}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => requestCameraPermission()}
                  style={{
                    height: 200,
                    backgroundColor: config.colors.borderColor,
                    borderRadius: 12,
                    marginTop: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={[styles.attechImage]}
                    source={require('../../assets/images/attechicon.png')}
                  />

                  <View
                    style={{
                      backgroundColor: config.colors.white,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        color: config.colors.blueColor,
                        fontSize: 12,
                      }}>
                      {t('Upload event theme')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => requestCameraPermission()}
                style={{
                  height: 200,
                  backgroundColor: config.colors.borderColor,
                  borderRadius: 12,
                  marginTop: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={[styles.attechImage]}
                  source={require('../../assets/images/attechicon.png')}
                />

                <View
                  style={{
                    backgroundColor: config.colors.white,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      color: config.colors.blueColor,
                      fontSize: 12,
                    }}>
                    {t('Upload event theme')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.TextColor,
              fontSize: 12,
              marginTop: 10,
            }}>
            {t(
              'Upload JPG or PNG file images with 2:1 ratio of the best in the default theme, image size should be less than 2 MB',
            )}
          </Text>
        </ScrollView>
        <AppButton
          text={t('Continue')}
          onPress={() => {
            onButtonPress(2);
          }}
          viewStyle={{
            marginTop: 30,
            width: '100%',
          }}
          buttonStyle={{
            backgroundColor: config.colors.buttonColor,
          }}
        />
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
          minimumDate={new Date(moment().add(3, 'days'))}
          maximumDate={new Date(moment().add('2', 'years'))}
        />
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}

          // minimumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          display="spinner"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}

          // minimumDate={new Date()}
        />
      </View>
    );
  };
  const Step3Component = stepCount => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 40,
              height: 40,
              justifyContent: 'center',
              borderRadius: 50,
            }}
            onPress={() => {
              if (route?.params?.stepCount) {
                navigation?.goBack();
              } else {
                setStepCount(2);
              }
            }}>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 18,
              textAlign: 'center',
              alignSelf: 'center',
              flex: 1,
            }}>
            {t('Create Request')}
          </Text>
          <View
            style={{
              backgroundColor: config.colors.blueColor,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.white,
                fontSize: 10,
              }}>
              {`${stepCount} of 03`}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            color: config.colors.blueColor,
            fontSize: 16,
            textAlign: 'left',
          }}>
          {t('Request Summary')}
        </Text>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          <View style={{}}>
            {imageArray.length > 0 ? (
              <>
                {imageArray?.map((img, i) => {
                  {
                    return (
                      <View
                        key={i}
                        activeOpacity={0.8}
                        style={{
                          height: 200,
                          backgroundColor: config.colors.borderColor,
                          borderRadius: 12,
                          marginTop: 15,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                            borderRadius: 12,
                          }}
                          resizeMode="cover"
                          borderRadius={12}
                          source={{uri: img?.uri ? img?.uri : img}}
                        />

                        {viewRequestData?.status != 'Completed' && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: 15,
                            }}
                            onPress={() => removeServiceImage(img)}>
                            <Image
                              style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',

                                tintColor: '#fff',
                              }}
                              source={require('../../assets/images/closeIcon.png')}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  }
                })}
              </>
            ) : (
              <></>
            )}
          </View>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 16,
              marginTop: 15,
              textAlign: 'left',
            }}>
            {t('Enter the details below to create your event')}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${t('Event Title')}: ${event_name}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
            }}>
            {`${t('Category')}: ${selectedCategoriesList
              ?.map(c => (I18nManager?.isRTL ? c?.name_ar : c?.name_en))
              .join(',')}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${t('No. of Guests')}: ${event_no_of_guests}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${t('Event Budget Cost')}: ${event_budget_cost}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${t('Comment')}: ${comment}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 16,
              marginTop: 15,
              textAlign: 'left',
            }}>
            {t('Date and Location')}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${moment(schedule_start_date).format('DD/MM/YY')}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${schedule_start_time} - ${schedule_end_time}`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`${location_id?.house_number}, ${location_id?.building_name}, ${location_id?.locality}`}
          </Text>

          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 16,
              marginTop: 15,
              textAlign: 'left',
            }}>
            {t('Service Charge')}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.lightBlueColor,
              fontSize: 14,
              marginTop: 5,
              textAlign: 'left',
            }}>
            {`SAR : ${serviceAmount}`}
          </Text>
          {viewRequestData?.packages?.length > 0 && (
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Service List')}</Text>
              {viewRequestData?.packages?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate(config.routes.SERVICE, {
                        service_id: item?.service?._id,
                        from: 'banner',
                      });
                    }}
                    key={index}
                    style={{marginTop: 10}}>
                    <View
                      style={{
                        backgroundColor: config.colors.white,

                        paddingVertical: 7,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        borderRadius: 10,
                      }}>
                      <AppImage
                        resizeMode="cover"
                        imageStyle={{
                          width: 100,
                          height: 100,
                          overflow: 'hidden',
                          borderRadius: 10,
                        }}
                        uri={
                          item?.service?.images?.length > 0
                            ? item?.service?.images[0]
                            : ''
                        }
                      />

                      <View
                        style={{
                          marginLeft: 10,
                          width: '70%',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontFamily: config.fonts.Poppins_Medium,
                            color: config.colors.Black,
                            fontSize: 14,
                            marginTop: 5,
                            textAlign: 'left',
                          }}
                          numberOfLines={1}>
                          {I18nManager?.isRTL
                            ? item?.service.name_ar
                            : item?.service.name_en}
                        </Text>
                        <Text
                          style={{
                            fontFamily: config.fonts.Poppins_Regular,
                            color: config.colors.Black,
                            fontSize: 14,
                            marginTop: 5,
                            textAlign: 'left',
                          }}
                          numberOfLines={1}>
                          {`${item?.service?.price} SAR`}
                        </Text>

                        {item?.service?.packages?.length > 0 && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              navigation.navigate(config.routes.SERVICE, {
                                service_id: item?.service?._id,
                                from: 'select_customization',
                                onSelectCustomization:
                                  handleReceiveCustomization,
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
                              marginTop: 10,
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
                        {item?.customize_package?.length > 0 && (
                          <View style={{marginTop: 4}}>
                            {item?.customize_package?.map((p, ind) => {
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: config.colors.Light_Black,
                    fontFamily: config.fonts.Poppins_Medium,
                  }}>
                  {t('Total Amount')}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: config.colors.Light_Black,
                    fontFamily: config.fonts.Poppins_Medium,
                    marginRight: 10,
                  }}>
                  {viewRequestData?.totalAmount}
                  {' SAR'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
        {isApiLoading && Apiloader()}
        {viewRequestData?.status != 'Rejected' && (
          <AppButton
            text={
              route?.params?.request_id
                ? viewRequestData?.status == 'Pending' ||
                  viewRequestData?.status == 'ReadyForPayment'
                  ? t('Process')
                  : t('Add to cart')
                : t('Process')
            }
            onPress={() => {
              route?.params?.request_id
                ? viewRequestData?.status == 'Pending' ||
                  viewRequestData?.status == 'ReadyForPayment'
                  ? onMakePaymentApi(serviceAmount)
                  : addServiceTocart()
                : onMakePaymentApi(serviceAmount);
            }}
            viewStyle={{marginTop: 10, paddingHorizontal: 15}}
          />
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={config.colors.BACKGROUNDCOLOR}
      />

      {stepCount == 1 && Step1Component('01')}
      {stepCount == 2 && Step2Component('02')}
      {stepCount == 3 && Step3Component('03')}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  flatlistCss: {
    flex: 1,
    marginHorizontal: 15,
  },
  inputCss: {
    marginTop: 5,
  },
  EventText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E9',
    paddingBottom: 15,
    // marginHorizontal: 10,
  },
  nameText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
    marginVertical: 5,
    textAlign: 'left',
  },
  nameinputCss: {
    marginTop: 10,
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
    color: config.colors.Black,
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputType: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Medium,
    height: 90,
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginTop: 5,
    textAlignVertical: 'top',
    textAlign: 'left',
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  savelocText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
  },
  locationMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveLocCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  LocIcon: {
    height: 12,
    width: 12,
  },
  dateCss: {
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateFirstCss: {
    width: '47%',
    marginTop: 7,
  },
  calenderIcon: {
    height: 18,
    width: 18,
  },
  dateText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#00000080',
    fontSize: 12,
    marginHorizontal: 5,
    marginTop: 3,
  },
  plusIcon: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    marginRight: 10,
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
    marginVertical: 5,
  },
  attechCss: {
    height: 122,
    width: 102,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ABABB680',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C0C0C01A',
    marginTop: 10,
  },

  attechImage: {
    height: 40,
    width: 65,
  },
  addIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginTop: 12,
    borderRadius: 8,
  },
});

export default CreateServiceRequest;
