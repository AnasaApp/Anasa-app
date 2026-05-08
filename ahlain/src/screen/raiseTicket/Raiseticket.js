import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  I18nManager,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import {
  CreateSupportReducer,
  GetAllMyBookingsReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import ImagePicker from '../../utils/ImagePicker';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import Apiloader from '../../conponents/ApiLoader';
const Raiseticket = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const GetAllMyBookngsResponse = useSelector(
    GetAllMyBookingsReducer.selectGetAllMyBookingsData,
  );
  const CreateSupportResponse = useSelector(
    CreateSupportReducer.selectCreateSupportData,
  );

  console.log('bookingID', GetAllMyBookngsResponse);
  const [currentBooking, setCurrenBooking] = useState('');
  const [currentService, setCurrentService] = useState('');
  const [imageArray, setImageArray] = useState([]);

  const [subject, setSubject] = useState('');
  const [concern, setConcern] = useState('');
  const [cancelNote, setCancelNote] = useState('');
  const [requestTypesList, setRequestTypesList] = useState([
    'Delivery',
    'Product issue',
    'Technical',
    'Others',
  ]);
  const [selectedRequestType, setSelectedRequestType] = useState(
    route?.params?.requestType ?? '',
  );
  const [showRequestTypeList, setShowRequestTypeList] = useState(false);
  const [showBookingServiceList, setShowBookingServiceList] = useState(false);
  const [showBookingList, setShowBookingList] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.from == 'profile') {
      dispatch({type: SagaActions.GET_ALL_MY_BOOKINGS, payload: ''});
    } else {
      setCurrenBooking(route?.params?.bookingDetail);
    }
  }, []);
  useEffect(() => {
    if (CreateSupportResponse != null) {
      if (CreateSupportResponse?.error == false) {
        Toast.show(CreateSupportResponse?.message, Toast.LONG);

        navigation.navigate(config.routes.TICKETS);
        dispatch(CreateSupportReducer.removeCreateSupportResponse());
      }
    }
  }, [CreateSupportResponse]);

  const handleCameraPermission = async index => {
    const res = await check(PERMISSIONS.IOS.CAMERA);
    if (res === 'granted') {
      Upload_Image();
      console.log('You can use ios camera');
    } else if (res === 'denied') {
      const res2 = request(PERMISSIONS.IOS.CAMERA);
    } else if (res === 'blocked') {
      alert('Please enable camera permission from app setting');
    }
  };
  const requestCameraPermission = async index => {
    // ask for PermissionAndroid as written in your code
    if (Platform.OS === 'ios') {
      handleCameraPermission(index);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t('Anasa Camera Permission'),
            message: t(
              'Anasa needs access to your camera so you can Upload pictures.',
            ),
            buttonNeutral: t('Ask Me Later'),
            buttonNegative: t('Cancel'),
            buttonPositive: t('Ok'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Upload_Image();
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const onPressSubmit = async () => {
    // if (currentBooking == '') {
    //   return Toast.show(t('Please Select Booking'), Toast.LONG);
    // }
    // if (currentService == '') {
    //   return Toast.show(t('Please Select Service'), Toast.LONG);
    // }
    if (subject?.trim() == '') {
      return Toast.show(t('Please Enter Subject'), Toast.LONG);
    }
    if (concern?.trim() == '') {
      return Toast.show(t('Please enter your concern'), Toast.LONG);
    }
    // if (imageArray.length == 0) {
    //   return Toast.show(t('Please attach images'), Toast.LONG);
    // }
    var formData = new FormData();
    formData.append('bookingId', currentBooking ? currentBooking?._id : '');
    formData.append('serviceId', currentService ? currentService._id : '');
    formData.append('subject', subject);
    formData.append('concern', concern);
    formData.append('type', 'Buyer');
    formData.append('requestType', selectedRequestType);

    imageArray.forEach(element => {
      formData.append('images', element);
    });
    const userData = JSON.parse(
      await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
    );
    let language = 'English';
    language = await AsyncStorage.getItem('user_language');
    setIsApiLoading(true);
    axios({
      method: 'post',
      url: config.constants.BASE_API_URL + 'buyer/createSupport',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'x-auth-token-buyer': userData && userData?.token,
        'x-buyer-language': language,
      },
      data: formData,
    })
      .then(res => {
        setIsApiLoading(false);
        Toast.show(res?.data?.message, Toast.LONG);

        navigation.navigate(config.routes.TICKETS);
      })
      .catch(e => {
        setIsApiLoading(false);
        console.log('e', e);
      });
    // dispatch({
    //   type: SagaActions.CREATE_SUPPORT,
    //   payload:payload,
    // });
  };
  const Upload_Image = () =>
    Alert.alert(t('Upload'), t('Please Uplaod Image'), [
      {
        text: t('Gallery'),
        onPress: () => openGallery(''),
      },
      {text: t('Camera'), onPress: () => openCamera('')},
      {
        text: t('Cancel'),
        onPress: () => console.log(''),
      },
    ]);

  const openCamera = () => {
    let options = {
      quality: 0.4,
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
    };
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          let imgObj = {
            uri: image.path,
            type: 'image/jpeg',
            name: Date.now() + 'image1.jpeg',
          };
          setImageArray([...imageArray, imgObj]);
        })
        .catch(e => console.log('e', e));
    }, 500);
  };

  const openGallery = () => {
    let options = {
      quality: 0.2,
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
    };
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          let imgObj = {
            uri: image.path,
            type: 'image/jpeg',
            name: Date.now() + 'image1.jpeg',
          };
          setImageArray([...imageArray, imgObj]);
        })
        .catch(e => console.log('e', e));
    }, 500);
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
          title={t('Raise Ticket')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={styles.mainCss}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowRequestTypeList(!showRequestTypeList);
            }}>
            <AppTextInput
              inputTextLabel={t('Type of complaint/inquiry')}
              placeholder={t('Select Type')}
              editable={false}
              value={t(selectedRequestType)}
              rightIcon={require('../../assets/images/downArrowIcon.png')}
              rightIconPress={() =>
                setShowRequestTypeList(!showRequestTypeList)
              }
            />
          </TouchableOpacity>
          {showRequestTypeList && (
            <View
              style={{
                backgroundColor: config.colors.white,
                maxHeight: 140,
                borderRadius: 6,
                padding: 10,
                elevation: 2,
              }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {requestTypesList?.map((r, i) => {
                  return (
                    <Text
                      key={i}
                      onPress={() => {
                        setSelectedRequestType(r);
                        setShowRequestTypeList(false);
                      }}
                      style={{
                        fontFamily: config.fonts.Poppins_Regular,
                        fontSize: 12,
                        color: config.colors.Black,
                        // borderBottomWidth: 1,
                        // borderColor: config.colors.Gray,
                        padding: 4,
                        textAlign: 'left',
                      }}>
                      {t(r)}
                    </Text>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {route?.params?.from == 'profile' ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setShowBookingList(!showBookingList);
                }}>
                <AppTextInput
                  inputTextLabel={t('Order ID')}
                  placeholder="#12345"
                  editable={false}
                  value={currentBooking?.bookingID}
                  rightIcon={require('../../assets/images/downArrowIcon.png')}
                  rightIconPress={() => setShowBookingList(!showBookingList)}
                />
              </TouchableOpacity>
              {showBookingList && (
                <View
                  style={{
                    backgroundColor: config.colors.white,
                    maxHeight: 140,
                    borderRadius: 6,
                    padding: 10,
                    elevation: 2,
                  }}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}>
                    {GetAllMyBookngsResponse?.results?.bookings?.map((s, i) => {
                      return (
                        <Text
                          key={i}
                          onPress={() => {
                            setCurrenBooking(s);
                            setCurrentService('');
                            setShowBookingList(false);
                          }}
                          style={{
                            fontFamily: config.fonts.Poppins_Regular,
                            fontSize: 12,
                            color: config.colors.Black,
                            // borderBottomWidth: 1,
                            // borderColor: config.colors.Gray,
                            padding: 4,
                            textAlign: 'left',
                          }}>
                          {s?.bookingID}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowBookingList(!showBookingList);
              }}>
              <AppTextInput
                inputTextLabel={t('Booking Id')}
                placeholder="#12345"
                value={route?.params?.bookingDetail?.bookingID}
                editable={false}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowBookingServiceList(!showBookingServiceList);
            }}>
            <AppTextInput
              inputTextLabel={t('Select the service')}
              placeholder={t('List of order inside the selected ...')}
              editable={false}
              value={
                I18nManager.isRTL
                  ? currentService?.name_ar
                  : currentService?.name_en
              }
              rightIcon={require('../../assets/images/downArrowIcon.png')}
              rightIconPress={() =>
                setShowBookingServiceList(!showBookingServiceList)
              }
            />
          </TouchableOpacity>
          {showBookingServiceList && (
            <View
              style={{
                backgroundColor: config.colors.white,
                maxHeight: 140,
                borderRadius: 6,
                padding: 10,
                elevation: 2,
              }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {route?.params?.from == 'profile'
                  ? currentBooking?.services?.map((s, i) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setCurrentService(s.service);
                            setShowBookingServiceList(false);
                          }}
                          key={i}
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
                            source={{uri: s?.service?.images[0]}}
                          />
                          <Text
                            onPress={() => {
                              setCurrentService(s.service);
                              setShowBookingServiceList(false);
                            }}
                            style={{
                              fontFamily: config.fonts.Poppins_Regular,
                              fontSize: 12,
                              color: config.colors.Black,
                              // borderBottomWidth: 1,
                              // borderColor: config.colors.Gray,
                              padding: 4,

                              textAlign: 'left',
                              marginHorizontal: 6,
                            }}>
                            {I18nManager.isRTL
                              ? s.service.name_ar
                              : s.service.name_en}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  : route?.params?.bookingDetail?.services?.map((s, i) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setCurrentService(s.service);
                            setShowBookingServiceList(false);
                          }}
                          key={i}
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
                            source={{uri: s?.service?.images[0]}}
                          />
                          <Text
                            onPress={() => {
                              setCurrentService(s.service);
                              setShowBookingServiceList(false);
                            }}
                            style={{
                              fontFamily: config.fonts.Poppins_Regular,
                              fontSize: 12,
                              color: config.colors.Black,
                              // borderBottomWidth: 1,
                              // borderColor: config.colors.Gray,
                              padding: 4,

                              textAlign: 'left',
                              marginHorizontal: 6,
                            }}>
                            {I18nManager.isRTL
                              ? s.service.name_ar
                              : s.service.name_en}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
              </ScrollView>
            </View>
          )}
          <AppTextInput
            inputTextLabel={t('Subject')}
            placeholder={t('Enter the reason')}
            onChangeText={val => setSubject(val)}
            value={subject?.trimStart()}
          />
          <View>
            <AppTextInput
              inputTextLabel={t('Write your concerns')}
              placeholder={t('Write here')}
              textAlignVertical={'top'}
              textInputStyle={{
                flex: 1,
                height: 120,
                textAlign: 'left',
                color: config.colors.Black,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              viewStyle={{marginHorizontal: 0, height: 120}}
              multiline={true}
              returnKeyType={'next'}
              onChangeText={val => {
                setConcern(val);
              }}
              value={concern?.trimStart()}
            />
            <Text style={styles.headingText}>{t('Attach images')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: 10,
              }}>
              {imageArray.length > 0 ? (
                <>
                  {imageArray?.map((img, i) => {
                    console.log('img', img);
                    {
                      return (
                        <TouchableOpacity
                          key={i}
                          // onPress={() => {
                          //   Upload_Image();
                          // }}
                          activeOpacity={0.5}
                          style={styles.ImgCss}>
                          <Image
                            style={[styles.addIcon, {marginRight: 12}]}
                            resizeMode="contain"
                            source={{uri: img?.uri ? img?.uri : img}}
                          />
                        </TouchableOpacity>
                      );
                    }
                  })}
                  <TouchableOpacity
                    onPress={() => {
                      requestCameraPermission();
                    }}
                    activeOpacity={0.5}
                    style={[styles.attechCss, {marginRight: 12}]}>
                    <Image
                      style={[styles.attechImage]}
                      resizeMode="contain"
                      source={require('../../assets/images/galleryIcon.png')}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    requestCameraPermission();
                  }}
                  activeOpacity={0.5}
                  style={[styles.attechCss, {marginRight: 12}]}>
                  <Image
                    style={[styles.attechImage]}
                    resizeMode="contain"
                    source={require('../../assets/images/galleryIcon.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <AppButton
        text={t('Submit')}
        onPress={() => onPressSubmit()}
        buttonStyle={{
          marginVertical: 20,
          marginHorizontal: 15,
          backgroundColor: config.colors.blueColor,
        }}
      />
      {isApiLoading && Apiloader()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.white,
    paddingBottom: 10,
  },
  mainCss: {
    marginHorizontal: 15,
    flex: 1,
  },
  headingText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
  },
  input: {
    height: 110,
    borderRadius: 4,
    marginVertical: 5,
    borderColor: '#9E9E9E',
    borderWidth: 0.7,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  attechCss: {
    height: 122,
    width: 102,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ABABB680',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C0C0C01A',
    marginTop: 10,
  },
  attechImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  addIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginTop: 12,
    borderRadius: 8,
  },
});

export default Raiseticket;
