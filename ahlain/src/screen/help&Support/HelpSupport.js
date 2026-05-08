import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  I18nManager,
  StatusBar,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {useTranslation} from 'react-i18next';
import {GetFAQReducer} from '../../redux/reducers';
import {useDispatch, useSelector} from 'react-redux';
import {SagaActions} from '../../redux/sagas/SagaActions';

const HelpSupport = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();

  const GetFAQResponse = useSelector(GetFAQReducer.selectGetFAQData);
  console.log('GetFAQResponse', JSON.stringify(GetFAQResponse));
  useEffect(() => {
    dispatch({type: SagaActions.GET_FAQ, payload: ''});
  }, []);

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
          title={t('Help & Support')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainCss}>
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 16,
                lineHeight: 26,
                marginTop: 10,
                textAlign: 'left',
              }}>
              {t('Type of complaint/inquiry')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(config.routes.RAISE_TICKET, {
                      from: 'profile',
                      requestType: 'Delivery',
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    backgroundColor: config.colors.creamColor,
                    borderRadius: 30,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={require('../../assets/images/truckIcon.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 22,
                    marginTop: 10,
                  }}>
                  {t('Delivery')}
                </Text>
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(config.routes.RAISE_TICKET, {
                      from: 'profile',
                      requestType: 'Product issue',
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    backgroundColor: config.colors.creamColor,
                    borderRadius: 30,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={require('../../assets/images/packageIcon.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 22,
                    marginTop: 10,
                  }}>
                  {t('Product issue')}
                </Text>
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(config.routes.RAISE_TICKET, {
                      from: 'profile',
                      requestType: 'Others',
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    backgroundColor: config.colors.creamColor,
                    borderRadius: 30,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: config.colors.Black,
                    }}
                    source={require('../../assets/images/categoryIcon.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 22,
                    marginTop: 10,
                  }}>
                  {t('Others')}
                </Text>
              </View>
              <View
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(config.routes.RAISE_TICKET, {
                      from: 'profile',
                      requestType: 'Technical',
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    backgroundColor: config.colors.creamColor,
                    borderRadius: 30,
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={require('../../assets/images/settingsIcon.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 22,
                    marginTop: 10,
                  }}>
                  {t('Technical')}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 15,
              }}
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate(config.routes.TICKETS);
              }}>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_SemiBold,
                  fontSize: 16,
                  lineHeight: 26,
                  flex: 1,
                  textAlign: 'left',
                }}>
                {t('View my Complaints/Inquiry')}
              </Text>
              <Image
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  tintColor: config.colors.Black,
                  transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
                }}
                source={require('../../assets/images/next.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: config.colors.white,
              borderRadius: 12,
              padding: 15,
              marginTop: 15,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 16,
                lineHeight: 26,
                marginTop: 10,
                textAlign: 'left',
              }}>
              {t('FAQ')}
            </Text>
            {GetFAQResponse?.results?.faqs?.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 15,
                    marginTop: 10,
                  }}
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate(config.routes.FAQ, {
                      faqItem: item,
                    });
                  }}>
                  <Text
                    style={{
                      fontFamily: config.fonts.Poppins_Regular,
                      color: config.colors.Black,
                      fontSize: 14,
                      flex: 1,
                      textAlign: 'left',
                    }}>
                    {I18nManager?.isRTL ? item?.title_ar : item?.title_en}
                  </Text>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: config.colors.Black,
                      transform: [
                        {rotate: I18nManager.isRTL ? '180deg' : '0deg'},
                      ],
                    }}
                    source={require('../../assets/images/next.png')}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  },
  ticketMainCss: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#5E5F770F',
    backgroundColor: config.colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  ticketCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
  },
  tickettext: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 16,
    marginLeft: 15,
  },
  nextIcon: {
    height: 19,
    width: 19,
    tintColor: config.colors.Gray,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  dataCss: {
    marginTop: 25,
  },
  faqsText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 18,
  },
  dataText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13.5,
    color: '#313450',
    marginTop: 5,
    lineHeight: 24,
  },
});

export default HelpSupport;
