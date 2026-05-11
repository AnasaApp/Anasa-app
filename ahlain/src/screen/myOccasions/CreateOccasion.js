import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  useColorScheme,
  I18nManager,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import AppButton from '../../conponents/AppButton';
import {
  CreateMyOccasionReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';

const OCCASION_TYPES = [
  {id: 'birthday', label: 'Birthday', emoji: '🎂'},
  {id: 'wedding', label: 'Wedding', emoji: '💍'},
  {id: 'graduation', label: 'Graduation', emoji: '🎓'},
  {id: 'anniversary', label: 'Anniversary', emoji: '💝'},
  {id: 'babyshower', label: 'Baby Shower', emoji: '🍼'},
  {id: 'corporate', label: 'Corporate', emoji: '🏢'},
  {id: 'other', label: 'Other', emoji: '🎉'},
];

const CreateOccasion = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const CreateMyOccasionResponse = useSelector(
    CreateMyOccasionReducer.selectCreateMyOccasionData,
  );
  const CreateMyOccasionError = useSelector(
    CreateMyOccasionReducer.selectCreateMyOccasionResponse,
  );

  const [occasionName, setOccasionName] = useState('');
  const [occasionDate, setOccasionDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Handle success
  useEffect(() => {
    if (CreateMyOccasionResponse != null) {
      if (CreateMyOccasionResponse?.error === false) {
        dispatch(CreateMyOccasionReducer.removeCreateMyOccasionResponse());
        const createdOccasion = CreateMyOccasionResponse?.results?.occasion;
        navigation.replace(config.routes.OCCASION_PLANNING_TYPE, {
          occasion: createdOccasion,
          isNew: true,
        });
      }
    }
  }, [CreateMyOccasionResponse]);

  // Handle error
  useEffect(() => {
    if (CreateMyOccasionError != null) {
      Toast.show(
        CreateMyOccasionError?.message ?? t('Something went wrong'),
        Toast.LONG,
      );
      dispatch(CreateMyOccasionReducer.removeCreateMyOccasionResponse());
    }
  }, [CreateMyOccasionError]);

  const handleCreate = () => {
    if (!occasionName.trim()) {
      return Toast.show(t('Please enter occasion name'), Toast.LONG);
    }
    if (!occasionDate) {
      return Toast.show(t('Please select occasion date'), Toast.LONG);
    }
    const payload = {
      name: occasionName.trim(),
      date: moment(occasionDate).format('YYYY-MM-DD'),
      type: selectedType || 'other',
    };
    dispatch({type: SagaActions.CREATE_MY_OCCASION, payload});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={config.colors.orangeColor}
        translucent={false}
      />
      <View style={styles.header}>
        <AppHeader
          navigation={navigation}
          onPress={() => navigation.goBack()}
          title={t('Create Occasion')}
          backgroundColor={config.colors.orangeColor}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>{t('Name Your Occasion')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('Tell us about this special moment so we can help you plan it perfectly.')}
          </Text>
        </View>

        {/* Occasion Type Picker */}
        <Text style={styles.sectionLabel}>{t('Occasion Type')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScroll}>
          {OCCASION_TYPES.map(type => (
            <TouchableOpacity
              key={type.id}
              activeOpacity={0.8}
              onPress={() => setSelectedType(type.id)}
              style={[
                styles.typeChip,
                selectedType === type.id && styles.typeChipActive,
              ]}>
              <Text style={styles.typeEmoji}>{type.emoji}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.id && styles.typeLabelActive,
                ]}>
                {t(type.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Occasion Name */}
        <Text style={styles.sectionLabel}>{t('Occasion Name')}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📝</Text>
          <TextInput
            style={styles.input}
            placeholder={t("e.g. Sarah's Birthday")}
            placeholderTextColor={config.colors.placeholderTextColor}
            value={occasionName}
            onChangeText={setOccasionName}
            maxLength={60}
            returnKeyType="done"
          />
          {occasionName.length > 0 && (
            <TouchableOpacity onPress={() => setOccasionName('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Occasion Date */}
        <Text style={styles.sectionLabel}>{t('Occasion Date')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.dateContainer}
          onPress={() => setDatePickerVisibility(true)}>
          <Image
            source={require('../../assets/images/calender.png')}
            style={styles.calenderIcon}
          />
          <Text
            style={[
              styles.dateText,
              !occasionDate && {color: config.colors.placeholderTextColor},
            ]}>
            {occasionDate
              ? moment(occasionDate).format('DD MMMM YYYY')
              : t('Select date')}
          </Text>
          {occasionDate ? (
            <TouchableOpacity
              onPress={() => setOccasionDate('')}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.dateArrow}>›</Text>
          )}
        </TouchableOpacity>

        {/* Date countdown hint */}
        {occasionDate ? (
          <View style={styles.countdownRow}>
            <Text style={styles.countdownText}>
              {moment(occasionDate).diff(moment(), 'days') >= 0
                ? `🗓 ${moment(occasionDate).diff(moment(), 'days')} ${t('days away')}`
                : `⏰ ${t('This date has already passed')}`}
            </Text>
          </View>
        ) : null}

        <AppButton
          text={t('Create & Plan')}
          onPress={handleCreate}
          buttonStyle={styles.createBtn}
        />
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={occasionDate ? new Date(occasionDate) : new Date()}
        minimumDate={new Date()}
        onConfirm={selectedDate => {
          setOccasionDate(selectedDate);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        isDarkModeEnabled={colorScheme === 'dark'}
      />
    </KeyboardAvoidingView>
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
    padding: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: config.colors.creamColor,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 18,
    color: config.colors.Black,
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionLabel: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 14,
    color: config.colors.Black,
    marginBottom: 10,
    marginTop: 4,
  },
  typeScroll: {
    paddingBottom: 16,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.colors.white,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: config.colors.borderColor,
  },
  typeChipActive: {
    backgroundColor: config.colors.orangeColor,
    borderColor: config.colors.orangeColor,
  },
  typeEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  typeLabel: {
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 13,
    color: config.colors.Gray,
  },
  typeLabelActive: {
    color: config.colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: config.colors.borderColor,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 14,
    color: config.colors.Black,
    paddingVertical: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  clearBtn: {
    fontSize: 14,
    color: config.colors.Gray,
    paddingLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: config.colors.borderColor,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 8,
  },
  calenderIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    fontFamily: config.fonts.Poppins_Medium,
    fontSize: 14,
    color: config.colors.Black,
  },
  dateArrow: {
    fontSize: 20,
    color: config.colors.Gray,
  },
  countdownRow: {
    marginBottom: 20,
  },
  countdownText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
  },
  createBtn: {
    marginTop: 16,
    marginHorizontal: 0,
  },
});

export default CreateOccasion;


