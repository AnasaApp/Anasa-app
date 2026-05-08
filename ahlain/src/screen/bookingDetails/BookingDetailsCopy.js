import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import AppButton from '../../conponents/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {BookingDetailReducer, CancelBookingReducer} from '../../redux/reducers';
import {useEffect} from 'react';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import AppTextInput from '../../conponents/AppInput';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
const BookingDetails = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const BookingDetailResponse = useSelector(
    BookingDetailReducer.selectBookingDetailData,
  );
  const CancelBookingResponse = useSelector(
    CancelBookingReducer.selectCancelBookingData,
  );
  const CancelBookingErrorResponse = useSelector(
    CancelBookingReducer.selectCancelBookingResponse,
  );
  const [currentService, setCurrentService] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');
  const [showBookingServiceList, setShowBookingServiceList] = useState(false);
  const refRBSheet = useRef();
  const refRBSheet2 = useRef();

  console.log(
    'BookingDetailResponse?.results?.booking',
    JSON.stringify(BookingDetailResponse?.results?.booking),
  );
  useEffect(() => {
    if (CancelBookingResponse != null) {
      if (CancelBookingResponse?.error == false) {
        Toast.show(CancelBookingResponse?.message, Toast.LONG);
        refRBSheet.current.close();
        navigation.navigate(config.routes.SIDE_BAR);
        dispatch(CancelBookingReducer.removeCancelBookingResponse());
      }
    }
  }, [CancelBookingResponse]);
  useEffect(() => {
    if (CancelBookingErrorResponse != null) {
      Toast.show(CancelBookingErrorResponse?.message, Toast.LONG);
    }
  }, [CancelBookingErrorResponse]);
  useEffect(() => {
    const payload = {
      uri: `/${route?.params?.booking_id}`,
    };
    dispatch({type: SagaActions.BOOKING_DETAIL, payload});
  }, []);
  const onPressCancelBooking = () => {
    if (currentService == '') {
      return Toast.show('Please select service', Toast.LONG);
    }
    if (cancelReason?.trim() == '') {
      return Toast.show('Please enter cancel reason', Toast.LONG);
    }
    if (cancelNote?.trim() == '') {
      return Toast.show('Please enter cancel note', Toast.LONG);
    }

    const payload = {
      bookingId: route?.params?.booking_id,
      service: currentService._id,
      reason: cancelReason?.trim(),
      notes: cancelNote?.trim(),
    };
    dispatch({type: SagaActions.CANCEL_BOOKING, payload});
  };
  const renderItem = ({item, index}) => {
    console.log('item', item);
    var startTime = moment(
      new Date(BookingDetailResponse?.results?.booking?.createdAt),
    ).add(BookingDetailResponse?.results?.booking?.vendor?.refundTime, 'hours');
    var endTime = moment(new Date());
    // calculate total duration
    var duration = moment.duration(endTime.diff(startTime));
    // duration in hours
    // var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes());
    console.log('duration', minutes);
    return (
      <View key={index} style={styles.FlatlistCss}>
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Service name')}</Text>
          <Text style={styles.balloonName}>
            {I18nManager.isRTL
              ? item?.service?.name_ar
              : item?.service?.name_en}
          </Text>
        </View>
        {item?.package?.length > 0 && (
          <View style={styles.boderCss}>
            <Text style={styles.serviceName}>{t('Customization')}</Text>

            {item?.package?.map((p, ind) => {
              return (
                <Text key={ind} style={styles.balloonName}>
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
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Date & Time')}</Text>
          <Text style={styles.balloonName}>
            {moment(
              BookingDetailResponse?.results?.booking?.event_start_date,
            ).format('MMM DD, YYYY')}
            {' | '}
            {BookingDetailResponse?.results?.booking?.event_start_time}
            {' - '}
            {moment(
              BookingDetailResponse?.results?.booking?.event_end_date,
            ).format('MMM DD, YYYY')}
            {' | '}
            {BookingDetailResponse?.results?.booking?.event_end_time}
          </Text>
        </View>
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Location')}</Text>
          <Text style={styles.balloonName}>
            {BookingDetailResponse?.results?.booking?.event_location?.city}
          </Text>
        </View>
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Vendor Name')}</Text>
          <Text style={styles.balloonName}>
            {BookingDetailResponse?.results?.booking?.vendor?.full_name}
          </Text>
        </View>
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Vendor Contact')}</Text>
          <Text style={styles.balloonName}>
            {BookingDetailResponse?.results?.booking?.vendor?.phone_number}
          </Text>
        </View>
        <View style={styles.boderCss}>
          <Text style={styles.serviceName}>{t('Booking Status')}</Text>
          <Text style={styles.balloonName}>{item?.status}</Text>
        </View>
        {!item?.isCombo && (
          <View style={[styles.boderCss, {borderBottomColor: '#fff'}]}>
            <Text style={styles.serviceName}>{t('Amount')}</Text>
            <Text style={styles.balloonName}>{`${item?.price} SAR`}</Text>
          </View>
        )}
        <View style={[styles.boderCss, {borderBottomColor: '#fff'}]}>
          <Text style={styles.serviceName}>{t('Payment Status')}</Text>
          <Text style={styles.balloonName}>
            {BookingDetailResponse?.results?.booking?.payment_status}
          </Text>
        </View>
        {item?.service_note && (
          <View style={[styles.boderCss, {borderBottomColor: '#fff'}]}>
            <Text style={styles.serviceName}>{t('Notes')}</Text>
            <Text style={styles.balloonName}>{item?.service_note}</Text>
          </View>
        )}
        {item?.cancel_reason && (
          <View style={[styles.boderCss, {borderBottomColor: '#fff'}]}>
            <Text style={styles.serviceName}>{t('Cancel Reason')}</Text>
            <Text style={styles.balloonName}>{item?.cancel_reason}</Text>
          </View>
        )}
        {item?.cancel_note && (
          <View style={[styles.boderCss, {borderBottomColor: '#fff'}]}>
            <Text style={styles.serviceName}>{t('Cancel Notes')}</Text>
            <Text style={styles.balloonName}>{item?.cancel_note}</Text>
          </View>
        )}
        <View style={styles.clickCss}>
          <Text style={styles.clicktext}>{t('To see the invoice')}</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate(config.routes.BILL_DETAILS, {
                bookingDetail: BookingDetailResponse?.results?.booking,
                service: item,
              });
            }}>
            <Text style={[styles.clicktext, {color: '#00B355'}]}>
              {' '}
              {t('click here')}
            </Text>
          </TouchableOpacity>
        </View>
        {item?.status == 'Pending' ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              if (minutes > 0) {
                Toast.show(
                  'You can cancel this booking within ' +
                    BookingDetailResponse?.results?.booking?.vendor
                      ?.refundTime +
                    ' hours',
                );
              } else {
                refRBSheet.current.open();
                setCurrentService(item?.service);
              }
            }}
            style={[
              styles.buttonCss,
              {
                width: '100%',
                marginTop: 25,

                backgroundColor: minutes > 0 ? config.colors.Gray : '#E35829',
              },
            ]}>
            <Text style={styles.buttonText}>{t('Cancel')}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: config.colors.BACKGROUNDCOLOR}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={config.colors.orangeColor}
        translucent={false}
      />
      <View
        style={{
          backgroundColor: config.colors.orangeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('Invoice Details')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.mainCss}>
          <View style={styles.congrsCss}>
            <Image
              style={styles.TickImg}
              resizeMode="contain"
              source={require('../../assets/images/Tick.png')}
            />
            <View style={styles.congrsTextCss}>
              <Text style={styles.congrsText}>{t('Congratulations!')}</Text>
              <Text style={styles.succesText}>
                {t('Your booking is successful')}
              </Text>
            </View>
          </View>
          <Text style={styles.helloText}>
            {t('Hello')},{'\n'}
            {t('Here are the details of your booking:')}
          </Text>
          <View>
            <FlatList
              data={BookingDetailResponse?.results?.booking?.services}
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={450}
            customStyles={{
              wrapper: {
                backgroundColor: '#D0D0D0',
              },

              draggableIcon: {
                backgroundColor: '#fff',
              },
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.rrbCss}>
              <View style={styles.rateUsCss}>
                <Text style={styles.rateUsText}>{t('Cancel booking')}</Text>
              </View>
              <View style={styles.cancelBookingCss}>
                <Text style={styles.cancelBookingText}>
                  {t('Do you want to cancel your Booking?')}
                </Text>
              </View>
              <Text style={styles.inputName}>
                {t('Select booking you want to cancel')}
              </Text>
              <TouchableOpacity activeOpacity={0.8}>
                <AppTextInput
                  placeholder={t('List of order inside the selected ...')}
                  editable={false}
                  value={
                    I18nManager.isRTL
                      ? currentService?.name_ar
                      : currentService?.name_en
                  }
                  viewStyle={{marginHorizontal: 0, marginVertical: 0}}
                  // rightIcon={require('../../assets/images/downArrow.png')}
                  // rightIconPress={() =>
                  //   setShowBookingServiceList(!showBookingServiceList)
                  // }
                />
              </TouchableOpacity>
              {/* {showBookingServiceList && (
                <View
                  style={{
                    backgroundColor: '#f6f6f6',
                    maxHeight: 140,
                    borderRadius: 6,
                    padding: 10,
                    elevation: 2,
                  }}>
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps={'handled'}>
                    {BookingDetailResponse?.results?.booking?.services?.map(
                      (s, i) => {
                        return (
                          <Text
                            key={i}
                            onPress={() => {
                              setCurrentService(s.service);
                              setShowBookingServiceList(false);
                            }}
                            style={{
                              fontFamily: config.fonts.Poppins_Regular,
                              fontSize: 14,
                              color: config.colors.Black,
                              // borderBottomWidth: 1,
                              // borderColor: config.colors.Gray,
                              padding: 4,
                              textAlign: 'left',
                            }}>
                            {I18nManager.isRTL
                              ? s?.service?.name_ar
                              : s?.service?.name_en}
                          </Text>
                        );
                      },
                    )}
                  </ScrollView>
                </View>
              )} */}
              <Text style={styles.inputName}>{t('Enter reason')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('Enter reason')}
                placeholderTextColor={'#00000080'}
                onChangeText={val => setCancelReason(val)}
                value={cancelReason}
              />
              <Text style={styles.inputName}>{t('Notes')}</Text>
              <TextInput
                style={styles.inputType}
                placeholder={t('Type here...')}
                placeholderTextColor={'#00000080'}
                multiline={true}
                onChangeText={val => setCancelNote(val)}
                value={cancelNote}
              />
            </ScrollView>
            <SafeAreaView
              style={[
                styles.buttonMainCss,
                {marginTop: 20, paddingBottom: 10},
              ]}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.close();
                  navigation.navigate(config.routes.SIDE_BAR);
                }}
                activeOpacity={0.5}
                style={styles.nobuttonCss}>
                <Text style={[styles.buttonText, {color: '#000'}]}>
                  {t('No')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.buttonCss, {backgroundColor: '#4F74B0'}]}
                onPress={() => {
                  onPressCancelBooking();
                }}>
                <Text style={styles.buttonText}>{t('Yes')}</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </RBSheet>
        </View>
      </ScrollView>
      {route.params.PastData ? (
        <View style={styles.buttonMainCss}>
          <TouchableOpacity activeOpacity={0.5} style={styles.buttonCss}>
            <Text style={styles.buttonText}>{t('Raise Complaint')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => refRBSheet2.current.open()}
            activeOpacity={0.5}
            style={[styles.buttonCss, {backgroundColor: '#4F74B0'}]}>
            <Text style={styles.buttonText}>{t('Rate Us')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <RBSheet
        ref={refRBSheet2}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={400}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
        }}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.rrbCss}>
          <View style={styles.rateUsCss2}>
            <Text style={styles.rateUsText2}>{t('Rate Us')}</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => refRBSheet2.current.close()}>
              <Image
                resizeMode="contain"
                style={styles.closeIcon}
                source={require('../../assets/images/closeIcon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.starCss}>
            <TouchableOpacity activeOpacity={0.5}>
              <Image
                resizeMode="contain"
                style={styles.startIcon}
                source={require('../../assets/images/start.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.startTouch} activeOpacity={0.5}>
              <Image
                resizeMode="contain"
                style={styles.startIcon}
                source={require('../../assets/images/start.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.startTouch} activeOpacity={0.5}>
              <Image
                resizeMode="contain"
                style={styles.startIcon}
                source={require('../../assets/images/start.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.startTouch} activeOpacity={0.5}>
              <Image
                resizeMode="contain"
                style={[styles.startIcon, {tintColor: '#DDDCDD'}]}
                source={require('../../assets/images/start.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.startTouch} activeOpacity={0.5}>
              <Image
                resizeMode="contain"
                style={[styles.startIcon, {tintColor: '#DDDCDD'}]}
                source={require('../../assets/images/start.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.feedbackCss}>
            <Text style={styles.feedbacktext}>{t('Your Feedback')}</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder={t('Type here...')}
              textAlignVertical="top"
            />
          </View>
          <AppButton
            text={t('Submit')}
            // onPress={() => navigation.navigate(config.routes.HOME_SCREEN)}
            onPress={() => refRBSheet2.current.close()}
            viewStyle={{marginTop: 20}}
          />
        </ScrollView>
      </RBSheet>
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
    marginHorizontal: 10,
  },
  congrsCss: {
    flexDirection: 'row',
    backgroundColor: '#F0F1F4',
    height: 70,
    borderRadius: 12,
    padding: 10,
  },
  TickImg: {
    height: 20,
    width: 20,
    marginTop: 2,
  },
  congrsTextCss: {
    marginLeft: 12,
  },
  congrsText: {
    fontSize: 15,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
  },
  succesText: {
    fontSize: 13,
    fontFamily: config.fonts.Poppins_Medium,
    color: '#545151',
  },
  helloText: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    marginTop: 15,
    textAlign: 'left',
  },
  FlatlistCss: {
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    elevation: 0.5,
  },
  boderCss: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E3E5',
    paddingBottom: 10,
  },
  serviceName: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: '#545151',
    textAlign: 'left',
  },
  balloonName: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    textAlign: 'left',
  },
  clickCss: {
    flexDirection: 'row',
    backgroundColor: '#F0F1F4',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  clicktext: {
    fontSize: 13,
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Light_Black,
  },
  buttonMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  buttonCss: {
    backgroundColor: '#E35829',
    width: '47%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    textAlign: 'left',
  },
  rrbCss: {
    marginHorizontal: 15,
  },
  rateUsCss: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  rateUsText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 18,
    textAlign: 'left',
  },
  cancelBookingCss: {
    backgroundColor: '#E3582917',
    height: 40,
    borderRadius: 5,
    // alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginTop: 15,
  },
  cancelBookingText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#E35829',
    fontSize: 14,
    textAlign: 'left',
  },
  inputName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
    marginTop: 15,
    textAlign: 'left',
  },
  input: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    height: 45,
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginTop: 5,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputType: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    height: 90,
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginTop: 5,
    textAlignVertical: 'top',
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  nobuttonCss: {
    backgroundColor: '#D3D6D9',
    width: '47%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateUsText2: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 20,
  },
  closeIcon: {
    height: 14,
    width: 14,
    bottom: 2,
  },
  rateUsCss2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  startTouch: {
    marginLeft: 8,
  },
  startIcon: {
    height: 26,
    width: 26,
  },
  feedbackCss: {
    height: 194,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  feedbacktext: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
  },
  feedbackInput: {
    backgroundColor: '#E7E7E7',
    height: 135,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    color: config.colors.Black,
  },
});

export default BookingDetails;
