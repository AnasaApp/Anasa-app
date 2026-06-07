import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  I18nManager,
  Share,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import config from '../../config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddToCartReducer,
  CreatePartyServiceReducer,
  GetComboDetailReducer,
  GetMyOccasionsReducer,
  SearchResultReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import AppHeader from '../../conponents/AppHeader';
import {AppButton} from '../../conponents';
import {getPartyDisplayName, getPartyTypeLabel} from '../../utils/partyHelpers';
import {rememberPartyComboSelections} from '../../utils/partyComboStorage';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {goToLogin} from '../../conponents/NavigationRef';

const BannerDetail = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const routePartyId = route?.params?.partyId;

  const dispatch = useDispatch();
  const lastSelectedPartyRef = useRef(null);
  const GetComboDetailResponse = useSelector(
    GetComboDetailReducer.selectGetComboDetailData,
  );
  const GetMyOccasionsResponse = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsData,
  );
  const CreatePartyServiceResponse = useSelector(
    CreatePartyServiceReducer.selectCreatePartyServiceData,
  );
  const CreatePartyServiceError = useSelector(
    CreatePartyServiceReducer.selectCreatePartyServiceResponse,
  );
  const AddToCartResponse = useSelector(AddToCartReducer.selectAddToCartData);
  const AddToCartErrorResponse = useSelector(
    AddToCartReducer.selectAddToCartResponse,
  );
  const [bannerItem, setBannerItem] = useState('');
  const [showOccasionModal, setShowOccasionModal] = useState(false);

  const partiesForModal = GetMyOccasionsResponse?.results?.parties ?? [];
  useEffect(() => {
    if (GetComboDetailResponse != null) {
      if (GetComboDetailResponse?.error == false) {
        setBannerItem(GetComboDetailResponse?.results?.advertisement);
        dispatch(GetComboDetailReducer.removeGetComboDetailResponse());
      }
    }
  }, [GetComboDetailResponse]);

  useEffect(() => {
    if (AddToCartResponse != null) {
      if (AddToCartResponse?.error == false) {
        Toast.show(AddToCartResponse?.message, Toast.LONG);

        navigation.navigate(config.routes.CART);
        dispatch(AddToCartReducer.removeAddToCartResponse());
      }
    }
  }, [AddToCartResponse]);
  useEffect(() => {
    if (AddToCartErrorResponse != null) {
      Toast.show(AddToCartErrorResponse?.message, Toast.LONG);

      dispatch(AddToCartReducer.removeAddToCartResponse());
    }
  }, [AddToCartErrorResponse]);

  useEffect(() => {
    if (CreatePartyServiceResponse != null) {
      if (CreatePartyServiceResponse?.error === false) {
        Toast.show(
          CreatePartyServiceResponse?.message ?? t('Added to occasion'),
          Toast.LONG,
        );
        const selectedParty = lastSelectedPartyRef.current;
        if (selectedParty?._id && bannerItem?._id && bannerItem?.type?.length) {
          rememberPartyComboSelections(
            selectedParty._id,
            bannerItem._id,
            bannerItem.type,
          );
        }
        dispatch(CreatePartyServiceReducer.removeCreatePartyServiceResponse());
        setShowOccasionModal(false);
        if (selectedParty?._id) {
          navigation.navigate(config.routes.OCCASION_VIEW, {
            occasion: selectedParty,
          });
        }
      }
    }
  }, [CreatePartyServiceResponse]);

  useEffect(() => {
    if (CreatePartyServiceError != null) {
      Toast.show(
        CreatePartyServiceError?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(CreatePartyServiceReducer.removeCreatePartyServiceResponse());
    }
  }, [CreatePartyServiceError]);

  useEffect(() => {
    dispatch({
      type: SagaActions.GET_COMBO_DETAIL,
      payload: {
        uri: '/' + route?.params?.banner_id,
      },
    });
  }, []);

  function isCustomizeRequired(data) {
    for (let attribute of data ?? []) {
      if (attribute?.service?.packages?.length > 0) {
        const matchingPackage = bannerItem?.type?.find(
          item => item._id === attribute?._id,
        );
        if (!matchingPackage?.package) {
          return t('Please select customization from detail page');
        }
      }
    }
    return false;
  }
  const onPressAddToCart = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (!result) {
      // Snackbar.show({
      //   text: t('Please login as a user to perform this action'),
      //   duration: Snackbar.LENGTH_LONG,
      //   backgroundColor: config.colors.blackColor,
      //   fontFamily: config.fonts.Poppins_Medium,
      //   textColor: config.colors.white,
      //   rtl: I18nManager?.isRTL,
      //   action: {
      //     text: t(`Go to Login`),
      //     textColor: config.colors.orangeColor,

      //     onPress: () => {
      //       goToLogin(config.routes.AUTH_NAVIGATION);
      //     },
      //   },
      // });
      goToLogin(config.routes.AUTH_NAVIGATION);
      return;
    }
    if (isCustomizeRequired(bannerItem?.type) != '') {
      return Toast.show(isCustomizeRequired(bannerItem?.type), Toast.SHORT);
    }
    const payload = {
      combo: bannerItem?._id,
      price: bannerItem?.comboPrice,
      comboServices: bannerItem?.type,
    };
    console.log('ADD_TO_CART', JSON.stringify(payload));
    // trackEvents('add_to_cart', payload);
    dispatch({type: SagaActions.ADD_TO_CART, payload});
  };

  const onPressAddToOccasion = async () => {
    const res = await AsyncStorage.getItem(config.AsyncKeys.USER_LOGGED_IN);
    const result = JSON.parse(res);
    if (!result) {
      goToLogin(config.routes.AUTH_NAVIGATION);
      return;
    }
    if (isCustomizeRequired(bannerItem?.type) != '') {
      return Toast.show(isCustomizeRequired(bannerItem?.type), Toast.SHORT);
    }
    dispatch({
      type: SagaActions.GET_MY_OCCASIONS,
      payload: {page: 1, pageSize: 50},
    });
    setShowOccasionModal(true);
  };

  const onSelectOccasion = party => {
    lastSelectedPartyRef.current = party;
    if (!bannerItem?._id) {
      return Toast.show(t('No Data Found'), Toast.SHORT);
    }
    const payload = {
      party: party?._id,
      combo: bannerItem._id,
      isAddedByAdmin: false,
      showToUser: true,
    };
    setShowOccasionModal(false);
    dispatch({type: SagaActions.CREATE_PARTY_SERVICE, payload});
  };

  const onAddToPartyDirect = () => {
    if (routePartyId) {
      onSelectOccasion({_id: routePartyId});
      return;
    }
    onPressAddToOccasion();
  };

  const handleReceiveCustomization = receivedData => {
    var newIndex = bannerItem?.type?.findIndex(
      item => item?.service?._id === receivedData?.service_id,
    );
    if (newIndex != -1) {
      const temp = {...bannerItem};
      temp.type = [...bannerItem.type];
      temp.type[newIndex] = {
        ...temp.type[newIndex],
        package: receivedData?.package,
        price: receivedData?.customize_price,
      };

      setBannerItem(temp);
      if (routePartyId && temp?._id) {
        rememberPartyComboSelections(routePartyId, temp._id, temp.type);
      }
    }
  };
  const callShareApi = async id => {
    // const getLink = await generateLink();
    const link = `${config.constants.PUBLIC_WEB_ORIGIN}/combo/${id}`;
    try {
      Share.share({
        message: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
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
          backgroundColor={config.colors.orangeColor}
          title={I18nManager?.isRTL ? bannerItem.name_ar : bannerItem?.name_en}
          rightimg={require('../../assets/images/share_icon.png')}
          onRightPress={() => {
            callShareApi(bannerItem?._id);
          }}
          rightImageStyle={{
            width: 20,
            height: 20,
            tintColor: config.colors.white,
            transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
          }}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 20}}>
        {bannerItem && (
          <>
            {bannerItem?.type?.map((banner_itm, index) => {
              return (
                <View key={index} style={styles.comboServiceCard}>
                  <ImageBackground
                    resizeMode="cover"
                    style={styles.comboServiceImage}
                    source={{
                      uri:
                        banner_itm?.service?.images?.length > 0
                          ? banner_itm?.service?.images[0]
                          : '',
                    }}>
                    <View style={styles.comboImageOverlay}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate(config.routes.VENDOR_DETAILS, {
                            vendor_id: banner_itm?.vendor?._id,
                          });
                        }}
                        style={styles.comboOverlayChip}>
                        <Image
                          style={styles.comboOverlayChipImage}
                          resizeMode="cover"
                          source={{uri: banner_itm?.vendor?.shop_cover_image}}
                        />
                        <Text style={styles.comboOverlayChipText}>
                          {I18nManager?.isRTL
                            ? banner_itm?.vendor?.shop_name_ar
                            : banner_itm?.vendor?.shop_name}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate(config.routes.SUBCATEGORIES, {
                            cate: banner_itm?.category,
                            search_result: banner_itm?.category,
                          });
                        }}
                        style={styles.comboCategoryChip}>
                        <Image
                          style={styles.comboOverlayChipImage}
                          resizeMode="cover"
                          source={{uri: banner_itm?.category?.image}}
                        />
                        <Text style={styles.comboOverlayChipText}>
                          {I18nManager?.isRTL
                            ? banner_itm?.category?.name_ar
                            : banner_itm?.category?.name_en}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>

                  <View style={styles.comboServiceBody}>
                    <Text
                      style={styles.comboServiceTitle}
                      numberOfLines={2}>
                      {I18nManager?.isRTL
                        ? banner_itm?.service.name_ar
                        : banner_itm?.service.name_en}
                    </Text>

                    <Text style={styles.comboServiceDesc} numberOfLines={3}>
                      {I18nManager?.isRTL
                        ? banner_itm?.service.description_ar
                        : banner_itm?.service.description_en}
                    </Text>

                    {banner_itm?.service?.packages?.length > 0 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          navigation.navigate(config.routes.SERVICE, {
                            service_id: banner_itm?.service?._id,
                            from: 'select_customization',
                            onSelectCustomization: handleReceiveCustomization,
                          });
                        }}
                        style={styles.customizeBtn}>
                        <Text style={styles.customizeBtnText}>
                          {t('Select Customization')}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {banner_itm?.package?.length > 0 && (
                      <View style={styles.selectedPackageWrap}>
                        {banner_itm?.package?.map((p, ind) => (
                          <Text key={ind} style={styles.selectedPackageText}>
                            {`${
                              I18nManager.isRTL
                                ? p?.customized_option_title_ar
                                : p?.customized_option_title_en
                            } : ${p?.options
                              ?.map(op =>
                                I18nManager?.isRTL
                                  ? op.option_ar
                                  : op.option_en,
                              )
                              .join(', ')
                              .toString()
                              .toLowerCase()}`}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
      <View style={styles.mainCss}>
        <View style={styles.priceSection}>
          <Text style={styles.priceText}>{t('Price')}</Text>
          <View style={styles.sarCss}>
            <Text style={styles.numberText}>{bannerItem?.comboPrice}</Text>
            <Text style={styles.sarText}>SAR</Text>
          </View>
        </View>
        <View style={styles.bottomActionRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addToOccasionBtn}
            onPress={onAddToPartyDirect}>
            <Text style={styles.addToOccasionText}>{t('Add to Occasion')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addToCartBtnCompact}
            activeOpacity={0.5}
            onPress={onPressAddToCart}>
            <Image
              resizeMode="contain"
              style={styles.plusIcon}
              source={require('../../assets/images/plus.png')}
            />
            <Text style={styles.buttonText}>{t('Add to cart')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showOccasionModal}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowOccasionModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.occasionModalOverlay}
          onPress={() => setShowOccasionModal(false)}>
          <View
            style={styles.occasionSheet}
            onStartShouldSetResponder={() => true}>
            <View style={styles.occasionSheetHandle} />
            <Text style={styles.occasionSheetTitle}>{t('Add to Occasion')}</Text>
            <Text style={styles.occasionSheetSubtitle}>
              {t('Choose an occasion to add this combo to')}
            </Text>

            {partiesForModal.length > 0 ? (
              <FlatList
                data={partiesForModal}
                keyExtractor={(item, idx) => (item?._id ?? idx).toString()}
                style={{maxHeight: 360}}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  const accentColors = [
                    config.colors.orangeColor,
                    config.colors.buttonColor,
                    config.colors.yellowColor,
                  ];
                  const displayName = getPartyDisplayName(item);
                  const typeLabel = getPartyTypeLabel(item?.type);
                  return (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => onSelectOccasion(item)}
                      style={styles.occasionRow}>
                      <View
                        style={[
                          styles.occasionRowAccent,
                          {backgroundColor: accentColors[index % 3]},
                        ]}
                      />
                      <View style={styles.occasionRowIcon}>
                        <Text style={{fontSize: 20}}>🎁</Text>
                      </View>
                      <View style={styles.occasionRowContent}>
                        <Text style={styles.occasionRowName} numberOfLines={1}>
                          {displayName}
                        </Text>
                        {typeLabel ? (
                          <Text style={styles.occasionRowDate} numberOfLines={1}>
                            {typeLabel}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.occasionRowArrow}>›</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View style={styles.occasionEmptyWrap}>
                <Text style={styles.occasionEmptyEmoji}>🎈</Text>
                <Text style={styles.occasionEmptyTitle}>
                  {t("You haven't created any occasions yet")}
                </Text>
                <Text style={styles.occasionEmptySubtitle}>
                  {t('Create one to add this combo to it')}
                </Text>
              </View>
            )}

            <AppButton
              text={t('Create New Occasion')}
              onPress={() => {
                setShowOccasionModal(false);
                navigation.navigate(config.routes.CREATE_OCCASION);
              }}
              buttonStyle={styles.occasionCreateBtn}
            />
            <TouchableOpacity
              onPress={() => setShowOccasionModal(false)}
              style={styles.occasionCancelBtn}>
              <Text style={styles.occasionCancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  headerCss: {
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 55,
    // backgroundColor: 'pink',
    paddingTop: 2,
  },
  BackIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  tittle: {
    fontFamily: config.fonts.Poppins_Bold,
    color: '#333333',
    fontSize: 18,
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
  },
  startIcon: {
    width: 12,
    height: 12,
  },
  serviceText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 18,
  },
  partyDecor: {
    height: 70,
    width: '24%',
    overflow: 'hidden',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  BalloondecorText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 16,
    textAlign: 'left',
  },
  Service: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
    textAlign: 'left',
  },
  sartxt: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: '#4F74B0',
    fontSize: 14,
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 12,
    marginHorizontal: 5,
  },
  flatlistMainCss: {
    flexDirection: 'row',
    // marginHorizontal: 5,
    backgroundColor: config.colors.white,
    elevation: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 10,
    width: '100%',
  },
  flatlistCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ballonCss: {
    marginLeft: 10,
    width: '70%',
  },
  addCardCss: {
    height: 35,
    width: 100,
    backgroundColor: '#4F74B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  flatlistCss: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: '#fff',
  },
  partyImg: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    borderRadius: 10,
  },
  secondCss: {
    marginLeft: 10,
  },
  partyText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
  },
  infoCss: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  InfoImg: {
    height: 10,
    width: 10,
  },
  InfoText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: '#E35829',
    fontSize: 10,
    marginLeft: 5,
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sarText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    fontSize: 14,
  },

  addCard: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.white,
    fontSize: 12,
  },
  plusIcon: {
    width: 18,
    height: 18,
    alignSelf: 'center',
    marginRight: 10,
  },
  mainCss: {
    backgroundColor: config.colors.white,
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  priceSection: {
    marginBottom: 14,
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToOccasionBtn: {
    flex: 1,
    borderRadius: 10,
    height: 50,
    borderWidth: 1.5,
    borderColor: config.colors.orangeColor,
    backgroundColor: config.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addToOccasionText: {
    color: config.colors.orangeColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_SemiBold,
    lineHeight: 22,
  },
  addToCartBtnCompact: {
    flex: 1,
    backgroundColor: config.colors.blueColor,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addToCartBtn: {
    width: '100%',
    backgroundColor: config.colors.blueColor,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  occasionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  occasionSheet: {
    backgroundColor: config.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  occasionSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: config.colors.borderColor,
    alignSelf: 'center',
    marginBottom: 16,
  },
  occasionSheetTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    textAlign: 'center',
    marginBottom: 4,
  },
  occasionSheetSubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  occasionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  occasionRowAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    ...(I18nManager.isRTL ? {right: 0} : {left: 0}),
  },
  occasionRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: I18nManager.isRTL ? 8 : 12,
    marginLeft: I18nManager.isRTL ? 12 : 8,
  },
  occasionRowContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  occasionRowName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    lineHeight: 20,
  },
  occasionRowDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
    marginTop: 2,
  },
  occasionRowArrow: {
    fontSize: 22,
    color: config.colors.Gray,
    paddingHorizontal: 6,
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  occasionEmptyWrap: {alignItems: 'center', paddingVertical: 18},
  occasionEmptyEmoji: {fontSize: 40, marginBottom: 8},
  occasionEmptyTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  occasionEmptySubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  occasionCreateBtn: {marginTop: 10, marginHorizontal: 0},
  occasionCancelBtn: {alignItems: 'center', paddingVertical: 12},
  occasionCancelText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.Gray,
  },
  comboServiceCard: {
    backgroundColor: config.colors.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  comboServiceImage: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  comboImageOverlay: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  comboOverlayChip: {
    backgroundColor: config.colors.Gray + 'CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  comboCategoryChip: {
    backgroundColor: config.colors.Gray + 'E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  comboOverlayChipImage: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
  comboOverlayChipText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 12,
    color: config.colors.white,
    marginHorizontal: 4,
  },
  comboServiceBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    alignItems: 'stretch',
  },
  comboServiceTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 16,
    lineHeight: 22,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  comboServiceDesc: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  customizeBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: config.colors.buttonColor,
    borderRadius: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizeBtnText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.buttonColor,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  selectedPackageWrap: {
    marginTop: 8,
  },
  selectedPackageText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Light_Black,
    fontSize: 10,
    lineHeight: 16,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  priceText: {
    fontSize: 12,
    color: config.colors.Light_Black,
    fontFamily: config.fonts.Poppins_Medium,
    textAlign: 'left',
  },
  sarCss: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Black,
    textAlign: 'left',
  },
  sarText: {
    fontSize: 12,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginLeft: 2,
  },
  buttonCss: {
    backgroundColor: config.colors.blueColor,
    height: 50,
    borderRadius: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: config.colors.white,
    fontFamily: config.fonts.Poppins_Medium,
  },
});

export default BannerDetail;
