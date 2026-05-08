import React, {useEffect, useState} from 'react';
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

const Search = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const SearchSuggestionResponse = useSelector(
    SearchSuggestionReducer.selectSearchSuggestionData,
  );
  const SearchHistoryResponse = useSelector(
    SearchHistoryReducer.selectSearchHistoryData,
  );
  const SearchMostRecentResponse = useSelector(
    SearchMostRecentReducer.selectSearchMostRecentData,
  );

  useEffect(() => {
    dispatch({type: SagaActions.SEARCH_HISTORY, payload: ''});
    dispatch({type: SagaActions.SEARCH_MOST_RECENT, payload: ''});
  }, []);
  useEffect(() => {
    if (SearchSuggestionResponse != null) {
      if (SearchSuggestionResponse?.error == false) {
        if (search_text == '') {
          dispatch(SearchSuggestionReducer.removeSearchSuggestionResponse());
        } else {
          if (SearchSuggestionResponse?.results?.suggestion.length == 0) {
            Toast.show(t('No Result Found!'), Toast.LONG);
          }
        }
      }
    }
  }, [SearchSuggestionResponse]);

  const [search_text, setSearchText] = useState('');

  const getSearchSuggestion = val => {
    setSearchText(val);
    dispatch({type: SagaActions.SEARCH_SUGGESTION, payload: {search: val}});
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        key={index}
        onPress={() =>
          navigation.navigate(config.routes.SEARCH_RESULT, {
            search_result: item,
          })
        }>
        <View style={styles.FlatlistCss}>
          <Image
            style={styles.decorImg}
            resizeMode="contain"
            source={{uri: item.image}}
          />
          <Text numberOfLines={1} style={styles.PartyDecorText}>
            {I18nManager.isRTL ? item?.name_ar : item?.name_en}
          </Text>
          <Text numberOfLines={1} style={styles.DecorationText}>
            {I18nManager.isRTL
              ? item?.category?.name_ar
              : item?.category?.name_en}
          </Text>
          {/* <View style={styles.starCss}>
          <View style={styles.NotificationCss}>
              <Image
                style={styles.StarImg}
                resizeMode="contain"
                source={require('../../assets/images/start.png')}
              />
              <Text style={styles.ratingText}>{item?.ratingText}</Text>
            </View>
          </View>*/}
        </View>
      </TouchableOpacity>
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
          title={t('Vendors')}
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
            setVendorList([]);
            setSearchText(val);
            debouncedCallGetSearchSuggestions(val);
          }}
          viewStyle={{marginHorizontal: 0}}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.inputCss}>
          <Image
            style={styles.searchIcon}
            source={require('../../assets/images/Search2.png')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Fine Catering,Dj,Decoration')}
            placeholderTextColor={config.colors.Gray}
            onChangeText={val => getSearchSuggestion(val)}
            value={search_text}
          />
        </View>

        {SearchSuggestionResponse?.results?.suggestion.length > 0 && (
          <View
            style={{
              margin: 10,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              nestedScrollEnabled>
              {SearchSuggestionResponse?.results?.suggestion?.map(
                (SearchItem, index) => {
                  console.log('SearchItem', SearchItem);
                  return SearchItem?.isCategory ? (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (SearchItem?.subCategoriesCount > 0) {
                          navigation.navigate(config.routes.SUBCATEGORIES, {
                            cate: SearchItem,
                          });
                        } else {
                          navigation.navigate(config.routes.SEARCH_RESULT, {
                            search_result: SearchItem,
                          });
                        }
                      }}
                      style={{
                        backgroundColor: config.colors.white,
                        borderRadius: 8,
                        elevation: 2,
                        marginBottom: 8,
                        padding: 10,
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 10,
                          resizeMode: 'cover',
                        }}
                        source={{uri: SearchItem?.image}}
                      />
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 16,
                          marginHorizontal: 10,
                          color: config.colors.Black,
                          fontFamily: config.fonts.Poppins_Medium,
                        }}>
                        {I18nManager.isRTL
                          ? SearchItem?.name_ar
                          : SearchItem?.name_en}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        backgroundColor: config.colors.white,
                        borderRadius: 8,
                        elevation: 2,
                        marginBottom: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                      }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 15,
                        }}
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate(config.routes.VENDOR_DETAILS, {
                            vendor_id: SearchItem?.vendor._id,
                            withInBuyerRadius: SearchItem?.withInBuyerRadius,
                          });
                        }}>
                        <Image
                          style={{width: 40, height: 40, borderRadius: 20}}
                          resizeMode="cover"
                          source={{uri: SearchItem?.vendor?.shop_cover_image}}
                        />
                        <View
                          style={{
                            marginLeft: 10,
                            borderBottomWidth: 1,
                            borderColor: config.colors.BACKGROUNDCOLOR,
                            flex: 1,
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              color: config.colors.Black,
                              fontFamily: config.fonts.Poppins_Medium,
                              textAlign: 'left',
                            }}>
                            {SearchItem?.vendor?.shop_name}
                          </Text>

                          <Text
                            style={{
                              fontSize: 10,
                              color: config.colors.Gray,
                              fontFamily: config.fonts.Poppins_Medium,
                              textAlign: 'left',
                            }}>
                            <Image
                              style={{
                                width: 10,
                                height: 12,
                                tintColor: config.colors.Gray,
                              }}
                              resizeMode="contain"
                              source={require('../../assets/images/Location.png')}
                            />{' '}
                            {SearchItem?.vendor.city}
                            {', '}
                            {SearchItem?.vendor.country}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {SearchItem?.services?.length == 1 ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            navigation.navigate(config.routes.SERVICE, {
                              service_id: SearchItem?.services[0]?._id,
                              withInBuyerRadius: SearchItem?.withInBuyerRadius,
                            });
                          }}
                          style={{flexDirection: 'row', marginLeft: 10}}
                          key={index}>
                          <Image
                            resizeMode="cover"
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 10,
                            }}
                            source={{uri: SearchItem?.services[0]?.images[0]}}
                          />
                          <View style={{marginLeft: 5}}>
                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 13,
                                color: config.colors.Black,
                                fontFamily: config.fonts.Poppins_Medium,
                                width: 100,
                                textAlign: 'left',
                              }}>
                              {I18nManager.isRTL
                                ? SearchItem?.services[0]?.name_ar
                                : SearchItem?.services[0]?.name_en}
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                color: config.colors.Gray,
                                fontFamily: config.fonts.Poppins_Medium,
                                textAlign: 'left',
                              }}>
                              {SearchItem?.services[0]?.price}
                              {' SAR'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <ScrollView
                          horizontal
                          keyboardShouldPersistTaps={'handled'}
                          showsHorizontalScrollIndicator={false}>
                          {SearchItem?.services?.map((sItem, index) => {
                            return (
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  navigation.navigate(config.routes.SERVICE, {
                                    service_id: sItem?._id,
                                    withInBuyerRadius:
                                      SearchItem?.withInBuyerRadius,
                                  });
                                }}
                                style={{flexDirection: 'row', marginLeft: 10}}
                                key={index}>
                                <Image
                                  resizeMode="cover"
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                  }}
                                  source={{uri: sItem?.images[0]}}
                                />
                                <View style={{marginLeft: 5}}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      fontSize: 13,
                                      color: config.colors.Black,
                                      fontFamily: config.fonts.Poppins_Medium,
                                      width: 100,
                                      textAlign: 'left',
                                    }}>
                                    {I18nManager.isRTL
                                      ? sItem?.name_ar
                                      : sItem?.name_en}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      color: config.colors.Gray,
                                      fontFamily: config.fonts.Poppins_Medium,
                                      textAlign: 'left',
                                    }}>
                                    {sItem?.price}
                                    {' SAR'}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                    </View>
                  );
                },
              )}
            </ScrollView>
          </View>
        )}
        {SearchSuggestionResponse?.results?.suggestion?.length > 0 ? (
          <></>
        ) : (
          <View>
            <View style={styles.LastsearchedCss}>
              <Text style={styles.LastsearchedText}>{t('Last searched')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SearchHistoryResponse?.results?.response?.map(
                  (item, index) => {
                    console.log('SearchHistoryResponse', item);
                    return (
                      item && (
                        <TouchableOpacity
                          key={index}
                          style={styles.decoretionCss}
                          onPress={() =>
                            navigation.navigate(config.routes.SEARCH_RESULT, {
                              search_result: item.subCategory,
                            })
                          }>
                          <Text style={styles.decoretionText}>
                            {I18nManager.isRTL
                              ? item?.subCategory?.name_ar
                              : item?.subCategory?.name_en}
                          </Text>
                        </TouchableOpacity>
                      )
                    );
                  },
                )}
              </ScrollView>
            </View>
            <Text style={styles.mostsearchText}>{t('Most Searched')}</Text>
            <View style={{marginBottom: 10}}>
              <FlatList
                data={SearchMostRecentResponse?.results?.response}
                renderItem={renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
