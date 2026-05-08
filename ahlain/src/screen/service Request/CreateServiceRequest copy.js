import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RBSheet from 'react-native-raw-bottom-sheet';

import {useDispatch, useSelector} from 'react-redux';
import {
  AddPacakageToCartReducer,
  CreateServiceEligiblityReducer,
  CreateRequestReducer,
  EditRequestReducer,
  MakePaymentReducer,
  MyProfileReducer,
  ViewRequestReducer,
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
let finalPackageArray = [];

const CreateServiceRequest = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const refRBSheet = useRef(null);

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
  const [location_id, setLocationId] = useState(route?.params?.location_id);

  const [event_name, setEventName] = useState('');
  const [event_budget_cost, setEventBudgetCost] = useState('');
  const [event_no_of_guests, setEventNoOfGuests] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [comment, setComment] = useState('');
  const [imageArray, setImageArray] = useState([]);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [schedule_start_date, setSchedulStartDate] = useState('');
  const [schedule_start_time, setScheduleStartTime] = useState('');
  const [schedule_end_date, setScheduleEndDate] = useState('');
  const [schedule_end_time, setScheduleEndTime] = useState('');
  const [requestPacakages, setRequestPackages] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [serviceAmount, setServiceAmount] = useState(0);
  const colorScheme = useColorScheme();

  console.log('CreateRequestResponse', JSON.stringify(ViewRequestResponse));
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
  }, [ViewRequestResponse]);
  useEffect(() => {
    if (CreateServiceEligiblityResponse != null) {
      if (CreateServiceEligiblityResponse?.error == false) {
        setServiceAmount(CreateServiceEligiblityResponse?.results?.amount);
        refRBSheet.current.open();
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
  const onPressProcess = async () => {
    if (event_name?.trim() == '') {
      return Toast.show(t('Please enter event name'), Toast.LONG);
    }
    if (event_budget_cost < 1) {
      return Toast.show(t('Please enter event budget cost'), Toast.LONG);
    }
    if (event_budget_cost < 2000) {
      return Toast.show(t('Min budget for event 2000 SAR'), Toast.LONG);
    }
    if (event_no_of_guests < 1) {
      return Toast.show(t('Please enter no of guests'), Toast.LONG);
    }
    if (descriptionEn?.trim() == '') {
      return Toast.show(t('Please enter event description'), Toast.LONG);
    }
    if (!location_id) {
      return Toast.show(t('Please enter event location'), Toast.LONG);
    }
    if (schedule_start_date == '') {
      return Toast.show(t('Please select event start date'), Toast.LONG);
    }

    if (schedule_start_time == '') {
      return Toast.show(t('Please select event start time'), Toast.LONG);
    }
    if (schedule_end_date == '') {
      return Toast.show(t('Please select event end date'), Toast.LONG);
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
    callCreateRequestApi();
  };
  const callCreateRequestApi = async () => {
    const payload = {
      location_id: location_id?._id,
      eventName: event_name?.trim(),
      startDate: moment(schedule_start_date).format('YYYY-MM-DD'),
      startTime: schedule_start_time,
      endDate: moment(schedule_end_date).format('YYYY-MM-DD'),
      endTime: schedule_end_time,
      description: descriptionEn?.trim(),
      comment: comment,
      images: imageArray,
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
    const finalPackageData = finalPackageArray.filter((element, index) => {
      return element && element;
    });
    if (finalPackageData.length == 0) {
      return Toast.show(t('Please select at least one service'));
    }
    console.log('finalPackageArray', finalPackageData);
    const payload = {
      packages: finalPackageData,
      isAddedByAdmin: true,
    };
    console.log('payload', payload);
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

    imageArray.forEach(element => {
      formData.append('images', element);
    });
    setIsApiLoading(true);
    const userData = JSON.parse(
      await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
    );
    let language = 'English';
    language = await AsyncStorage.getItem('user_language');
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
        navigation.goBack();
      })
      .catch(e => {
        setIsApiLoading(false);
        console.log('e', e);
      });
  };
  const onMakePaymentApi = serviceAmount => {
    refRBSheet.current.close();
    const status = ViewRequestResponse?.results?.event?.status;
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
  const Step1Component = () => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.flatlistCss}>
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}
            style={styles.rrbCss}>
            <Text
              style={{
                color: config.colors.Light_Black,
                fontSize: 11,
                fontFamily: config.fonts.Poppins_Regular,
                textAlign: 'left',
              }}>
              {t(
                'E- Party planning is a service designed to assist you in organizing your party or gathering while staying within your allocated budget. By using this service, you can save valuable time and energy that would otherwise be spent searching for suitable products and resources. Our team of experts will plan and choose on your behalf, ensuring that your event is tailored to your preferences and requirements and adding the items in your cart for you to process.',
              )}
            </Text>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Event Name')}</Text>
              <TextInput
                style={styles.input2}
                placeholder={t('Enter event name')}
                placeholderTextColor={config.colors.Gray}
                onChangeText={val =>
                  setEventName(
                    I18nManager.isRTL
                      ? val.replace(
                          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF 0-9 ]/g,
                          '',
                        )
                      : val.replace(/[^a-zA-Z0-9 ]/g, ''),
                  )
                }
                value={event_name}
                editable={
                  route?.params?.request_id
                    ? ViewRequestResponse?.results?.event?.status == 'Pending'
                      ? true
                      : false
                    : true
                }
              />
            </View>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Event Budget Cost')}</Text>
              <TextInput
                style={styles.input2}
                placeholder={t('Min budget for event 2000 SAR')}
                placeholderTextColor={config.colors.Gray}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={val => {
                  setEventBudgetCost(val.replace(/[^0-9]/g, ''));
                }}
                value={event_budget_cost}
                editable={
                  route?.params?.request_id
                    ? ViewRequestResponse?.results?.event?.status == 'Pending'
                      ? true
                      : false
                    : true
                }
              />
            </View>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('No. of Guests')}</Text>
              <TextInput
                style={styles.input2}
                placeholder={t('Enter no of guests')}
                placeholderTextColor={config.colors.Gray}
                returnKeyType="done"
                keyboardType="numeric"
                onChangeText={val => {
                  setEventNoOfGuests(
                    I18nManager.isRTL
                      ? val.replace(
                          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF 0-9 ]/g,
                          '',
                        )
                      : val.replace(/[^a-zA-Z0-9 ]/g, ''),
                  );
                }}
                value={event_no_of_guests}
                editable={
                  route?.params?.request_id
                    ? ViewRequestResponse?.results?.event?.status == 'Pending'
                      ? true
                      : false
                    : true
                }
              />
            </View>
            <View style={styles.nameinputCss}>
              {/* <Text style={styles.nameText}>{t('Event Description')}</Text> */}
              <Text style={styles.nameText}>
                {t('What are the requirements for the event?')}
              </Text>
              <TextInput
                style={styles.inputType}
                placeholder={t('Type here...')}
                placeholderTextColor={config.colors.Gray}
                multiline={true}
                onChangeText={val =>
                  setDescriptionEn(
                    I18nManager.isRTL
                      ? val.replace(
                          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s0-9]/g,
                          '',
                        )
                      : val.replace(/[^a-zA-Z0-9\s]/g, ''),
                  )
                }
                value={descriptionEn?.trimStart()}
                editable={
                  route?.params?.request_id
                    ? ViewRequestResponse?.results?.event?.status == 'Pending'
                      ? true
                      : false
                    : true
                }
              />
            </View>
            <View style={styles.nameinputCss}>
              <View style={styles.locationMainCss}>
                <Text style={styles.nameText}>{t('Event Location')}</Text>
                <View style={styles.saveLocCss}>
                  <Image
                    resizeMode="contain"
                    style={styles.LocIcon}
                    source={require('../../assets/images/Location.png')}
                  />
                  <Text
                    onPress={() => {
                      route?.params?.request_id
                        ? ViewRequestResponse?.results?.event?.status ==
                            'Pending' && setLocationId('')
                        : setLocationId('');
                      route?.params?.request_id
                        ? ViewRequestResponse?.results?.event?.status ==
                            'Pending' &&
                          navigation.navigate(config.routes.SELECT_LOCATION, {
                            from: 'Cart',
                            setLocationId,
                          })
                        : navigation.navigate(config.routes.SELECT_LOCATION, {
                            from: 'Cart',
                            setLocationId,
                          });
                    }}
                    style={styles.savelocText}>
                    {t('Saved Locations')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: 45,
                }}
                // onPress={() => {
                //   setLocationId('');
                //   navigation.navigate(config.routes.SELECT_LOCATION, {
                //     from: 'Cart',
                //     setLocationId,
                //   });
                // }}
              >
                <TextInput
                  style={styles.input2}
                  placeholder={t('Enter event location')}
                  placeholderTextColor={config.colors.Gray}
                  editable={false}
                  numberOfLines={1}
                  value={
                    location_id
                      ? `${location_id?.house_number}, ${location_id?.building_name}, ${location_id?.locality}`
                      : ''
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.locationMainCss, {width: '100%'}]}>
              <View style={styles.dateFirstCss}>
                <Text style={styles.nameText}>{t('From')}</Text>
                <TouchableOpacity
                  style={styles.dateCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    route?.params?.request_id
                      ? ViewRequestResponse?.results?.event?.status == 'Pending'
                        ? showStartDatePicker()
                        : null
                      : showStartDatePicker();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={styles.calenderIcon}
                    source={require('../../assets/images/calender.png')}
                  />
                  <Text style={styles.dateText}>
                    {schedule_start_date == ''
                      ? 'dd/mm/yy'
                      : moment(schedule_start_date).format('DD/MM/YY')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateFirstCss}>
                <Text style={styles.nameText}>{''}</Text>
                <TouchableOpacity
                  style={styles.dateCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    route?.params?.request_id
                      ? ViewRequestResponse?.results?.event?.status == 'Pending'
                        ? showStartTimePicker()
                        : null
                      : showStartTimePicker();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={styles.calenderIcon}
                    source={require('../../assets/images/time.png')}
                  />
                  <Text style={styles.dateText}>
                    {schedule_start_time == '' ? 'hh:mm' : schedule_start_time}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.locationMainCss, {width: '100%'}]}>
              <View style={styles.dateFirstCss}>
                <Text style={styles.nameText}>{t('To')}</Text>
                <TouchableOpacity
                  style={styles.dateCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    route?.params?.request_id
                      ? ViewRequestResponse?.results?.event?.status == 'Pending'
                        ? showEndDatePicker()
                        : null
                      : showEndDatePicker();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={styles.calenderIcon}
                    source={require('../../assets/images/calender.png')}
                  />
                  <Text style={styles.dateText}>
                    {schedule_end_date == ''
                      ? 'dd/mm/yy'
                      : moment(schedule_end_date).format('DD/MM/YY')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateFirstCss}>
                <Text style={styles.nameText}>{''}</Text>
                <TouchableOpacity
                  style={styles.dateCss}
                  activeOpacity={0.5}
                  onPress={() => {
                    route?.params?.request_id
                      ? ViewRequestResponse?.results?.event?.status == 'Pending'
                        ? showEndTimePicker()
                        : null
                      : showEndTimePicker();
                  }}>
                  <Image
                    resizeMode="contain"
                    style={styles.calenderIcon}
                    source={require('../../assets/images/time.png')}
                  />
                  <Text style={styles.dateText}>
                    {schedule_end_time == '' ? 'hh:mm' : schedule_end_time}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Attach images')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.Gray,
                  fontSize: 12,
                  marginBottom: 5,
                  textAlign: 'left',
                }}>
                {t(
                  '(Add pictures to show your idea for the party whether it is a picture cake, decor ..etc)',
                )}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 10,
                }}>
                {imageArray.length > 0 ? (
                  <>
                    {imageArray?.map((img, i) => {
                      console.log('img', img);
                      {
                        return (
                          <TouchableOpacity
                            key={i}
                            // onPress={() => {
                            //   Upload_Image();
                            // }}
                            activeOpacity={0.5}
                            style={styles.ImgCss}>
                            <Image
                              style={[styles.addIcon, {marginLeft: 12}]}
                              resizeMode="cover"
                              source={{uri: img?.uri ? img?.uri : img}}
                            />
                            {ViewRequestResponse?.results?.event?.status !=
                              'Completed' && (
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
                      onPress={() => {
                        requestCameraPermission();
                      }}
                      activeOpacity={0.5}
                      style={[styles.attechCss, {marginLeft: 12}]}>
                      <Image
                        style={[styles.attechImage, {marginLeft: 12}]}
                        source={require('../../assets/images/attechicon.png')}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      requestCameraPermission();
                    }}
                    activeOpacity={0.5}
                    style={[styles.attechCss, {marginLeft: 12}]}>
                    <Image
                      style={[styles.attechImage]}
                      source={require('../../assets/images/attechicon.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Comment')}</Text>
              <TextInput
                style={styles.inputType}
                placeholder={t('Type here...')}
                placeholderTextColor={config.colors.Gray}
                multiline={true}
                onChangeText={val =>
                  setComment(
                    I18nManager.isRTL
                      ? val.replace(
                          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF '"_\-!,?()0-9]/g,
                          '',
                        )
                      : val.replace(/[^a-zA-Z0-9'"_\-!,?() ]/g, ''),
                  )
                }
                value={comment?.trimStart()}
                editable={
                  route?.params?.request_id
                    ? ViewRequestResponse?.results?.event?.status == 'Pending'
                      ? true
                      : false
                    : true
                }
              />
            </View>
            {ViewRequestResponse?.results?.event?.packages.length > 0 && (
              <View style={styles.nameinputCss}>
                <Text style={styles.nameText}>{t('Service List')}</Text>
                {ViewRequestResponse?.results?.event?.packages?.map(
                  (item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        style={{
                          borderWidth: 1,
                          padding: 8,
                          borderColor: config.colors.Gray,
                          borderRadius: 6,
                        }}>
                        <TouchableOpacity
                          onPress={() => onServiceItemPress(item, index + 1)}
                          style={styles.packageCss}>
                          <Image
                            resizeMode="contain"
                            style={styles.plusIcon}
                            source={
                              finalPackageArray[index + 1]?.service ==
                              item?.service?._id
                                ? require('../../assets/images/select.png')
                                : require('../../assets/images/Untick.png')
                            }
                          />

                          <Text style={styles.packageText}>
                            {item?.service?.name_en}
                          </Text>
                          <Text style={styles.packagePriceText}>
                            {item?.service?.price} SAR
                          </Text>
                        </TouchableOpacity>
                        {item?.service?.packages.length > 0 && (
                          <View
                            style={{
                              paddingHorizontal: 15,
                              paddingVertical: 10,
                            }}>
                            <Text
                              style={{
                                fontFamily: config.fonts.Poppins_SemiBold,
                                color: config.colors.Black,
                                fontSize: 14,
                              }}>
                              {t('Package List')}
                            </Text>
                            {item?.service?.packages?.map((p, i) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    onPacakageItemPress(
                                      item?.service?._id,
                                      p,
                                      index + 1 + '' + i,
                                    );
                                  }}
                                  key={i}
                                  style={styles.packageCss}>
                                  <Image
                                    resizeMode="contain"
                                    style={styles.plusIcon}
                                    source={
                                      finalPackageArray[index + 1 + '' + i]
                                        ?.package == p?._id
                                        ? require('../../assets/images/select.png')
                                        : require('../../assets/images/Untick.png')
                                    }
                                  />
                                  <Text style={styles.packageText}>
                                    {I18nManager.isRTL
                                      ? p?.name_ar
                                      : p?.name_en}
                                  </Text>
                                  <Text style={styles.packagePriceText}>
                                    {p?.price} SAR
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  },
                )}
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
                    {ViewRequestResponse?.results?.event?.totalAmount}
                    {' SAR'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            minimumDate={new Date(moment().add(3, 'days'))}
            maximumDate={new Date(moment().add('2', 'years'))}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}
          />
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            display="spinner"
            onConfirm={handleStartTimeConfirm}
            onCancel={hideStartTimePicker}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}

            // minimumDate={new Date()}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
            minimumDate={new Date(moment().add(3, 'days'))}
            maximumDate={new Date(moment().add('2', 'years'))}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}
          />
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            display="spinner"
            onConfirm={handleEndTimeConfirm}
            onCancel={hideEndTimePicker}
            isDarkModeEnabled={colorScheme == 'dark' ? true : false}

            // minimumDate={new Date()}
          />
        </View>
        {ViewRequestResponse?.results?.event?.status != 'Rejected' && (
          <AppButton
            text={
              route?.params?.request_id
                ? ViewRequestResponse?.results?.event?.status == 'Pending' ||
                  ViewRequestResponse?.results?.event?.status ==
                    'ReadyForPayment'
                  ? t('Process')
                  : t('Add to cart')
                : t('Process')
            }
            onPress={() =>
              route?.params?.request_id
                ? ViewRequestResponse?.results?.event?.status == 'Pending' ||
                  ViewRequestResponse?.results?.event?.status ==
                    'ReadyForPayment'
                  ? onPressProcess()
                  : addServiceTocart()
                : onPressProcess()
            }
            viewStyle={{marginVertical: 15, paddingHorizontal: 15}}
          />
        )}
        {isApiLoading && Apiloader()}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={350}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000080',
            },
            container: {
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              height: '60%',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
          }}>
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 10}}>
            <Text style={[styles.nameText, {fontSize: 16}]}>
              {t('Summary')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('Event Name')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'left',
                }}>
                {event_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('Event Budget Cost')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'left',
                }}>
                {event_budget_cost}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('No. of Guests')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'left',
                }}>
                {event_no_of_guests}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('Event Description')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'left',
                }}>
                {descriptionEn}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('Event Location')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'justify',
                  width: '60%',
                }}>
                {location_id
                  ? `${location_id?.house_number}, ${location_id?.building_name}, ${location_id?.locality}`
                  : ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={styles.nameText}>{t('Event Timings')}</Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Black,
                  fontSize: 12,
                  textAlign: 'justify',
                  width: '60%',
                }}>
                {`${moment(schedule_start_date).format(
                  'DD MMM YY',
                )} ${schedule_start_time} - ${moment(schedule_end_date).format(
                  'DD MMM YY',
                )} ${schedule_end_time}`}
              </Text>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
              paddingHorizontal: 20,
            }}>
            <Text style={styles.nameText}>{t('Service Charge')}</Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                color: config.colors.Black,
                fontSize: 12,
                textAlign: 'left',
              }}>
              {`SAR : ${serviceAmount}`}
            </Text>
          </View>
          <SafeAreaView>
            <AppButton
              text={
                route?.params?.request_id
                  ? ViewRequestResponse?.results?.event?.status == 'Pending' ||
                    ViewRequestResponse?.results?.event?.status ==
                      'ReadyForPayment'
                    ? t('Process')
                    : t('Add to cart')
                  : t('Process')
              }
              onPress={() => onMakePaymentApi(serviceAmount)}
              viewStyle={{marginTop: 10, paddingHorizontal: 15}}
            />
          </SafeAreaView>
        </RBSheet>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={config.colors.BACKGROUNDCOLOR}
      />
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
              {'01 of 03'}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            color: config.colors.blueColor,
            fontSize: 16,
          }}>
          {t('Enter the details below to create your event ')}
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
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Category *')}
              inputTextSubLabel={t('Select the type of your service')}
              placeholder={t('Select service')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
              rightIcon={require('../../assets/images/downArrowIcon.png')}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('No. of Guests *')}
              placeholder={t('Enter Number of guests')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Event Budget Cost *')}
              placeholder={t('The minimum budget is 2,000')}
              textInputStyle={{flex: 1}}
              viewStyle={{marginHorizontal: 0}}
            />
          </View>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('Comment *')}
              placeholder={t('Comment')}
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
            />
          </View>
        </ScrollView>
        <AppButton
          text={t('Continue')}
          onPress={() => {
            navigation.navigate(config.routes.CREATE_SERVICE_REQUEST);
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
