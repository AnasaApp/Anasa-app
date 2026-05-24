import React, {useEffect, useMemo} from 'react';
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
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import AppButton from '../../conponents/AppButton';
import AppImage from '../../conponents/AppImage';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {AddToCartReducer} from '../../redux/reducers';
import {trackEvents} from '../../config/FCMEvents';

const OccasionView = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const occasion = route?.params?.occasion;

  const AddToCartResponse = useSelector(AddToCartReducer.selectAddToCartData);
  const AddToCartErrorResponse = useSelector(
    AddToCartReducer.selectAddToCartResponse,
  );

  const services = useMemo(() => occasion?.services || [], [occasion]);

  const totalPrice = useMemo(
    () =>
      services.reduce(
        (sum, s) => sum + (Number(s?.price) || 0),
        0,
      ),
    [services],
  );

  const daysLeft = occasion?.date
    ? moment(occasion.date).diff(moment(), 'days')
    : null;

  // Pipe the cart saga responses to a toast (the saga is shared with other
  // screens, so we still clear state after handling).
  useEffect(() => {
    if (AddToCartResponse != null && AddToCartResponse?.error === false) {
      Toast.show(AddToCartResponse?.message ?? t('Added to cart'), Toast.LONG);
      dispatch(AddToCartReducer.removeAddToCartResponse());
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

  const onAddAllToCart = () => {
    if (!services.length) {
      return Toast.show(t('No services to add'), Toast.SHORT);
    }
    services.forEach(s => {
      const payload = {
        serviceId: s?._id,
        packageId: [],
        price: Number(s?.price) || 0,
        occasion_id: occasion?._id,
        occasion_name: occasion?.name,
      };
      trackEvents('add_to_cart', payload);
      dispatch({type: SagaActions.ADD_TO_CART, payload});
    });
    navigation.navigate(config.routes.CART);
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
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Occasion summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>{occasion?.emoji ?? '🎉'}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 14}}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {occasion?.name ?? t('My Occasion')}
            </Text>
            <Text style={styles.summaryDate}>
              {occasion?.date
                ? moment(occasion.date).format('DD MMM YYYY')
                : ''}
            </Text>
          </View>
          {daysLeft !== null && daysLeft >= 0 && (
            <View style={styles.countdown}>
              <Text style={styles.countdownNum}>{daysLeft}</Text>
              <Text style={styles.countdownLbl}>{t('days left')}</Text>
            </View>
          )}
        </View>

        {/* Services section header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            {t('Services in this occasion')}
          </Text>
          <Text style={styles.sectionCount}>
            {services.length} {services.length === 1 ? t('item') : t('items')}
          </Text>
        </View>

        {services.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🧺</Text>
            <Text style={styles.emptyTitle}>
              {t('No services added yet')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('Browse services and add them to this occasion.')}
            </Text>
            <AppButton
              text={t('Browse Services')}
              onPress={() => navigation.navigate(config.routes.CATEGORIES)}
              buttonStyle={{marginTop: 16, marginHorizontal: 0}}
            />
          </View>
        ) : (
          services.map((s, idx) => {
            const name = I18nManager?.isRTL ? s?.name_ar : s?.name_en;
            const image = Array.isArray(s?.images) ? s?.images?.[0] : s?.image;
            return (
              <TouchableOpacity
                key={s?._id ?? idx}
                activeOpacity={0.85}
                onPress={() =>
                  s?._id &&
                  navigation.navigate(config.routes.SERVICE, {
                    service_id: s?._id,
                  })
                }
                style={styles.serviceCard}>
                <AppImage uri={image} imageStyle={styles.serviceImage} />
                <View style={styles.serviceBody}>
                  <Text style={styles.serviceName} numberOfLines={2}>
                    {name ?? s?.name}
                  </Text>
                  <Text style={styles.servicePrice}>
                    {s?.price} {t('SAR')}
                  </Text>
                </View>
                <Text style={styles.serviceChevron}>›</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {services.length > 0 && (
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
            buttonStyle={styles.addAllBtn}
          />
        </View>
      )}
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
    paddingBottom: 30,
  },
  // Summary
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
  countdown: {
    alignItems: 'center',
    backgroundColor: config.colors.creamColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
  },
  countdownNum: {
    fontFamily: config.fonts.Poppins_Bold,
    fontSize: 18,
    color: config.colors.orangeColor,
    lineHeight: 24,
  },
  countdownLbl: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 10,
    color: config.colors.Gray,
    lineHeight: 14,
  },
  // Section header
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
  // Service card
  serviceCard: {
    backgroundColor: config.colors.white,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
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
  serviceChevron: {
    fontSize: 24,
    color: config.colors.Gray,
    paddingHorizontal: 4,
    transform: [{rotate: I18nManager?.isRTL ? '180deg' : '0deg'}],
  },
  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyEmoji: {fontSize: 48, marginBottom: 10},
  emptyTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 16,
    color: config.colors.Black,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  // Footer
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
