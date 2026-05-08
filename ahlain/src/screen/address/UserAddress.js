import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import config from '../../config';
import Toast from 'react-native-simple-toast';
import AppHeader from '../../conponents/AppHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  ChangeDefaultAddressReducer,
  GetAddressReducer,
  DeleteAddressReducer,
  MyProfileReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useTranslation} from 'react-i18next';
import NoData from '../../conponents/NoData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonModal} from '../../conponents/CommonModal';
import AppImage from '../../conponents/AppImage';
import {AppButton} from '../../conponents';
import {useFocusEffect} from '@react-navigation/native';

const SelectLocation = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const UserProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const ChangeDefaultAddressResponse = useSelector(
    ChangeDefaultAddressReducer.selectChangeDefaultAddressData,
  );
  const GetAddressResponse = useSelector(
    GetAddressReducer.selectGetAddressData,
  );
  const DeleteAddressResponse = useSelector(
    DeleteAddressReducer.selectDeleteAddressData,
  );
  const DeleteAddressErrorResponse = useSelector(
    DeleteAddressReducer.selectDeleteAddressResponse,
  );
  const [select, setSelect] = useState(
    UserProfileResponse?.results?.buyer?.default_address?._id,
  );
  const [selectLocation, setSelectLocation] = useState(
    UserProfileResponse?.results?.buyer?.default_address,
  );

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const onChange = val => {
    setSelect(val._id);
    setSelectLocation(val);
    if (route?.params?.from == 'Cart') {
    } else {
      const payload = {
        uri: '/' + val._id,
      };
      dispatch({type: SagaActions.CHANGE_DEFAULT_ADDRESS, payload});
    }
  };
  useFocusEffect(
    useCallback(() => {
      callGetAddressApi();
    }, []),
  );
  useEffect(() => {
    if (ChangeDefaultAddressResponse != null) {
      if (ChangeDefaultAddressResponse?.error == false) {
        Toast.show(ChangeDefaultAddressResponse?.message, Toast.LONG);
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
        dispatch(
          ChangeDefaultAddressReducer.removeChangeDefaultAddressResponse(),
        );
      }
    }
  }, [ChangeDefaultAddressResponse]);

  useEffect(() => {
    if (DeleteAddressResponse != null) {
      if (DeleteAddressResponse?.error == false) {
        Toast.show(DeleteAddressResponse?.message, Toast.LONG);
        callGetAddressApi();
        dispatch(DeleteAddressReducer.removeDeleteAddressResponse());
      }
    }
  }, [DeleteAddressResponse]);
  useEffect(() => {
    if (DeleteAddressErrorResponse != null) {
      if (DeleteAddressErrorResponse?.message != '') {
        Toast.show(DeleteAddressErrorResponse?.message, Toast.LONG);

        dispatch(DeleteAddressReducer.removeDeleteAddressResponse());
      }
    }
  }, [DeleteAddressErrorResponse]);
  //api calling

  const callGetAddressApi = () => {
    dispatch({type: SagaActions.GET_ADDRESS, payload: {search: ''}});
  };
  const callDeleteAddressApi = addressId => {
    const payload = {
      uri: '/' + addressId,
    };
    dispatch({type: SagaActions.DELETE_ADDRESS, payload});
  };
  return (
    <View style={styles.SafeAreaView}>
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
          title={t('Saved Address')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {GetAddressResponse?.results?.address?.length > 0 ? (
            <View style={styles.mainCss}>
              {route?.params?.from == 'Cart' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={async () => {
                    const res = await AsyncStorage.getItem(
                      config.AsyncKeys.USER_LOCATION,
                    );
                    if (res) {
                      const result = JSON.parse(res);
                      navigation.navigate(config.routes.MAP_VIEW_LOCATION, {
                        from: 'add',
                        latitude: result?.latitude,
                        longitude: result?.longitude,
                      });
                    } else {
                      navigation.navigate(config.routes.MAP_VIEW_LOCATION, {
                        from: 'add',
                        latitude: 0,
                        longitude: 0,
                      });
                    }
                  }}
                  style={styles.currentLocationCss}>
                  <Image
                    style={{
                      height: 25,
                      width: 25,
                      marginBottom: 1,
                      marginRight: 5,
                      tintColor: config.colors.buttonColor,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                    source={require('../../assets/images/plus.png')}
                  />
                  <Text style={styles.currentLocText}>
                    {t('Add New Location')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}

              {GetAddressResponse?.results?.address?.map((item, index) => {
                {
                  return (
                    <View style={styles.homeMainCss} key={index}>
                      <View style={styles.homeCss}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: config.colors.borderColor,
                            padding: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: config.colors.borderColor,
                              paddingHorizontal: 12,
                              paddingVertical: 4,
                              borderRadius: 10,
                            }}>
                            <Image
                              style={{
                                width: 18,
                                height: 18,
                              }}
                              resizeMode="contain"
                              source={
                                item?.addressType == 'Home'
                                  ? require('../../assets/images/homeIcon2.png')
                                  : require('../../assets/images/eventIcon.png')
                              }
                            />

                            <Text
                              style={{
                                fontFamily: config.fonts.Poppins_Medium,
                                color: config.colors.Light_Black,
                                fontSize: 14,
                                marginLeft: 5,
                              }}>
                              {t(item?.addressType)}
                            </Text>
                          </View>
                          <View
                            style={{
                              alignItems: 'center',

                              flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  item?.latitude != 0 &&
                                  item?.longitude != 0
                                ) {
                                  navigation.navigate(
                                    config.routes.MAP_VIEW_LOCATION,
                                    {
                                      from: 'edit',
                                      edit_address: item,
                                      latitude: item?.latitude,
                                      longitude: item?.longitude,
                                    },
                                  );
                                } else {
                                  Toast.show(
                                    t('No Cordinates Available'),
                                    Toast.LONG,
                                  );
                                }
                              }}
                              activeOpacity={0.8}>
                              <AppImage
                                imageStyle={styles.currentLocation}
                                resizeMode="contain"
                                imageSource={config.ImageList.editIcon}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setIsConfirmationModalVisible(true);
                                setSelectedAddress(item);
                              }}
                              style={{marginLeft: 10}}
                              activeOpacity={0.8}>
                              <AppImage
                                imageStyle={styles.currentLocation}
                                resizeMode="contain"
                                imageSource={config.ImageList.deleteIcon}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{marginLeft: 10}}
                              onPress={() => {
                                onChange(item);
                              }}>
                              <Image
                                resizeMode="contain"
                                style={styles.Tick}
                                source={
                                  select == item?._id
                                    ? require('../../assets/images/Tick.png')
                                    : require('../../assets/images/Untick.png')
                                }
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          marginTop: 5,
                          marginHorizontal: 10,
                        }}>
                        <Text style={styles.detailsText}>{item.name}</Text>
                        <Text style={styles.detailsText}>
                          {`${item?.country_code ?? ''} ${item?.mobileNumber}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginHorizontal: 10,
                        }}>
                        <Text style={styles.detailsText}>
                          {item.house_number}
                          {', '}
                          {item?.building_name}
                          {', '}
                          {item.locality}
                          {', '}
                          {item.city}
                          {', '}
                          {item.country}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })}
            </View>
          ) : (
            <View
              style={{
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppImage
                imageStyle={{
                  height: 200,
                  width: 200,
                }}
                resizeMode="contain"
                imageSource={config.ImageList.noAddressIcon}
              />
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  fontSize: 16,
                  lineHeight: 26,
                  color: config.colors.Black,
                  marginTop: 10,
                  textAlign: 'center',
                  alignSelf: 'center',
                  width: '80%',
                }}>
                {t('No address saved yet')}
              </Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 14,
                  lineHeight: 22,
                  color: config.colors.Gray,
                  marginTop: 10,
                  textAlign: 'center',
                  alignSelf: 'center',
                  width: '80%',
                }}>
                {t(
                  'Let\'s add your frequently used addresses, so you can find \'em in just one tap',
                )}
              </Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.buttonMainView}>
          {route?.params?.from == 'Cart' ? (
            <TouchableOpacity
              style={styles.buttonCss}
              activeOpacity={0.5}
              onPress={() => {
                route?.params?.setLocationId(selectLocation);
                navigation.goBack();
              }}>
              <Text style={styles.buttonText}>{t('Confirm')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonCss}
              activeOpacity={0.5}
              onPress={async () => {
                const res = await AsyncStorage.getItem(
                  config.AsyncKeys.USER_LOCATION,
                );
                if (res) {
                  const result = JSON.parse(res);
                  navigation.navigate(config.routes.MAP_VIEW_LOCATION, {
                    from: 'add',
                    latitude: result?.latitude,
                    longitude: result?.longitude,
                  });
                } else {
                  navigation.navigate(config.routes.MAP_VIEW_LOCATION, {
                    from: 'add',
                    latitude: 0,
                    longitude: 0,
                  });
                }
              }}>
              <Text style={styles.buttonText}>{t('Add Address')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CommonModal
        navigation={navigation}
        isCommonModalVisible={isConfirmationModalVisible}
        setIsCommonModalVisible={setIsConfirmationModalVisible}
        title={t('Delete Address')}
        subTitle={t('Are you sure to delete this?')}
        showButtonInRow={true}
        FirstButton={() => (
          <AppButton
            buttonStyle={{
              backgroundColor: config.colors.white,
              borderWidth: 1,
              borderColor: config.colors.orangeColor,
              width: '48%',
            }}
            text={t('No')}
            textStyle={{color: config.colors.orangeColor}}
            onPress={() => {
              setIsConfirmationModalVisible(false);
            }}
          />
        )}
        SecondButton={() => (
          <AppButton
            buttonStyle={{
              width: '48%',
            }}
            text={t('Yes')}
            onPress={() => {
              setIsConfirmationModalVisible(false);
              callDeleteAddressApi(selectedAddress?._id);
            }}
          />
        )}
      />
    </View>
  );
};

export default SelectLocation;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  mainCss: {
    // flex: 1,
    // backgroundColor:'gray',
    marginHorizontal: 15,
    marginTop: 15,
  },
  currentLocationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocation: {
    height: 25,
    width: 25,
    marginBottom: 1,
    marginRight: 5,
  },
  currentLocText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    marginLeft: 10,
    marginTop: 3,
  },
  FlatlistCss: {
    backgroundColor: 'red',
    width: '100%',
  },
  homeCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    width: '90%',
    textAlign: 'left',
  },
  detailsText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Gray,
    fontSize: 13,
    width: '90%',
    marginTop: 5,
    textAlign: 'left',
  },
  Tick: {
    height: 18,
    width: 18,
  },
  homeMainCss: {
    marginTop: 30,
    marginHorizontal: 15,
    backgroundColor: config.colors.white,
    borderRadius: 10,
    paddingBottom: 10,
  },
  buttonMainView: {
    marginHorizontal: 15,
  },
  buttonCss: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 55,
    backgroundColor: config.colors.orangeColor,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_Medium,
    lineHeight: 24,
    marginHorizontal: 5,
  },
});
