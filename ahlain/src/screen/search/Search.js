import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  SearchHistoryReducer,
  SearchMostRecentReducer,
  SearchSuggestionReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {AppTextInput} from '../../conponents';
import {debounce} from 'lodash';
import NoData from '../../conponents/NoData';
import AppImage from '../../conponents/AppImage';

const Search = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const SearchSuggestionResponse = useSelector(
    SearchSuggestionReducer.selectSearchSuggestionData,
  );

  const [searchResultList, setSearchResultList] = useState([]);
  const [search_text, setSearchText] = useState('');

  useEffect(() => {
    // dispatch({type: SagaActions.SEARCH_HISTORY, payload: ''});
    // dispatch({type: SagaActions.SEARCH_MOST_RECENT, payload: ''});
  }, []);
  useEffect(() => {
    if (SearchSuggestionResponse != null) {
      if (SearchSuggestionResponse?.error == false) {
        console.log(
          'SearchSuggestionResponse',
          JSON.stringify(SearchSuggestionResponse),
        );
        setSearchResultList(SearchSuggestionResponse?.results?.suggestion);
        dispatch(SearchSuggestionReducer.removeSearchSuggestionResponse());
      }
    }
  }, [SearchSuggestionResponse]);

  const getSearchSuggestion = val => {
    setSearchText(val);
    dispatch({type: SagaActions.SEARCH_SUGGESTION, payload: {search: val}});
  };
  const debouncedCallGetSearchSuggestions = useCallback(
    debounce(text => {
      if (text != '') {
        getSearchSuggestion(text);
      }
    }, 500),
    [],
  );

  const renderSearchItem = ({item, index}) => {
    return item?.isCategory ? (
      <View
        key={index}
        style={{
          paddingHorizontal: 10,
          width: config.constants.Width / 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(config.routes.SUBCATEGORIES, {
              cate: item,
              search_result: item,
            })
          }
          style={{
            backgroundColor: config.colors.white,
            borderRadius: 12,
            paddingBottom: 10,
            marginBottom: 15,
          }}>
          <AppImage
            imageStyle={{
              height: 130,
              width: '100%',
              resizeMode: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            resizeMode={'cover'}
            uri={item?.image}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 14,
                color: config.colors.Black,
                textTransform: 'capitalize',
                width: '70%',
              }}>
              {I18nManager.isRTL ? item?.name_ar : item.name_en}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : item?.isVendor ? (
      <View
        key={index}
        style={{
          paddingHorizontal: 10,
          width: config.constants.Width / 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(config.routes.VENDOR_DETAILS, {
              vendor_id: item?._id,
            });
          }}
          style={{
            backgroundColor: config.colors.white,
            borderRadius: 12,
            paddingBottom: 10,
            marginBottom: 15,
          }}>
          <AppImage
            imageStyle={{
              height: 130,
              width: '100%',
              resizeMode: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            resizeMode={'cover'}
            uri={item?.shop_cover_image}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 14,
                color: config.colors.Black,
                textTransform: 'capitalize',
                width: '70%',
              }}>
              {I18nManager.isRTL ? item?.shop_name_ar : item.shop_name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <View
        key={index}
        style={{
          paddingHorizontal: 10,
          width: config.constants.Width / 2,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(config.routes.SERVICE, {
              service_id: item?._id,
            })
          }
          style={{
            backgroundColor: config.colors.white,
            borderRadius: 12,
            paddingBottom: 10,
            marginBottom: 15,
          }}>
          <AppImage
            imageStyle={{
              height: 130,
              width: '100%',
              resizeMode: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            resizeMode={'cover'}
            uri={item?.images[0]}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 14,
                color: config.colors.Black,
                textTransform: 'capitalize',
                width: '70%',
              }}>
              {I18nManager.isRTL ? item?.name_ar : item.name_en}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                resizeMode="contain"
                source={require('../../assets/images/addCardtroly.png')}
              />
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: config.fonts.Poppins_Medium,
              fontSize: 14,
              color: config.colors.orangeColor,
              textAlign: 'left',
              marginHorizontal: 10,
              marginTop: 5,
            }}>
            {item.price}
            {' SAR'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
          title={t('Search')}
          backgroundColor={config.colors.orangeColor}
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
          value={search_text?.trimStart()}
          textInputStyle={{flex: 1}}
          onChangeText={val => {
            setSearchResultList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
          rightIcon={search_text && config.ImageList.closeIcon}
          rightIconPress={() => {
            setSearchResultList([]);
            setSearchText('');
            debouncedCallGetSearchSuggestions('');
          }}
        />
      </View>
      <View style={{flex: 1}}>
        {searchResultList?.length > 0 ? (
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            data={searchResultList}
            // keyExtractor={item => item._id.toString()}
            renderItem={renderSearchItem}
            contentContainerStyle={{
              paddingVertical: 15,
            }}
            numColumns={2}
            // onEndReached={() => {
            //   if (totalPageNo >= pageNo) {
            //     getMyBookingsApi(selectedBookingType, pageNo, searchText);
            //   }
            // }}
            // onEndReachedThreshold={0.5}
          />
        ) : (
          <NoData text={t('No Result Found')} visible={true} />
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
  inputCss: {
    borderWidth: 0.3,
    height: 50,
    borderColor: '#7070701A',
    elevation: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 0,
    backgroundColor: config.colors.white,
    marginTop: 10,
  },
  searchIcon: {
    height: 20,
    width: 19,
    marginHorizontal: 15,
    // borderRightWidth
  },
  input: {
    borderLeftWidth: I18nManager.isRTL ? 0 : 1,
    borderRightWidth: I18nManager.isRTL ? 1 : 0,
    height: 37,
    borderColor: '#E35829',
    paddingHorizontal: 10,
    color: config.colors.Gray,
    color: config.colors.Black,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  LastsearchedCss: {
    marginHorizontal: 12,
  },
  LastsearchedText: {
    fontSize: 14,
    color: config.colors.Gray,
    fontFamily: config.fonts.Poppins_Regular,
    marginTop: 20,
  },
  servicCss: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  decoretionCss: {
    backgroundColor: '#F1F2F6',
    height: 32,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 5,
  },
  decoretionText: {
    fontSize: 14,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Medium,
  },
  cakeCss: {
    backgroundColor: '#F1F2F6',
    height: 32,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mostsearchText: {
    fontSize: 18,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginLeft: 12,
    marginVertical: 10,
  },
  FlatlistCss: {
    backgroundColor: '#fff',
    elevation: 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    // margin: 12,
    marginHorizontal: 10,
    padding: 5,
    width: 150,
  },
  decorImg: {
    height: 100,
    width: 120,
    alignSelf: 'center',
  },
  PartyDecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  NotificationCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DecorationText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Gray,
    fontSize: 10,
    marginLeft: 5,
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  StarImg: {
    height: 10,
    width: 10,
    marginHorizontal: 5,
  },
  ratingText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#474747',
    fontSize: 10,
    marginRight: 10,
    top: 1,
  },
});

export default Search;
