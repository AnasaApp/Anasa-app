import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  I18nManager,
  Modal,
  Alert,
  useColorScheme,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddServiceNoteReducer,
  BookingEligiblityReducer,
  CheckoutCartReducer,
  CheckValidPromoCodeReducer,
  GetMyCartReducer,
  MakePaymentReducer,
  MyProfileReducer,
  RemoveCartReducer,
  UpdateCartReducer,
} from '../../redux/reducers';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';

const Cart = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const refRBSheet = useRef(null);
  const dispatch = useDispatch();
  const GetMyCartResponse = useSelector(GetMyCartReducer.selectGetMyCartData);
  const selectUpdateCartResponse = useSelector(
    UpdateCartReducer.selectUpdateCartData,
  );
  const RemoveCartResponse = useSelector(
    RemoveCartReducer.selectRemoveCartData,
  );
  const CheckoutCartResponse = useSelector(
    CheckoutCartReducer.selectCheckoutCartData,
  );
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const CheckValidPromoCodeResponse = useSelector(
    CheckValidPromoCodeReducer.selectCheckValidPromoCodeData,
  );
  const CheckValidPromoCodeErrorResponse = useSelector(
    CheckValidPromoCodeReducer.selectCheckValidPromoCodeResponse,
  );
  const CheckoutCartErrorResponse = useSelector(
    CheckoutCartReducer.selectCheckoutCartResponse,
  );
  const MakePaymentResponse = useSelector(
    MakePaymentReducer.selectMakePaymentData,
  );
  const AddServiceNoteResponse = useSelector(
    AddServiceNoteReducer.selectAddServiceNoteData,
  );
  const BookingEligiblityResponse = useSelector(
    BookingEligiblityReducer.selectBookingEligiblityData,
  );
  const BookingEligiblityErrorResponse = useSelector(
    BookingEligiblityReducer.selectBookingEligiblityResponse,
  );
  console.log('GetMyCartResponse', JSON.stringify(GetMyCartResponse));

  console.log(
    'MyProfileResponse' + moment().format('hh:mm:ss A'),
    MyProfileResponse,
  );
  const [location_id, setLocationId] = useState(route?.params?.location_id);
  console.log('location_id', location_id);

  const [event_name, setEventName] = useState('');
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
  const [promoCodeValue, setPromoCodeValue] = useState('');
  const [promocode, setPromoCode] = useState('');
  const [buyerComment, setBuyerComment] = useState('');
  const [showEventDetailModal, setShowEventDetailModal] = useState('');
  const [serviceNoteIndex, setserviceNoteIndex] = useState(-1);
  const [CartServiceNotesArray, setCartServiceNotesArray] = useState([]);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (CheckValidPromoCodeResponse != null) {
      if (CheckValidPromoCodeResponse?.error == false) {
        Toast.show(CheckValidPromoCodeResponse?.message, Toast.LONG);
        setPromoCode(CheckValidPromoCodeResponse?.results);
        dispatch({
          type: SagaActions.GET_MY_CART,
          payload: {
            promoCodeId: CheckValidPromoCodeResponse?.results?.promocode?._id,
          },
        });

        dispatch(
          CheckValidPromoCodeReducer.removeCheckValidPromoCodeResponse(),
        );
      }
    }
  }, [CheckValidPromoCodeResponse]);
  useEffect(() => {
    if (CheckValidPromoCodeErrorResponse != null) {
      Toast.show(CheckValidPromoCodeErrorResponse?.message, Toast.LONG);
      dispatch(CheckValidPromoCodeReducer.removeCheckValidPromoCodeResponse());
    }
  }, [CheckValidPromoCodeErrorResponse]);
  useEffect(() => {
    if (CheckoutCartResponse != null) {
      if (CheckoutCartResponse?.error == false) {
        navigation.replace(config.routes.PAYMENT_STATUS, {
          service_id: GetMyCartResponse?.results?.cart[0]?.service?._id,
          CheckoutCartResponse: CheckoutCartResponse,
        });

        dispatch(CheckoutCartReducer.removeCheckoutCartResponse());
      }
    }
  }, [CheckoutCartResponse]);
  useEffect(() => {
    if (BookingEligiblityResponse != null) {
      if (BookingEligiblityResponse?.error == false) {
        if (GetMyCartResponse?.results?.grandTotal > 0) {
          onMakePaymentApi();
        } else {
          const checkoutPayload = {
            location: location_id?._id,
            event_name: event_name?.trim(),
            event_start_date: moment(schedule_start_date).format('YYYY-MM-DD'),
            event_start_time: schedule_start_time,
            event_end_date: moment(schedule_end_date).format('YYYY-MM-DD'),
            event_end_time: schedule_end_time,
            promoCodeId: promocode != '' ? promocode?.promocode?._id : '',
            offerId: '',
            serviceCharge: GetMyCartResponse?.results?.serviceCharge,
            shippingCost: GetMyCartResponse?.results?.shippingCost,
            discount: GetMyCartResponse?.results?.discount,
            grandTotal: GetMyCartResponse?.results?.grandTotal,
            commissionAmount: GetMyCartResponse?.results?.commissionAmount,
            buyerComment: buyerComment,
          };

          dispatch({
            type: SagaActions.CHECKOUT_CART,
            payload: checkoutPayload,
          });
        }

        dispatch(BookingEligiblityReducer.removeBookingEligiblityResponse());
      }
    }
  }, [BookingEligiblityResponse]);
  useEffect(() => {
    if (BookingEligiblityErrorResponse != null) {
      Alert.alert(t('Notes'), `${BookingEligiblityErrorResponse?.message}`, [
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel',
        // },
        {text: t('Ok'), onPress: () => console.log('OK Pressed')},
      ]);
      dispatch(BookingEligiblityReducer.removeBookingEligiblityResponse());
    }
  }, [BookingEligiblityErrorResponse]);
  useEffect(() => {
    if (AddServiceNoteResponse != null) {
      if (AddServiceNoteResponse?.error == false) {
        Toast.show(AddServiceNoteResponse?.message, Toast.LONG);

        dispatch(AddServiceNoteReducer.removeAddServiceNoteResponse());
      }
    }
  }, [AddServiceNoteResponse]);
  useEffect(() => {
    if (MakePaymentResponse != null) {
      if (MakePaymentResponse?.error == false) {
        console.log('MakePaymentResponse',MakePaymentResponse);

        if (MakePaymentResponse?.results?.redirectUrl) {
          // const checkoutPayload = {
          //   location: location_id?._id,
          //   event_name: event_name?.trim(),
          //   event_start_date: moment(schedule_start_date).format('YYYY-MM-DD'),
          //   event_start_time: schedule_start_time,
          //   event_end_date: moment(schedule_end_date).format('YYYY-MM-DD'),
          //   event_end_time: schedule_end_time,
          //   promoCodeId: promocode != '' ? promocode?.promocode?._id : '',
          //   offerId: '',
          //   serviceCharge: GetMyCartResponse?.results?.serviceCharge,
          //   shippingCost: GetMyCartResponse?.results?.shippingCost,
          //   discount: GetMyCartResponse?.results?.discount,
          //   grandTotal: GetMyCartResponse?.results?.grandTotal,
          //   commissionAmount: GetMyCartResponse?.results?.commissionAmount,
          //   buyerComment: buyerComment,
          // };

          navigation.replace(config.routes.CHECK_PAYMENT, {
            transactionID: MakePaymentResponse?.results?.orderId,
            link: MakePaymentResponse?.results?.redirectUrl,
            // checkoutPayload: checkoutPayload,
            service_id: GetMyCartResponse?.results?.cart[0]?.service?._id,
            from: 'cart',
          });
        }
        console.log(
          'MakePaymentResponse?.results?.resp?.link',
          MakePaymentResponse,
        );
        dispatch(MakePaymentReducer.removeMakePaymentResponse());
      }
    }
  }, [MakePaymentResponse]);
  useEffect(() => {
    if (CheckoutCartErrorResponse != null) {
      Toast.show(CheckoutCartErrorResponse?.message, Toast.LONG);
      dispatch(CheckoutCartReducer.removeCheckoutCartResponse());
    }
  }, [CheckoutCartErrorResponse]);
  useEffect(() => {
    if (RemoveCartResponse != null) {
      if (RemoveCartResponse?.error == false) {
        Toast.show(RemoveCartResponse?.message, Toast.LONG);
        dispatch({type: SagaActions.GET_MY_CART, payload: {promoCodeId: ''}});
        dispatch(RemoveCartReducer.removeRemoveCartResponse());
      }
    }
  }, [RemoveCartResponse]);
  useEffect(() => {
    if (selectUpdateCartResponse != null) {
      if (selectUpdateCartResponse?.error == false) {
        Toast.show(selectUpdateCartResponse?.message, Toast.LONG);
        dispatch({type: SagaActions.GET_MY_CART, payload: {promoCodeId: ''}});
        dispatch(UpdateCartReducer.removeUpdateCartResponse());
      }
    }
  }, [selectUpdateCartResponse]);
  useEffect(() => {
    dispatch({type: SagaActions.GET_MY_CART, payload: {promoCodeId: ''}});
  }, []);
  useEffect(() => {
    if (MyProfileResponse?.results?.buyer?.preferredStartDate) {
      setSchedulStartDate(
        MyProfileResponse?.results?.buyer?.preferredStartDate,
      );
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

  const updateCart = (cartId, qty) => {
    const payload = {
      cartId: cartId,
      quantity: qty,
    };
    dispatch({type: SagaActions.UPDATE_CART, payload: payload});
  };
  const removeCart = cartId => {
    const payload = {
      uri: `/${cartId}`,
    };
    dispatch({type: SagaActions.REMOVE_CART, payload: payload});
  };

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
  const handleCartServiceTextInput = (val, index) => {
    setCartServiceNotesArray(prevState => ({...prevState, [index]: val}));
  };
  const getCartServiceTextInput = index => {
    return CartServiceNotesArray[index];
  };
  const callAddServiceNoteApi = (item, index) => {
    const payload = {
      cart_id: item?._id,
      service_note: CartServiceNotesArray[index],
    };
    dispatch({type: SagaActions.ADD_SERVICE_NOTE, payload: payload});
  };
  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          marginTop: 10,
          backgroundColor: config.colors.white,
          elevation: 1,
          paddingVertical: 7,
          paddingHorizontal: 4,
          borderRadius: 10,
        }}>
        <View style={styles.flatlistMainCss}>
          {item?.isCombo ? (
            <View style={styles.flatlistCss}>
              <Image
                style={styles.partyDecor}
                source={{uri: item?.combo?.image}}
              />
              <View style={styles.ballonCss}>
                <Text style={styles.BalloondecorText}>
                  {I18nManager?.isRTL
                    ? item?.combo?.name_ar
                    : item?.combo?.name_en}
                </Text>

                <Text style={styles.sartxt}>
                  {item?.price}
                  {' SAR'}
                </Text>
                {index != serviceNoteIndex && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setserviceNoteIndex(index)}
                    style={{
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: config.colors.Gray,
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={styles.Service}>{t('Enter Notes')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.flatlistCss}>
              <Image
                style={styles.partyDecor}
                source={{uri: item?.service?.images[0]}}
              />
              <View style={styles.ballonCss}>
                <Text style={styles.BalloondecorText}>
                  {I18nManager?.isRTL
                    ? item?.service?.name_ar
                    : item?.service?.name_en}
                </Text>
                <Text style={styles.Service}>
                  {I18nManager?.isRTL
                    ? item?.service?.description_ar
                    : item?.service?.description_en}
                </Text>
                {item?.package?.length > 0 && (
                  <View style={styles.boderCss}>
                    {item?.package?.map((p, ind) => {
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
                              I18nManager?.isRTL ? op.option_ar : op.option_en,
                            )
                            .join(', ')
                            .toString()
                            .toLowerCase()}`}
                        </Text>
                      );
                    })}
                  </View>
                )}
                <Text style={styles.sartxt}>
                  {item.price}
                  {' SAR'}
                </Text>
                {index != serviceNoteIndex && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setserviceNoteIndex(index)}
                    style={{
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: config.colors.Gray,
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={styles.Service}>{t('Enter Notes')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={{position: 'absolute', right: 10}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => removeCart(item?._id)}
              style={styles.locationCss}>
              <Image
                style={styles.closeIcon}
                resizeMode="contain"
                source={require('../../assets/images/closeIcon.png')}
              />
            </TouchableOpacity>
            {item?.isCombo ? (
              <View style={styles.plusIconCss} />
            ) : (
              <View style={styles.plusIconCss}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => updateCart(item?._id, item.quantity - 1)}>
                  <Image
                    style={styles.plusIcon}
                    resizeMode="contain"
                    source={require('../../assets/images/lessthenButton.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.numbertxt}>{item.quantity}</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => updateCart(item?._id, item.quantity + 1)}>
                  <Image
                    style={styles.plusIcon}
                    resizeMode="contain"
                    source={require('../../assets/images/plusButton.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {index == serviceNoteIndex && (
          <View style={{marginTop: 5}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setserviceNoteIndex(-1)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.BalloondecorText}>{t('Enter Notes')}</Text>

              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: config.colors.Black,
                  transform: [{rotate: '-90deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputType}
              placeholder={t('Type here...')}
              placeholderTextColor={'#00000080'}
              onBlur={e => callAddServiceNoteApi(item, index)}
              returnKeyType="done"
              onChangeText={val =>
                handleCartServiceTextInput(
                  val.replace(
                    /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9'"_\-!,?()\s]/g,
                    '',
                  ),
                  index,
                )
              }
              value={getCartServiceTextInput(index)}
            />
          </View>
        )}
      </View>
    );
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

  const onPressProcess = () => {
    if (event_name?.trim() == '') {
      return Toast.show(t('Please Enter Name.'), Toast.LONG);
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
    refRBSheet.current.close();
    callBookingEligiblityApi();
  };
  const callBookingEligiblityApi = () => {
    const checkoutPayload = {
      location: location_id?._id,
      event_name: event_name?.trim(),
      event_start_date: moment(schedule_start_date).format('YYYY-MM-DD'),
      event_start_time: schedule_start_time,
      event_end_date: moment(schedule_end_date).format('YYYY-MM-DD'),
      event_end_time: schedule_end_time,
      promoCodeId: promocode != '' ? promocode?.promocode?._id : '',
      offerId: '',
      shippingCost: GetMyCartResponse?.results?.shippingCost,
      discount: GetMyCartResponse?.results?.discount,
      grandTotal: GetMyCartResponse?.results?.grandTotal,
      commissionAmount: GetMyCartResponse?.results?.commissionAmount,
      buyerComment: buyerComment,
    };
    dispatch({type: SagaActions.BOOKING_ELIGIBILITY, payload: checkoutPayload});
  };
  const onCheckValidPromoCodeApi = () => {
    const payload = {
      promoCode: promoCodeValue,
    };
    dispatch({type: SagaActions.CHECK_VALID_PROMOCODE, payload});
  };
  const eventDetaiModalView = () => {
    return (
      <Modal
        visible={showEventDetailModal}
        transparent={true}
        animationType="fade">
        <SafeAreaView style={styles.infoModalConatiner}>
          <View style={styles.modalCardView}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  fontSize: 14,
                  color: config.colors.Black,
                }}>
                {t('Delivery schedule of each items:')}
              </Text>
              <TouchableOpacity onPress={() => setShowEventDetailModal(false)}>
                <Image
                  source={require('../../assets/images/closeIcon.png')}
                  style={styles.closeImg}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('1 day before')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('DIY')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Work Giveaways')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Decore')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Table or/and chairs set up')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('4 hours before')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Giveaways')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Cleaning Before Event')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Installing Entertainment')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('2 hours before')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Mini platter(finger food)')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Cake')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Party locations')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('1 hour before')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Cleaning at event')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Serving services')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Live entertainment')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Music')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Sweets')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Valete parking')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Drinks')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('Start of Event')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Breakfast')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('BBQ')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Food cart')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Live cooking')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Work Lunch')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('2 hours after')}
                  </Text>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Ready meals')}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '30%',
                    marginHorizontal: 10,
                    marginTop: 10,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('End of Event')}
                  </Text>
                </View>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    borderColor: config.colors.buttonColor,
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={require('../../assets/images/next.png')}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: config.colors.buttonColor,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                  />
                </View>
                <View
                  style={{width: '30%', marginHorizontal: 10, marginTop: 10}}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_SemiBold,
                      fontSize: 12,
                      color: config.colors.Black,
                    }}>
                    {t('2 hours after or noon day after if after 12am')}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Cleaning after event')}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 5,
                        width: 5,
                        borderRadius: 5,
                        backgroundColor: config.colors.Black,
                        marginHorizontal: 5,
                      }} />
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 10,
                        color: config.colors.Black,
                      }}>
                      {t('Removal of all rentals')}
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View style={{padding: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 12,
                  }}>
                  <Text
                    style={[
                      styles.eventHeadingTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('Customer scheduled Event time')}
                  </Text>
                  <Text
                    style={[
                      styles.eventHeadingTextStyle,
                      {width: '48%', textAlign: 'right'},
                    ]}>
                    {t('Service type')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.eventHeadingTextStyle,
                    {
                      textAlign: 'center',
                      color: config.colors.white,
                      backgroundColor: config.colors.buttonColor,
                      paddingVertical: 8,
                      marginVertical: 12,
                    },
                  ]}>
                  {t('Deliver before event start time')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('Min 1 hour before event')}
                  </Text>
                  <View style={{width: '48%', alignItems: 'flex-end'}}>
                    <Text style={styles.eventTextStyle}>
                      {t('Finger food')}
                    </Text>
                    <Text style={styles.eventTextStyle}>
                      {t('Party cleaning')}
                    </Text>
                    <Text style={styles.eventTextStyle}>
                      {t('Party catering services')}
                    </Text>
                    <Text style={styles.eventTextStyle}>{t('Location')}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.eventTextStyle, {width: '48%'}]}>
                    {t('Min 2 hours before event')}
                  </Text>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'right'},
                    ]}>
                    {t('Cake')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('Min 4 hours before event')}
                  </Text>
                  <View style={{width: '48%', alignItems: 'flex-end'}}>
                    <Text style={styles.eventTextStyle}>{t('Decoration')}</Text>
                    <Text style={styles.eventTextStyle}>{t('giveaways')}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.eventHeadingTextStyle,
                    {
                      textAlign: 'center',
                      color: config.colors.white,
                      backgroundColor: config.colors.buttonColor,
                      paddingVertical: 8,
                      marginVertical: 12,
                    },
                  ]}>
                  {t('Deliver During event time')}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('Beginning of event')}
                  </Text>
                  <View style={{width: '48%', alignItems: 'flex-end'}}>
                    <Text style={styles.eventTextStyle}>
                      {t('Entertainment')}
                    </Text>
                    <Text style={styles.eventTextStyle}>{t('BBQ')}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('2 hours after event start time')}
                  </Text>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'right'},
                    ]}>
                    {t('catering')}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.eventHeadingTextStyle,
                    {
                      textAlign: 'center',
                      color: config.colors.white,
                      backgroundColor: config.colors.buttonColor,
                      paddingVertical: 8,
                      marginVertical: 12,
                    },
                  ]}>
                  {t('Deliver after event time')}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'left'},
                    ]}>
                    {t('2 hours after event end time')}
                  </Text>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'right'},
                    ]}>
                    {t('After party cleaning')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '48%', alignItems: 'flex-start'}}>
                    <Text style={styles.eventTextStyle}>
                      {t('4 hours after event end time.')}
                    </Text>
                    <Text style={[styles.eventTextStyle, {marginLeft: 10}]}>
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: config.colors.Black,
                          borderRadius: 10,
                        }}></View>
                      {'  '}
                      {t('Afternoon the next day if time is after 12 am.')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.eventTextStyle,
                      {width: '48%', textAlign: 'right'},
                    ]}>
                    {t('Remove all items and rented items')}
                  </Text>
                </View>
              </View> */}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i)
      {result += chars[Math.floor(Math.random() * chars.length)];}
    return result;
  }
  const onMakePaymentApi = () => {
    const payload = {
      customerEmail: MyProfileResponse?.results?.buyer?.email,
      email: MyProfileResponse?.results?.buyer?.email,
      amount: GetMyCartResponse?.results?.grandTotal,
      firstName: MyProfileResponse?.results?.buyer?.full_name,
      country: 'SA',
      referenceId: randomString(
        24,
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      ),
    };
    console.log('payload', payload);
    dispatch({type: SagaActions.MAKE_PAYMENT, payload});
  };
  const checkItemLimit = () => {
    const cartArray = GetMyCartResponse?.results?.cart;
    if (cartArray?.length > 0) {
      for (let index = 0; index < cartArray?.length; index++) {
        const element = cartArray[index];
        if (element?.vendorOrderLimitExceeds) {
          return Alert.alert(t('Notes'), `${element?.limitExceedMsg}`, [
            // {
            //   text: 'Cancel',
            //   onPress: () => console.log('Cancel Pressed'),
            //   style: 'cancel',
            // },
            {text: t('Ok'), onPress: () => console.log('OK Pressed')},
          ]);
        }
      }
      if (MyProfileResponse?.results?.buyer?.default_address) {
        setLocationId(MyProfileResponse?.results?.buyer?.default_address);
      }
      navigation.navigate(config.routes.CHOOSE_DELIVERY, {
        myCartData: GetMyCartResponse?.results,
      });
      // refRBSheet.current.open();
    } else {
      Toast.show(t('Cart is empty'), Toast.LONG);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('Cart')}
      />
      <ScrollView
        style={styles.mainCss}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.serviceText}>{t('All Services')}</Text>
        <FlatList
          data={GetMyCartResponse?.results?.cart}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        <Text style={styles.entercode}>
          {t('Have a coupon code? enter here')}
        </Text>
        <View style={styles.inputCss}>
          <TextInput
            style={styles.input}
            placeholder="ASCZXSGDF"
            placeholderTextColor={config.colors.Gray}
            onChangeText={val =>
              setPromoCodeValue(
                val.replace(
                  /[^a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF 0-9 ]/g,
                  '',
                ),
              )
            }
            editable={promocode?.isValid ? false : true}
            value={promoCodeValue}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (promocode?.isValid) {
                setPromoCodeValue('');
                setPromoCode('');
              } else {
                onCheckValidPromoCodeApi();
              }
            }}>
            <Text style={styles.applyText}>
              {promocode?.isValid ? t('Remove') : t('Apply')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.widthCss}>
          <View style={styles.subtotalCss}>
            <Text style={styles.subtotalText}>{t('Subtotal')}</Text>
            <Text style={styles.subtotalText}>
              {GetMyCartResponse?.results?.total}
              {' SAR'}
            </Text>
          </View>
          <View style={styles.subtotalCss}>
            <Text style={styles.subtotalText}>{t('Shipping Cost')}</Text>
            <Text style={styles.subtotalText}>
              {GetMyCartResponse?.results?.shippingCost}
              {' SAR'}
            </Text>
          </View>

          <View style={styles.subtotalCss}>
            <Text style={styles.subtotalText}>{t('Service Charge')}</Text>
            <Text style={styles.subtotalText}>
              {GetMyCartResponse?.results?.serviceCharge}
              {' SAR'}
            </Text>
          </View>
          {promocode != '' && promocode?.isValid && (
            <View style={styles.subtotalCss}>
              <Text style={styles.subtotalText}>{t('Discount')}</Text>
              <Text style={styles.subtotalText}>
                {'- '}
                {GetMyCartResponse?.results?.discount}
                {' SAR'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.subtotalCss}>
          <Text style={styles.subtotalText}>{t('Total')}</Text>
          <Text style={styles.sarText}>
            {GetMyCartResponse?.results?.grandTotal}
            {' SAR'}
          </Text>
        </View>
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
            style={styles.rrbCss}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#E6E6E9',
              }}>
              <Text style={styles.EventText}>{t('Event Details')}</Text>
              <TouchableOpacity
                style={{marginTop: 5}}
                onPress={() => setShowEventDetailModal(true)}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../assets/images/Info.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Name')}</Text>
              <TextInput
                style={styles.input2}
                placeholder={t('Enter your name')}
                placeholderTextColor={config.colors.Gray}
                onChangeText={val => setEventName(val)}
                value={event_name}
              />
            </View>
            <View style={styles.nameinputCss}>
              <View style={styles.locationMainCss}>
                <Text style={styles.nameText}>{t('Location')}</Text>
                <View style={styles.saveLocCss}>
                  <Image
                    resizeMode="contain"
                    style={styles.LocIcon}
                    source={require('../../assets/images/Location.png')}
                  />
                  <Text
                    onPress={() => {
                      setLocationId('');
                      navigation.navigate(config.routes.SELECT_LOCATION, {
                        from: 'Cart',
                        setLocationId,
                      });
                      refRBSheet.current.close();
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
                onPress={() => {
                  setLocationId('');
                  navigation.navigate(config.routes.SELECT_LOCATION, {
                    from: 'Cart',
                    setLocationId,
                  });
                  refRBSheet.current.close();
                }}>
                <TextInput
                  style={styles.input2}
                  placeholder={t('Enter your location')}
                  placeholderTextColor={config.colors.Gray}
                  editable={false}
                  numberOfLines={1}
                  multiline={true}
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
                    showStartDatePicker();
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
                    showStartTimePicker();
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
                    showEndDatePicker();
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
                    showEndTimePicker();
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
            {/* <View style={styles.nameinputCss}>
              <Text style={styles.nameText}>{t('Notes')}</Text>
              <TextInput
                style={styles.inputType}
                placeholder={t('Type here...')}
                placeholderTextColor={'#00000080'}
                multiline={true}
                onChangeText={val =>
                  // setBuyerComment(val.replace(/[^a-zA-Z0-9 ]/g, ''))
                  setBuyerComment(
                    val.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9'"_\-!,?()\s]/g, ''),
                  )
                }
                value={buyerComment?.trimStart()}
              />
            </View> */}
          </ScrollView>
          <SafeAreaView>
            <AppButton
              text={t('Process')}
              onPress={() => onPressProcess()}
              viewStyle={{marginTop: 30, paddingHorizontal: 15}}
            />
          </SafeAreaView>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            minimumDate={new Date()}
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
            minimumDate={new Date()}
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
          {eventDetaiModalView()}
        </RBSheet>
      </ScrollView>
      <AppButton
        text={t('Checkout')}
        onPress={() => {
          checkItemLimit();
        }}
        buttonStyle={{
          backgroundColor:
            GetMyCartResponse?.results?.cart.length > 0
              ? config.colors.buttonColor
              : config.colors.Gray,
        }}
        viewStyle={{marginTop: 30, paddingHorizontal: 15}}
      />
    </SafeAreaView>
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
  serviceText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 5,
    textAlign: 'left',
  },
  partyDecor: {
    height: 75,
    width: 75,
    overflow: 'hidden',
    borderRadius: 10,
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
    marginVertical: 4,
    textAlign: 'left',
  },
  sartxt: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#4F74B0',
    fontSize: 14,
    textAlign: 'left',
  },
  locationCss: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'flex-end',
  },
  closeIcon: {
    width: 11,
    height: 11,
    marginHorizontal: 2,
  },
  flatlistMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 5,
  },
  flatlistCss: {
    flexDirection: 'row',
    // alignItems: 'center',
    width: '60%',
  },
  ballonCss: {
    marginLeft: 10,
  },
  plusIcon: {
    height: 25,
    width: 25,
  },
  numbertxt: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 12,
    marginHorizontal: 10,
  },
  plusIconCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entercode: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#888888',
    fontSize: 12,
    marginTop: 40,
    textAlign: 'left',
  },
  inputCss: {
    borderWidth: 1,
    borderColor: '#E6E6E9',
    height: 48,
    borderRadius: 6,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    paddingHorizontal: 20,
    width: '80%',
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  applyText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.buttonColor,
    fontSize: 14,
  },
  subtotalCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 15,
    marginTop: 15,
  },
  widthCss: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E9',
    paddingBottom: 20,
  },
  sarText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 20,
    marginTop: 15,
  },
  rrbCss: {
    marginHorizontal: 15,
  },
  EventText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 5,

    paddingBottom: 15,
    textAlign: 'left',

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
  inputType: {
    fontSize: 10,
    height: 35,
    fontFamily: config.fonts.Poppins_Medium,
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginTop: 5,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    color: config.colors.Black,
  },
  infoModalConatiner: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCardView: {
    marginHorizontal: 30,
    padding: 4,
    width: '90%',
    backgroundColor: config.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
    borderRadius: 8,
  },
  closeImg: {width: 18, height: 18},
  eventHeadingTextStyle: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.Black,
  },
  eventTextStyle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Black,
  },
});

export default Cart;
