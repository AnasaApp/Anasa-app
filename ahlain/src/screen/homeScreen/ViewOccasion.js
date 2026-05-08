import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  Switch,
  I18nManager,
  StatusBar,
  FlatList,
  ImageBackground,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  ChangeLanguageReducer,
  ChangeNotificationReducer,
  MyProfileReducer,
  ViewOccasionReducer,
} from '../../redux/reducers';

import {useTranslation} from 'react-i18next';
import {SagaActions} from '../../redux/sagas/SagaActions';

const ViewOccasion = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const ViewOccasionResponse = useSelector(
    ViewOccasionReducer.selectViewOccasionData,
  );
  const MyProfileResponse = useSelector(MyProfileReducer.selectMyProfileData);

  const [isNotf, setisNotf] = useState(
    MyProfileResponse?.results?.buyer?.notification_status,
  );
  const [occasionItem, setOccasionItem] = useState(
    route?.params?.occasionItem ?? '',
  );

  //hooks calling
  useEffect(() => {
    if (ViewOccasionResponse != null) {
      if (ViewOccasionResponse?.error == false) {
        console.log(
          'ViewOccasionResponse',
          JSON.stringify(ViewOccasionResponse),
        );
        setOccasionItem(ViewOccasionResponse?.results?.occasion);

        dispatch(ViewOccasionReducer.removeViewOccasionResponse());
      }
    }
  }, [ViewOccasionResponse]);

  //api calling
  useEffect(() => {
    callViewOccasionApi();
  }, []);

  //function calling

  const callViewOccasionApi = () => {
    const payload = {
      uri: '/' + occasionItem?._id,
    };
    console.log('payload', payload);
    dispatch({type: SagaActions.VIEW_OCCASION, payload});
  };
  const renderOccasionItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginHorizontal: 15,
          backgroundColor: config.colors.white,
          marginBottom: 15,
          borderRadius: 12,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(config.routes.Banner_Detail, {
            banner_id: item?._id,
          });
        }}>
        <ImageBackground
          resizeMode="cover"
          style={{
            width: '100%',
            height: 150,
            overflow: 'hidden',
            borderRadius: 10,
          }}
          source={{
            uri: item?.image,
          }} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingHorizontal: 10,
          }}>
          <View>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 16,
                color: config.colors.Black,
                lineHeight: 24,
              }}>
              {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Medium,
                  fontSize: 14,
                  lineHeight: 22,
                  color: config.colors.orangeColor,
                  marginHorizontal: 4,
                }}>
                {item?.comboPrice}
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    fontSize: 12,
                    color: config.colors.Black,
                  }}>
                  {' SAR'}
                </Text>
              </Text>
            </View>
          </View>
          <Image
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
            source={require('../../assets/images/addCardtroly.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: config.colors.BACKGROUNDCOLOR}}>
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
          title={
            I18nManager?.isRTL ? occasionItem.name_ar : occasionItem?.name_en
          }
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={occasionItem?.offers}
          // keyExtractor={item => item?._id.toString()}
          renderItem={renderOccasionItem}
          contentContainerStyle={{
            paddingVertical: 15,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    paddingBottom: 10,
  },
  mainCss: {
    marginHorizontal: 15,
    flex: 1,
    // marginTop: 10,
  },
  iconCss: {
    height: 60,
    backgroundColor: config.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5E5F770F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  nameCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    height: 30,
    width: 30,
  },
  name: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 16,
    marginLeft: 20,
  },
  selectIcon: {
    height: 18,
    width: 18,
  },
  languageMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
  },
});

export default ViewOccasion;
