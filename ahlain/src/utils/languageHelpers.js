import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import i18n from '../translations';

export const USER_LANGUAGE_KEY = 'user_language';

export const toI18nCode = language =>
  language === 'Arabic' || language === 'ar' ? 'ar' : 'en';

export const toStoredLanguage = language =>
  language === 'ar' || language === 'Arabic' ? 'Arabic' : 'English';

export async function getStoredLanguage() {
  const stored = await AsyncStorage.getItem(USER_LANGUAGE_KEY);
  return toStoredLanguage(stored || 'English');
}

/** True only after the user has chosen a language on the picker screen. */
export async function hasUserChosenLanguage() {
  const stored = await AsyncStorage.getItem(USER_LANGUAGE_KEY);
  return stored === 'English' || stored === 'Arabic';
}

/** Load persisted language before the UI tree renders. */
export async function bootstrapAppLanguage() {
  const stored = await getStoredLanguage();
  const code = toI18nCode(stored);
  if (i18n.language !== code) {
    await i18n.changeLanguage(code);
  }
  return code;
}

/** Persist language, apply i18n/RTL, then restart so the whole app reloads. */
export async function applyLanguageAndRestart(languageLabel) {
  const stored = toStoredLanguage(languageLabel);
  const code = toI18nCode(stored);

  await AsyncStorage.setItem(USER_LANGUAGE_KEY, stored);

  if (code === 'ar') {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(false);
  }

  await i18n.changeLanguage(code);

  setTimeout(() => {
    RNRestart.Restart();
  }, 150);
}
