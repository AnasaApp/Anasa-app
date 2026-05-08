import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  I18nManager,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {useDispatch, useSelector} from 'react-redux';
import {GetAboutUsReducer, GetWalletInfoReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment/moment';
import DateRangePicker from 'rn-select-date-range';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const MyEarnings = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const GetWalletInfoResponse = useSelector(
    GetWalletInfoReducer.selectGetWalletInfoData,
  );
  const GetWalletInfoErrorResponse = useSelector(
    GetWalletInfoReducer.selectGetWalletInfoResponse,
  );
  const [dateRange, setDateRange] = useState(null);
  const [transactionsList, setTransactionsList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [currentWalletBalance, setCurrentWalletBalance] = useState(0);

  const refRBSheet2 = useRef();
  const refRBSheetCalender = useRef();

  //hooks calling
  useEffect(() => {
    if (GetWalletInfoResponse != null) {
      if (GetWalletInfoResponse?.error == false) {
        console.log(
          'GetWalletInfoResponse',
          JSON.stringify(GetWalletInfoResponse),
        );
        setCurrentWalletBalance(
          GetWalletInfoResponse?.results?.credited -
            GetWalletInfoResponse?.results?.debited,
        );
        setTransactionsList([
          ...transactionsList,
          ...GetWalletInfoResponse?.results?.transactions,
        ]);
        setPageNo(pageNo + 1);
        setTotalPageNo(GetWalletInfoResponse?.results?.totalPages);
        dispatch(GetWalletInfoReducer.removeGetWalletInfoResponse());
      }
    }
  }, [GetWalletInfoResponse]);

  useEffect(() => {
    if (GetWalletInfoErrorResponse != null) {
      if (GetWalletInfoErrorResponse?.error == true) {
        Toast.show(GetWalletInfoErrorResponse.message, Toast.LONG);
        dispatch(GetWalletInfoReducer.removeGetWalletInfoResponse());
      }
    }
  }, [GetWalletInfoErrorResponse]);

  useFocusEffect(
    useCallback(() => {
      setTransactionsList([]);
      setTotalPageNo(1);
      setPageNo(1);
      callGetWalletInfoApi(1);
    }, []),
  );
  //api calling
  const callGetWalletInfoApi = pageNo => {
    const payload = {
      page: pageNo,
      pageSize: 10,
    };
    dispatch({type: SagaActions.GET_WALLET_INFO, payload});
  };

  const renderTransactionItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flexDirection: 'row',
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: config.colors.borderColor,
          paddingVertical: 10,
          paddingHorizontal: 5,
        }}>
        <Image
          resizeMode="contain"
          style={{
            height: 30,
            width: 30,
          }}
          source={require('../../assets/images/myearn.png')}
        />
        <View style={{marginLeft: 10, flex: 1}}>
          <Text
            style={{
              fontFamily: config.fonts.InterSemiBoldFont,
              fontSize: 14,
              color: config.colors.blackColor,
              lineHeight: 22,
              textAlign: 'left',
            }}>
            {item?.transactionID}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.InterRegularFont,
              fontSize: 12,
              color: config.colors.Gray,
              lineHeight: 18,
              textAlign: 'left',
            }}>
            {moment(item?.createdAt).format('DD MMM YYYY | HH:mm A')}
          </Text>
        </View>
        <View style={{}}>
          <Text
            style={{
              fontFamily: config.fonts.InterMediumFont,
              fontSize: 14,
              color: config.colors.blackColor,
              lineHeight: 22,
            }}>
            {`${item?.amount ?? 0} SAR`}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.InterRegularFont,
              fontSize: 12,
              color:
                item?.type == 'deposit'
                  ? config.colors.greenColor
                  : config.colors.red,
              lineHeight: 18,
              textAlign: 'right',
            }}>
            {t(item?.type)}
          </Text>
        </View>
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
          title={t('Wallet')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <TouchableOpacity activeOpacity={0.8}>
        <ImageBackground
          source={require('../../assets/images/earningBack.png')}
          resizeMode="stretch"
          style={{height: 180}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 40,
            }}>
            <View>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.white,
                  fontSize: 14,
                  textAlign: 'left',
                }}>
                {t('Wallet Balance')}
              </Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.white,
                  fontSize: 22,
                  marginTop: 15,
                  textAlign: 'left',
                }}>
                {`${currentWalletBalance} SAR`}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          height: 40,
          marginVertical: 5,
          alignItems: 'center',
          backgroundColor: '#f3f3f3',
        }}>
        <Text style={styles.addService}>{t('Transactions')}</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => refRBSheetCalender.current.open()}>
          <Image
            style={{height: 25, width: 25, resizeMode: 'contain'}}
            source={require('../../assets/images/calender.png')}
          />
        </TouchableOpacity>
      </View>
      {transactionsList?.length > 0 ? (
        <View style={{flex: 1, margin: 15}}>
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            data={transactionsList}
            keyExtractor={item => item._id?.toString()}
            renderItem={renderTransactionItem}
            onEndReached={() => {
              if (totalPageNo >= pageNo) {
                callGetWalletInfoApi(pageNo);
              }
            }}
            onEndReachedThreshold={0.5}
          />
        </View>
      ) : (
        <View style={styles.mainCss}>
          <Text style={styles.addService}>{t('No Transaction Found')}</Text>
        </View>
      )}
      <RBSheet
        ref={refRBSheetCalender}
        // closeOnDragDown={true}
        // closeOnPressMask={true}

        customStyles={{
          wrapper: {
            backgroundColor: '#00000080',
          },
          draggableIcon: {
            backgroundColor: '#fff',
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 20,
            height: '60%',
          },
        }}>
        <DateRangePicker
          confirmBtnTitle={'Confirm'}
          onSelectDateRange={range => {
            setDateRange(range);
          }}
          onConfirm={() => {
            refRBSheetCalender.current.close();
          }}
          onClear={() => setDateRange(null)}
          blockSingleDateSelection={false}
          responseFormat="YYYY-MM-DD"
          maxDate={moment()}
          // minDate={moment().subtract(100, "days")}
          selectedDateContainerStyle={styles.selectedDateContainerStyle}
          selectedDateStyle={styles.selectedDateStyle}
        />
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
    marginHorizontal: 15,
    flex: 1,
  },
  dataText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13.5,
    color: '#313450',
    marginTop: 10,
    lineHeight: 24,
    textAlign: 'left',
  },
  secondTextCss: {
    marginTop: 20,
  },
  addService: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 14,
    marginTop: 10,
  },
});

export default MyEarnings;
