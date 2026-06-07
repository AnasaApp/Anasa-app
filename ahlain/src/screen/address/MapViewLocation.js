import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import config from '../../config';
import {useDispatch, useSelector} from 'react-redux';

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
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {AppButton, AppTextInput} from '../../conponents';
import {buildMapRegion, isValidCoordinate} from '../../utils/mapHelpers';
import useMapCamera from '../../hooks/useMapCamera';

const MapViewLocation = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const AddAddressResponse = useSelector(
    AddAddressReducer.selectAddAddressData,
  );
  const EditAddressResponse = useSelector(
    EditAddressReducer.selectEditAddressData,
  );

  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);

  const GetCitiesResponse = useSelector(GetCitiesReducer.selectGetCitiesData);
  const [userName, setUsername] = useState(
    route?.params?.address ? route?.params?.address?.name : '',
  );
  const [mobileNumber, setMobileNumber] = useState(
    route?.params?.address ? route?.params?.address?.mobileNumber : '',
  );
  const [emirateName, setEmirateName] = useState(
    route?.params?.address ? route?.params?.address?.emirateName : '',
  );
  const [pincode, setPincode] = useState(
    route?.params?.address ? '' + route?.params?.address?.pincode : '',
  );
  const [houseNo, setHouseNo] = useState(
    route?.params?.address ? route?.params?.address?.houseNo : '',
  );
  const [building_name, setBuildingName] = useState(
    route?.params?.address ? route?.params?.address?.building_name : '',
  );
  const [locality, setLocality] = useState(
    route?.params?.address ? route?.params?.address?.locality : '',
  );
  const [city, setCity] = useState(
    route?.params?.address ? route?.params?.address?.city : '',
  );
  const [country, setCountry] = useState(
    route?.params?.address ? route?.params?.address?.country : '',
  );
  const [isDefaultSelected, setIsDefaultSelected] = useState(
    route?.params?.address ? route?.params?.address?.isDefaultSelected : false,
  );
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [address, setAddress] = useState('');
  const [editAddress, setEditAddress] = useState(
    route?.params?.edit_address ?? '',
  );

  const initialLat =
    route?.params?.latitude ?? route?.params?.edit_address?.latitude;
  const initialLng =
    route?.params?.longitude ?? route?.params?.edit_address?.longitude;

  const {
    mapRef,
    mapRegion,
    moveMapTo,
    onMapReady,
    onRegionChangeComplete: handleRegionChangeComplete,
  } = useMapCamera(initialLat, initialLng);

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
  const [locationStatus, setLocationStatus] = useState('loading');

  const searchBarInput = useRef();
  const initStartedRef = useRef(false);
  const geocodeDebounceRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (geocodeDebounceRef.current) {
        clearTimeout(geocodeDebounceRef.current);
      }
    };
  }, []);

  const isLocationReady =
    locationStatus === 'ready' &&
    !!address?.trim() &&
    isValidCoordinate(latitude, longitude);

  const handleLocationFailure = message => {
    setLocationStatus('failed');
    Toast.show(message ?? t('Unable to get your location'), Toast.LONG);
    navigation.goBack();
  };

  const fetchCurrentPosition = () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position.coords),
        () => {
          Geolocation.getCurrentPosition(
            position => resolve(position.coords),
            error => reject(error),
            {enableHighAccuracy: false, timeout: 15000, maximumAge: 120000},
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });

  const ensureLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth !== 'granted') {
        throw new Error('permission_denied');
      }
      return;
    }
    const res = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (res === 'granted') {
      return;
    }
    if (res === 'denied') {
      const res2 = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (res2 === 'granted') {
        return;
      }
    }
    throw new Error('permission_denied');
  };

  const resolveAddressAt = (lat, lng, options = {}) => {
    const {moveCamera = true} = options;
    if (!isValidCoordinate(lat, lng)) {
      return Promise.reject(new Error('invalid_coordinates'));
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number(
      lat,
    )},${Number(lng)}&key=${config.constants.MAP_API_KEY}`;

    return axios.get(url, {timeout: 12000}).then(res => {
      const result = res.data?.results?.[0];
      if (!result?.formatted_address) {
        throw new Error('no_address');
      }
      const geoLat = result.geometry?.location?.lat;
      const geoLng = result.geometry?.location?.lng;
      if (!isValidCoordinate(geoLat, geoLng)) {
        throw new Error('invalid_geocode');
      }

      setAddress(result.formatted_address);
      const full_address = result.formatted_address.split(',') ?? [];
      if (full_address[1]) {
        setBuildingName(full_address[1]);
      }
      setlatitude(lat);
      setlongitude(lng);

      const component = result.address_components ?? [];
      for (let i = 0; i < component.length; i++) {
        if (
          component[i]?.types.includes('premise') ||
          component[i]?.types.includes('street_number')
        ) {
          setHouseNo(component[i]?.long_name);
        } else if (component[i]?.types.includes('postal_code')) {
          setPincode(component[i]?.long_name);
        } else if (component[i]?.types.includes('locality')) {
          setLocality(component[i]?.long_name);
        } else if (component[i]?.types.includes('country')) {
          setCountry(component[i]?.long_name);
        }
      }

      if (moveCamera) {
        moveMapTo(geoLat, geoLng);
      }
      return result.formatted_address;
    });
  };

  const loadLocationAt = async (lat, lng) => {
    if (!isValidCoordinate(lat, lng)) {
      throw new Error('invalid_coordinates');
    }
    const nLat = Number(lat);
    const nLng = Number(lng);
    setlatitude(nLat);
    setlongitude(nLng);
    moveMapTo(nLat, nLng);

    try {
      await resolveAddressAt(nLat, nLng, {moveCamera: false});
    } catch {
      setAddress(
        `${nLat.toFixed(5)}, ${nLng.toFixed(5)} — ${t('Move the map to refine')}`,
      );
    }

    if (isMountedRef.current) {
      setLocationStatus('ready');
    }
  };

  const initializeLocation = async () => {
    if (initStartedRef.current) {
      return;
    }
    initStartedRef.current = true;
    setLocationStatus('loading');

    try {
      if (
        route?.params?.from === 'edit' &&
        editAddress &&
        isValidCoordinate(editAddress?.latitude, editAddress?.longitude)
      ) {
        setCity(editAddress?.city);
        await loadLocationAt(editAddress.latitude, editAddress.longitude);
        return;
      }

      if (isValidCoordinate(initialLat, initialLng)) {
        await loadLocationAt(initialLat, initialLng);
        return;
      }

      await ensureLocationPermission();
      const coords = await fetchCurrentPosition();
      await AsyncStorage.setItem(
        config.AsyncKeys.USER_LOCATION,
        JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      );
      await loadLocationAt(coords.latitude, coords.longitude);
    } catch (error) {
      const msg =
        error?.message === 'permission_denied'
          ? t('Please enable location permission from app setting')
          : t('Unable to get your location. Please try again.');
      handleLocationFailure(msg);
    }
  };

  const onUseCurrentLocation = async () => {
    setLocationStatus('loading');
    try {
      await ensureLocationPermission();
      const coords = await fetchCurrentPosition();
      await AsyncStorage.setItem(
        config.AsyncKeys.USER_LOCATION,
        JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      );
      await loadLocationAt(coords.latitude, coords.longitude);
    } catch (error) {
      const msg =
        error?.message === 'permission_denied'
          ? t('Please enable location permission from app setting')
          : t('Unable to get your location. Please try again.');
      handleLocationFailure(msg);
    }
  };

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
  // api calling

  useEffect(() => {
    initializeLocation();
  }, []);
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
      page: pageNo,
      pageSize: 50,
      search: searchText,
    };
    dispatch({type: SagaActions.GET_CITIES, payload});
  };
  const getSearchSuggestion = val => {
    setSearchText(val);
    if (val?.length > 2) {
      dispatch(UIReducer.showLoader(true));
      axios
        .post(
          'https://places.googleapis.com/v1/places:autocomplete',
          {
            input: val,
            languageCode: i18n.language == 'en' ? 'en' : 'ar',
            // locationBias: {
            //   circle: {
            //     center: {
            //       latitude: 37.7937,
            //       longitude: -122.3965,
            //     },
            //     radius: 500.0,
            //   },
            // },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': config.constants.MAP_API_KEY, // Note: API key is usually included as a query parameter, not in headers
            },
          },
        )
        .then(response => {
          setSearchResults(response.data.suggestions);
          dispatch(UIReducer.showLoader(false));
        })
        .catch(error => {
          dispatch(UIReducer.showLoader(false));

          console.error(
            'Error:',
            error.response ? error.response.data : error.message,
          );
        });
    } else {
      setSearchResults([]);
    }
  };
  const is_selectAddress = place_id => {
    getLocation_data(place_id);
    searchBarInput.current.blur();
  };
  const getLocation_data = place_id => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${config.constants.MAP_API_KEY}`;

    setLocationStatus('loading');
    axios
      .get(url, {timeout: 12000})
      .then(res => {
        const lat = res.data.results[0]?.geometry?.location?.lat;
        const lng = res.data.results[0]?.geometry?.location?.lng;
        if (!isValidCoordinate(lat, lng)) {
          throw new Error('invalid');
        }
        moveMapTo(lat, lng);
        return resolveAddressAt(lat, lng, {moveCamera: false});
      })
      .then(() => {
        setSearchResults([]);
        setSearchText('');
        setBottomSheetShow(true);
        setLocationStatus('ready');
      })
      .catch(() => {
        Toast.show(t('Unable to find this place'), Toast.LONG);
        setLocationStatus('ready');
      });
  };

  const scheduleAddressLookup = (lat, lng, {immediate = false} = {}) => {
    if (!isValidCoordinate(lat, lng)) {
      return;
    }
    const nLat = Number(lat);
    const nLng = Number(lng);
    setlatitude(nLat);
    setlongitude(nLng);

    if (geocodeDebounceRef.current) {
      clearTimeout(geocodeDebounceRef.current);
    }

    const runLookup = () => {
      resolveAddressAt(nLat, nLng, {moveCamera: false})
        .then(() => {
          if (isMountedRef.current) {
            setLocationStatus('ready');
          }
        })
        .catch(() => {});
    };

    if (immediate) {
      runLookup();
      return;
    }

    geocodeDebounceRef.current = setTimeout(runLookup, 450);
  };

  const isResolvingLocation = locationStatus === 'loading';

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: config.colors.white}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={buildMapRegion(initialLat, initialLng)}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={onMapReady}
        onRegionChange={region => {
          if (locationStatus === 'loading' || !region) {
            return;
          }
          scheduleAddressLookup(region.latitude, region.longitude);
        }}
        onRegionChangeComplete={region =>
          handleRegionChangeComplete(region, (lat, lng) =>
            scheduleAddressLookup(lat, lng, {immediate: true}),
          )
        }
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
          top: 50,
          width: '95%',
          marginHorizontal: 10,
        }}>
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 40,
              height: 40,
              justifyContent: 'center',
              borderRadius: 50,
            }}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                transform: [{rotate: I18nManager?.isRTL ? '180deg' : '0deg'}],
              }}
            />
          </TouchableOpacity>

          <AppTextInput
            onRefs={searchBarInput}
            inputTextLabel={''}
            inputTextLabelVisible={false}
            placeholder={t('Search Area')}
            onChangeText={val => getSearchSuggestion(val)}
            value={search_text}
            editable={!isResolvingLocation}
            textInputStyle={{flex: 1, width: '80%'}}
            leftIcon={require('../../assets/images/Search.png')}
            leftIconStyle={{
              width: 22,
              height: 22,
            }}
            viewStyle={{
              width: config.constants.Width - 100,
              marginLeft: 20,
              backgroundColor: config.colors.white,
            }}
          />
        </View>
        {searchResults?.length > 0 && (
          <View
            style={{
              marginTop: 10,
              borderRadius: 10,

              marginHorizontal: 10,
              height: 200,
              backgroundColor: config.colors.white,
            }}>
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{
                paddingVertical: 10,
              }}
              nestedScrollEnabled={true}>
              {searchResults?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => {
                      is_selectAddress(item?.placePrediction?.placeId);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}>
                    <Text
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 13,
                        lineHeight: 16,
                        color: config.colors.blackColor,
                      }}>
                      {item.placePrediction?.text?.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: config.colors.white,
          padding: 15,
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isResolvingLocation}
          onPress={onUseCurrentLocation}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{
              height: 24,
              width: 24,
              tintColor: config.colors.purpleColor,
              opacity: isResolvingLocation ? 0.4 : 1,
            }}
            source={require('../../assets/images/currentLocation.png')}
          />
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 14,
              lineHeight: 21,
              marginLeft: 4,
              color: config.colors.blackColor,
              opacity: isResolvingLocation ? 0.4 : 1,
            }}>
            {t('Use Current Location')}
          </Text>
        </TouchableOpacity>
        <View style={styles.addressRow}>
          {isResolvingLocation ? (
            <ActivityIndicator
              size="small"
              color={config.colors.orangeColor}
              style={styles.addressSpinner}
            />
          ) : null}
          <Text
            style={[
              styles.addressText,
              isResolvingLocation && styles.addressTextLoading,
            ]}>
            {isResolvingLocation
              ? t('Fetching your location...')
              : address || t('Move the map or search to pick a location')}
          </Text>
        </View>
        <AppButton
          text={t('Proceed')}
          disabled={!isLocationReady}
          onPress={() => {
            if (!isLocationReady) {
              return;
            }
            navigation.replace(config.routes.ADD_NEW_ADDRESS, {
                from: route?.params?.from,
                address: {
                  _id: editAddress?._id ?? '',
                  pincode: pincode,
                  houseNo: houseNo,
                  building_name: building_name,
                  locality: locality,
                  city: city,
                  country: country,
                  address: address,
                  latitude: latitude,
                  longitude: longitude,
                  name: MyProfileResponse?.results?.buyer?.full_name ?? '',
                  phone_number: MyProfileResponse?.results?.buyer?.phone_number
                    ? '' + MyProfileResponse?.results?.buyer?.phone_number
                    : '',
                  country_code:
                    MyProfileResponse?.results?.buyer?.country_code ?? '966',
                },
              });
          }}
          textStyle={{fontSize: 14}}
          buttonStyle={{
            marginVertical: 10,
            opacity: isLocationReady ? 1 : 0.45,
          }}
        />
      </View>

    </SafeAreaView>
  );
};

export default MapViewLocation;

const styles = StyleSheet.create({
  inputCss: {
    marginTop: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
  },
  centerPinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    zIndex: 2,
  },
  centerPinImage: {
    height: 40,
    width: 40,
    tintColor: config.colors.purpleColor,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    minHeight: 40,
  },
  addressSpinner: {
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    lineHeight: 18,
    color: config.colors.blackColor,
    textAlign: 'left',
  },
  addressTextLoading: {
    color: config.colors.Gray,
  },
});
