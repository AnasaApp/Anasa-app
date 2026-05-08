import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  Platform,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {GetCategoriesReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import FooterComponent from '../../conponents/FooterComponent';
import AppImage from '../../conponents/AppImage';
import {AppTextInput} from '../../conponents';
import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';

const Categories = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const CategoriesResponse = useSelector(
    GetCategoriesReducer.selectGetCategoriesData,
  );
  const [sortByPrice, setSortByPrice] = useState('');
  const [sortByName, setSortByName] = useState(1);
  const [isListView, setIsListView] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);

  const isFocused = useIsFocused();

  //hooks calling
  useEffect(() => {
    if (CategoriesResponse != null && isFocused) {
      if (CategoriesResponse?.error == false) {
        console.log('CategoriesResponse', JSON.stringify(CategoriesResponse));
        setCategoriesList(CategoriesResponse?.results?.categories);
        dispatch(GetCategoriesReducer.removeGetCategoriesResponse());
      }
    }
  }, [CategoriesResponse]);
  useEffect(() => {
    callGetCategoriesApi('', 0);
  }, []);
  const callGetCategoriesApi = (search, sortByName) => {
    const payload = {
      uri: `?search=${search}&sort_by_name=${sortByName}`,
    };
    dispatch({type: SagaActions.GET_CATEGORIES, payload});
  };

  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      callGetCategoriesApi(text, 0);
    }, 500),
    [],
  );
  const renderItem = (item, index) => {
    if (route?.params?.fromData) {
      item = item?.category;
    }

    return isListView ? (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: config.colors.white,
          marginBottom: 40,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 2,
          width: '100%',
        }}
        activeOpacity={0.5}
        onPress={() => {
          // if (item?.subCategoriesCount > 0) {
          //   navigation.navigate(config.routes.SUBCATEGORIES, {
          //     cate: item,
          //   });
          // } else {
          //   navigation.navigate(config.routes.SEARCH_RESULT, {
          //     search_result: item,
          //   });
          // }
          navigation.navigate(config.routes.SUBCATEGORIES, {
            cate: item,
            search_result: item,
          });
        }}>
        {index % 2 == 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
              paddingHorizontal: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: config.colors.Black,
                fontFamily: config.fonts.Poppins_SemiBold,
                flex: 1,
                textAlign: 'left',
              }}>
              {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
            </Text>
            <AppImage
              uri={item?.image}
              imageStyle={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
              }}
              // source={require('../../assets/images/flowerImage.png')}
            />
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: config.colors.orangeColor,
                borderRadius: 50,
                position: 'absolute',
                left: 15,
                top: 10,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: config.colors.white,
                  fontFamily: config.fonts.Poppins_SemiBold,
                }}>
                {t('New')}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
              paddingHorizontal: 5,
            }}>
            <AppImage
              uri={item?.image}
              imageStyle={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 18,
                color: config.colors.Black,
                fontFamily: config.fonts.Poppins_SemiBold,
                lineHeight: 24,
                flex: 1,
                textAlign: 'right',
              }}>
              {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
            </Text>

            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: config.colors.orangeColor,
                borderRadius: 50,
                position: 'absolute',
                right: 15,
                top: 10,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: config.colors.white,
                  fontFamily: config.fonts.Poppins_SemiBold,
                }}>
                {t('New')}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    ) : (
      <View
        key={index}
        style={{
          width: '50%',
          paddingHorizontal: 8,
          paddingVertical: 5,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: config.colors.white,
            height: 180,
            paddingHorizontal: 15,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate(config.routes.SUBCATEGORIES, {
              cate: item,
              search_result: item,
            });
          }}>
          <AppImage
            uri={item?.image}
            imageStyle={{
              width: 120,
              height: 120,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            backgroundColor: config.colors.orangeColor,
            borderRadius: 50,
            position: 'absolute',
            right: 15,
            top: 15,
          }}>
          <Text
            style={{
              fontSize: 11,
              color: config.colors.white,
              fontFamily: config.fonts.Poppins_SemiBold,
            }}>
            {t('New')}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: config.colors.Black,
            fontFamily: config.fonts.Poppins_SemiBold,
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          {I18nManager?.isRTL ? item?.name_ar : item?.name_en}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: config.colors.orangeColor,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingVertical: 10,
          paddingHorizontal: 10,
          paddingTop: Platform.OS == 'ios' ? 60 : 20,
        }}>
        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              alignItems: 'center',
              backgroundColor: config.colors.white,
              width: 40,
              height: 40,
              justifyContent: 'center',
              borderRadius: 50,
            }}>
            <Image
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                transform: [{rotate: I18nManager?.isRTL ? '180deg' : '0deg'}],
              }}
              source={require('../../assets/images/backArrowIcon.png')}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 16,
              lineHeight: 24,
              color: config.colors.white,
            }}>
            {t('Our Services')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!route?.params?.fromData && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (sortByName == 1) {
                    callGetCategoriesApi(searchText, 0);
                    setSortByName(0);
                  } else {
                    callGetCategoriesApi(searchText, 1);
                    setSortByName(1);
                  }
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 20,

                    tintColor: config.colors.white,
                  }}
                  resizeMode="contain"
                  source={require('../../assets/images/sort_by_name.png')}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsListView(true);
              }}
              style={{
                alignItems: 'center',
                marginLeft: 10,
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/listIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsListView(false);
              }}
              style={{
                alignItems: 'center',
                marginLeft: 10,
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: config.colors.white,
                }}
                source={require('../../assets/images/categoryIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: config.colors.white + 70,
            marginVertical: 12,
          }}
        />
        <AppTextInput
          inputTextLabelVisible={false}
          inputTextLabel={''}
          placeholder={t('Search')}
          leftIcon={require('../../assets/images/Search.png')}
          value={searchText}
          onChangeText={val => {
            setCategoriesList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
        />
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 15}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {route?.params?.fromData
              ? route?.params?.fromData
              : categoriesList?.map((item, index) => {
                  return renderItem(item, index);
                })}
          </View>
        </ScrollView>
      </View>
      <FooterComponent from={'category'} navigation={navigation} />
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
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  cakeCss: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 10,
  },
  cakeImg: {
    height: 95,
    width: 95,
  },
  cakeText: {
    fontSize: 14,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: 7,
  },
  SearchIcon: {
    height: 20,
    width: 20,
    marginHorizontal: 5,
  },
});

export default Categories;
