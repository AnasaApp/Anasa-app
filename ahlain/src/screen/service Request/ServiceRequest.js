import moment from 'moment/moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  I18nManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {GetRequestReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AppImage from '../../conponents/AppImage';
import Toast from 'react-native-simple-toast';

const ServiceRequest = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetRequestResponse = useSelector(
    GetRequestReducer.selectGetRequestData,
  );

  const [requestType, setRequestType] = useState('0');

  const [searchText, setSearchText] = useState('');
  const [selectedRequestType, setSelectedRequestType] = useState(0);
  const [requestList, setRequestList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);

  const isFocused = useIsFocused();
  const requestTypeList = [
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
  useFocusEffect(
    useCallback(() => {
      setRequestList([]);
      setTotalPageNo(1);
      setPageNo(1);
      getMyRequestsApi(requestType, 1, '');
    }, []),
  );
  //hooks calling

  useEffect(() => {
    if (GetRequestResponse != null && isFocused) {
      if (GetRequestResponse?.error == false) {
        setRequestList([
          ...requestList,
          ...GetRequestResponse?.results?.events,
        ]);
        setPageNo(pageNo + 1);
        console.log(
          'GetRequestResponse?.results?.events',
          JSON.stringify(GetRequestResponse?.results?.events),
        );
        setTotalPageNo(GetRequestResponse?.results?.totalPage);
        dispatch(GetRequestReducer.removeGetRequestResponse());
      }
    }
  }, [GetRequestResponse]);
  const getMyRequestsApi = (type, pageNo) => {
    setRequestType(type);
    const payload = {
      page: pageNo,
      pageSize: 10,
      type: type,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_REQUEST, payload});
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          if (item?.status == 'Paid') {
            Toast.show(
              t(
                'Service Charge is Paid. Please wait for admin to process your request',
              ),
              Toast.LONG,
            );
            return;
          }
          if (item?.status == 'Completed') {
            navigation.navigate(config.routes.CREATE_SERVICE_REQUEST, {
              request_id: item?._id,
              stepCount: 3,
            });
            return;
          }
          navigation.navigate(config.routes.CREATE_SERVICE_REQUEST, {
            request_id: item?._id,
          });
        }}
        style={{
          backgroundColor: config.colors.white,
          borderRadius: 12,
          padding: 10,
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <AppImage
            imageStyle={{
              width: 80,
              height: 80,
              resizeMode: 'cover',
              borderRadius: 12,
            }}
            borderRadius={12}
            resizeMode="cover"
            uri={item?.images[0]}
          />
          <View
            style={{
              flex: 1,
              marginLeft: 10,
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
                  fontSize: 16,
                  lineHeight: 24,
                  color: config.colors.Black,
                  textAlign: 'left',
                  flex: 1,
                }}>
                {item?.eventName}
              </Text>
              <Image
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: config.colors.Black,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: config.colors.Gray,
                }}
                source={require('../../assets/images/markerIcon.png')}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Gray,
                  fontSize: 14,
                  lineHeight: 22,
                  marginLeft: 10,
                  textAlign: 'left',
                  flex: 1,
                }}>
                {`${item?.event_location?.house_number}, ${item?.event_location?.building_name}, ${item?.event_location?.locality}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: config.colors.Gray,
                }}
                source={require('../../assets/images/calendarIcon.png')}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Gray,
                  fontSize: 14,
                  lineHeight: 22,
                  marginLeft: 10,
                }}>
                {moment(item?.startDate).format('MMM DD, YYYY')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: config.colors.Gray,
                }}
                source={require('../../assets/images/time.png')}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  color: config.colors.Gray,
                  fontSize: 14,
                  lineHeight: 22,
                  marginLeft: 10,
                }}>
                {`${item?.startTime} - ${item?.endTime}`}
              </Text>
            </View>
            {item?.status == 'Completed' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate(config.routes.CREATE_SERVICE_REQUEST, {
                      request_id: item?._id,
                    });
                  }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: config.colors.blueColor,
                    borderRadius: 6,
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      color: config.colors.white,
                      fontSize: 12,
                      lineHeight: 18,
                    }}>
                    {t('Re-Book')}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: config.colors.white,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: config.colors.blueColor,
                    marginLeft: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Medium,
                      color: config.colors.blueColor,
                      fontSize: 12,
                      lineHeight: 18,
                    }}>
                    {t('Write Review')}
                  </Text>
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
          title={t('Plan My Party Orders')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <View
        style={{
          marginTop: 15,
          paddingHorizontal: 15,
        }}>
        <ScrollView
          style={{alignSelf: 'flex-start'}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {requestTypeList?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  backgroundColor:
                    selectedRequestType == item?.key
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
                  setRequestList([]);
                  setSelectedRequestType(item?.key);
                  getMyRequestsApi(item?.key, 1);
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 21,
                    color:
                      selectedRequestType == item?.key
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
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={requestList}
          keyExtractor={item => item?._id.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (totalPageNo >= pageNo) {
              getMyRequestsApi(requestType, pageNo);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
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
    flex: 1,
  },
  flatlistCss: {
    borderWidth: 1,
    // elevation:1,
    borderColor: '#5E5F770F',
    backgroundColor: config.colors.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  issueText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 10,
    textAlign: 'left',
  },
  ticketText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    textAlign: 'left',
  },
  dateTimeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#ACADB7',
    fontSize: 11,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#2CD147',
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 11,
    paddingHorizontal: 5,
  },
  buttonCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ServiceRequest;
