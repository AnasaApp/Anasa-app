import {
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
import MapView, {Marker} from 'react-native-maps';
import {AppButton, AppTextInput} from '../../conponents';

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

  const [region, setRegion] = useState({
    latitude: 0.0,
    longitude: 0.0,

    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [initialRegion, setInitialRegion] = useState({
    latitude: route?.params?.latitude,
    longitude: route?.params?.longitude,

    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
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

  const searchBarInput = useRef();
  const mapRef = useRef();

  //hooks calling

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
    requestLocationPermission();
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
  const requestLocationPermission = async val => {
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
          const res2 = request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
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

    axios
      .get(url)
      .then(res => {
        mapRef.current?.animateToRegion(
          {
            latitude: res.data.results[0]?.geometry?.location?.lat,
            longitude: res.data.results[0]?.geometry?.location?.lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
          650,
        );

        setRegion({
          latitude: res.data.results[0]?.geometry?.location?.lat,
          longitude: res.data.results[0]?.geometry?.location?.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        });
        getAddressFromCoordinates(
          res.data.results[0]?.geometry?.location?.lat,
          res.data.results[0]?.geometry?.location?.lng,
        );
        setSearchResults([]);
        setSearchText('');
        setBottomSheetShow(true);
      })
      .catch(error => console.log('error', error));
  };

  async function setCurrentLocation(val) {
    Geolocation.getCurrentPosition(
      async position => {
        await AsyncStorage.setItem(
          config.AsyncKeys.USER_LOCATION,
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
        if (route?.params?.from == 'edit') {
          if (val == 'current') {
            setRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            });
            getAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude,
            );
          } else {
            setRegion({
              latitude: parseFloat(editAddress?.latitude),
              longitude: parseFloat(editAddress?.longitude),
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            });
            setCity(editAddress?.city);
            getAddressFromCoordinates(
              editAddress.latitude,
              editAddress.longitude,
            );
          }
        } else {
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          });
          getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
        }
      },

      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }
  const onRegionChange = region => {
    let latitude = '';
    let longitude = '';
    if (region.latitude == editAddress?.latitude) {
      latitude = editAddress.latitude;
      longitude = editAddress.longitude;
    } else {
      latitude = region.latitude;
      longitude = region.longitude;
    }

    getAddressFromCoordinates(latitude, longitude);
  };

  function getAddressFromCoordinates(lat, lng) {
    console.log('lat', lat + lng);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      lat + ',' + lng
    }&key=${config.constants.MAP_API_KEY}`;
    axios
      .get(url)
      .then(res => {
        console.log(
          'res.data?.results[0]?.formatted_address',
          res.data?.results[0]?.formatted_address,
        );
        setAddress(res.data?.results[0]?.formatted_address);
        const full_address = res.data?.results[0]?.formatted_address.split(',');
        setBuildingName(full_address[1]);

        setlatitude(res.data?.results[0]?.geometry?.location?.lat);
        setlongitude(res.data?.results[0]?.geometry?.location?.lng);
        const component = res.data?.results[0]?.address_components;
        for (let i = 0; i < component?.length; i++) {
          if (
            component[i]?.types.includes('premise') ||
            component[i]?.types.includes('street_number')
          ) {
            setHouseNo(component[i]?.long_name);
          } else if (component[i]?.types.includes('postal_code')) {
            setPincode(component[i]?.long_name);
          } else if (
            component[i]?.types.includes('administrative_area_level_1')
          ) {
            // setaddi_number(component[i]?.long_name)
            // setCity(component[i]?.long_name);
          } else if (component[i]?.types.includes('locality')) {
            // setaddi_number(component[i]?.long_name)
            setLocality(component[i]?.long_name);
          } else if (component[i]?.types.includes('country')) {
            // setaddi_number(component[i]?.long_name)
            setCountry(component[i]?.long_name);
          }
        }
      })
      .catch(error => console.log('error', error));
    console.log(url);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: config.colors.white}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={region => {
          onRegionChange(region);
        }}

        // minZoomLevel={10}
        // onRegionChange={onAnnotationPress()}
        // provider={PROVIDER_GOOGLE}

        // zoomEnabled={true}
        // mapType={'satellite'}

        // showsUserLocation = {true}
      >
        <Marker coordinate={initialRegion}>
          <Image
            style={{
              height: 24,
              width: 24,
              tintColor: config.colors.orangeColor,
            }}
            source={require('../../assets/images/currentLocation.png')}
          />
        </Marker>
      </MapView>
      <View
        style={{alignSelf: 'center', position: 'absolute', top: '20%'}}
        pointerEvents="none">
        <Image
          style={{
            height: 40,
            width: 40,
            tintColor: config.colors.purpleColor,
          }}
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
          onPress={() => {
            requestLocationPermission('current');
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{
              height: 24,
              width: 24,
              tintColor: config.colors.purpleColor,
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
            }}>
            {t('Use Current Location')}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Regular,
            fontSize: 14,
            lineHeight: 18,
            color: config.colors.blackColor,
            marginTop: 10,
            textAlign: 'left',
          }}>
          {address}
        </Text>
        <AppButton
          text={t('Proceed')}
          onPress={() => {
            if (address != '') {
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
            } else {
              Toast.show({
                type: 'error',
                text1: t('Please select your address'),
              });
            }
          }}
          textStyle={{fontSize: 14}}
          buttonStyle={{marginVertical: 10}}
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
});
