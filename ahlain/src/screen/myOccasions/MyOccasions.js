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
import moment from 'moment';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {GetMyOccasionsReducer} from '../../redux/reducers';
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

  useEffect(() => {
    dispatch({type: SagaActions.GET_MY_OCCASIONS, payload: ''});
  }, []);

  useEffect(() => {
    if (GetMyOccasionsData != null) {
      setOccasions(GetMyOccasionsData?.results?.occasions ?? []);
    }
  }, [GetMyOccasionsData]);

  useEffect(() => {
    if (GetMyOccasionsError != null) {
      Toast.show(
        GetMyOccasionsError?.message ?? t('Failed to load occasions'),
        Toast.LONG,
      );
      dispatch(GetMyOccasionsReducer.removeGetMyOccasionsResponse());
    }
  }, [GetMyOccasionsError]);

  // Refresh list after creating a new occasion
  const onFocus = () => {
    dispatch({type: SagaActions.GET_MY_OCCASIONS, payload: ''});
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
    const daysLeft = moment(item?.date).diff(moment(), 'days');
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        style={styles.card}
        onPress={() =>
          navigation.navigate(config.routes.OCCASION_PLANNING_TYPE, {
            occasion: item,
          })
        }>
        <View
          style={[
            styles.cardAccent,
            {
              backgroundColor:
                index % 3 === 0
                  ? config.colors.orangeColor
                  : index % 3 === 1
                  ? config.colors.buttonColor
                  : config.colors.yellowColor,
            },
          ]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🎂</Text>
            </View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.occasionName} numberOfLines={1}>
                {item?.name}
              </Text>
              <Text style={styles.occasionDate}>
                {moment(item?.date).format('DD MMM YYYY')}
              </Text>
            </View>
            {daysLeft >= 0 && (
              <View style={styles.daysBadge}>
                <Text style={styles.daysNum}>{daysLeft}</Text>
                <Text style={styles.daysLabel}>{t('days')}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.planLabel}>{t('Tap to plan this occasion')}</Text>
            <Image
              source={require('../../assets/images/backArrowIcon.png')}
              style={[
                styles.arrowIcon,
                {transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}]},
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
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



