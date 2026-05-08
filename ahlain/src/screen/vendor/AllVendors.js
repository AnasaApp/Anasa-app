import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  I18nManager,
  Image,
} from 'react-native';

import config from '../../config';
import {useDispatch, useSelector} from 'react-redux';

import {useTranslation} from 'react-i18next';

import FooterComponent from '../../conponents/FooterComponent';
import {AppButton, AppHeader, AppTextInput} from '../../conponents';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useIsFocused} from '@react-navigation/native';
import {GetAllVendorsReducer} from '../../redux/reducers';
import {debounce} from 'lodash';
import {goToLogin} from '../../conponents/NavigationRef';

const AllVendors = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const GetAllVendorsResponse = useSelector(
    GetAllVendorsReducer.selectGetAllVendorsData,
  );

  const [searchText, setSearchText] = useState('');
  const [selectedVendorType, setSelectedVendorType] = useState('all');
  const [vendorList, setVendorList] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const vendorTypeList = [
    {
      key: 'all',
      name: 'All Vendors',
    },
    {
      key: 'top_vendor',
      name: 'Top Vendors',
    },
    {
      key: 'new_vendor',
      name: 'New Vendors',
    },
  ];
  const isFocused = useIsFocused();

  //hooks calling
  useEffect(() => {
    if (GetAllVendorsResponse != null && isFocused) {
      if (GetAllVendorsResponse?.error == false) {
        console.log('GetAllVendorsResponse', GetAllVendorsResponse);
        setVendorList(GetAllVendorsResponse?.results?.vendors);
        dispatch(GetAllVendorsReducer.removeGetAllVendorsResponse());
      }
    }
  }, [GetAllVendorsResponse]);
  //api calling
  useEffect(() => {
    checkUserLoggedIn();
    callAllVendorsApi('', selectedVendorType);
  }, []);
  //function calling
  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    setUserLoggedIn(result);
    if (result == true) {
    } else {
    }
  };
  const callAllVendorsApi = (search, type) => {
    const payload = {
      type: type == 'all' ? '' : type,
      search: search,
    };
    dispatch({type: SagaActions.GET_ALL_VENDORS, payload});
  };
  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      callAllVendorsApi(text, selectedVendorType);
    }, 500),
    [],
  );

  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          width: '50%',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          key={index}
          onPress={() =>
            navigation.push(config.routes.VENDOR_DETAILS, {
              vendor_id: item?._id,
            })
          }
          style={{
            marginLeft: I18nManager?.isRTL ? 15 : 0,
            marginRight: I18nManager?.isRTL ? 0 : 15,
            backgroundColor: config.colors.white,
            borderRadius: 12,
            paddingBottom: 10,
            marginBottom: 15,
          }}>
          <Image
            style={{
              height: 130,
              width: '100%',
              resizeMode: 'stretch',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            source={{uri: item?.shop_cover_image}}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 14,
                color: config.colors.Black,
                textTransform: 'capitalize',
                flex: 1,
                textAlign: 'left',
              }}>
              {I18nManager?.isRTL ? item?.shop_name_ar : item?.shop_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                resizeMode="contain"
                source={require('../../assets/images/start.png')}
              />
              <Text style={styles.ratingText}>
                {item?.rating}
                {'/5'}
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 14,
              color: config.colors.orangeColor,
              textTransform: 'capitalize',
              textAlign: 'left',
              marginHorizontal: 10,
              marginTop: 5,
            }}>
            {I18nManager?.isRTL ? item?.city_ar : item?.city}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
          title={t('Vendors')}
          backgroundColor={config.colors.orangeColor}
          rightimg={require('../../assets/images/addCardtroly.png')}
          rightimgContainerStyle={{
            alignItems: 'center',
            backgroundColor: config.colors.creamColor,
            width: 40,
            height: 40,
            justifyContent: 'center',
            borderRadius: 50,
            marginLeft: 10,
          }}
          rightImageStyle={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
          }}
          onRightPress={() => {
            if (userLoggedIn) {
              navigation.navigate(config.routes.CART);
            } else {
              goToLogin(config.routes.AUTH_NAVIGATION);
            }
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: config.colors.white + 70,
            marginVertical: 12,
          }}
        />
        <AppTextInput
          inputTextLabelVisible={false}
          inputTextLabel={''}
          placeholder={t('Search')}
          leftIcon={require('../../assets/images/Search.png')}
          value={searchText}
          onChangeText={val => {
            setVendorList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <View
          style={{
            marginTop: 15,
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{alignSelf: 'flex-start'}}>
            {vendorTypeList?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    backgroundColor:
                      selectedVendorType == item?.key
                        ? config.colors.orangeColor
                        : config.colors.white,
                    borderWidth: 1,
                    borderRadius: 50,
                    borderColor: config.colors.borderColor,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    setVendorList([]);
                    setSelectedVendorType(item?.key);
                    callAllVendorsApi(searchText, item?.key);
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      fontSize: 12,
                      lineHeight: 21,
                      color:
                        selectedVendorType == item?.key
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
        <FlatList
          data={vendorList}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 15}}
          numColumns={2}
        />
      </View>

      <FooterComponent from={'vendor'} navigation={navigation} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
});

export default AllVendors;
