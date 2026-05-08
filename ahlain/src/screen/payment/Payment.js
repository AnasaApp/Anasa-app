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
  I18nManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {GetMyCartReducer, RateServiceReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
const Payment = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const RateServiceResponse = useSelector(
    RateServiceReducer.selectRateServiceData,
  );

  const refRBSheet = useRef();

  const [ratingLength, setRatingLength] = useState(['1', '2', '3', '4', '5']);
  const [ratingCount, setRatingCount] = useState(1);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (RateServiceResponse != null) {
      if (RateServiceResponse?.error == false) {
        Toast.show(RateServiceResponse?.message, Toast.LONG);

        navigation.navigate(config.routes.HOME_SCREEN);
        dispatch(RateServiceReducer.removeRateServiceResponse());
      }
    }
  }, [RateServiceResponse]);
  const onPressRateUs = () => {
    // if (feedback == '') {
    //   return Toast.show('Please enter feedback', Toast.LONG);
    // }
    refRBSheet.current.close();
    const payload = {
      serviceId: route?.params?.service_id,
      rating: ratingCount,
      feedback: feedback,
    };
    dispatch({type: SagaActions.RATE_SERVICE, payload});
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
          title={t('Booking Status')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <View style={styles.firstImgCss}>
            <Image
              resizeMode="contain"
              style={styles.paymentImg}
              source={require('../../assets/images/payment.png')}
            />
          </View>
          <View style={styles.secondCss}>
            <Text style={styles.successfullText}>
              {t('Your booking is successful')}
            </Text>
            <Text style={styles.thankuText}>
              {t('Thank you for shopping with us!')}
            </Text>
            <Text style={styles.thankuText}>{t('Anasa party!')}</Text>
            {route?.params?.CheckoutCartResponse?.results?.myBooking?.services?.map(
              (item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      flexDirection: 'row',
                      borderRadius: 6,
                      borderColor: '#E2E3E5',
                      marginBottom: 10,
                    }}>
                    <Image
                      style={{
                        width: 45,
                        height: 45,
                        resizeMode: 'cover',
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                      source={{uri: item?.service?.images[0]}}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text
                        style={{
                          fontFamily: config.fonts.Poppins_Medium,
                          color: config.colors.Light_Black,
                          fontSize: 13,
                        }}>
                        {I18nManager.isRTL
                          ? item?.service?.name_ar
                          : item?.service?.name_en}
                      </Text>
                      {!item?.isCombo && (
                        <Text
                          style={{
                            fontFamily: config.fonts.Poppins_Medium,
                            color: config.colors.Gray,
                            fontSize: 12,
                          }}>
                          {item?.price}
                          {' SAR'}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              },
            )}

            <View
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 6,
                borderColor: '#E2E3E5',
                marginBottom: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  resizeMode="contain"
                  style={{width: 12, height: 12, resizeMode: 'contain'}}
                  source={require('../../assets/images/Location.png')}
                />
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    color: config.colors.Gray,
                    fontSize: 10,
                    marginHorizontal: 5,
                  }}>
                  {t('Delivering To')}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  color: config.colors.Light_Black,
                  fontSize: 13,
                  width: '90%',
                }}>
                {
                  route?.params?.CheckoutCartResponse?.results?.myBooking
                    ?.event_location?.house_number
                }{' '}
                {
                  route?.params?.CheckoutCartResponse?.results?.myBooking
                    ?.event_location?.building_name
                }{' '}
                {
                  route?.params?.CheckoutCartResponse?.results?.myBooking
                    ?.event_location?.locality
                }{' '}
                {
                  route?.params?.CheckoutCartResponse?.results?.myBooking
                    ?.event_location?.city
                }{' '}
                {
                  route?.params?.CheckoutCartResponse?.results?.myBooking
                    ?.event_location?.country
                }{' '}
              </Text>
            </View>

            <View style={styles.clickhereCss}>
              <Text style={styles.clickhere}>
                {t('To see the complete booking details')}{' '}
              </Text>
              <TouchableOpacity activeOpacity={0.5}>
                <Text
                  onPress={() => {
                    navigation.navigate(config.routes.MY_BOOKINGS);
                  }}
                  style={[styles.clickhere, {color: '#00B355'}]}>
                  {t('click here')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <AppButton
        text={t('Back To Home')}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{name: config.routes.HOME_SCREEN}],
          });
        }}
        buttonStyle={{marginHorizontal: 15}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    paddingBottom: 10,
  },
  firstImgCss: {
    height: Dimensions.get('window').height / 3,
    justifyContent: 'center',
  },
  paymentImg: {
    height: 222,
    width: 227,
    alignSelf: 'center',
  },
  secondCss: {
    marginHorizontal: 15,
  },
  successfullText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#00B355',
    fontSize: 18,
    textAlign: 'center',
  },
  thankuText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 23,
    // marginTop: 10,
    marginVertical: 10,
  },
  clickhereCss: {
    backgroundColor: '#E2E3E5',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  clickhere: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Light_Black,
    fontSize: 13,
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
  },
});

export default Payment;
