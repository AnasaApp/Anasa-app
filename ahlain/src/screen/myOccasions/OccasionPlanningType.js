import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
  Image,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import AppButton from '../../conponents/AppButton';
import {PlanForMeReducer} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';

const OccasionPlanningType = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const occasion = route?.params?.occasion;
  const isNew = route?.params?.isNew ?? false;

  const PlanForMeResponse = useSelector(PlanForMeReducer.selectPlanForMeData);
  const PlanForMeError = useSelector(
    PlanForMeReducer.selectPlanForMeResponse,
  );

  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPlanForMeSheet, setShowPlanForMeSheet] = useState(false);
  const scaleAnim = new Animated.Value(0.8);

  // Animate success modal
  useEffect(() => {
    if (showSuccessModal) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [showSuccessModal]);

  // Handle plan for me success
  useEffect(() => {
    if (PlanForMeResponse != null) {
      if (PlanForMeResponse?.error === false) {
        dispatch(PlanForMeReducer.removePlanForMeResponse());
        setShowPlanForMeSheet(false);
        setShowSuccessModal(true);
      }
    }
  }, [PlanForMeResponse]);

  // Handle plan for me error
  useEffect(() => {
    if (PlanForMeError != null) {
      Toast.show(PlanForMeError?.message ?? t('Something went wrong'), Toast.LONG);
      dispatch(PlanForMeReducer.removePlanForMeResponse());
    }
  }, [PlanForMeError]);

  const handlePlanForMe = () => {
    if (!occasion?._id) {
      return Toast.show(t('Occasion not found'), Toast.LONG);
    }
    const payload = {
      occasion_id: occasion._id,
      notes: notes.trim(),
      occasion_name: occasion?.name,
      occasion_date: occasion?.date,
    };
    dispatch({type: SagaActions.PLAN_FOR_ME, payload});
  };

  const daysLeft = occasion?.date
    ? moment(occasion.date).diff(moment(), 'days')
    : null;

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
        {/* Occasion info card */}
        <View style={styles.occasionCard}>
          <View style={styles.occasionCardLeft}>
            <View style={styles.occasionIconCircle}>
              <Text style={styles.occasionEmoji}>🎉</Text>
            </View>
            <View style={{marginLeft: 14, flex: 1}}>
              <Text style={styles.occasionCardName} numberOfLines={1}>
                {occasion?.name ?? t('My Occasion')}
              </Text>
              <Text style={styles.occasionCardDate}>
                {occasion?.date
                  ? moment(occasion.date).format('DD MMM YYYY')
                  : ''}
              </Text>
            </View>
          </View>
          {daysLeft !== null && daysLeft >= 0 && (
            <View style={styles.occasionCountdown}>
              <Text style={styles.countdownNum}>{daysLeft}</Text>
              <Text style={styles.countdownLbl}>{t('days left')}</Text>
            </View>
          )}
        </View>

        {/* Section title */}
        <Text style={styles.choiceTitle}>{t('How would you like to plan?')}</Text>
        <Text style={styles.choiceSubtitle}>
          {t('Choose how you want to bring this occasion to life')}
        </Text>

        {/* Plan Myself Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.planCard}
          onPress={() => {
            // Navigate to occasions browse or service browsing
            navigation.navigate(config.routes.CATEGORIES);
          }}>
          <View style={[styles.planCardIcon, {backgroundColor: '#EEF9F5'}]}>
            <Text style={styles.planCardEmoji}>🛍</Text>
          </View>
          <View style={styles.planCardBody}>
            <Text style={styles.planCardTitle}>{t('Plan Myself')}</Text>
            <Text style={styles.planCardDesc}>
              {t('Browse our services and hand-pick exactly what you want for your occasion.')}
            </Text>
            <View style={styles.planCardTag}>
              <Text style={styles.planCardTagText}>{t('Full Control')}</Text>
            </View>
          </View>
          <View style={styles.planCardArrow}>
            <Text style={styles.planCardArrowText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Plan For Me Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.planCard, styles.planCardPrimary]}
          onPress={() => setShowPlanForMeSheet(true)}>
          <View style={[styles.planCardIcon, {backgroundColor: 'rgba(255,255,255,0.25)'}]}>
            <Text style={styles.planCardEmoji}>🎯</Text>
          </View>
          <View style={styles.planCardBody}>
            <Text style={[styles.planCardTitle, {color: config.colors.white}]}>
              {t('Plan For Me')}
            </Text>
            <Text style={[styles.planCardDesc, {color: config.colors.white + 'CC'}]}>
              {t('Let our experts handle everything. Share your vision and we do the rest.')}
            </Text>
            <View style={[styles.planCardTag, {backgroundColor: 'rgba(255,255,255,0.25)'}]}>
              <Text style={[styles.planCardTagText, {color: config.colors.white}]}>
                {t('Hassle Free')}
              </Text>
            </View>
          </View>
          <View style={[styles.planCardArrow, {backgroundColor: 'rgba(255,255,255,0.15)'}]}>
            <Text style={[styles.planCardArrowText, {color: config.colors.white}]}>›</Text>
          </View>
        </TouchableOpacity>

        {/* How it works */}
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

      {/* Plan For Me Bottom Sheet Modal */}
      <Modal
        visible={showPlanForMeSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlanForMeSheet(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlanForMeSheet(false)}>
          <View
            style={styles.bottomSheet}
            onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t('Share Your Vision')}</Text>
            <Text style={styles.sheetSubtitle}>
              {t('Add any notes or preferences for our planning team')}
            </Text>
            <View style={styles.notesBox}>
              <TextInput
                style={styles.notesInput}
                placeholder={t(
                  'E.g. Floral theme, outdoor venue, 50 guests, budget around 5000 SAR...',
                )}
                placeholderTextColor={config.colors.placeholderTextColor}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>{notes.length}/500</Text>
            </View>
            <AppButton
              text={t('Send Request')}
              onPress={handlePlanForMe}
              buttonStyle={styles.sendBtn}
            />
            <TouchableOpacity
              onPress={() => setShowPlanForMeSheet(false)}
              style={styles.cancelBtn}>
              <Text style={styles.cancelText}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}>
        <View style={styles.successOverlay}>
          <Animated.View
            style={[styles.successCard, {transform: [{scale: scaleAnim}]}]}>
            <View style={styles.successIconWrap}>
              <Text style={styles.successIcon}>🎊</Text>
            </View>
            <Text style={styles.successTitle}>{t('Request Sent!')}</Text>
            <Text style={styles.successMsg}>
              {t(
                "We've received your planning request. Our team will reach out to you shortly to help plan the perfect occasion.",
              )}
            </Text>
            <View style={styles.successInfoRow}>
              <Text style={styles.successOccasionName}>
                {occasion?.name ?? ''}
              </Text>
              {occasion?.date ? (
                <Text style={styles.successDate}>
                  {moment(occasion.date).format('DD MMM YYYY')}
                </Text>
              ) : null}
            </View>
            <AppButton
              text={t('Got it!')}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate(config.routes.HOME_SCREEN);
              }}
              buttonStyle={{marginHorizontal: 0, marginTop: 20}}
            />
          </Animated.View>
        </View>
      </Modal>
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
  // Occasion card at top
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
  occasionCountdown: {
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
  // Choice section
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
  // Plan cards
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
  // How it works
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
  // Bottom sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: config.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: config.colors.borderColor,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    marginBottom: 6,
  },
  sheetSubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    marginBottom: 18,
    lineHeight: 20,
  },
  notesBox: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: config.colors.borderColor,
    padding: 12,
    marginBottom: 16,
  },
  notesInput: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Black,
    minHeight: 100,
    maxHeight: 150,
  },
  charCount: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 11,
    color: config.colors.Gray,
    textAlign: 'right',
    marginTop: 6,
  },
  sendBtn: {
    marginHorizontal: 0,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 15,
    color: config.colors.Gray,
  },
  // Success modal
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: config.colors.white,
    borderRadius: 24,
    margin: 20,
    padding: 28,
    alignItems: 'center',
    elevation: 10,
  },
  successIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: config.colors.creamColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 44,
  },
  successTitle: {
    fontFamily: config.fonts.Poppins_Bold,
    fontSize: 22,
    color: config.colors.Black,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMsg: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.Gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  successInfoRow: {
    backgroundColor: config.colors.creamColor,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  successOccasionName: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 15,
    color: config.colors.Black,
    textAlign: 'center',
  },
  successDate: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default OccasionPlanningType;

