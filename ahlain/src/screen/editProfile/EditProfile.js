import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Platform,
  I18nManager,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';
import AppTextInput from '../../conponents/AppInput';
import {EditProfileReducer, MyProfileReducer} from '../../redux/reducers';
import ImagePicker from '../../utils/ImagePicker';

import {check, PERMISSIONS, request} from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import {SagaActions} from '../../redux/sagas/SagaActions';
import CountryPicker from 'react-native-country-picker-modal';

import {useTranslation} from 'react-i18next';

const EditProfile = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const EditProfileResponse = useSelector(
    EditProfileReducer.selectEditProfileData,
  );
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);
  const [image, setImage] = useState();
  const [fullName, setFullName] = useState(
    MyProfileResponse?.results?.buyer?.full_name,
  );
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState(
    MyProfileResponse?.results?.buyer?.phone_number,
  );
  const [userImage, setUserImage] = useState(
    MyProfileResponse?.results?.buyer?.profile_image != ''
      ? MyProfileResponse?.results?.buyer?.profile_image
      : '',
  );
  const [show, setShow] = useState(false);
  const [imageObj, setProfileImageObj] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [countryCode, setCountryCode] = useState('SA');
  const [callingCode, setCallingCode] = useState('966');
  const [isCalenderVisible, setIsCalenderVisible] = useState(false);
  const [seletion, setSelection] = useState({start: 0, end: 0});
  const changeNum = num => {
    const formatNum = num.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    setphoneNumber(formatNum);
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);
  console.log('EditProfileResponse', EditProfileResponse);
  useEffect(() => {
    if (EditProfileResponse != null) {
      if (EditProfileResponse?.error == false) {
        dispatch({type: SagaActions.MY_PROFILE, payload: ''});
        Toast.show(EditProfileResponse?.message, Toast.LONG);
        dispatch(EditProfileReducer.removeEditProfileResponse());

        navigation.goBack();
      }
    }
  }, [EditProfileResponse]);
  const handleCameraPermission = async () => {
    const res = await check(PERMISSIONS.IOS.CAMERA);
    if (res === 'granted') {
      console.log('You can use ios camera');
      setCameraPermission(true);
    } else if (res === 'denied') {
      const res2 = request(PERMISSIONS.IOS.CAMERA);
    } else if (res === 'blocked') {
      alert(t('Please enable camera permission from app setting'));
    }
  };
  const requestCameraPermission = async () => {
    // ask for PermissionAndroid as written in your code
    if (Platform.OS === 'ios') {
      handleCameraPermission();
    } else {
      try {
        const res = await check(PERMISSIONS.ANDROID.CAMERA);
        if (res === 'granted') {
          console.log('You can use camera');
          setCameraPermission(true);
        } else if (res === 'denied') {
          const res2 = request(PERMISSIONS.ANDROID.CAMERA);
        } else if (res === 'blocked') {
          alert(t('Please enable camera permission from app setting'));
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (!I18nManager.isRTL) {return 1;}
    if (keyValue == 'Backspace') {
      setSelection({start: phoneNumber.length, end: phoneNumber.length});
    } else {
      setSelection({start: 0, end: 0});
    }
  };
  const onSelectCountry = country => {
    setCountryCode(country.cca2);
    setCallingCode(country?.callingCode[0]);
  };
  const ImageSelectModal = () => {
    return (
      <Modal visible={show} transparent={true} animationType="fade">
        <SafeAreaView style={styles.infoModalConatiner}>
          <View style={styles.modalCardView}>
            <TouchableOpacity
              onPress={() => setShow(false)}
              style={{alignItems: 'flex-end', margin: 10}}>
              <Image
                source={require('../../assets/images/closeIcon.png')}
                style={styles.closeImg}
              />
            </TouchableOpacity>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openCamera}
                style={styles.imageSelectOption}>
                <Text style={styles.imageSelectOptionTxt}>{t('Camera')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={openGallery}
                style={{...styles.imageSelectOption, marginVertical: 20}}>
                <Text style={styles.imageSelectOptionTxt}>{t('Gallery')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  const openCamera = () => {
    setShow(false);
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
          setUserImage(image.path);
          setProfileImageObj(imgObj);
        })
        .catch(e => console.log('e', e));
    }, 500);
  };

  const openGallery = () => {
    setShow(false);
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
          setUserImage(image.path);
          setProfileImageObj(imgObj);
        })
        .catch(e => console.log('e', e));
    }, 500);
  };

  const onPressSave = () => {
    if (fullName === '') {
      Toast.show(t('Please enter valid name.'), Toast.LONG);
    } else if (phoneNumber === '' || phoneNumber?.length < 5) {
      Toast.show(t('Please enter valid phone number.'), Toast.LONG);
    } else {
      callUpdateProfileApi();
    }
  };

  const callUpdateProfileApi = () => {
    const payload = {
      full_name: fullName,
      phone_number: phoneNumber.replace(/\s/g, ''),
      profile_image: imageObj,
      country_code: callingCode,
      country_short_name: countryCode,
    };
    dispatch({
      type: SagaActions.EDIT_PROFILE,
      payload,
    });
  };
  return (
    <View style={styles.container}>
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
          title={t('Personal information')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View style={styles.bgI}>
            {userImage == '' || userImage == null ? (
              <Image
                source={require('../../assets/images/user_icon.png')}
                style={styles.profile}
              />
            ) : (
              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                <Image source={{uri: userImage}} style={styles.profile} />
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                cameraPermission ? setShow(true) : requestCameraPermission();
              }}>
              <Image
                resizeMode="contain"
                style={styles.cameraIcon}
                source={require('../../assets/images/CameraIcon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.mainCss}>
            <AppTextInput
              inputTextLabel={t('Full Name')}
              placeholder={t('Enter your name')}
              onChangeText={val =>
                // setfullName(
                //   I18nManager.isRTL
                //     ? val.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF ]/g, '')
                //     : val.replace(/[^a-zA-Z ]/g, ''),
                // )
                setFullName(val)
              }
              value={fullName?.trimStart()}
              viewStyle={{marginHorizontal: 0}}
              maxLength={50}
            />
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
                    onChangeText={num => changeNum(num.replace(/[^0-9]/g, ''))}
                    value={phoneNumber}
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
            <AppTextInput
              inputTextLabel={t('Email Address')}
              value={MyProfileResponse?.results?.buyer?.email}
              placeholder={t('Enter your email')}
              viewStyle={{marginHorizontal: 0}}
              keyboardType="email-address"
              editable={false}
            />
          </View>
          <AppButton
            text={t('Save')}
            onPress={() => {
              onPressSave();
            }}
            buttonStyle={{marginHorizontal: 15}}
          />
        </View>
      </ScrollView>
      {ImageSelectModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  bgI: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
  },
  cameraIcon: {
    height: 45,
    width: 45,
    // position:"absolute",
    // top:100
    marginTop: -40,
    marginLeft: 65,
  },
  mainCss: {
    margin: 15,
    backgroundColor: config.colors.white,
    borderRadius: 12,
    padding: 15,
  },
  labelText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
    textAlign: 'left',
  },
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
    marginTop: 2,
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
  textInputConatiner: {
    width: '80%',
    marginHorizontal: 5,
    paddingHorizontal: 10,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    top: 1,
  },
  infoModalConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCardView: {
    marginHorizontal: 30,
    paddingVertical: 10,
    width: '90%',
    backgroundColor: config.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 2,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  closeImg: {width: 18, height: 18},
  imageSelectOption: {
    borderColor: config.colors.buttonColor,
    borderWidth: 2,
    height: 40,
    width: '70%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelectOptionTxt: {
    fontSize: 16,
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.TextColor,
  },
  userImageView: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: config.colors.Gray,
    borderWidth: 1,
  },
});

export default EditProfile;
