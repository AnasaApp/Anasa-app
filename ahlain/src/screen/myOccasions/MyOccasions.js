import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  I18nManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import config from '../../config';
import {
  getPartyDisplayName,
  formatPartyMetaLine,
  enrichPartyWithCachedMeta,
  getPartyDateStatus,
  isPartyDateExpired,
  hasPartyOccasionDate,
} from '../../utils/partyHelpers';
import usePartyMetaCache from '../../utils/usePartyMetaCache';
import OccasionDateStatusTag from '../../conponents/OccasionDateStatusTag';
import AppHeader from '../../conponents/AppHeader';
import AppImage from '../../conponents/AppImage';
import {AppButton} from '../../conponents';
import {CommonModal} from '../../conponents/CommonModal';
import {DeletePartyReducer, GetMyOccasionsReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import Toast from 'react-native-simple-toast';

const MyOccasions = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const GetMyOccasionsData = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsData,
  );
  const GetMyOccasionsError = useSelector(
    GetMyOccasionsReducer.selectGetMyOccasionsResponse,
  );
  const [occasions, setOccasions] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState(null);
  const partyMetaVersion = usePartyMetaCache();
  const DeletePartyResponse = useSelector(
    DeletePartyReducer.selectDeletePartyData,
  );
  const DeletePartyErrorResponse = useSelector(
    DeletePartyReducer.selectDeletePartyResponse,
  );
  const refreshOccasions = () => {
    dispatch({
      type: SagaActions.GET_MY_OCCASIONS,
      payload: {page: 1, pageSize: 50},
    });
  };

  const callDeletePartyApi = partyId => {
    dispatch({
      type: SagaActions.DELETE_PARTY,
      payload: {uri: '/' + partyId},
    });
  };

  useEffect(() => {
    dispatch({
      type: SagaActions.GET_MY_OCCASIONS,
      payload: {page: 1, pageSize: 50},
    });
  }, []);

  useEffect(() => {
    if (GetMyOccasionsData != null) {
      setOccasions(
        (GetMyOccasionsData?.results?.parties ?? []).map(enrichPartyWithCachedMeta),
      );
    }
  }, [GetMyOccasionsData, partyMetaVersion]);

  useEffect(() => {
    if (GetMyOccasionsError != null) {
      Toast.show(
        GetMyOccasionsError?.message ?? t('Failed to load occasions'),
        Toast.LONG,
      );
      dispatch(GetMyOccasionsReducer.removeGetMyOccasionsResponse());
    }
  }, [GetMyOccasionsError]);

  useEffect(() => {
    if (DeletePartyResponse != null) {
      if (DeletePartyResponse?.error === false) {
        Toast.show(
          DeletePartyResponse?.message ?? t('Delete Occasion'),
          Toast.LONG,
        );
        refreshOccasions();
        dispatch(DeletePartyReducer.removeDeletePartyResponse());
      }
    }
  }, [DeletePartyResponse]);

  useEffect(() => {
    if (DeletePartyErrorResponse != null) {
      if (DeletePartyErrorResponse?.message) {
        Toast.show(DeletePartyErrorResponse.message, Toast.LONG);
      }
      dispatch(DeletePartyReducer.removeDeletePartyResponse());
    }
  }, [DeletePartyErrorResponse]);

  const openDeleteModal = party => {
    setPartyToDelete(party);
    setIsDeleteModalVisible(true);
  };

  const confirmDeleteParty = () => {
    if (!partyToDelete?._id) {
      return;
    }
    setIsDeleteModalVisible(false);
    callDeletePartyApi(partyToDelete._id);
    setPartyToDelete(null);
  };

  // Refresh list after creating a new occasion
  const onFocus = () => {
    refreshOccasions();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', onFocus);
    return unsubscribe;
  }, [navigation]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Text style={styles.emptyEmoji}>🎉</Text>
      </View>
      <Text style={styles.emptyTitle}>{t('No Occasions Yet')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('Tap the + button to create your first personal occasion')}
      </Text>
    </View>
  );

  const renderItem = ({item, index}) => {
    const party = enrichPartyWithCachedMeta(item);
    const displayName = getPartyDisplayName(party);
    const metaLine = formatPartyMetaLine(party);
    const dateStatus = getPartyDateStatus(party);
    const isExpired = isPartyDateExpired(party);
    const showDateTag = hasPartyOccasionDate(party);
    return (
      <View
        key={index}
        style={[styles.card, isExpired && styles.cardExpired]}>
        <View
          style={[
            styles.cardAccent,
            {
              backgroundColor: isExpired
                ? config.colors.Gray
                : index % 3 === 0
                ? config.colors.orangeColor
                : index % 3 === 1
                ? config.colors.buttonColor
                : config.colors.yellowColor,
            },
          ]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardMainPress}
              onPress={() =>
                navigation.navigate(config.routes.OCCASION_VIEW, {
                  occasion: party,
                })
              }>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>🎂</Text>
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.occasionName} numberOfLines={1}>
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
                <Text style={styles.occasionDate}>{metaLine}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openDeleteModal(party)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              style={styles.deleteBtn}>
              <AppImage
                imageSource={config.ImageList.deleteIcon}
                imageStyle={styles.deleteIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(config.routes.OCCASION_VIEW, {
                occasion: party,
              })
            }
            style={styles.cardFooter}>
            <Text style={styles.planLabel}>{t('Tap to view occasion')}</Text>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={[
                styles.arrowIcon,
                {transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}]},
              ]}
            />
          </TouchableOpacity>
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
      <View style={styles.header}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('My Occasions')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <FlatList
        data={occasions}
        keyExtractor={(item, index) => (item?._id ?? index).toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          occasions.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB: Add New */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => navigation.navigate(config.routes.CREATE_OCCASION)}>
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>

      <CommonModal
        navigation={navigation}
        isCommonModalVisible={isDeleteModalVisible}
        setIsCommonModalVisible={setIsDeleteModalVisible}
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
            onPress={() => {
              setIsDeleteModalVisible(false);
              setPartyToDelete(null);
            }}
          />
        )}
        SecondButton={() => (
          <AppButton
            buttonStyle={{width: '48%'}}
            text={t('Yes')}
            onPress={confirmDeleteParty}
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
  header: {
    backgroundColor: config.colors.orangeColor,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  listEmpty: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: config.colors.white,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardExpired: {
    opacity: 0.88,
  },
  cardAccent: {
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMainPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 8,
    padding: 4,
  },
  deleteIcon: {
    width: 22,
    height: 22,
    tintColor: config.colors.Gray,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  occasionName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    lineHeight: 22,
  },
  occasionDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
  },
  daysBadge: {
    alignItems: 'center',
    backgroundColor: config.colors.creamColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  daysNum: {
    fontFamily: config.fonts.Poppins_Bold,
    fontSize: 16,
    color: config.colors.orangeColor,
    lineHeight: 22,
  },
  daysLabel: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 10,
    color: config.colors.Gray,
    lineHeight: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: config.colors.BACKGROUNDCOLOR,
  },
  planLabel: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 12,
    color: config.colors.orangeColor,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: config.colors.orangeColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 42,
  },
  emptyTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.Gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: config.colors.orangeColor,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: config.colors.orangeColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabPlus: {
    fontSize: 30,
    color: config.colors.white,
    lineHeight: 36,
    marginTop: -2,
  },
});

export default MyOccasions;



