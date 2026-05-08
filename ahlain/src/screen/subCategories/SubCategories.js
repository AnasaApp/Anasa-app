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
  ImageBackground,
  Platform,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetServicesReducer,
  ServiceResultReducer,
  SubCategoriesReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useTranslation} from 'react-i18next';
import {useIsFocused} from '@react-navigation/native';
import NoData from '../../conponents/NoData';
import LinearGradient from 'react-native-linear-gradient';
import {debounce} from 'lodash';
import {AppTextInput} from '../../conponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {goToLogin} from '../../conponents/NavigationRef';

const SubCategories = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const SubCategoriesResponse = useSelector(
    SubCategoriesReducer.selectSubCategoriesData,
  );
  const GetServicesResponse = useSelector(
    GetServicesReducer.selectGetServicesData,
  );

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const isFocused = useIsFocused();

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    if (GetServicesResponse != null && isFocused) {
      if (GetServicesResponse?.error == false) {
        setServiceList([
          ...serviceList,
          ...GetServicesResponse?.results?.services,
        ]);
        console.log(
          'GetServicesResponse?.results?.services',
          JSON.stringify(GetServicesResponse?.results),
        );
        setPageNo(pageNo + 1);
        setTotalPageNo(GetServicesResponse?.results?.totalPage);
        dispatch(GetServicesReducer.removeGetServicesResponse());
      }
    }
  }, [GetServicesResponse]);
  useEffect(() => {
    if (SubCategoriesResponse != null && isFocused) {
      if (SubCategoriesResponse?.error == false) {
        const subCategories = SubCategoriesResponse?.results?.subCategories;
        const updatedSubCategories = [
          {_id: 'All', name_en: 'All', name_ar: 'الجميع'},
          ...subCategories,
        ];
        setSubCategoryList(updatedSubCategories);
        setTotalPageNo(1);
        setPageNo(1);
        callGetServicesApi(1, route?.params?.cate?._id, 'All', '');
      }
    }
  }, [SubCategoriesResponse]);
  useEffect(() => {
    checkUserLoggedIn();

    setServiceList([]);
    setSubCategoryList([]);
    callSubCategoryListApi(route?.params?.cate?._id);
  }, []);

  const checkUserLoggedIn = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    setUserLoggedIn(result);
    if (result == true) {
    } else {
    }
  };
  const callSubCategoryListApi = cate_id => {
    dispatch({
      type: SagaActions.SUB_CATEGORIES,
      payload: {categoryId: cate_id},
    });
  };
  const callGetServicesApi = (pageNo, categoryId, subCategoryId, search) => {
    const payload = {
      page: pageNo,
      pageSize: 10,
      category: categoryId,
      subCategory: subCategoryId == 'All' ? '' : subCategoryId,
      search: search,
    };
    dispatch({
      type: SagaActions.GET_SERVICES,
      payload,
    });
  };
  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      callGetServicesApi(
        1,
        route?.params?.cate?._id,
        selectedSubCategory,
        text,
      );
    }, 500),
    [],
  );
  const renderServiceItem = ({item, index}) => {
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
          navigation.navigate(config.routes.SERVICE, {
            service_id: item?._id,
          });
        }}>
        <ImageBackground
          resizeMode="cover"
          style={{
            width: '100%',
            height: 150,
            overflow: 'hidden',
            borderRadius: 10,
            // justifyContent: 'flex-end',
            marginTop: 10,
          }}
          source={{
            uri: item?.images?.length > 0 ? item?.images[0] : '',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item?.vendor) {
                navigation.navigate(config.routes.VENDOR_DETAILS, {
                  vendor_id: item?.vendor?._id,
                });
              }
            }}
            style={{
              backgroundColor: config.colors.Gray + 80,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
              margin: 10,
            }}>
            <Image
              style={{
                width: 24,
                height: 24,
                resizeMode: 'cover',
                borderRadius: 20,
              }}
              resizeMode="cover"
              source={{uri: item?.vendor?.shop_cover_image}}
            />

            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 12,
                color: config.colors.white,
                marginHorizontal: 4,
              }}>
              {I18nManager?.isRTL
                ? item.vendor?.shop_name_ar
                : item.vendor?.shop_name}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: config.colors.Gray + 90,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
              marginTop: 40,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 12,
                color: config.colors.white,
              }}>
              {`${t('Preparation Time')}:`}
            </Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 12,
                color: config.colors.orangeColor,
                marginHorizontal: 4,
              }}>
              {`${item?.preparationTime} ${t('hours')}`}
            </Text>
          </View>
        </ImageBackground>
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
                textAlign: 'left',
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
                {item?.price}
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Medium,
                    fontSize: 12,
                    color: config.colors.Black,
                  }}>
                  {' SAR'}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: config.fonts.Poppins_Regular,
                  fontSize: 12,
                  color: config.colors.Black,
                  marginLeft: 5,
                }}>
                <Image
                  style={{
                    width: 12,
                    height: 12,
                    resizeMode: 'contain',
                  }}
                  resizeMode="contain"
                  source={require('../../assets/images/start.png')}
                />
                {` ${item?.rating}`}
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
          title={
            I18nManager.isRTL
              ? route?.params?.cate?.name_ar
              : route?.params?.cate?.name_en
          }
          backgroundColor={config.colors.orangeColor}
          rightimg={require('../../assets/images/addCardtroly.png')}
          rightimgContainerStyle={{
            alignItems: 'center',
            backgroundColor: config.colors.creamColor,
            width: 40,
            height: 40,
            justifyContent: 'center',
            borderRadius: 50,
            marginLeft: 10,
          }}
          rightImageStyle={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
          }}
          onRightPress={() => {
            if (userLoggedIn) {
              navigation.navigate(config.routes.CART);
            } else {
              goToLogin(config.routes.AUTH_NAVIGATION);
            }
          }}
        />
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
            setServiceList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
        />
      </View>

      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            fontFamily: config.fonts.Poppins_SemiBold,
            fontSize: 16,
            lineHeight: 24,
            color: config.colors.Black,
            marginVertical: 5,
            textAlign: 'left',
          }}>
          {t('Product Type')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{alignSelf: 'flex-start'}}>
          {subCategoryList?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  backgroundColor:
                    selectedSubCategory == item?._id
                      ? config.colors.orangeColor
                      : config.colors.white,
                  borderWidth: 1,
                  borderRadius: 50,
                  borderColor: config.colors.borderColor,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedSubCategory(item?._id);
                  setPageNo(1);
                  setTotalPageNo(1);
                  setServiceList([]);
                  setSearchText('');
                  callGetServicesApi(
                    1,
                    route?.params?.cate?._id,
                    item?._id,
                    '',
                  );
                }}>
                <Text
                  style={{
                    fontFamily: config.fonts.Poppins_Regular,
                    fontSize: 12,
                    lineHeight: 21,
                    color:
                      selectedSubCategory == item?._id
                        ? config.colors.white
                        : config.colors.Black,
                  }}>
                  {I18nManager.isRTL ? item?.name_ar : item.name_en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={{flex: 1}}>
        {serviceList?.length > 0 ? (
          <FlatList
            data={serviceList}
            contentContainerStyle={{paddingVertical: 10}}
            showsVerticalScrollIndicator={false}
            renderItem={renderServiceItem}
            onEndReached={() => {
              if (totalPageNo >= pageNo) {
                callGetServicesApi(
                  pageNo,
                  route?.params?.cate?._id,
                  selectedSubCategory,
                  searchText,
                );
              }
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <NoData visible={true} text={t('No Data Found')} />
        )}
      </View>
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
  mainCss: {
    marginHorizontal: 15,
  },
  linearGradient: {
    height: 150,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  bgImg: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
    borderRadius: 10,
    // justifyContent: 'flex-end',
    marginTop: 10,
  },
  bgImgView: {
    marginHorizontal: 20,
  },
  khanText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'left',
  },
  locationCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -5,
  },
  locationIcon: {
    width: 10,
    height: 12,
    tintColor: '#fff',
  },
  locationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.white,
    fontSize: 11,
    marginLeft: 5,
    marginTop: 2,
    textAlign: 'left',
  },
  startIcon: {
    width: 12,
    height: 12,
  },
  flatlistCss: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 15,
    padding: 8,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: '#fff',
    width: 300,
  },
  partyImg: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    borderRadius: 10,
  },
  secondCss: {
    marginLeft: 10,
    flex: 1,
  },
  partyText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
    textAlign: 'left',
  },
  infoCss: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  InfoImg: {
    height: 10,
    width: 10,
  },
  InfoText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#E35829',
    fontSize: 9,
    marginLeft: 4,
    width: '70%',
    textAlign: 'left',
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  sarText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 13,
    textAlign: 'left',
  },
  addCardCss: {
    height: 25,
    width: 70,
    backgroundColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  addCard: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 10,

    textAlign: 'left',
  },
  startIcon: {
    width: 13,
    height: 12,
    marginHorizontal: 2,
  },
});

export default SubCategories;
