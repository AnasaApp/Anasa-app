import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  I18nManager,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import AppButton from '../../conponents/AppButton';
import AppImage from '../../conponents/AppImage';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {AddToCartReducer, DeletePartyReducer, DeletePartyServiceReducer, ViewPartyReducer} from '../../redux/reducers';
import {CommonModal} from '../../conponents/CommonModal';
import {trackEvents} from '../../config/FCMEvents';
import OccasionDateStatusTag from '../../conponents/OccasionDateStatusTag';
import usePartyMetaCache from '../../utils/usePartyMetaCache';
import {
  getPartyDisplayName,
  formatPartyMetaLine,
  enrichPartyWithCachedMeta,
  getPartyDateStatus,
  getPartyId,
  hasPartyOccasionDate,
  isPartyDateExpired,
  mergePartyRecords,
  normalizePartyServiceForDisplay,
  normalizePartyComboForDisplay,
} from '../../utils/partyHelpers';
import {getPartyComboSelections, removePartyComboSelections} from '../../utils/partyComboStorage';
import {
  getComboCustomizeError,
  getComboOfferId,
} from '../../utils/partyComboHelpers';
import {useFocusEffect} from '@react-navigation/native';

const OccasionView = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const partyMetaVersion = usePartyMetaCache();
  const partyId = getPartyId(route?.params?.occasion);
  const routeParty = useMemo(
    () => enrichPartyWithCachedMeta(route?.params?.occasion),
    [route?.params?.occasion, partyMetaVersion],
  );

  const ViewPartyData = useSelector(ViewPartyReducer.selectViewPartyData);
  const ViewPartyError = useSelector(ViewPartyReducer.selectViewPartyResponse);

  const AddToCartResponse = useSelector(AddToCartReducer.selectAddToCartData);
  const AddToCartErrorResponse = useSelector(
    AddToCartReducer.selectAddToCartResponse,
  );
  const DeletePartyServiceResponse = useSelector(
    DeletePartyServiceReducer.selectDeletePartyServiceData,
  );
  const DeletePartyServiceError = useSelector(
    DeletePartyServiceReducer.selectDeletePartyServiceResponse,
  );
  const DeletePartyResponse = useSelector(
    DeletePartyReducer.selectDeletePartyData,
  );
  const DeletePartyErrorResponse = useSelector(
    DeletePartyReducer.selectDeletePartyResponse,
  );

  const [party, setParty] = useState(routeParty ?? null);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const partyServices = useMemo(() => {
    const raw = ViewPartyData?.results?.services ?? [];
    return raw.map(normalizePartyServiceForDisplay);
  }, [ViewPartyData]);

  const partyCombos = useMemo(() => {
    const raw = ViewPartyData?.results?.combos ?? [];
    return raw.map(normalizePartyComboForDisplay);
  }, [ViewPartyData]);

  const occasionItemCount = partyServices.length + partyCombos.length;

  const totalPrice = useMemo(
    () =>
      [...partyServices, ...partyCombos].reduce(
        (sum, item) => sum + (Number(item?.price) || 0),
        0,
      ),
    [partyServices, partyCombos],
  );

  useFocusEffect(
    useCallback(() => {
      if (!partyId) {
        return;
      }
      dispatch({
        type: SagaActions.VIEW_PARTY,
        payload: {uri: `/${partyId}`},
      });
    }, [partyId, dispatch]),
  );

  useEffect(() => {
    if (ViewPartyData?.error === false && ViewPartyData?.results?.party) {
      setParty(mergePartyRecords(ViewPartyData.results.party, routeParty));
      return;
    }
    if (routeParty) {
      setParty(routeParty);
    }
  }, [ViewPartyData, routeParty, partyMetaVersion]);

  useEffect(() => {
    if (ViewPartyError != null) {
      Toast.show(
        ViewPartyError?.message ?? t('Failed to load occasion'),
        Toast.LONG,
      );
      dispatch(ViewPartyReducer.removeViewPartyResponse());
    }
  }, [ViewPartyError]);

  useEffect(() => {
    if (AddToCartResponse != null && AddToCartResponse?.error === false) {
      Toast.show(AddToCartResponse?.message ?? t('Added to cart'), Toast.LONG);
      dispatch(AddToCartReducer.removeAddToCartResponse());
      navigation.navigate(config.routes.CART);
    }
  }, [AddToCartResponse]);

  useEffect(() => {
    if (AddToCartErrorResponse != null) {
      Toast.show(
        AddToCartErrorResponse?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(AddToCartReducer.removeAddToCartResponse());
    }
  }, [AddToCartErrorResponse]);

  useEffect(() => {
    if (DeletePartyServiceResponse != null) {
      if (DeletePartyServiceResponse?.error === false) {
        Toast.show(
          DeletePartyServiceResponse?.message ?? t('Removed from occasion'),
          Toast.LONG,
        );
        if (partyId) {
          dispatch({
            type: SagaActions.VIEW_PARTY,
            payload: {uri: `/${partyId}`},
          });
        }
        dispatch(DeletePartyServiceReducer.removeDeletePartyServiceResponse());
      }
    }
  }, [DeletePartyServiceResponse]);

  useEffect(() => {
    if (DeletePartyServiceError != null) {
      Toast.show(
        DeletePartyServiceError?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(DeletePartyServiceReducer.removeDeletePartyServiceResponse());
    }
  }, [DeletePartyServiceError]);

  useEffect(() => {
    if (DeletePartyResponse != null) {
      if (DeletePartyResponse?.error === false) {
        Toast.show(
          DeletePartyResponse?.message ?? t('Delete Occasion'),
          Toast.LONG,
        );
        dispatch(DeletePartyReducer.removeDeletePartyResponse());
        navigation.goBack();
      }
    }
  }, [DeletePartyResponse]);

  useEffect(() => {
    if (DeletePartyErrorResponse != null) {
      Toast.show(
        DeletePartyErrorResponse?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(DeletePartyReducer.removeDeletePartyResponse());
    }
  }, [DeletePartyErrorResponse]);

  const displayName = getPartyDisplayName(party);
  const description = party?.description?.trim?.() || '';
  const dateStatus = getPartyDateStatus(party);
  const isExpired = isPartyDateExpired(party);
  const showDateTag = hasPartyOccasionDate(party);

  const showExpiredToast = () =>
    Toast.show(t('This occasion has expired'), Toast.LONG);

  const navigateBrowseServices = () => {
    if (isExpired) {
      return showExpiredToast();
    }
    navigation.navigate(config.routes.CATEGORIES);
  };

  const navigateBrowseCombos = () => {
    if (isExpired) {
      return showExpiredToast();
    }
    navigation.navigate(config.routes.HOME_SCREEN);
  };

  const renderSectionEmpty = ({
    emoji,
    title,
    subtitle,
    buttonText,
    onPress,
  }) => (
    <View style={styles.sectionEmptyWrap}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      <AppButton
        text={buttonText}
        onPress={onPress}
        disabled={isExpired}
        buttonStyle={[
          styles.sectionActionBtn,
          isExpired && styles.disabledPrimaryBtn,
        ]}
        textStyle={styles.sectionActionBtnText}
      />
    </View>
  );

  const renderAddMoreButton = (label, onPress) => (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isExpired}
      onPress={onPress}
      style={[styles.addMoreBtn, isExpired && styles.addMoreBtnDisabled]}>
      <Text
        style={[
          styles.addMoreBtnText,
          isExpired && styles.addMoreBtnTextDisabled,
        ]}>
        + {label}
      </Text>
    </TouchableOpacity>
  );

  const openRemoveModal = item => {
    if (isExpired) {
      return showExpiredToast();
    }
    setItemToRemove(item);
    setRemoveModalVisible(true);
  };

  const confirmRemoveItem = async () => {
    if (!itemToRemove?.partyServiceId) {
      return;
    }
    if (itemToRemove.isCombo && partyId && itemToRemove.comboOfferId) {
      await removePartyComboSelections(partyId, itemToRemove.comboOfferId);
    }
    dispatch({
      type: SagaActions.DELETE_PARTY_SERVICE,
      payload: {uri: `/${itemToRemove.partyServiceId}`},
    });
    setRemoveModalVisible(false);
    setItemToRemove(null);
  };

  const confirmDeleteOccasion = () => {
    if (!partyId) {
      return;
    }
    setDeleteModalVisible(false);
    dispatch({
      type: SagaActions.DELETE_PARTY,
      payload: {uri: `/${partyId}`},
    });
  };

  const renderCardActions = (item, onView) => (
    <View style={styles.cardActions}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isExpired}
        onPress={onView}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        style={styles.actionBtn}>
        <AppImage
          imageSource={config.ImageList.viewIcon}
          imageStyle={styles.viewIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {!isExpired ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openRemoveModal(item)}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          style={styles.actionBtn}>
          <AppImage
            imageSource={config.ImageList.deleteIcon}
            imageStyle={styles.removeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const onAddAllToCart = async () => {
    if (isExpired) {
      return Toast.show(t('This occasion has expired'), Toast.LONG);
    }
    if (!occasionItemCount) {
      return Toast.show(t('No services to add'), Toast.SHORT);
    }

    const rawCombos = ViewPartyData?.results?.combos ?? [];
    const partyId = party?._id;
    for (const partyCombo of rawCombos) {
      const offerId = getComboOfferId(partyCombo);
      if (!offerId) {
        continue;
      }
      const typeItems = await getPartyComboSelections(partyId, offerId);
      const customizeError = getComboCustomizeError(typeItems ?? [], t);
      if (customizeError) {
        return Toast.show(
          t('Open combo to choose required options before adding to cart'),
          Toast.LONG,
        );
      }
    }

    trackEvents('add_party_to_cart', {
      party_id: partyId,
      party_name: getPartyDisplayName(party),
      service_count: partyServices.length,
      combo_count: partyCombos.length,
    });

    dispatch({
      type: SagaActions.ADD_PARTY_SERVICES_TO_CART,
      payload: {
        partyId,
        partyCombos: rawCombos,
      },
    });
  };

  const renderComboCard = (combo, idx) => {
    const name = I18nManager?.isRTL ? combo?.name_ar : combo?.name_en;
    const servicesLabel =
      combo?.typeCount === 1
        ? `1 ${t('service included')}`
        : `${combo?.typeCount ?? 0} ${t('services included')}`;
    return (
      <View
        key={combo?.partyServiceId ?? combo?._id ?? idx}
        style={[styles.serviceCard, styles.comboCard, isExpired && styles.disabledCard]}>
        <View style={styles.serviceCardPress}>
          <View style={styles.comboBadge}>
            <Text style={styles.comboBadgeText}>{t('Combo')}</Text>
          </View>
          <AppImage uri={combo?.image} imageStyle={styles.serviceImage} />
          <View style={styles.serviceBody}>
            <Text style={styles.serviceName} numberOfLines={2}>
              {name ?? combo?.name}
            </Text>
            <Text style={styles.comboMeta}>{servicesLabel}</Text>
            <Text style={styles.servicePrice}>
              {combo?.price} {t('SAR')}
            </Text>
          </View>
          {renderCardActions(
            {
              partyServiceId: combo.partyServiceId,
              isCombo: true,
              comboOfferId: combo._id,
              name: name ?? combo?.name,
            },
            () => {
              if (isExpired) {
                return showExpiredToast();
              }
              if (combo?._id) {
                navigation.navigate(config.routes.Banner_Detail, {
                  banner_id: combo._id,
                  partyId: party?._id,
                });
              }
            },
          )}
        </View>
      </View>
    );
  };

  const renderServiceCard = (s, idx) => {
    const name = I18nManager?.isRTL ? s?.name_ar : s?.name_en;
    return (
      <View
        key={s?.partyServiceId ?? s?._id ?? idx}
        style={[styles.serviceCard, isExpired && styles.disabledCard]}>
        <View style={styles.serviceCardPress}>
          <AppImage uri={s?.image} imageStyle={styles.serviceImage} />
          <View style={styles.serviceBody}>
            <Text style={styles.serviceName} numberOfLines={2}>
              {name ?? s?.name}
            </Text>
            <Text style={styles.servicePrice}>
              {s?.price} {t('SAR')}
            </Text>
          </View>
          {renderCardActions(
            {
              partyServiceId: s.partyServiceId,
              isCombo: false,
              name: name ?? s?.name,
            },
            () => {
              if (isExpired) {
                return showExpiredToast();
              }
              if (s?._id) {
                navigation.navigate(config.routes.SERVICE, {
                  service_id: s._id,
                  partyId: party?._id,
                });
              }
            },
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={config.colors.orangeColor}
        translucent={false}
      />
      <View style={styles.headerWrap}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('My Occasion')}
          backgroundColor={config.colors.orangeColor}
          rightimg={config.ImageList.deleteIcon}
          onRightPress={() => setDeleteModalVisible(true)}
          rightImageStyle={{
            tintColor: config.colors.white,
            width: 22,
            height: 22,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, isExpired && styles.summaryCardExpired]}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🎉</Text>
          </View>
          <View style={{flex: 1, marginLeft: 14}}>
            <View style={styles.summaryTitleRow}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {displayName}
              </Text>
              {showDateTag ? (
                <OccasionDateStatusTag
                  party={party}
                  status={dateStatus}
                  style={{marginLeft: 8}}
                />
              ) : null}
            </View>
            <Text style={styles.summaryDate}>
              {formatPartyMetaLine(party)}
            </Text>
            {description ? (
              <Text style={styles.summaryDescription} numberOfLines={3}>
                {description}
              </Text>
            ) : null}
            {isExpired ? (
              <Text style={styles.expiredHint}>{t('This occasion has expired')}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.planBtn, isExpired && styles.disabledBtn]}
            disabled={isExpired}
            onPress={() => {
              if (isExpired) {
                return showExpiredToast();
              }
              navigation.navigate(config.routes.OCCASION_PLANNING_TYPE, {
                occasion: party,
              });
            }}>
            <Text
              style={[
                styles.planBtnText,
                isExpired && styles.disabledBtnText,
              ]}>
              {t('Plan')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {t('Services in this occasion')}
          </Text>
          <Text style={styles.sectionCount}>
            {partyServices.length}{' '}
            {partyServices.length === 1 ? t('item') : t('items')}
          </Text>
        </View>

        {partyServices.length === 0
          ? renderSectionEmpty({
              emoji: '🛎️',
              title: t('No services added yet'),
              subtitle: t('Browse services and add them to this occasion.'),
              buttonText: t('Add Service'),
              onPress: navigateBrowseServices,
            })
          : (
            <>
              {partyServices.map(renderServiceCard)}
              {renderAddMoreButton(t('Add More Services'), navigateBrowseServices)}
            </>
          )}

        <View style={[styles.sectionRow, styles.sectionRowSpaced]}>
          <Text style={styles.sectionTitle}>
            {t('Combos in this occasion')}
          </Text>
          <Text style={styles.sectionCount}>
            {partyCombos.length}{' '}
            {partyCombos.length === 1 ? t('item') : t('items')}
          </Text>
        </View>

        {partyCombos.length === 0
          ? renderSectionEmpty({
              emoji: '🎁',
              title: t('No combos added yet'),
              subtitle: t('Browse combos and add them to this occasion.'),
              buttonText: t('Add Combo'),
              onPress: navigateBrowseCombos,
            })
          : (
            <>
              <Text style={styles.comboHint}>
                {t('Tap a combo to configure packages, then add all to cart')}
              </Text>
              {partyCombos.map(renderComboCard)}
              {renderAddMoreButton(t('Add More Combos'), navigateBrowseCombos)}
            </>
          )}
      </ScrollView>

      {occasionItemCount > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>{t('Total')}</Text>
            <Text style={styles.footerTotal}>
              {totalPrice} {t('SAR')}
            </Text>
          </View>
          <AppButton
            text={t('Add to Cart')}
            onPress={onAddAllToCart}
            disabled={isExpired}
            buttonStyle={[styles.addAllBtn, isExpired && styles.disabledPrimaryBtn]}
          />
        </View>
      )}
      <CommonModal
        navigation={navigation}
        isCommonModalVisible={removeModalVisible}
        setIsCommonModalVisible={setRemoveModalVisible}
        title={t('Remove from occasion')}
        subTitle={t('Are you sure you want to remove this item from your occasion?')}
        showButtonInRow={true}
        FirstButton={() => (
          <AppButton
            buttonStyle={{
              backgroundColor: config.colors.white,
              borderWidth: 1,
              borderColor: config.colors.orangeColor,
              width: '48%',
            }}
            text={t('No')}
            textStyle={{color: config.colors.orangeColor}}
            onPress={() => {
              setRemoveModalVisible(false);
              setItemToRemove(null);
            }}
          />
        )}
        SecondButton={() => (
          <AppButton
            buttonStyle={{width: '48%'}}
            text={t('Yes')}
            onPress={confirmRemoveItem}
          />
        )}
      />
      <CommonModal
        navigation={navigation}
        isCommonModalVisible={deleteModalVisible}
        setIsCommonModalVisible={setDeleteModalVisible}
        title={t('Delete Occasion')}
        subTitle={t('Are you sure you want to delete this occasion?')}
        showButtonInRow={true}
        FirstButton={() => (
          <AppButton
            buttonStyle={{
              backgroundColor: config.colors.white,
              borderWidth: 1,
              borderColor: config.colors.orangeColor,
              width: '48%',
            }}
            text={t('No')}
            textStyle={{color: config.colors.orangeColor}}
            onPress={() => setDeleteModalVisible(false)}
          />
        )}
        SecondButton={() => (
          <AppButton
            buttonStyle={{width: '48%'}}
            text={t('Yes')}
            onPress={confirmDeleteOccasion}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  headerWrap: {
    backgroundColor: config.colors.orangeColor,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: config.colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  summaryCardExpired: {
    opacity: 0.92,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryEmoji: {fontSize: 26},
  summaryName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 16,
    color: config.colors.Black,
    lineHeight: 22,
  },
  summaryDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    lineHeight: 20,
    marginTop: 2,
  },
  summaryDescription: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
    marginTop: 6,
  },
  planBtn: {
    backgroundColor: config.colors.creamColor,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  planBtnText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 12,
    color: config.colors.orangeColor,
  },
  disabledBtn: {
    backgroundColor: config.colors.borderColor,
  },
  disabledBtnText: {
    color: config.colors.Gray,
  },
  expiredHint: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 4,
  },
  disabledCard: {
    opacity: 0.55,
  },
  disabledPrimaryBtn: {
    backgroundColor: config.colors.borderColor,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
  },
  sectionCount: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 12,
    color: config.colors.Gray,
  },
  serviceCard: {
    backgroundColor: config.colors.white,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  serviceCardPress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
  },
  viewIcon: {
    width: 22,
    height: 22,
    tintColor: config.colors.orangeColor,
  },
  removeIcon: {
    width: 22,
    height: 22,
    tintColor: config.colors.Gray,
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: config.colors.creamColor,
  },
  serviceBody: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    lineHeight: 20,
  },
  servicePrice: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 13,
    color: config.colors.orangeColor,
    marginTop: 4,
  },
  sectionRowSpaced: {
    marginTop: 18,
  },
  sectionEmptyWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: config.colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionActionBtn: {
    alignSelf: 'stretch',
    width: '100%',
    marginTop: 16,
    marginHorizontal: 0,
    marginVertical: 0,
    minHeight: 48,
    borderRadius: 12,
  },
  sectionActionBtnText: {
    fontSize: 15,
    lineHeight: 22,
  },
  addMoreBtn: {
    alignSelf: 'stretch',
    borderWidth: 1.5,
    borderColor: config.colors.orangeColor,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: config.colors.white,
  },
  addMoreBtnDisabled: {
    borderColor: config.colors.borderColor,
    backgroundColor: '#FAFAFA',
  },
  addMoreBtnText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.orangeColor,
    lineHeight: 20,
  },
  addMoreBtnTextDisabled: {
    color: config.colors.Gray,
  },
  comboHint: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
    marginBottom: 10,
  },
  comboCard: {
    paddingTop: 16,
  },
  comboBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: config.colors.orangeColor,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comboBadgeText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 10,
    color: config.colors.white,
  },
  comboMeta: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 11,
    color: config.colors.Gray,
    lineHeight: 16,
    marginTop: 2,
  },
  emptyEmoji: {fontSize: 40, marginBottom: 8},
  emptyTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: config.colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: config.colors.borderColor,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerLabel: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.Gray,
  },
  footerTotal: {
    fontFamily: config.fonts.Poppins_Bold,
    fontSize: 18,
    color: config.colors.orangeColor,
  },
  addAllBtn: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
});

export default OccasionView;
