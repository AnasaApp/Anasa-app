import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  PermissionsAndroid,
  Alert,
  I18nManager,
  useColorScheme,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RBSheet from 'react-native-raw-bottom-sheet';

import {useDispatch, useSelector} from 'react-redux';
import {
  AddPacakageToCartReducer,
  CreateServiceEligiblityReducer,
  CreateRequestReducer,
  EditRequestReducer,
  MakePaymentReducer,
  MyProfileReducer,
  ViewRequestReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AppButton from '../../conponents/AppButton';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import ImagePicker from '../../utils/ImagePicker';

import {PERMISSIONS, check, request} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Apiloader from '../../conponents/ApiLoader';
import FooterComponent from '../../conponents/FooterComponent';
let finalPackageArray = [];

const StartServiceRequest = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: config.colors.orangeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingBottom: 10,
        }}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('Create Request')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            backgroundColor: config.colors.white,
            borderRadius: 15,
            alignItems: 'center',
            padding: 15,
            marginTop: 10,
          }}>
          <Image
            resizeMode="contain"
            style={{width: 24, height: 24, marginTop: 10}}
            source={require('../../assets/images/partyUserIcon.png')}
          />
          <Text
            style={{
              fontFamily: config.fonts.Poppins_SemiBold,
              fontSize: 16,
              lineHeight: 26,
              marginTop: 10,
            }}>
            {t('Plan my party')}
          </Text>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Regular,
              fontSize: 12,
              lineHeight: 22,
              marginTop: 10,
            }}>
            {t(
              'It is a services designed to assist you in organizing your party or gathering while staying within your allocated budget. By using this service, you can save valuable time and energy that would otherwise be spent searching for suitable products and resources. Our team of experts will plan and choose on your behalf, ensuring that your event is tailored to your preferences and requirements and adding the items in your cart for your process.',
            )}
          </Text>
        </View>
        <AppButton
          text={t('Continue')}
          onPress={() => {
            navigation.navigate(config.routes.CREATE_SERVICE_REQUEST);
          }}
          buttonStyle={{
            marginTop: 30,
            width: '100%',
            backgroundColor: config.colors.buttonColor,
          }}
        />
      </View>
      <FooterComponent from={'request'} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  flatlistCss: {
    flex: 1,
    marginHorizontal: 15,
  },
  EventText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E9',
    paddingBottom: 15,
    // marginHorizontal: 10,
  },
  nameText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
    marginVertical: 5,
    textAlign: 'left',
  },
  nameinputCss: {
    marginTop: 10,
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
    color: config.colors.Black,
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  inputType: {
    fontSize: 14,
    fontFamily: config.fonts.Poppins_Medium,
    height: 90,
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    paddingHorizontal: 15,
    marginTop: 5,
    textAlignVertical: 'top',
    textAlign: 'left',
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  savelocText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
  },
  locationMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveLocCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  LocIcon: {
    height: 12,
    width: 12,
  },
  dateCss: {
    borderWidth: 1,
    borderColor: '#ABABB680',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateFirstCss: {
    width: '47%',
    marginTop: 7,
  },
  calenderIcon: {
    height: 18,
    width: 18,
  },
  dateText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#00000080',
    fontSize: 12,
    marginHorizontal: 5,
    marginTop: 3,
  },
  plusIcon: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    marginRight: 10,
  },
  packageMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  packageText: {
    fontSize: 13,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    width: '60%',
    textAlign: 'left',
  },
  packagePriceText: {
    fontSize: 13,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    marginHorizontal: 10,
    width: '30%',
    textAlign: 'center',
  },
  packageCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
    width: 65,
  },
  addIcon: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginTop: 12,
    borderRadius: 8,
  },
});

export default StartServiceRequest;
