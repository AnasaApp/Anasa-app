import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import AppButton from '../../conponents/AppButton';
import {useState} from 'react';
import moment from 'moment';
import {RateServiceReducer} from '../../redux/reducers';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {SagaActions} from '../../redux/sagas/SagaActions';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const BillDetails = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const viewShot = React.useRef();

  const dispatch = useDispatch();

  const [bookingDetail, setBookingDetail] = useState(
    route?.params?.bookingDetail,
  );

  const [captureImage, setCaptureImage] = useState('');
  console.log('route?.params?.bookingDetail', route?.params?.bookingDetail);
  let totalAnasaService = 0;

  const captureAndShareScreenshot = () => {
    viewShot.current.capture().then(uri => {
      console.log('do something with ', uri);
      setCaptureImage(uri);
      Share.open({
        title: 'Invoice',
        message: ':',
        url: uri,
        subject: bookingDetail?.bookingID,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    }),
      error => console.error('Oops, snapshot failed', error);
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
          title={t('Anasa App Invoice')}
          rightimg={require('../../assets/images/share_icon.png')}
          rightImageStyle={{
            width: 30,
            height: 20,
            resizeMode: 'contain',
            tintColor: config.colors.white,
          }}
          onRightPress={() => captureAndShareScreenshot()}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShot} options={{format: 'jpg', quality: 0.9}}>
          <View style={styles.mainCss}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  resizeMode: 'cover',
                }}
                source={require('../../assets/images/anasaLogo.png')}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.Black,
                  marginTop: 10,
                  textAlign: 'left',
                }}>
                {t('Ash Sharqiyah ,Dhahran,Saudi Arabai')}
              </Text>
            </View>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E2E3E5',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={styles.bookingId}>{'رقم الفاتوره'}</Text>
                  <Text style={styles.bookingId}>{'Invoice number'}</Text>
                </View>

                <Text style={styles.bookingId}>{bookingDetail?.bookingID}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Text style={styles.bookingId}>{'التاريخ و الوقت'}</Text>
                  <Text style={styles.bookingId}>{'Date & Time'}</Text>
                </View>
                <View style={{width: '60%', alignItems: 'flex-end'}}>
                  <Text style={[styles.bookingId, {fontSize: 12}]}>
                    {moment(bookingDetail?.event_start_date).format(
                      'MMM DD, YYYY',
                    )}
                    {' | '}
                    {bookingDetail?.event_start_time}
                    {' - '}
                    {moment(bookingDetail?.event_end_date).format(
                      'MMM DD, YYYY',
                    )}
                    {' | '}
                    {bookingDetail?.event_end_time}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E2E3E5',
              }}>
              <View>
                <Text style={styles.bookingId}>
                  {'تفاصيل المناسبة'} {' (Event Details)'}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text style={styles.bookingId}>
                  {bookingDetail?.event_name}
                </Text>
                <Text style={[styles.dateTime, {width: '90%'}]}>
                  {bookingDetail?.event_location?.house_number}{' '}
                  {bookingDetail?.event_location?.building_name}{' '}
                  {bookingDetail?.event_location?.locality}{' '}
                  {bookingDetail?.event_location?.city}{' '}
                  {bookingDetail?.event_location?.country}{' '}
                </Text>
              </View>
            </View>

            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E2E3E5',
              }}>
              {/* <Text style={styles.servicetext}>{t('Bill Detail')}</Text>
              <View style={styles.cakeMainCss}>
                {bookingDetail?.services?.map((item, index) => {
                  return (
                    <View key={index} style={styles.cakeCss}>
                      <View>
                        <Text style={styles.bookingId}>
                          {I18nManager.isRTL
                            ? item?.service?.name_ar
                            : item?.service?.name_en}
                        </Text>
                        <Text
                          style={
                            styles.dateTime
                          }>{`${item?.quantity} x SAR : ${item?.price}`}</Text>
                      </View>
                      <Text
                        style={[
                          styles.dateTime,
                          {fontSize: 14},
                        ]}>{`SAR: ${item?.price}`}</Text>
                    </View>
                  );
                })}
              </View> */}
              <View>
                <Text style={styles.bookingId}>
                  {'تفاصيل الفاتورة'}
                  {' (Bill Detail)'}
                </Text>
              </View>
              <View style={styles.cakeMainCss}>
                {bookingDetail?.services?.map((item, index) => {
                  totalAnasaService =
                    totalAnasaService +
                    item?.quantity *
                      item?.price *
                      (bookingDetail?.vendor?.commission / 100);
                  return (
                    <View key={index}>
                      {/* <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text style={styles.bookingId}>
                            {`${item?.service?.name_ar}`}
                          </Text>
                          <Text style={styles.bookingId}>
                            {`${item?.service?.name_en}`}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.dateTime,
                            {fontSize: 14},
                          ]}>{`SAR: ${item?.price}`}</Text>
                      </View> */}
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
                          <Text style={styles.bookingId}>
                            {`${'خدمات تطبيق أناسة'} ${item?.service?.name_ar}`}
                          </Text>
                          <Text style={styles.bookingId}>
                            {`${'Anasa App Service For'} ${
                              item?.service?.name_en
                            }`}
                          </Text>
                        </View>
                        <Text
                          style={[styles.dateTime, {fontSize: 14}]}>{`SAR: ${(
                          item?.price *
                          (bookingDetail?.vendor?.commission / 100)
                        )?.toFixed(2)}`}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#E2E3E5',
              }}>
              <View style={styles.cakeCss}>
                <View>
                  <Text style={styles.bookingId}>{'تكلفة التوصيل'}</Text>
                  <Text style={styles.bookingId}>{'Shipping Cost'}</Text>
                </View>
                <Text
                  style={
                    styles.bookingId
                  }>{`SAR : ${bookingDetail?.shippingCost}`}</Text>
              </View>
              <View style={styles.cakeCss}>
                <View>
                  <Text style={styles.bookingId}>{'خصم'}</Text>
                  <Text style={styles.bookingId}>{'Discount'}</Text>
                </View>
                <Text
                  style={
                    styles.bookingId
                  }>{`SAR : ${bookingDetail?.discount}`}</Text>
              </View>
              <View style={styles.cakeCss}>
                <View>
                  <Text style={styles.bookingId}>{'المبلغ الاجمالي'}</Text>
                  <Text style={styles.bookingId}>{'Total Amount'}</Text>
                </View>
                {/* <Text style={styles.bookingId}>{`SAR :  ${
                  bookingDetail?.isCombo
                    ? bookingDetail?.comboPrice
                    : bookingDetail.total
                }`}</Text> */}
                <Text
                  style={styles.bookingId}>{`SAR : ${totalAnasaService?.toFixed(
                  2,
                )}`}</Text>
              </View>
              {/* <View style={styles.cakeCss}>
                <Text style={styles.bookingId}>{t('Discount')}</Text>
                <Text
                  style={
                    styles.bookingId
                  }>{`SAR : ${bookingDetail?.discount}`}</Text>
              </View>
              <View style={styles.cakeCss}>
                <Text style={styles.bookingId}>{t('Total Amount Paid')}</Text>
                <Text
                  style={
                    styles.bookingId
                  }>{`SAR : ${bookingDetail?.vendor?.commission}`}</Text>
              </View> */}
              {/* <Text style={styles.dateTime}>
                {t('Prices are 15% VAT inclusive')}
              </Text> */}
            </View>
          </View>
        </ViewShot>
      </ScrollView>
      <View style={[styles.buttonMainCss, {margin: 15}]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(config.routes.RAISE_TICKET, {
              bookingDetail: bookingDetail,
            })
          }
          activeOpacity={0.5}
          style={styles.buttonCss}>
          <Text style={styles.buttonText}>{t('Raise Complaint')}</Text>
        </TouchableOpacity>
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
    backgroundColor: config.colors.white,
    elevation: 1,
    borderRadius: 10,
  },
  thanktext: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.buttonColor,
    marginVertical: 15,
    textAlign: 'left',
  },
  idMianCss: {
    backgroundColor: config.colors.white,
    height: 70,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  bookingId: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    textAlign: 'left',
  },
  dateTime: {
    fontSize: 12,
    fontFamily: config.fonts.Poppins_Medium,
    color: '#888888',
    textAlign: 'left',
  },
  amoutCss: {
    alignItems: 'flex-end',
  },
  servicetext: {
    fontSize: 16,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    marginTop: 20,
    textAlign: 'left',
  },
  khanmainCss: {
    backgroundColor: config.colors.white,
    height: 65,
    borderRadius: 10,
    elevation: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  decorImg: {
    height: 57,
    width: 57,
  },
  khanCss: {
    marginLeft: 10,
  },
  khantext: {
    fontSize: 15,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    textAlign: 'left',
  },
  locationImg: {
    height: 12,
    width: 12,
    marginBottom: 2,
  },
  locationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cakeMainCss: {
    backgroundColor: config.colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cakeCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  buttonMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonCss: {
    backgroundColor: '#E35829',
    width: '100%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
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
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
});

export default BillDetails;
