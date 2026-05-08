import moment from 'moment/moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  I18nManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {GetSupportReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';

const Tickets = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetSupportResponse = useSelector(
    GetSupportReducer.selectGetSupportData,
  );

  useEffect(() => {
    dispatch({type: SagaActions.GET_SUPPORT, payload: ''});
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.flatlistCss}
        onPress={() => {
          navigation.navigate(config.routes.CHAT_SCREEN, {
            ticket_id: item?._id,
          });
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              fontSize: 14,
              lineHeight: 26,
              marginTop: 10,
            }}>
            {`${t('Request Details Num')}\n #${item?._id}`}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.button,
              {backgroundColor: item.status ? '#2CD147' : '#F4F4F7'},
            ]}>
            <Text
              style={[
                styles.activeText,
                {color: item.status ? '#fff' : '#ABABB6'},
              ]}>
              {item.status ? t('Active') : t('Closed')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Gray,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {`${t('Request Type')}`}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Black,
            marginTop: 5,
            textAlign: 'left',
          }}>
          {`${t(item?.requestType) ?? t('Others')}`}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Gray,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {`${t('Request Date')}`}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Black,
            marginTop: 5,
            textAlign: 'left',
          }}>
          {moment(item?.createdAt).format('MMM DD YYYY hh:mm a')}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Gray,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {`${t('Service Detail')}`}
        </Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 24,
              height: 24,
              resizeMode: 'cover',
              borderRadius: 20,
            }}
            borderRadius={20}
            resizeMode="cover"
            source={{uri: item?.service?.images[0]}}
          />
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 12,
              lineHeight: 18,
              color: config.colors.Black,
              marginHorizontal: 6,
              textAlign: 'left',
            }}>
            {I18nManager.isRTL ? item.service.name_ar : item.service.name_en}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Gray,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {`${t('Subject')}`}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Black,
            marginTop: 5,
            textAlign: 'left',
          }}>
          {item.subject}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Gray,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {`${t('Description')}`}
        </Text>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 12,
            lineHeight: 18,
            color: config.colors.Black,
            marginTop: 5,
            textAlign: 'left',
          }}>
          {item.concern}
        </Text>
        {item?.images?.length > 0 && (
          <View>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 14,
                lineHeight: 22,
                color: config.colors.Black,
                marginTop: 10,
              }}>
              {`${t('Attach images')}`}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
              {item?.images?.map((img, i) => {
                {
                  return (
                    <TouchableOpacity key={i} activeOpacity={0.5}>
                      <Image
                        style={{
                          marginRight: 12,
                          height: 100,
                          width: 100,
                          resizeMode: 'cover',
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                        borderRadius={12}
                        source={{uri: img}}
                      />
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </View>
        )}
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
          title={t('My Complaints/Inquiry')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <View style={styles.mainCss}>
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={GetSupportResponse?.results?.support}
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
    fontSize: 15,
    textAlign: 'left',
  },
  ticketText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 9,
    textAlign: 'left',
  },
  dateTimeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#ACADB7',
    fontSize: 11,
  },
  button: {
    backgroundColor: '#2CD147',
    height: 25,
    width: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 11.5,
  },
  buttonCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Tickets;
