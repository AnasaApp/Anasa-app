import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {TopRatedReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
const TopRated = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const TopRatedResponse = useSelector(TopRatedReducer.selectTopRatedData);

  console.log('TopRatedResponse', TopRatedResponse);

  useEffect(() => {
    dispatch({type: SagaActions.TOP_RATED, payload: ''});
  }, []);
  const getReviewStarRatingView = rating => {
    let view = [];
    for (let index = 0; index < rating; index++) {
      view.push(
        <Image
          style={styles.startIcon}
          resizeMode="contain"
          source={require('../../assets/images/start.png')}
        />,
      );
    }
    return view;
  };
  const renderItem = ({item, index}) => {
    item = item?.vendor;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() =>
          navigation.navigate(config.routes.VENDOR_DETAILS, {
            vendor_id: item?._id,
          })
        }>
        <View style={styles.FlatlistCss}>
          <Image
            style={styles.decorImg}
            resizeMode="cover"
            source={{uri: item?.shop_cover_image}}
          />
          <Text style={styles.PartyDecorText}>{item?.shop_name}</Text>
          <View style={styles.starCss}>
            <Text
              numberOfLines={1}
              style={[styles.DecorationText, {width: '60%'}]}>
              {item?.building_name}
            </Text>
            <View style={[styles.NotificationCss, {marginRight: 5}]}>
              <Image
                style={styles.startIcon}
                resizeMode="contain"
                source={require('../../assets/images/start.png')}
              />
              <Text style={styles.ratingText}>
                {item?.rating}
                {'/5'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title={t('New Vendors')}
      />

      <View style={styles.flatlistCss}>
        <FlatList
          data={
            route?.params?.fromData
              ? route?.params?.fromData
              : TopRatedResponse?.results?.vendor
          }
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          // horizontal={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  NotificationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatlistCss: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  cakeCss: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 10,
  },
  cakeImg: {
    height: 95,
    width: 95,
  },
  cakeText: {
    fontSize: 14,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: 7,
  },
  FlatlistCss: {
    backgroundColor: '#fff',
    elevation: 0.5,
    borderRadius: 10,
    margin: 12,
    width: Dimensions.get('window').width / 2.4,
    overflow: 'hidden',
  },
  decorImg: {
    height: 140,
    width: '100%',
  },
  PartyDecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
    textAlign: 'left',
  },
  DecorationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Gray,
    fontSize: 11,
    marginLeft: 5,
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  StarImg: {
    height: 12,
    width: 12,
    marginHorizontal: 5,
  },
  ratingText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#474747',
    fontSize: 12,
    marginRight: 10,
    top: 2,
  },
  startIcon: {
    width: 10,
    height: 10,
    marginHorizontal: 1,
  },
});

export default TopRated;
