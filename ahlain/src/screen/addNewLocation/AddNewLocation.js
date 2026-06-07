import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TextInput,
  Image,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
  I18nManager,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {SelectList} from 'react-native-dropdown-select-list';

import Geolocation from 'react-native-geolocation-service';

import AppButton from '../../conponents/AppButton';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {
  AddAddressReducer,
  EditAddressReducer,
  GetCitiesReducer,
} from '../../redux/reducers';
import Toast from 'react-native-simple-toast';
import {AppTextInput} from '../../conponents';
import {useTranslation} from 'react-i18next';
import {buildMapRegion, isValidCoordinate} from '../../utils/mapHelpers';
import useMapCamera from '../../hooks/useMapCamera';

const AddNewLocation = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const searchBarInput = useRef();

  const initialLat =
    route?.params?.latitude ?? route?.params?.edit_address?.latitude;
  const initialLng =
    route?.params?.longitude ?? route?.params?.edit_address?.longitude;

  const {
    mapRef,
    mapRegion: region,
    isMapReady,
    moveMapTo,
    onMapReady,
    onRegionChangeComplete: handleRegionChangeComplete,
  } = useMapCamera(initialLat, initialLng);

  const AddAddressResponse = useSelector(
    AddAddressReducer.selectAddAddressData,
  );
  const EditAddressResponse = useSelector(
    EditAddressReducer.selectEditAddressData,
  );

  const GetCitiesResponse = useSelector(GetCitiesReducer.selectGetCitiesData);
  const [House, setHouse] = useState('');
  const [Building, setBuilding] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState('');
  const [postCode, setpostCode] = useState('');

  const [Latitude, setlatitude] = useState('');
  const [Longitude, setlongitude] = useState('');
  const [addAddress, setAddress] = useState('');
  const [citySelected, setCitySelected] = useState('');
  const [countrySelected, setCountrySelected] = useState('');
  const [showMovementMarker, setShowMovementMarker] = useState(false);

  const [editAddress, setEditAddress] = useState(route?.params?.edit_address);
  const [isBottomSheetShow, setBottomSheetShow] = useState(true);
  const [search_text, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [cityDropdown, setCityDropdown] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [searchCityText, setSearchCityText] = useState('');
  const [isCityShow, setIsCityShow] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const data = [
    {key: '1', value: 'Mumbai'},
    {key: '2', value: 'Noida'},
    {key: '3', value: 'Ajmer'},
  ];
  const data2 = [
    {key: '1', value: 'India'},
    {key: '2', value: 'U.S.A'},
    {key: '3', value: 'Dubai'},
  ];
  useEffect(() => {
    if (isValidCoordinate(initialLat, initialLng)) {
      getAddressFromCoordinates(initialLat, initialLng, {moveCamera: false});
    } else {
      requestLocationPermission();
    }
  }, []);
  useEffect(() => {
    setCitiesList([]);
    setTotalPageNo(1);
    setPageNo(1);
    callGetCitiesApi(1, '');
  }, []);

  useEffect(() => {
    if (AddAddressResponse != null) {
      if (AddAddressResponse?.error == false) {
        Toast.show(AddAddressResponse?.message, Toast.LONG);
        dispatch(AddAddressReducer.removeAddAddressResponse());
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
        navigation.navigate(config.routes.SELECT_LOCATION);
      }
    }
  }, [AddAddressResponse]);
  useEffect(() => {
    if (EditAddressResponse != null) {
      if (EditAddressResponse?.error == false) {
        Toast.show(EditAddressResponse?.message, Toast.LONG);
        dispatch(EditAddressReducer.removeEditAddressResponse());
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
        navigation.navigate(config.routes.SELECT_LOCATION);
      }
    }
  }, [EditAddressResponse]);
  useEffect(() => {
    if (GetCitiesResponse != null) {
      if (GetCitiesResponse?.error == false) {
        console.log(
          'GetCitiesResponse?.results?.city',
          GetCitiesResponse?.results,
        );
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

  //function calling

  const callGetCitiesApi = (pageNo, searchText) => {
    setSearchCityText(searchText);
    const payload = {
      page: pageNo,
      pageSize: 50,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_CITIES, payload});
  };
  const handleLocationPermission = async val => {
    const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (res === 'granted') {
      await setCurrentLocation(val);
      console.log('You can use ios location');
    } else if (res === 'denied') {
      const res2 = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (res === 'blocked') {
      alert(t('Please enable location permission from app setting'));
    }
  };
  const requestLocationPermission = async val => {
    console.log('region', region);
    // ask for PermissionAndroid as written in your code
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        await setCurrentLocation(val);
      }
    } else {
      try {
        const res = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (res === 'granted') {
          await setCurrentLocation(val);
          console.log('You can use location');
        } else if (res === 'denied') {
          const res2 = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          if (res2 === 'granted') {
            await setCurrentLocation(val);
          }
        } else if (res === 'blocked') {
          alert(t('Please enable location permission from app setting'));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const getSearchSuggestion = val => {
    setSearchText(val);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBIk9oE4wqqpQ3Yt-bj3LvPbKJhLyc5g5Q&input=${val}`;
    axios
      .get(url)
      .then(response => {
        console.log('res===>googleapis----', response.data);

        setSearchResults(response.data.predictions);
      })
      .catch(error => console.log('error', error));
  };
  const is_selectAddress = item => {
    getLocation_data(item.place_id);
    searchBarInput.current.blur();
  };
  const getLocation_data = place_id => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${config.constants.MAP_API_KEY}`;
    axios
      .get(url)
      .then(res => {
        const lat = res.data.results[0]?.geometry?.location?.lat;
        const lng = res.data.results[0]?.geometry?.location?.lng;
        moveMapTo(lat, lng);
        getAddressFromCoordinates(lat, lng, {moveCamera: false});
        setSearchResults([]);
        setSearchText('');
        setBottomSheetShow(true);
      })
      .catch(error => console.log('error', error));
  };

  async function setCurrentLocation(val) {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude: lat, longitude: lng} = position.coords;
        await AsyncStorage.setItem(
          config.AsyncKeys.USER_LOCATION,
          JSON.stringify({latitude: lat, longitude: lng}),
        );
        if (editAddress != '' && val !== 'current') {
          moveMapTo(editAddress?.latitude, editAddress?.longitude);
          setHouse(
            route?.params?.edit_address?.house_number
              ? '' + route?.params?.edit_address?.house_number
              : '',
          );
          setBuilding(route?.params?.edit_address?.building_name);
          setLocality(route?.params?.edit_address?.locality);
          setCity({
            city_ar: route?.params?.edit_address?.city_ar,
            city: route?.params?.edit_address?.city,
          });
          setCountry(route?.params?.edit_address?.country);
        } else {
          moveMapTo(lat, lng);
          getAddressFromCoordinates(lat, lng, {moveCamera: false});
        }
      },

      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }
  const onPressSaveLocation = () => {
    if (House?.trim() == '') {
      return Toast.show(t('Please enter House no'), Toast.LONG);
    }
    if (Building?.trim() == '') {
      return Toast.show(t('Please enter Building'), Toast.LONG);
    }
    if (locality?.trim() == '') {
      return Toast.show(t('Please enter locality'), Toast.LONG);
    }
    if (!city) {
      return Toast.show(t('Please enter city'), Toast.LONG);
    }
    if (country?.trim() == '') {
      return Toast.show(t('Please enter country'), Toast.LONG);
    }
    if (editAddress != '') {
      const payload = {
        addressId: editAddress?._id,
        house_number: House,
        building_name: Building,
        locality: locality,
        city: city?.city,
        city_ar: city?.city_ar,
        country: country,
        latitude: '' + region.latitude,
        longitude: '' + region.longitude,
      };
      dispatch({type: SagaActions.EDIT_ADDRESS, payload});
    } else {
      const payload = {
        house_number: House,
        building_name: Building,
        locality: locality,
        city: city?.city,
        city_ar: city?.city_ar,
        country: country,
        latitude: '' + region.latitude,
        longitude: '' + region.longitude,
      };
      dispatch({type: SagaActions.ADD_ADDRESS, payload});
    }
  };

  const onRegionChange = (lat, lng) => {
    setBottomSheetShow(true);
    getAddressFromCoordinates(lat, lng, {moveCamera: false});
  };

  function getAddressFromCoordinates(lat, lng, options = {}) {
    const {moveCamera = true} = options;
    if (!isValidCoordinate(lat, lng)) {
      return;
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number(
      lat,
    )},${Number(lng)}&key=${config.constants.MAP_API_KEY}`;
    axios
      .get(url)
      .then(res => {
        const result = res.data?.results?.[0];
        if (!result) {
          return;
        }
        const geoLat = result.geometry?.location?.lat;
        const geoLng = result.geometry?.location?.lng;

        setAddress(result.formatted_address ?? '');
        setlatitude(geoLat);
        setlongitude(geoLng);

        if (moveCamera && isValidCoordinate(geoLat, geoLng)) {
          moveMapTo(geoLat, geoLng);
        }

        const full_address = result.formatted_address?.split(',') ?? [];
        if (full_address[1]) {
          setBuilding(full_address[1]);
        }
        const component = result.address_components ?? [];

        for (let i = 0; i < component.length; i++) {
          if (
            component[i]?.types.includes('premise') ||
            component[i]?.types.includes('street_number')
          ) {
            setHouse(component[i]?.long_name);
          } else if (component[i]?.types.includes('postal_code')) {
            setpostCode(component[i]?.long_name);
          } else if (component[i]?.types.includes('locality')) {
            setLocality(component[i]?.long_name);
          } else if (component[i]?.types.includes('country')) {
            setCountry(component[i]?.long_name);
          }
        }
      })
      .catch(error => console.log('error', error));
  }
  return (
    <View style={styles.container}>
      <>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{
            flex: 1,
            width: '100%',
            height: Dimensions.get('window').height,
          }}
          initialRegion={buildMapRegion(initialLat, initialLng)}
          showsUserLocation
          showsMyLocationButton={false}
          onMapReady={onMapReady}
          onRegionChangeComplete={r =>
            handleRegionChangeComplete(r, onRegionChange)
          }
          onTouchStart={() => setBottomSheetShow(false)}
        />
        <View style={styles.centerPinWrap} pointerEvents="none">
          <Image
            style={styles.centerPinImage}
            source={require('../../assets/images/markerIcon.png')}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: Platform.OS == 'android' ? 10 : 45,
            width: '95%',
            marginHorizontal: 10,
          }}>
          <View style={styles.inputSearchCss}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/backArrow.png')}
                style={{
                  height: 40,
                  width: 20,
                  marginHorizontal: 15,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.inputSearch}
              placeholder={t('Search')}
              placeholderTextColor={config.colors.Gray}
              onChangeText={val => getSearchSuggestion(val)}
              value={search_text}
              onFocus={() => setBottomSheetShow(false)}
              onBlur={() => setBottomSheetShow(true)}
              ref={searchBarInput}
            />
          </View>
          {searchResults.length > 0 && (
            <View
              style={{
                backgroundColor: 'white',
                marginTop: 10,
                borderRadius: 10,

                marginHorizontal: 10,
              }}>
              {searchResults.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.searchAddressView}
                    onPress={() => is_selectAddress(item)}>
                    {/* {console.log("item===>>>", item.terms)} */}
                    <Text style={styles.searchAddressText}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {isBottomSheetShow && (
          <View
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: '#fff',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              elevation: 5,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              automaticallyAdjustKeyboardInsets={true}>
              <Text style={styles.Address}>{t('Add New Address')}</Text>
              <View style={styles.InputCss}>
                <TextInput
                  style={styles.input}
                  placeholder={t('House/Flat no.')}
                  placeholderTextColor={config.colors.Gray}
                  onChangeText={val =>
                    setHouse(val.replace(/[^a-zA-Z0-9]/g, ''))
                  }
                  value={House}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('Building Name')}
                  placeholderTextColor={config.colors.Gray}
                  onChangeText={val =>
                    setBuilding(val.replace(/[^a-zA-Z0-9 ]/g, ''))
                  }
                  value={Building?.trimStart()}
                />
              </View>
              <TextInput
                style={[styles.Localityinput, {width: '100%'}]}
                placeholder={t('Locality')}
                placeholderTextColor={config.colors.Gray}
                onChangeText={val =>
                  setLocality(val.replace(/[^a-zA-Z0-9 ]/g, ''))
                }
                value={locality?.trimStart()}
              />
              <View>
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
                    placeholder={t('City')}
                    editable={false}
                    value={I18nManager?.isRTL ? city?.city_ar : city?.city}
                    viewStyle={{
                      marginHorizontal: 0,
                      marginVertical: 0,
                      borderWidth: 0,
                      borderBottomWidth: 1,
                      borderColor: '#00000017',
                      paddingHorizontal: 0,
                    }}
                    rightIcon={require('../../assets/images/downArrow.png')}
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
                      borderColor: config.colors.Gray,
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
                            color={config.colors.buttonColor}
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
              <TextInput
                style={[styles.Localityinput, {width: '100%'}]}
                placeholder={t('Country')}
                placeholderTextColor={config.colors.Gray}
                onChangeText={val => setCountry(val.replace(/[^a-zA-Z ]/g, ''))}
                value={country}
              />

              {/*   <View style={styles.selectlistMainCss}>
                <View style={styles.cityCss}>
                  <SelectList
                    setSelected={setCitySelected}
                    data={data}
                    search={false}
                    placeholder="City"
                    boxStyles={styles.boxstyle}
                    defaultOption={{key: '1', value: city}}
                    dropdownStyles={styles.dropdownStyle}
                  />
                </View>
                <View style={styles.cityCss}>
                  <SelectList
                    setSelected={setCountrySelected}
                    data={data2}
                    search={false}
                    placeholder="Country"
                    boxStyles={styles.boxstyle}
                    defaultOption={{key: '1', value: country}}
                    dropdownStyles={styles.dropdownStyle}
                  />
                </View>
              </View> */}
              <View style={styles.currentLocationCss}>
                <Image
                  style={styles.currentLocation}
                  resizeMode="contain"
                  source={require('../../assets/images/currentLocation.png')}
                />
                <Text
                  onPress={() => requestLocationPermission('current')}
                  style={styles.currentLocText}>
                  {t('Use current location')}
                </Text>
              </View>
            </ScrollView>
            <AppButton
              text={t('Save')}
              onPress={() => onPressSaveLocation()}
              viewStyle={{}}
            />
          </View>
        )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
  firstCss: {
    // flex: 0.5,
    height: '45%',
    // backgroundColor:'red'
  },
  secondCss: {
    // flex: 0.5,
    height: '60%',
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    paddingHorizontal: 20,
  },
  Address: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'left',
  },
  InputCss: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderBottomWidth: 1,
    width: '47%',
    borderBottomColor: '#00000017',
    marginTop: 5,
    color: config.colors.Black,
    height: 45,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  Localityinput: {
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: '#00000017',
    marginTop: 15,
    color: config.colors.Black,
    height: 45,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  selectlistMainCss: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cityCss: {
    width: '47%',
  },
  boxstyle: {
    borderRadius: 0,
    borderColor: '#FAFAFA',
    borderBottomColor: '#00000017',
  },
  dropdownStyle: {
    borderRadius: 0,
    borderColor: '#FAFAFA',
    backgroundColor: '#fff',
  },
  currentLocationCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    // backgroundColor:'red',
    // flex: 1,
  },
  currentLocation: {
    height: 24,
    width: 24,
  },
  currentLocText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    marginLeft: 10,
    // marginTop:20
  },
  inputSearchCss: {
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
  inputSearch: {
    borderLeftWidth: I18nManager.isRTL ? 0 : 1,
    borderRightWidth: I18nManager.isRTL ? 1 : 0,
    height: 37,
    borderColor: '#E35829',
    width: '90%',
    paddingHorizontal: 10,
    color: config.colors.Gray,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  searchAddressView: {
    marginHorizontal: 10,
    padding: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: config.colors.Gray,
  },
  searchAddressText: {
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
  },
  centerPinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -60,
    zIndex: 2,
  },
  centerPinImage: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
});

export default AddNewLocation;
