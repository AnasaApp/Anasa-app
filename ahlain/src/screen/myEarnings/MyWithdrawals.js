import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import {

   WithdrawListingReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import DateRangePicker from 'rn-select-date-range';
import { useTranslation } from 'react-i18next';

const MyWithdrawals = ({navigation, route}) => {
  const {t,i18n} = useTranslation();


  const [dateRange, setDateRange] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState(route?.params?.withdrawlAmount);
  const dispatch = useDispatch();
  const WithdrawListingResponse = useSelector(
    WithdrawListingReducer.selectWithdrawListingData,
  );


  const refRBSheetCalender = useRef();
console.log('WithdrawListingResponse', JSON.stringify(WithdrawListingResponse));
  useEffect(() => {
    getWithdrawListing();
  }, []);


  const getWithdrawListing = () => {
    const payload = {
      from:dateRange?.firstDate,
      to:dateRange?.secondDate,
    };

    dispatch({type: SagaActions.WITHDRAW_LISTING, payload: payload});
  };


  const renderTransactionItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          borderRadius: 10,
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#ddd',
        }}>
        <Image
          style={{
            height: 60,
            width: 60,
            resizeMode: 'cover',
            borderRadius: 10,
            alignSelf:'center',
          }}
          source={{uri: item?.vendor?.shop_cover_image}}
        />
        <View style={{padding: 10, flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{width: '60%'}}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  color: config.colors.Black,
                  fontSize: 15,
                }}>
                {item?.transactionID}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  color: config.colors.Gray,
                  fontSize: 12,
                  textAlign:'left',
                }}>
                {moment(item?.createdAt).format('hh:mm A - DD/MM/YYYY')}
              </Text>
            </View>
            <Text
              style={[
                styles.headingText,
                {
                  color: item?.type == 'withdraw' ? 'green' : config.colors.red,
                },
              ]}>
              {'+'}{item?.amount}
              {' SAR'}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Gray,
              fontSize: 12,
              marginTop: 8,
            }}>
            {t('Account Number')}
          </Text>
          <View style={{flexDirection:'row',justifyContent:'space-between'
        ,alignItems:'center',
        }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              color: config.colors.Black,
              fontSize: 14,
            }}>
            {item?.vendor?.bank_account_num}
          </Text>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              alignSelf: 'flex-end',
            }}
            source={require('../../assets/images/bankIcon.png')}
          />
          </View>



        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('My Withdrawals')}
      />
      <ImageBackground
        source={require('../../assets/images/earningBack.png')}
        style={{height: 180, justifyContent: 'center'}}
        resizeMode="stretch"
       >
        <View style={{marginLeft: 40}}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              color: config.colors.white,
              fontSize: 14,
              textAlign:'left',
            }}>
            {t('Bank Transferred')}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              color: config.colors.white,
              fontSize: 22,
              marginTop: 15,
              textAlign:'left',
            }}>
            {withdrawalAmount}{' SAR'}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              color: config.colors.white,
              fontSize: 12,
              marginTop: 5,
              textAlign:'left',
            }}>
            {t('Last transaction on')}{' '}{moment(
              WithdrawListingResponse?.results?.transaction[0]?.createdAt
            ).format('DD MMM YYYY')}
          </Text>
        </View>
      </ImageBackground>

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
        <Text style={styles.addService}>{t('Earnings Transactions')}</Text>

        <TouchableOpacity activeOpacity={0.8} onPress={() => refRBSheetCalender.current.open()}>
          <Image
            style={{height: 25, width: 25, resizeMode: 'contain'}}
            source={require('../../assets/images/calender.png')}
          />
        </TouchableOpacity>
      </View>
      {WithdrawListingResponse?.results?.transaction?.length > 0 ? (
        <View style={{flex: 1, margin: 15}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            renderItem={renderTransactionItem}
            data={WithdrawListingResponse?.results?.transaction}
          />
        </View>
      ) : (
        <View style={styles.mainCss}>
          <Text style={styles.addService}>
            {t('No Transaction Found')}
          </Text>

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
            height:'60%',
          },
        }}>
       <DateRangePicker
      confirmBtnTitle={'Confirm'}
          onSelectDateRange={(range) => {
            setDateRange(range);
          }}
          onConfirm={()=>{console.log('dateRange', dateRange);
          getWithdrawListing();
          refRBSheetCalender.current.close();
        }}
          blockSingleDateSelection={true}
          responseFormat="YYYY-MM-DD"
          maxDate={moment()}

          selectedDateContainerStyle={styles.selectedDateContainerStyle}
          selectedDateStyle={styles.selectedDateStyle}
        />
      </RBSheet>
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
    marginTop: 20,
  },
  addService: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  coverImgCss: {
    height: 150,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9E9E9E4D',
    backgroundColor: '#C0C0C01A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginVertical: 15,
  },
  PlussIcon: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  uploadText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Gray,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  labelText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Gray,
    fontSize: 14,
  },
  headingText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 15,
    textAlign:'left',
  },
  selectedDateContainerStyle: {

    backgroundColor: config.colors.buttonColor,
    padding:10,
    borderRadius:10,
  },
  selectedDateStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MyWithdrawals;
