import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Button,
  Animated,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  DeleteAllNotificationReducer,
  DeleteNotificationReducer,
  GetNotificationListReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import moment from 'moment';
import {Swipeable} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
const Notification = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetNotificationListResponse = useSelector(
    GetNotificationListReducer.selectGetNotificationListData,
  );
  const DeleteNotificationResposne = useSelector(
    DeleteNotificationReducer.selectDeleteNotificationData,
  );
  const DeleteAllNotificationtResponse = useSelector(
    DeleteAllNotificationReducer.selectDeleteAllNotificationData,
  );

  console.log('DeleteAllNotificationtResponse', DeleteAllNotificationtResponse);
  let row = [];
  let prevOpenedRow;
  useEffect(() => {
    dispatch(GetNotificationListReducer.removeGetNotificationListResponse());
    dispatch({type: SagaActions.GET_NOTIFICATION_LIST, payload: ''});
    AsyncStorage.removeItem('notification_status');
  }, []);

  useEffect(() => {
    if (DeleteNotificationResposne != null) {
      if (DeleteNotificationResposne?.error == false) {
        Toast.show(DeleteNotificationResposne?.message, Toast.LONG);

        dispatch({type: SagaActions.GET_NOTIFICATION_LIST, payload: ''});

        dispatch(DeleteNotificationReducer.removeDeleteNotificationResponse());
      }
    }
  }, [DeleteNotificationResposne]);
  useEffect(() => {
    if (DeleteAllNotificationtResponse != null) {
      if (DeleteAllNotificationtResponse?.error == false) {
        Toast.show(DeleteAllNotificationtResponse?.message, Toast.LONG);

        dispatch({type: SagaActions.GET_NOTIFICATION_LIST, payload: ''});

        dispatch(
          DeleteAllNotificationReducer.removeDeleteAllNotificationResponse(),
        );
      }
    }
  }, [DeleteAllNotificationtResponse]);
  const onDeleteNotificationApi = id => {
    const payload = {
      uri: '/' + id,
    };
    dispatch({type: SagaActions.DELETE_NOTIFICATION, payload});
  };
  const onDeleteAllNotificationApi = () => {
    dispatch({type: SagaActions.DELETE_ALL_NOTIFICATION, payload: ''});
  };

  const renderItem = ({item, index}) => {
    const closeRow = index => {
      console.log('closerow');
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });
      return (
        <TouchableOpacity
          onPress={() => onDeleteNotificationApi(item?._id)}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            elevation: 2,
            alignSelf: 'center',
            marginHorizontal: 5,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: config.colors.red,
          }}
          activeOpacity={0.8}>
          <Image
            style={{height: 35, width: 35, tintColor: '#fff'}}
            source={require('../../assets/images/delet.png')}
          />
        </TouchableOpacity>
      );
    };

    let day = moment(item.createdAt).calendar().split(' ')[0];
    if (day == 'Last') {
      day = moment(item.createdAt).format('L');
    }
    let previousDay = '';
    if (
      GetNotificationListResponse?.results?.notifications[index - 1]?.createdAt
    ) {
      previousDay = moment(
        GetNotificationListResponse?.results?.notifications[index - 1]
          ?.createdAt,
      )
        .calendar()
        .split(' ')[0];
      if (previousDay == 'Last') {
        previousDay = moment(
          GetNotificationListResponse?.results?.notifications[index - 1]
            ?.createdAt,
        ).format('L');
      }
    } else {
    }

    return (
      <>
        {day != previousDay && <Text style={styles.todayText}>{day}</Text>}
        <Swipeable
          containerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: '#ECECEC',
            paddingBottom: 5,
          }}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={ref => (row[index] = ref)}
          rightOpenValue={-100}>
          <View style={styles.FlatlistCss} key={index}>
            <View style={styles.bellIconCss}>
              <Image
                style={styles.bellIcon}
                resizeMode="contain"
                source={
                  index % 2 == 0
                    ? require('../../assets/images/notificationYello.png')
                    : require('../../assets/images/notificationBlue.png')
                }
              />
            </View>
            <View style={styles.bookingCss}>
              <Text style={styles.bookingText}>
                {I18nManager?.isRTL
                  ? item?.description_ar
                  : item.description_en}
              </Text>
              <TouchableOpacity activeOpacity={0.5}>
                <Text
                  style={styles.seeText}
                  onPress={() => {
                    navigation.navigate(config.routes.BOOKING_DETAILS, {
                      booking_id: item.id,
                    });
                  }}>
                  {t('See Order Details')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timeCss}>
            <Image
              style={styles.timeIcon}
              resizeMode="contain"
              source={item.timeIcon}
            />
            <Text style={styles.timeext}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </View>
        </Swipeable>
      </>
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
          title={t('Notifications')}
          backgroundColor={config.colors.orangeColor}
          rightimg={require('../../assets/images/delet.png')}
          onRightPress={() => onDeleteAllNotificationApi()}
          rightImageStyle={{
            tintColor: config.colors.white,
          }}
        />
      </View>

      <View style={styles.mainCss}>
        {GetNotificationListResponse?.results?.notifications.length > 0 ? (
          <FlatList
            data={GetNotificationListResponse?.results?.notifications}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              color: config.colors.Light_Black,
              fontSize: 14,
              margin: 20,
              alignSelf: 'center',
            }}>
            {t('No Data Found!')}
          </Text>
        )}
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
    marginHorizontal: 10,
    flex: 1,
  },
  todayText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 18,
    textAlign: 'left',
  },
  FlatlistCss: {
    flexDirection: 'row',
    width: wp('100%'),

    marginTop: 10,
    paddingHorizontal: 10,
  },
  bellIconCss: {
    width: '10%',
    marginTop: 2,
  },
  bellIcon: {
    height: 35,
    width: 35,
  },
  bookingCss: {
    width: '70%',
    marginLeft: 10,
  },
  bookingText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Light_Black,
    fontSize: 13,
    textAlign: 'left',
  },
  seeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.buttonColor,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'left',
  },
  timeCss: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  timeIcon: {
    height: 12,
    width: 12,
    tintColor: '#BEBFC3',
    marginBottom: 3,
  },
  timeext: {
    fontFamily: config.fonts.Poppins_Regular,
    color: '#BEBFC3',
    fontSize: 10,
    // paddingTop:5,
    marginHorizontal: 3,
  },
});

export default Notification;
