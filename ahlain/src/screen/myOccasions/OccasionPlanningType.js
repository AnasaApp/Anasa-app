import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import config from '../../config';
import {
  getPartyDisplayName,
  formatPartyMetaLine,
  getPartyDateStatus,
  hasPartyOccasionDate,
  isPartyDateExpired,
} from '../../utils/partyHelpers';
import OccasionDateStatusTag from '../../conponents/OccasionDateStatusTag';
import AppHeader from '../../conponents/AppHeader';

const OccasionPlanningType = ({navigation, route}) => {
  const {t} = useTranslation();
  const occasion = route?.params?.occasion;

  const displayName = getPartyDisplayName(occasion);
  const metaLine = formatPartyMetaLine(occasion);
  const dateStatus = getPartyDateStatus(occasion);
  const isExpired = isPartyDateExpired(occasion);
  const showDateTag = hasPartyOccasionDate(occasion);

  const showExpiredToast = () =>
    Toast.show(t('This occasion has expired'), Toast.LONG);

  const openPlanMyPartyFlow = () => {
    if (isExpired) {
      return showExpiredToast();
    }
    navigation.navigate(config.routes.START_SERVICE_REQUEST, {
      occasion,
      partyId: occasion?._id,
    });
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
          title={t('Plan Your Occasion')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.occasionCard}>
          <View style={styles.occasionCardLeft}>
            <View style={styles.occasionIconCircle}>
              <Text style={styles.occasionEmoji}>🎉</Text>
            </View>
            <View style={{marginLeft: 14, flex: 1}}>
              <View style={styles.occasionTitleRow}>
                <Text style={styles.occasionCardName} numberOfLines={1}>
                  {displayName}
                </Text>
                {showDateTag ? (
                  <OccasionDateStatusTag
                    party={occasion}
                    status={dateStatus}
                    style={{marginLeft: 8}}
                  />
                ) : null}
              </View>
              <Text style={styles.occasionCardDate}>{metaLine}</Text>
            </View>
          </View>
        </View>

        {isExpired ? (
          <Text style={styles.expiredNotice}>
            {t('This occasion has expired')}
          </Text>
        ) : null}

        <Text style={styles.choiceTitle}>{t('How would you like to plan?')}</Text>
        <Text style={styles.choiceSubtitle}>
          {t('Choose how you want to bring this occasion to life')}
        </Text>

        <TouchableOpacity
          activeOpacity={isExpired ? 1 : 0.85}
          disabled={isExpired}
          style={[styles.planCard, isExpired && styles.planCardDisabled]}
          onPress={() => {
            if (isExpired) {
              return showExpiredToast();
            }
            navigation.navigate(config.routes.OCCASION_VIEW, {occasion});
          }}>
          <View style={[styles.planCardIcon, {backgroundColor: '#EEF9F5'}]}>
            <Text style={styles.planCardEmoji}>🛍</Text>
          </View>
          <View style={styles.planCardBody}>
            <Text style={styles.planCardTitle}>{t('Plan Myself')}</Text>
            <Text style={styles.planCardDesc}>
              {t(
                'Browse our services and hand-pick exactly what you want for your occasion.',
              )}
            </Text>
            <View style={styles.planCardTag}>
              <Text style={styles.planCardTagText}>{t('Full Control')}</Text>
            </View>
          </View>
          <View style={styles.planCardArrow}>
            <Text style={styles.planCardArrowText}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={isExpired ? 1 : 0.85}
          disabled={isExpired}
          style={[
            styles.planCard,
            styles.planCardPrimary,
            isExpired && styles.planCardDisabled,
          ]}
          onPress={openPlanMyPartyFlow}>
          <View
            style={[styles.planCardIcon, {backgroundColor: 'rgba(255,255,255,0.25)'}]}>
            <Text style={styles.planCardEmoji}>🎯</Text>
          </View>
          <View style={styles.planCardBody}>
            <Text style={[styles.planCardTitle, {color: config.colors.white}]}>
              {t('Plan For Me')}
            </Text>
            <Text style={[styles.planCardDesc, {color: config.colors.white + 'CC'}]}>
              {t(
                'Let our experts handle everything. Share your vision and we do the rest.',
              )}
            </Text>
            <View
              style={[
                styles.planCardTag,
                {backgroundColor: 'rgba(255,255,255,0.25)'},
              ]}>
              <Text style={[styles.planCardTagText, {color: config.colors.white}]}>
                {t('Hassle Free')}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.planCardArrow,
              {backgroundColor: 'rgba(255,255,255,0.15)'},
            ]}>
            <Text style={[styles.planCardArrowText, {color: config.colors.white}]}>
              ›
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.howItWorksBox}>
          <Text style={styles.howTitle}>{t('How "Plan For Me" works')}</Text>
          {[
            {step: '1', text: t('You share your occasion details & notes')},
            {step: '2', text: t('Our team reviews and curates a plan for you')},
            {step: '3', text: t('We contact you to confirm and finalize')},
          ].map(s => (
            <View key={s.step} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{s.step}</Text>
              </View>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  occasionCard: {
    backgroundColor: config.colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  occasionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  occasionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  occasionEmoji: {
    fontSize: 26,
  },
  occasionCardName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    lineHeight: 22,
  },
  occasionCardDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    lineHeight: 20,
  },
  occasionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  expiredNotice: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 13,
    color: '#B91C1C',
    marginBottom: 16,
  },
  choiceTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    marginBottom: 4,
  },
  choiceSubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: config.colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  planCardPrimary: {
    backgroundColor: config.colors.orangeColor,
  },
  planCardDisabled: {
    opacity: 0.55,
  },
  planCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planCardEmoji: {
    fontSize: 26,
  },
  planCardBody: {
    flex: 1,
  },
  planCardTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    lineHeight: 22,
    marginBottom: 4,
  },
  planCardDesc: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 12,
    color: config.colors.Gray,
    lineHeight: 18,
    marginBottom: 8,
  },
  planCardTag: {
    alignSelf: 'flex-start',
    backgroundColor: config.colors.creamColor,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  planCardTagText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 11,
    color: config.colors.orangeColor,
  },
  planCardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  planCardArrowText: {
    fontSize: 22,
    color: config.colors.Gray,
    lineHeight: 28,
  },
  howItWorksBox: {
    backgroundColor: config.colors.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  howTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: config.colors.orangeColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 13,
    color: config.colors.white,
    lineHeight: 20,
  },
  stepText: {
    flex: 1,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Light_Black,
    lineHeight: 20,
  },
});

export default OccasionPlanningType;
