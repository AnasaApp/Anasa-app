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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {GetRequestReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import {useFocusEffect} from '@react-navigation/native';

const ServiceRequest = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetRequestResponse = useSelector(
    GetRequestReducer.selectGetRequestData,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch({type: SagaActions.GET_REQUEST, payload: {temp: ''}});
    }, []),
  );

  const renderItem = ({item}) => {
    console.log('item', item);
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.flatlistCss}
        onPress={() => {
          navigation.navigate(config.routes.CREATE_SERVICE_REQUEST, {
            request_id: item?._id,
          });
        }}>
        <Text style={styles.ticketText}>{item.eventName}</Text>
        <Text style={styles.issueText}>
          <Image
            style={{width: 10, height: 12, tintColor: config.colors.Gray}}
            resizeMode="contain"
            source={require('../../assets/images/Location.png')}
          />{' '}
          {item.event_location?.city}
          {', '}
          {item.event_location?.country}
        </Text>
        <View style={styles.buttonCss}>
          <Text style={styles.dateTimeText}>
            {moment(item.createdAt).format('MMM DD YYYY hh:mm a')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.button,
              {
                backgroundColor:
                  item.status == 'Pending' ? '#2CD147' : '#F4F4F7',
              },
            ]}>
            <Text
              style={[
                styles.activeText,
                {color: item.status == 'Pending' ? '#fff' : '#ABABB6'},
              ]}>
              {item.status == 'Pending' || item.status == 'ReadyForPayment'
                ? t('Pending')
                : t(item.status)}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('Service Request')}
      />

      <View style={styles.mainCss}>
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={GetRequestResponse?.results?.events}
        />
      </View>
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
