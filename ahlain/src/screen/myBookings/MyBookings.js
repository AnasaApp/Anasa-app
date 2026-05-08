import moment from 'moment/moment';
import React, {useCallback, useRef, useState} from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  I18nManager,
  StatusBar,
  ImageBackground,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  GetMyBookingsReducer,
  GetMyCartReducer,
  RateServiceReducer,
  ReOrderBookingReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {AppButton, AppTextInput} from '../../conponents';
import {debounce} from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-simple-toast';
import Apploader from '../../conponents/AppLoader';
import NoData from '../../conponents/NoData';

const MyBookings = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const GetMyBookingsResponse = useSelector(
    GetMyBookingsReducer.selectGetMyBookingsData,
  );
  const RateServiceResponse = useSelector(
    RateServiceReducer.selectRateServiceData,
  );

  const ReOrderBookingResponse = useSelector(
    ReOrderBookingReducer.selectReOrderBookingData,
  );
  const ReOrderBookingErrorResponse = useSelector(
    ReOrderBookingReducer.selectReOrderBookingResponse,
  );

  const [ratingLength, setRatingLength] = useState(['1', '2', '3', '4', '5']);
  const [ratingCount, setRatingCount] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [currentService, setCurrentService] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedBookingType, setSelectedBookingType] = useState(
    route?.params?.bookingType ? route?.params?.bookingType : 0,
  );
  const [bookingList, setBookingList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);

  const isFocused = useIsFocused();
  const bookingTypeList = [
    {
      key: 0,
      name: 'All',
    },
    {
      key: 1,
      name: 'Booked',
    },
    {
      key: 2,
      name: 'Cancelled',
    },
    {
      key: 3,
      name: 'Past',
    },
  ];
  const refRBSheet = useRef();

  useFocusEffect(
    useCallback(() => {
      setBookingList([]);
      setTotalPageNo(1);
      setPageNo(1);
      getMyBookingsApi(selectedBookingType, 1, '');
    }, []),
  );
  //hooks calling

  useEffect(() => {
    if (ReOrderBookingResponse != null) {
      if (ReOrderBookingResponse?.error == false) {
        Toast.show(ReOrderBookingResponse.message, Toast.LONG);
        dispatch(ReOrderBookingReducer.removeReOrderBookingResponse());

        navigation.navigate(config.routes.CART);
      }
    }
  }, [ReOrderBookingResponse]);

  useEffect(() => {
    if (ReOrderBookingErrorResponse != null) {
      if (ReOrderBookingErrorResponse?.error == true) {
        Toast.show(ReOrderBookingErrorResponse.message, Toast.LONG);
        dispatch(ReOrderBookingReducer.removeReOrderBookingResponse());
      }
    }
  }, [ReOrderBookingErrorResponse]);
  useEffect(() => {
    if (RateServiceResponse != null) {
      if (RateServiceResponse?.error == false) {
        refRBSheet.current.close();
        setRatingCount(1);
        setFeedback('');
        setTimeout(() => {
          Toast.show(RateServiceResponse?.message, Toast.LONG);
        }, 500);
        dispatch(RateServiceReducer.removeRateServiceResponse());
      }
    }
  }, [RateServiceResponse]);
  useEffect(() => {
    if (GetMyBookingsResponse != null && isFocused) {
      if (GetMyBookingsResponse?.error == false) {
        setBookingList([
          ...bookingList,
          ...GetMyBookingsResponse?.results?.bookings,
        ]);
        setPageNo(pageNo + 1);
        setTotalPageNo(GetMyBookingsResponse?.results?.totalPage);
        dispatch(GetMyBookingsReducer.removeGetMyBookingsResponse());
      }
    }
  }, [GetMyBookingsResponse]);
  const getMyBookingsApi = (type, pageNo, searchText) => {
    setSelectedBookingType(type);
    const payload = {
      page: pageNo,
      pageSize: 10,
      type: type,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_MY_BOOKINGS, payload});
  };
  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      if (text != '') {
        getMyBookingsApi(selectedBookingType, 1, text);
      } else {
        setBookingList([]);
        setTotalPageNo(1);
        setPageNo(1);
      }
    }, 500),
    [],
  );
  const onPressRateUs = () => {
    // if(feedback==""){
    //   return Toast.show("Please enter feedback",Toast.LONG)
    // }
    const payload = {
      serviceId: currentService?._id,
      rating: ratingCount,
      feedback: feedback?.trim(),
    };
    console.log('payload', payload);
    dispatch({type: SagaActions.RATE_SERVICE, payload});
  };
  const callReOrderBookingApi = bookingId => {
    const payload = {
      uri: '/' + bookingId,
    };
    dispatch({type: SagaActions.RE_ORDER_BOOKING, payload});
  };
  const renderItem = ({item, index}) => {
    index == 0 && console.log('item', JSON.stringify(item));
    return (
      <View
        key={index}
        style={{
          borderTopWidth: 1,
          borderTopColor: config.colors.borderColor,
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              fontSize: 14,
              color: config.colors.blueColor,
            }}>
            {`${t('Booking ID: #')} `}
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 12,
                color: config.colors.Gray,
              }}>
              {item.bookingID}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              fontSize: 14,
              color: config.colors.blueColor,
            }}>
            {`${t('Order Date')}: `}
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 12,
                color: config.colors.Gray,
              }}>
              {moment(item?.createdAt).format('DD-MM-YY')}
            </Text>
          </Text>
        </View>
        {item?.services?.map((sItem, sIndex) => {
          return (
            <TouchableOpacity
              key={sIndex}
              style={{
                backgroundColor: config.colors.white,
                marginTop: 15,
                borderRadius: 12,
              }}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate(config.routes.BOOKING_DETAILS, {
                  booking_id: item?._id,
                });
              }}>
              <ImageBackground
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: 150,
                  overflow: 'hidden',
                  borderRadius: 10,
                }}
                source={{
                  uri:
                    sItem?.service?.images?.length > 0
                      ? sItem?.service?.images[0]
                      : '',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate(config.routes.VENDOR_DETAILS, {
                      vendor_id: sItem?.service.vendor._id,
                    });
                  }}
                  style={{
                    backgroundColor: config.colors.lightGreenColor,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    margin: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      fontSize: 12,
                      color: config.colors.greenColor,
                      marginHorizontal: 4,
                    }}>
                    {t(sItem?.status)}
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
              <View
                style={{
                  paddingBottom: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    paddingHorizontal: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Medium,
                        fontSize: 16,
                        color: config.colors.Black,
                        lineHeight: 24,
                      }}>
                      {I18nManager?.isRTL
                        ? sItem?.service.name_ar
                        : sItem?.service.name_en}
                    </Text>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 12,
                        color: config.colors.Gray,
                        lineHeight: 18,
                      }}>
                      {`${t('Quantity')}: ${sItem?.quantity}`}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Medium,
                          fontSize: 14,
                          lineHeight: 22,
                          color: config.colors.Black,
                          marginTop: 4,
                        }}>
                        {sItem?.isCombo ? sItem?.comboPrice : sItem?.price}
                        <Text
                          style={{
                            fontFamily: config.fonts.Poppins_Medium,
                            fontSize: 12,
                            color: config.colors.Black,
                          }}>
                          {' SAR'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate(config.routes.VENDOR_DETAILS, {
                          vendor_id: item.vendor._id,
                        });
                      }}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignSelf: 'flex-start',
                        margin: 10,
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
                          color: config.colors.Gray,
                          marginHorizontal: 4,
                        }}>
                        {I18nManager?.isRTL
                          ? item.vendor?.shop_name_ar
                          : item.vendor?.shop_name}
                      </Text>
                    </TouchableOpacity>
                    {item?.status == 'Completed' && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setCurrentService(sItem?.service);
                          refRBSheet?.current?.open();
                        }}
                        style={{
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: config.colors.blueColor,
                          borderRadius: 6,
                        }}>
                        <Text
                          style={{
                            fontFamily: config.fonts.Poppins_Medium,
                            fontSize: 12,
                            color: config.colors.white,
                          }}>
                          {t('Rate Us')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <AppButton
            buttonStyle={{
              backgroundColor: config.colors.white,
              borderWidth: 1,
              borderColor: config.colors.blueColor,
              width: '48%',
            }}
            text={t('Invoice')}
            textStyle={{color: config.colors.Black}}
            onPress={() => {
              navigation.navigate(config.routes.BILL_DETAILS, {
                bookingDetail: item,
                service: item,
              });
            }}
          />
          <AppButton
            buttonStyle={{
              backgroundColor: config.colors.blueColor,
              width: '48%',
            }}
            text={t('Re-Order package')}
            onPress={() => {
              callReOrderBookingApi(item?.bookingID);
            }}
          />
        </View>
      </View>
      // <TouchableOpacity
      //   activeOpacity={0.8}
      //   onPress={() => {
      //     console.log('GET_MY_BOOKINGS', item);
      //     navigation.navigate(config.routes.BOOKING_DETAILS, {
      //       booking_id: item?._id,
      //     });
      //   }}
      //   key={index}
      //   style={styles.bookingMainCss}>
      //   <View style={styles.idCss}>
      //     <View>
      //       <Text style={styles.idText}>
      //         {t('Booking ID: #')}
      //         {item.bookingID}
      //       </Text>
      //       <Text style={styles.dateText}>
      //         {moment(item.event_start_date).format('MMM DD, YYYY')}
      //         {' | '}
      //         {item?.event_start_time}
      //       </Text>
      //       <Text style={styles.dateText}>
      //         {moment(item.event_end_date).format('MMM DD, YYYY')}
      //         {' | '}
      //         {item?.event_end_time}
      //       </Text>
      //     </View>
      //     <View
      //       style={[
      //         styles.bookingButton,
      //         {backgroundColor: item.isFinished ? '#0D605533' : '#4F74B033'},
      //       ]}
      //       // onPress={() => {
      //       //   navigation.navigate(config.routes.BOOKING_DETAILS,{OngoingData:'ongoing'});
      //       // }}
      //     >
      //       <Text
      //         style={[
      //           styles.bookingstart,
      //           {color: item.isFinished ? '#0D6055' : '#4F74B0'},
      //         ]}>
      //         {item.isFinished ? 'Completed' : 'OTP: ' + item.otp}
      //       </Text>
      //     </View>
      //   </View>

      //   <View style={styles.idCss}>
      //     <View>
      //       <Text style={styles.dateText}>{t('Vendor Name')}</Text>
      //       <Text style={styles.idText}>{item.vendor.full_name}</Text>
      //     </View>
      //     <View>
      //       <Text style={styles.dateText}>{t('Booking Amount')}</Text>
      //       <Text style={styles.bookingAmoutText}>
      //         {'SAR: '}
      //         {item?.isCombo ? item?.comboPrice : item.total}
      //       </Text>
      //     </View>
      //   </View>
      //   <View style={styles.idCss}>
      //     <View>
      //       <Text style={styles.dateText}>{t('Booking Items')}</Text>
      //       <View style={styles.dotCss}>
      //         {item.services?.map((s, i) => {
      //           return (
      //             <View style={[styles.dotCss, {marginLeft: 5}]}>
      //               <View style={styles.dot}></View>
      //               <Text style={styles.idText}>
      //                 {s.quantity}
      //                 {' X '}
      //                 {I18nManager.isRTL
      //                   ? s.service?.name_ar
      //                   : s.service?.name_en}
      //               </Text>
      //               {s.isCombo && (
      //                 <Text style={styles.dateText}>{'(Combo)'}</Text>
      //               )}
      //             </View>
      //           );
      //         })}
      //       </View>
      //     </View>
      //   </View>
      //   <View style={styles.infoCss}>
      //     <Image
      //       resizeMode="contain"
      //       style={styles.infoIcon}
      //       source={require('../../assets/images/Info.png')}
      //     />
      //   </View>
      // </TouchableOpacity>
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
          backgroundColor: config.colors.orangeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('My Bookings')}
          backgroundColor={config.colors.orangeColor}
          rightimg={require('../../assets/images/addCardtroly.png')}
          rightimgContainerStyle={{
            alignItems: 'center',
            backgroundColor: config.colors.creamColor,
            width: 40,
            height: 40,
            justifyContent: 'center',
            borderRadius: 50,
            marginLeft: 10,
          }}
          rightImageStyle={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: config.colors.white + 70,
            marginVertical: 12,
          }}
        />
        <AppTextInput
          inputTextLabelVisible={false}
          inputTextLabel={''}
          placeholder={t('Search')}
          leftIcon={require('../../assets/images/Search.png')}
          value={searchText}
          onChangeText={val => {
            setBookingList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
        />
      </View>
      <View
        style={{
          marginTop: 15,
          paddingHorizontal: 15,
        }}>
        <ScrollView
          style={{
            alignSelf: 'flex-start',
          }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {bookingTypeList?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  backgroundColor:
                    selectedBookingType == item?.key
                      ? config.colors.orangeColor
                      : config.colors.white,
                  borderWidth: 1,
                  borderRadius: 6,
                  borderColor: config.colors.borderColor,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.8}
                onPress={() => {
                  setBookingList([]);
                  setSelectedBookingType(item?.key);
                  getMyBookingsApi(item?.key, 1, searchText);
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 21,
                    color:
                      selectedBookingType == item?.key
                        ? config.colors.white
                        : config.colors.Black,
                  }}>
                  {t(item?.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.mainCss}>
        {bookingList?.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            data={bookingList}
            keyExtractor={item => item._id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              backgroundColor: config.colors.creamColor,
              paddingVertical: 15,
            }}
            onEndReached={() => {
              if (totalPageNo >= pageNo) {
                getMyBookingsApi(selectedBookingType, pageNo, searchText);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <NoData text={t('No Data Found')} visible={true} />
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
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
          container: {
            backgroundColor: config.colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          style={styles.rrbCss}>
          <View style={styles.rateUsCss}>
            <Text style={styles.rateUsText}>{t('Rate Us')}</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => refRBSheet.current.close()}>
              <Image
                resizeMode="contain"
                style={styles.closeIcon}
                source={require('../../assets/images/closeIcon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.starCss}>
            {ratingLength?.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={index}
                  style={{paddingHorizontal: 5}}
                  onPress={() => {
                    setRatingCount(item);
                  }}>
                  <Image
                    style={{
                      height: 26,
                      width: 26,
                      tintColor: item <= ratingCount ? '#FCDB35' : '#DDDCDD',
                    }}
                    source={require('../../assets/images/start.png')}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.feedbackCss}>
            <Text style={styles.feedbacktext}>{t('Your Feedback')}</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder={t('Type here...')}
              placeholderTextColor={config.colors.Gray}
              textAlignVertical="top"
              multiline={true}
              value={feedback}
              onChangeText={val => setFeedback(val)}
            />
          </View>
        </ScrollView>
        <AppButton
          text={t('Submit')}
          onPress={() => onPressRateUs()}
          buttonStyle={{marginBottom: 30, marginHorizontal: 15}}
        />
        <Apploader />
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
    flex: 1,
  },
  ongoingMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F1F4',
    borderRadius: 12,
    height: 50,
    padding: 5,
  },
  ongoingCss: {
    width: '30%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ongoingtext: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_SemiBold,
    textAlign: 'center',
  },
  bookingMainCss: {
    backgroundColor: config.colors.white,
    padding: 7,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  idCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  idText: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
  },
  dateText: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Gray,
  },
  bookingButton: {
    backgroundColor: '#E3582917',
    height: 30,
    width: 114,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingstart: {
    fontSize: 11,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#E35829',
  },
  bookingAmoutText: {
    fontSize: 16,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    textAlign: 'right',
  },
  dotCss: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dot: {
    height: 7,
    width: 7,
    backgroundColor: '#4F74B0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  infoCss: {
    alignSelf: 'flex-end',
  },
  infoIcon: {
    height: 20,
    width: 20,
    tintColor: 'gray',
  },
  lastMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 18,
    height: 40,
    padding: 5,
    marginTop: 10,
  },
  lastCss: {
    width: '30%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    height: 35,
    borderRadius: 18,
  },
  lasttext: {
    fontSize: 13,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: 'center',
  },
  rrbCss: {
    marginHorizontal: 15,
  },
  rateUsText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 20,
  },
  closeIcon: {
    height: 14,
    width: 14,
    bottom: 2,
  },
  rateUsCss: {
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
    borderColor: config.colors.borderColor,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  feedbacktext: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    textAlign: 'left',
  },
  feedbackInput: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    height: 135,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

export default MyBookings;
