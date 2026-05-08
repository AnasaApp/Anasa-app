import {I18nManager} from 'react-native';

// Function to get the correct font based on language
const getFont = (englishFont, arabicFont) => {
  return I18nManager.isRTL ? arabicFont : englishFont;
};

const fontFamily = {
  // ── Rubik – regular / upright ──────────────────────────────────────────
  Rubik_Thin: 'Rubik-Light',          // Rubik starts at 300 (no 100/200)
  Rubik_ExtraLight: 'Rubik-Light',    // map to nearest available
  Rubik_Light: 'Rubik-Light',
  Rubik_Regular: 'Rubik-Regular',
  Rubik_Medium: 'Rubik-Medium',
  Rubik_SemiBold: 'Rubik-SemiBold',
  Rubik_Bold: 'Rubik-Bold',
  Rubik_ExtraBold: 'Rubik-ExtraBold',
  Rubik_Black: 'Rubik-Black',

  // ── Rubik – italic ─────────────────────────────────────────────────────
  Rubik_Light_Italic: 'Rubik-LightItalic',
  Rubik_Italic: 'Rubik-Italic',
  Rubik_Medium_Italic: 'Rubik-MediumItalic',
  Rubik_SemiBold_Italic: 'Rubik-SemiBoldItalic',
  Rubik_Bold_Italic: 'Rubik-BoldItalic',

  // ── IBM Plex Sans Arabic ───────────────────────────────────────────────
  Arabic_Thin: 'IBMPlexSansArabic-Thin',
  Arabic_ExtraLight: 'IBMPlexSansArabic-ExtraLight',
  Arabic_Light: 'IBMPlexSansArabic-Light',
  Arabic_Regular: 'IBMPlexSansArabic-Regular',
  Arabic_Medium: 'IBMPlexSansArabic-Medium',
  Arabic_SemiBold: 'IBMPlexSansArabic-SemiBold',
  Arabic_Bold: 'IBMPlexSansArabic-Bold',

  // ── Auto-switching Poppins aliases (Rubik for English, Arabic for RTL) ─
  Poppins_Thin: getFont('Rubik-Light', 'IBMPlexSansArabic-Thin'),
  Poppins_ExtraLight: getFont('Rubik-Light', 'IBMPlexSansArabic-ExtraLight'),
  Poppins_Light: getFont('Rubik-Light', 'IBMPlexSansArabic-Light'),
  Poppins_Regular: getFont('Rubik-Regular', 'IBMPlexSansArabic-Regular'),
  Poppins_Medium: getFont('Rubik-Medium', 'IBMPlexSansArabic-Medium'),
  Poppins_SemiBold: getFont('Rubik-SemiBold', 'IBMPlexSansArabic-SemiBold'),
  Poppins_Bold: getFont('Rubik-Bold', 'IBMPlexSansArabic-Bold'),
  Poppins_ExtraBold: getFont('Rubik-ExtraBold', 'IBMPlexSansArabic-Bold'),

  // ── Special ────────────────────────────────────────────────────────────
  Saudi_Riyal: 'saudi_riyal',
};

export default fontFamily;
