import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';

import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {GetMyBookingsReducer} from '../../redux/reducers';
import moment from 'moment';

const SearchBooking = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetMyBookingsResponse = useSelector(
    GetMyBookingsReducer.selectGetMyBookingsData,
  );
  console.log('GetMyBookingsResponse', JSON.stringify(GetMyBookingsResponse));
  const [search_text, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (GetMyBookingsResponse != null) {
      if (GetMyBookingsResponse?.error == false) {
        if (search_text != '') {
          setSearchResults(GetMyBookingsResponse?.results?.bookings);
          if (GetMyBookingsResponse?.results?.bookings.length == 0) {
            Toast.show(t('No Result Found!'), Toast.LONG);
          }
        } else {
        }
      }
    }
  }, [GetMyBookingsResponse]);

  const getSearchSuggestion = val => {
    if (val != '') {
      dispatch({type: SagaActions.GET_MY_BOOKINGS, payload: {search: val}});
    } else {
      setSearchResults([]);
    }
    setSearchText(val);
  };
  const renderItem = ({item, index}) => {
    console.log('GET_MY_BOOKINGS', item);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(config.routes.BOOKING_DETAILS, {
            booking_id: item?._id,
          })
        }
        key={index}
        style={styles.bookingMainCss}>
        <View style={styles.idCss}>
          <View>
            <Text style={styles.idText}>
              {t('Booking ID: #')}
              {item.bookingID}
            </Text>
            <Text style={styles.dateText}>
              {moment(item.event_start_date).format('MMM DD, YYYY')}
              {' | '}
              {item?.event_start_time}
            </Text>
            <Text style={styles.dateText}>
              {moment(item.event_end_date).format('MMM DD, YYYY')}
              {' | '}
              {item?.event_end_time}
            </Text>
          </View>
          <View
            style={[
              styles.bookingButton,
              {backgroundColor: item.isFinished ? '#0D605533' : '#4F74B033'},
            ]}
            // onPress={() => {
            //   navigation.navigate(config.routes.BOOKING_DETAILS,{OngoingData:'ongoing'});
            // }}
          >
            <Text
              style={[
                styles.bookingstart,
                {color: item.isFinished ? '#0D6055' : '#4F74B0'},
              ]}>
              {item.isFinished ? 'Completed' : 'OTP: ' + item.otp}
            </Text>
          </View>
        </View>

        <View style={styles.idCss}>
          <View>
            <Text style={styles.dateText}>{t('Vendor Name')}</Text>
            <Text style={styles.idText}>{item.vendor.full_name}</Text>
          </View>
          <View>
            <Text style={styles.dateText}>{t('Booking Amount')}</Text>
            <Text style={styles.bookingAmoutText}>
              {'SAR: '}
              {item.total}
            </Text>
          </View>
        </View>
        <View style={styles.idCss}>
          <View>
            <Text style={styles.dateText}>{t('Booking Items')}</Text>
            <View style={styles.dotCss}>
              {item.services?.map((s, i) => {
                return (
                  <View style={[styles.dotCss, {marginLeft: 5}]}>
                    <View style={styles.dot} />
                    <Text style={styles.idText}>
                      {s.quantity}
                      {' X '}
                      {I18nManager.isRTL
                        ? s.service?.name_ar
                        : s.service?.name_en}
                    </Text>
                    {s.isCombo && (
                      <Text style={styles.dateText}>{'(Combo)'}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.infoCss}>
          <Image
            resizeMode="contain"
            style={styles.infoIcon}
            source={require('../../assets/images/Info.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('Search')}
      />

      <View style={styles.inputCss}>
        <Image
          style={styles.searchIcon}
          source={require('../../assets/images/Search2.png')}
        />
        <TextInput
          style={styles.input}
          placeholder={t('Search Your Bookings')}
          placeholderTextColor={config.colors.Gray}
          onChangeText={val => getSearchSuggestion(val)}
          value={search_text}
        />
      </View>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 10}}
        keyboardShouldPersistTaps={'handled'}
        renderItem={renderItem}
        data={searchResults}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  inputCss: {
    borderWidth: 0.3,
    height: 50,
    borderColor: '#7070701A',
    elevation: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 0,
    backgroundColor: config.colors.white,
    marginTop: 10,
  },
  searchIcon: {
    height: 20,
    width: 19,
    marginHorizontal: 15,
    // borderRightWidth
  },
  input: {
    borderLeftWidth: I18nManager.isRTL ? 0 : 1,
    borderRightWidth: I18nManager.isRTL ? 1 : 0,
    height: 37,
    borderColor: '#E35829',
    paddingHorizontal: 10,
    color: config.colors.Gray,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  LastsearchedCss: {
    marginHorizontal: 12,
  },
  LastsearchedText: {
    fontSize: 14,
    color: config.colors.Gray,
    fontFamily: config.fonts.Poppins_Regular,
    marginTop: 20,
  },
  servicCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  decoretionCss: {
    backgroundColor: '#F1F2F6',
    height: 32,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 5,
  },
  decoretionText: {
    fontSize: 14,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
  },
  cakeCss: {
    backgroundColor: '#F1F2F6',
    height: 32,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mostsearchText: {
    fontSize: 18,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginLeft: 12,
    marginVertical: 10,
  },
  FlatlistCss: {
    backgroundColor: '#fff',
    elevation: 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    // margin: 12,
    marginHorizontal: 10,
  },
  decorImg: {
    height: 99,
    width: 117,
  },
  PartyDecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  NotificationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DecorationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Gray,
    fontSize: 10,
    marginLeft: 5,
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  StarImg: {
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
  ratingText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#474747',
    fontSize: 10,
    marginRight: 10,
    top: 1,
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
});

export default SearchBooking;
