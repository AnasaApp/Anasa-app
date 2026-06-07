import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
  useColorScheme,
  I18nManager,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
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
  GetPartyTypesReducer,
} from '../../redux/reducers';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {getPartyTypeLabel, rememberPartyMeta, mergePartyRecords, getPartyId} from '../../utils/partyHelpers';

const CreateOccasion = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const preselectedTypeId = route?.params?.partyTypeId;

  const CreateMyOccasionResponse = useSelector(
    CreateMyOccasionReducer.selectCreateMyOccasionData,
  );
  const CreateMyOccasionError = useSelector(
    CreateMyOccasionReducer.selectCreateMyOccasionResponse,
  );
  const GetPartyTypesData = useSelector(
    GetPartyTypesReducer.selectGetPartyTypesData,
  );
  const GetPartyTypesError = useSelector(
    GetPartyTypesReducer.selectGetPartyTypesResponse,
  );

  const [occasionName, setOccasionName] = useState('');
  const [occasionDescription, setOccasionDescription] = useState('');
  const [occasionDate, setOccasionDate] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState(preselectedTypeId || '');
  const lastCreateMetaRef = useRef(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const partyTypes = GetPartyTypesData?.results?.partyTypes ?? [];
  const typesLoading =
    GetPartyTypesData == null && GetPartyTypesError == null;

  useEffect(() => {
    dispatch({type: SagaActions.GET_PARTY_TYPES, payload: {}});
  }, []);

  useEffect(() => {
    if (preselectedTypeId) {
      setSelectedTypeId(preselectedTypeId);
    }
  }, [preselectedTypeId]);

  useEffect(() => {
    if (GetPartyTypesError != null) {
      Toast.show(
        GetPartyTypesError?.message ?? t('Failed to load occasion types'),
        Toast.LONG,
      );
      dispatch(GetPartyTypesReducer.removeGetPartyTypesResponse());
    }
  }, [GetPartyTypesError]);

  useEffect(() => {
    if (CreateMyOccasionResponse != null) {
      if (CreateMyOccasionResponse?.error === false) {
        dispatch(CreateMyOccasionReducer.removeCreateMyOccasionResponse());
        const createdParty = CreateMyOccasionResponse?.results?.party;
        const meta = lastCreateMetaRef.current;
        const partyId = getPartyId(createdParty);
        if (partyId && meta) {
          rememberPartyMeta(partyId, meta);
        }
        const enrichedParty = mergePartyRecords(createdParty, meta);
        navigation.replace(config.routes.OCCASION_PLANNING_TYPE, {
          occasion: enrichedParty,
          isNew: true,
        });
      }
    }
  }, [CreateMyOccasionResponse]);

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
    if (!selectedTypeId) {
      return Toast.show(t('Please select occasion type'), Toast.LONG);
    }
    if (!occasionName.trim()) {
      return Toast.show(t('Please enter occasion name'), Toast.LONG);
    }
    if (!occasionDescription.trim()) {
      return Toast.show(t('Please enter occasion description'), Toast.LONG);
    }
    if (!occasionDate) {
      return Toast.show(t('Please select occasion date'), Toast.LONG);
    }
    const formattedDate = moment(occasionDate).format('YYYY-MM-DD');
    lastCreateMetaRef.current = {
      date: formattedDate,
      occasion_date: formattedDate,
      occasionDate: formattedDate,
      description: occasionDescription.trim(),
    };
    const payload = {
      type: selectedTypeId,
      name: occasionName.trim(),
      description: occasionDescription.trim(),
      date: formattedDate,
      occasion_date: formattedDate,
      occasionDate: formattedDate,
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
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>{t('Name Your Occasion')}</Text>
          <Text style={styles.heroSubtitle}>
            {t(
              'Choose a type, add details, and pick a date — we will help you plan your occasion.',
            )}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>{t('Occasion Type')}</Text>
        {typesLoading ? (
          <ActivityIndicator
            color={config.colors.orangeColor}
            style={{marginBottom: 16}}
          />
        ) : partyTypes.length === 0 ? (
          <Text style={styles.noTypesText}>
            {t('No occasion types available. Please try again later.')}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeScroll}>
            {partyTypes.map(type => {
              const label = getPartyTypeLabel(type);
              const active = selectedTypeId === type?._id;
              return (
                <TouchableOpacity
                  key={type._id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTypeId(type._id)}
                  style={[styles.typeChip, active && styles.typeChipActive]}>
                  <Text
                    style={[
                      styles.typeLabel,
                      active && styles.typeLabelActive,
                    ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <Text style={styles.sectionLabel}>{t('Occasion Name')} *</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📝</Text>
          <TextInput
            style={styles.input}
            placeholder={t("e.g. Sarah's Birthday")}
            placeholderTextColor={config.colors.placeholderTextColor}
            value={occasionName}
            onChangeText={setOccasionName}
            maxLength={60}
            returnKeyType="next"
          />
          {occasionName.length > 0 && (
            <TouchableOpacity onPress={() => setOccasionName('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionLabel}>{t('Occasion Description')} *</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('Describe your occasion')}
            placeholderTextColor={config.colors.placeholderTextColor}
            value={occasionDescription}
            onChangeText={setOccasionDescription}
            maxLength={500}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.sectionLabel}>{t('Occasion Date')} *</Text>
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
  noTypesText: {
    fontFamily: config.fonts.Poppins_Regular,
    fontSize: 13,
    color: config.colors.Gray,
    marginBottom: 16,
  },
  typeScroll: {
    paddingBottom: 16,
  },
  typeChip: {
    backgroundColor: config.colors.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: config.colors.borderColor,
  },
  typeChipActive: {
    backgroundColor: config.colors.orangeColor,
    borderColor: config.colors.orangeColor,
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
  textAreaContainer: {
    alignItems: 'flex-start',
    height: 110,
    paddingVertical: 12,
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
  textArea: {
    height: 86,
    paddingTop: 0,
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
