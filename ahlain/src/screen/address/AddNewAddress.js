import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {useDispatch, useSelector} from 'react-redux';

import AppTextInput from '../../conponents/AppInput';
import AppButton from '../../conponents/AppButton';
import {
  AddAddressReducer,
  EditAddressReducer,
  GetCitiesReducer,
  MyProfileReducer,
  UIReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import CountryPicker from 'react-native-country-picker-modal';

const AddNewAddress = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const GetCitiesResponse = useSelector(GetCitiesReducer.selectGetCitiesData);
  const AddAddressResponse = useSelector(
    AddAddressReducer.selectAddAddressData,
  );
  const AddAddressErrorResponse = useSelector(
    AddAddressReducer.selectAddAddressResponse,
  );

  const EditAddressResponse = useSelector(
    EditAddressReducer.selectEditAddressData,
  );
  const EditAddressErrorResponse = useSelector(
    EditAddressReducer.selectEditAddressResponse,
  );
  const [userName, setUsername] = useState(
    route?.params?.address ? route?.params?.address?.name : '',
  );
  const [mobileNumber, setMobileNumber] = useState(
    route?.params?.address ? route?.params?.address?.phone_number : '',
  );
  const [building_name, setBuildingName] = useState(
    route?.params?.address ? route?.params?.address?.building_name : '',
  );
  const [pincode, setPincode] = useState(
    route?.params?.address ? '' + route?.params?.address?.pincode : '',
  );
  const [houseNo, setHouseNo] = useState(
    route?.params?.address ? route?.params?.address?.houseNo : '',
  );
  const [area, setArea] = useState(
    route?.params?.address
      ? route?.params?.address?.locality || route?.params?.address?.address
      : '',
  );
  const [city, setCity] = useState(
    route?.params?.address ? route?.params?.address?.city : '',
  );
  const [country, setCountry] = useState(
    route?.params?.address ? route?.params?.address?.country : '',
  );
  const [latitude, setLatitude] = useState(
    route?.params?.address ? route?.params?.address?.latitude : '',
  );
  const [longitude, setLongitude] = useState(
    route?.params?.address ? route?.params?.address?.longitude : '',
  );
  const [isDefaultSelected, setIsDefaultSelected] = useState(
    route?.params?.address ? route?.params?.address?.isDefaultSelected : false,
  );
  const [countryCode, setCountryCode] = useState('SA');
  const [callingCode, setCallingCode] = useState('966');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);

  const [cityDropdown, setCityDropdown] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [searchCityText, setSearchCityText] = useState('');
  const [isCityShow, setIsCityShow] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedAddressType, setSelectedAddressType] = useState('Home');

  //hooks calling
  useEffect(() => {
    if (GetCitiesResponse != null) {
      if (GetCitiesResponse?.error == false) {
        setLoading(true);
        setCitiesList([...citiesList, ...GetCitiesResponse?.results?.cities]);
        setPageNo(pageNo + 1);
        setTotalPageNo(GetCitiesResponse?.results?.totalPages);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        dispatch(GetCitiesReducer.removeGetCitiesResponse());
      }
    }
  }, [GetCitiesResponse]);
  useEffect(() => {
    if (MyProfileResponse != null) {
      if (MyProfileResponse?.error == false) {
        if (!route?.params?.address) {
          setUsername(MyProfileResponse?.results?.buyer?.full_name);
          setMobileNumber(
            MyProfileResponse?.results?.buyer?.phone_number
              ? '' + MyProfileResponse?.results?.buyer?.phone_number
              : '',
          );
        }
      }
    }
  }, [MyProfileResponse]);
  useEffect(() => {
    if (EditAddressErrorResponse != null) {
      if (EditAddressErrorResponse?.message != '') {
        Toast.show(EditAddressErrorResponse?.message, Toast.LONG);
        dispatch(EditAddressReducer.removeEditAddressResponse());
      }
    }
  }, [EditAddressErrorResponse]);

  useEffect(() => {
    if (EditAddressResponse != null) {
      if (EditAddressResponse?.error == false) {
        Toast.show(EditAddressResponse?.message, Toast.LONG);
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});

        navigation.goBack();
        dispatch(EditAddressReducer.removeEditAddressResponse());
      }
    }
  }, [EditAddressResponse]);
  useEffect(() => {
    if (AddAddressErrorResponse != null) {
      if (AddAddressErrorResponse?.message != '') {
        Toast.show(AddAddressErrorResponse?.message, Toast.LONG);

        dispatch(AddAddressReducer.removeAddAddressResponse());
      }
    }
  }, [AddAddressErrorResponse]);

  useEffect(() => {
    if (AddAddressResponse != null) {
      if (AddAddressResponse?.error == false) {
        Toast.show(AddAddressResponse?.message, Toast.LONG);
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});

        navigation.goBack();
        dispatch(AddAddressReducer.removeAddAddressResponse());
      }
    }
  }, [AddAddressResponse]);
  // api calling
  useEffect(() => {
    setCitiesList([]);
    setTotalPageNo(1);
    setPageNo(1);
    callGetCitiesApi(1, '');
  }, []);

  //function calling

  const callGetCitiesApi = (pageNo, searchText) => {
    setSearchCityText(searchText);
    const payload = {
      pageNo: pageNo,
      pageSize: 20,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_CITIES, payload});
  };
  const callAddNewAddressApi = () => {
    // if (emirateName.length < 3) {
    //   return Toast.show({
    //     type: 'error',
    //     text1: t('Please select emirate name'),
    //   });
    // }

    if (pincode?.trim() == '') {
      return Toast.show({
        type: 'error',
        text1: t('Please enter a valid pincode'),
      });
    }
    if (houseNo?.trim() == '') {
      return Toast.show({
        type: 'error',
        text1: t('Please enter house number'),
      });
    }
    if (area?.trim() == '') {
      return Toast.show({
        type: 'error',
        text1: t('Please enter locality or area'),
      });
    }
    const resolvedCity =
      typeof city === 'string' ? city : city?.city ?? '';
    if (resolvedCity.trim() === '') {
      return Toast.show({
        type: 'error',
        text1: t('Please enter city'),
      });
    }
    if (country?.trim() == '') {
      return Toast.show({
        type: 'error',
        text1: t('Please enter country'),
      });
    }
    if (userName.length < 3) {
      return Toast.show({
        type: 'error',
        text1: t('User Name should be more than 3 characters long'),
      });
    }
    if (mobileNumber === '' || mobileNumber?.length < 9) {
      return Toast.show({
        type: 'error',
        text1: t('Please enter valid mobile number'),
      });
    }

    const cityName = resolvedCity;
    const cityNameAr = typeof city === 'string' ? city : city?.city_ar;

    const payload = {
      house_number: houseNo,
      building_name: building_name,
      locality: area,
      city: cityName,
      city_ar: cityNameAr,
      country: country,
      name: userName,
      mobileNumber: mobileNumber,
      latitude: latitude,
      longitude: longitude,
      isDefaultSelected: isDefaultSelected,
      addressType: selectedAddressType,
      country_code: callingCode,
      country_short_name: countryCode,
    };

    if (route?.params?.from == 'edit') {
      payload.addressId = route?.params?.address?._id;
      dispatch({type: SagaActions.EDIT_ADDRESS, payload});
    } else {
      dispatch({type: SagaActions.ADD_ADDRESS, payload});
    }
  };
  const onSelectCountry = country => {
    setCountryCode(country.cca2);
    setCallingCode(country?.callingCode[0]);
  };
  return (
    <View style={{flex: 1, backgroundColor: config.colors.white}}>
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
          title={t('Enter Address')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.inputCss}>
          <AppTextInput
            inputTextLabel={t('Pincode')}
            placeholder={t('Pincode')}
            textInputStyle={{flex: 1}}
            onChangeText={num => setPincode(num.replace(/[^0-9]/g, ''))}
            value={pincode}
            keyboardType={'numeric'}
            returnKeyType="done"
          />
        </View>
        <View style={styles.inputCss}>
          <AppTextInput
            inputTextLabel={t('House / Flat / Office No.')}
            placeholder={t('House / Flat / Office No.')}
            textInputStyle={{flex: 1}}
            onChangeText={val => setHouseNo(val)}
            value={houseNo}
          />
        </View>
        <View style={styles.inputCss}>
          <AppTextInput
            inputTextLabel={t('Building Name')}
            placeholder={t('Building Name')}
            textInputStyle={{flex: 1}}
            onChangeText={val => setBuildingName(val)}
            value={building_name}
          />
        </View>
        <View style={styles.inputCss}>
          <AppTextInput
            inputTextLabel={t('Locality / Area')}
            placeholder={t('Locality / Area')}
            textInputStyle={{flex: 1, height: 100}}
            onChangeText={val => setArea(val)}
            multiline={true}
            value={area}
            viewStyle={{
              height: 100,
              paddingTop: 6,
            }}
            textAlignVertical={'top'}
          />
        </View>
        <View style={styles.inputCss}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{flex: 1}}
            onPress={() => {
              setTimeout(() => {
                setIsCityShow(!isCityShow);
              }, 100);
              setCityDropdown(!cityDropdown);
            }}>
            <AppTextInput
              inputTextLabel={t('City')}
              placeholder={t('City')}
              editable={false}
              value={I18nManager?.isRTL ? city?.city_ar : city?.city}
              textInputStyle={{flex: 1}}
              rightIcon={require('../../assets/images/downArrowIcon.png')}
              rightIconStyle={{
                width: 20,
                height: 20,
                transform: [{rotate: cityDropdown ? '180deg' : '0deg'}],
              }}
              rightIconPress={() => {
                setTimeout(() => {
                  setIsCityShow(!isCityShow);
                }, 100);
                setCityDropdown(!cityDropdown);
              }}
            />
          </TouchableOpacity>

          {cityDropdown && (
            <View
              style={{
                maxHeight: 350,
                borderWidth: 1,
                borderColor: config.colors.borderColor,
                borderRadius: 12,
                backgroundColor: config.colors.white,
              }}>
              <AppTextInput
                textInputStyle={{
                  flex: 1,
                }}
                onChangeText={val => {
                  setCitiesList([]);
                  setPageNo(1);
                  setTotalPageNo(1);
                  callGetCitiesApi(1, val);
                }}
                value={searchCityText}
                placeholder={`${t('Search Here')}`}
                returnKeyType="done"
                maxLength={30}
                rightIcon={
                  searchCityText != '' &&
                  require('../../assets/images/closeIcon.png')
                }
                rightIconPress={() => {
                  setSearchCityText('');
                  setCitiesList([]);
                  setPageNo(1);
                  setTotalPageNo(1);
                  callGetCitiesApi(1, '');
                }}
                rightIconStyle={{
                  width: 16,
                  height: 16,
                  tintColor: config.colors.blackColor,
                }}
                viewStyle={{
                  marginHorizontal: 10,
                }}
              />
              <FlatList
                nestedScrollEnabled
                keyboardShouldPersistTaps={'handled'}
                data={citiesList}
                keyExtractor={item => item._id.toString()}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={index}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                        borderBottomColor: config.colors.greyColor,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => {
                        setCity(item);
                        setCityDropdown(false);
                        setIsCityShow(false);
                      }}>
                      <Text
                        style={{
                          fontFamily: config.fonts.MontserratMedium,
                          fontSize: 12,
                          color: config.colors.blackColor,
                          lineHeight: 22,
                          // textTransform: 'capitalize',
                          textAlign: 'left',
                        }}>
                        {I18nManager?.isRTL ? item?.city_ar : item?.city}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                onEndReached={() => {
                  if (totalPageNo >= pageNo) {
                    callGetCitiesApi(pageNo, searchCityText);
                  }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loading ? (
                    <ActivityIndicator
                      style={{margin: 20}}
                      color={config.colors.purpleColor}
                    />
                  ) : null
                }
                ListEmptyComponent={
                  !loading && !citiesList.length ? (
                    <Text
                      style={{
                        fontFamily: config.fonts.InterMediumFont,
                        fontSize: 12,
                        color: config.colors.blackColor,
                        lineHeight: 22,
                        margin: 20,
                        textAlign: 'center',
                      }}>
                      {t('No Data Found')}
                    </Text>
                  ) : null
                }
              />
            </View>
          )}
        </View>
        <View style={styles.inputCss}>
          <AppTextInput
            inputTextLabel={t('Country')}
            placeholder={t('Country')}
            textInputStyle={{flex: 1}}
            onChangeText={val => setCountry(val)}
            value={country}
          />
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            fontSize: 16,
            color: config.colors.Black,
            lineHeight: 24,
            marginTop: 15,
            textAlign: 'left',
          }}>
          {t('Address Type')}
        </Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',

            marginVertical: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedAddressType('Home');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor:
                selectedAddressType == 'Home'
                  ? config.colors.blueColor
                  : config.colors.borderColor,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              backgroundColor:
                selectedAddressType == 'Home'
                  ? config.colors.blueColor + 20
                  : config.colors.white,
            }}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              resizeMode="contain"
              source={require('../../assets/images/homeIcon2.png')}
            />

            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.Light_Black,
                fontSize: 14,
                marginLeft: 5,
              }}>
              {t('Home')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedAddressType('Event');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor:
                selectedAddressType == 'Event'
                  ? config.colors.blueColor
                  : config.colors.borderColor,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 10,
              backgroundColor:
                selectedAddressType == 'Event'
                  ? config.colors.blueColor + 20
                  : config.colors.white,
              marginLeft: 20,
            }}>
            <Image
              style={{
                width: 18,
                height: 18,
              }}
              resizeMode="contain"
              source={require('../../assets/images/eventIcon.png')}
            />

            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                color: config.colors.Light_Black,
                fontSize: 14,
                marginLeft: 5,
              }}>
              {t('Event')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsDefaultSelected(!isDefaultSelected);
            }}>
            <Image
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
              }}
              resizeMode="contain"
              source={
                isDefaultSelected
                  ? require('../../assets/images/Tick.png')
                  : require('../../assets/images/Untick.png')
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: config.fonts.InterRegularFont,
              fontSize: 14,
              color: config.colors.Gray,
              textAlign: 'left',
              lineHeight: 22,
              marginHorizontal: 5,
            }}>
            {t('Use as default address')}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            fontSize: 16,
            color: config.colors.Black,
            lineHeight: 24,
            marginTop: 15,
            textAlign: 'left',
          }}>
          {t('Contact')}
        </Text>
        <View style={{}}>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 14,
              color: config.colors.Black,
              lineHeight: 18,
              marginTop: 10,
              textAlign: 'left',
            }}>
            {t(
              'Information provided here will be used to contact you Delivery Purposes.',
            )}
          </Text>
          <View style={styles.inputCss}>
            <AppTextInput
              inputTextLabel={t('User Name')}
              placeholder={t('User Name')}
              textInputStyle={{flex: 1}}
              onChangeText={val => setUsername(val)}
              value={userName}
            />
          </View>
          <View style={styles.inputCss}>
            <Text style={styles.labelText}>{t('Mobile Number')}</Text>
            <View style={styles.mobileInputContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsCalenderVisible(!isCalenderVisible)}
                style={styles.flagimageview}>
                {/* <Image
                    source={require('../../assets/images/FlagSaudi.png')}
                    style={styles.flagImage}
                  /> */}
                <CountryPicker
                  countryCode={countryCode}
                  withFilter={true}
                  withFlag={true}
                  withCountryNameButton={false}
                  withCallingCode={true}
                  withEmoji={true}
                  onSelect={onSelectCountry}
                  visible={isCalenderVisible}
                />
                <Image
                  source={require('../../assets/images/downArrow.png')}
                  style={styles.downArrowImage}
                />
              </TouchableOpacity>

              <View style={styles.textInputConatiner}>
                <Text style={styles.codecctext}>
                  {callingCode ? '+' + callingCode : ''}
                </Text>
                <TextInput
                  placeholder={'5XX XXX XXX'}
                  placeholderTextColor={config.colors.placeholderTextColor}
                  onChangeText={num =>
                    setMobileNumber(num.replace(/[^0-9]/g, ''))
                  }
                  value={mobileNumber}
                  keyboardType={'numeric'}
                  maxLength={20}
                  style={styles.txtInput}
                  // selection={I18nManager.isRTL&& seletion}
                  // onSelectionChange={handleSelectionChange}
                  // onKeyPress={handleKeyPress}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <AppButton
        text={t('Update')}
        onPress={() => callAddNewAddressApi()}
        textStyle={{fontSize: 14}}
        buttonStyle={{marginVertical: 20, marginHorizontal: 20}}
      />
    </View>
  );
};

export default AddNewAddress;

const styles = StyleSheet.create({
  inputCss: {
    marginTop: 15,
  },
  mobileInputContainer: {
    borderColor: config.colors.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 15,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: config.colors.white,
  },
  flagimageview: {
    width: '18%',
    paddingHorizontal: 10,
    borderLeftColor: !I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderLeftWidth: !I18nManager.isRTL ? 0 : 1,
    borderRightColor: I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderRightWidth: I18nManager.isRTL ? 0 : 1,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  downArrowImage: {
    width: 14,
    height: 7,
    resizeMode: 'contain',
  },
  textInputConatiner: {
    width: '80%',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    // top: 2,
  },
  txtInput: {
    width: '80%',
    height: 50,
    paddingHorizontal: 10,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    marginTop: 3,
    color: config.colors.Black,
    textAlign: 'left',
  },
  codecctext: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 16,
    color: config.colors.Black,
  },
  input: {
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 3,
    borderColor: '#9E9E9E',
    borderWidth: 0.7,
    paddingHorizontal: 10,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  nameText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'left',
  },

  flagimageview: {
    width: '20%',
    paddingHorizontal: 10,
    borderLeftColor: !I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderLeftWidth: !I18nManager.isRTL ? 0 : 1,
    borderRightColor: I18nManager.isRTL ? '#ffffff' : '#ABABB680',
    borderRightWidth: I18nManager.isRTL ? 0 : 1,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  downArrow: {
    width: 14,
    height: 7,
  },
  contryCode: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#080B25',
    fontSize: 16,
  },
  txtInput: {
    width: '80%',
    height: 45,
    paddingLeft: 10,
    fontFamily: config.fonts.Poppins_Medium,
    color: '#080B25',
    fontSize: 15,
    top: 0.5,
    color: config.colors.Black,
    textAlign: 'left',
  },
});
