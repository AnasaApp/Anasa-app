import {I18nManager} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PARTY_META_CACHE_KEY = 'party_occasion_meta_cache';
let partyMetaCache = {};
let partyMetaCacheVersion = 0;
const partyMetaCacheListeners = new Set();

const notifyPartyMetaCacheListeners = () => {
  partyMetaCacheVersion += 1;
  partyMetaCacheListeners.forEach(listener => listener(partyMetaCacheVersion));
};

export const getPartyMetaCacheVersion = () => partyMetaCacheVersion;

export const subscribePartyMetaCache = listener => {
  partyMetaCacheListeners.add(listener);
  return () => partyMetaCacheListeners.delete(listener);
};

export const getPartyId = party => {
  const id = party?._id ?? party?.id;
  if (id == null || id === '') {
    return null;
  }
  return String(id);
};

export const normalizePartyDateValue = value => {
  if (value == null || value === '') {
    return null;
  }
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value;
    }
    if (value.$date != null) {
      return value.$date;
    }
    if (value.date != null) {
      return normalizePartyDateValue(value.date);
    }
    if (value.iso != null) {
      return value.iso;
    }
  }
  return value;
};

export const extractPartyMetaFromPayload = payload => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const rawDate =
    payload.date ??
    payload.occasion_date ??
    payload.occasionDate ??
    payload.event_date ??
    payload.eventDate ??
    payload.party_date ??
    payload.partyDate ??
    payload.occasion?.date ??
    payload.occasion?.occasion_date ??
    payload.occasion?.occasionDate ??
    null;
  const date = normalizePartyDateValue(rawDate);
  if (date == null || date === '') {
    return null;
  }
  const description = payload.description?.trim?.()
    ? payload.description.trim()
    : payload.description || '';
  return {
    date,
    occasion_date: date,
    occasionDate: date,
    ...(description ? {description} : {}),
  };
};

/** Occasion date + description from a party record returned by the API. */
export const extractPartyMetaFromParty = party =>
  extractPartyMetaFromPayload(party);

export const syncPartyMetaFromApiParty = async party => {
  const partyId = getPartyId(party);
  const meta = extractPartyMetaFromParty(party);
  if (partyId && meta) {
    await rememberPartyMeta(partyId, meta);
  }
};

const TYPE_EMOJI_BY_KEYWORD = [
  {keys: ['birthday', 'birth'], emoji: '🎂'},
  {keys: ['wedding', 'anniversary', 'marriage'], emoji: '💍'},
  {keys: ['graduation', 'graduate'], emoji: '🎓'},
  {keys: ['baby', 'shower'], emoji: '🍼'},
  {keys: ['corporate', 'office', 'business'], emoji: '🏢'},
];

export const getPartyTypeEmoji = type => {
  const label = (
    type?.name_en ||
    type?.name_ar ||
    type?.name ||
    ''
  ).toLowerCase();
  const match = TYPE_EMOJI_BY_KEYWORD.find(entry =>
    entry.keys.some(k => label.includes(k)),
  );
  return match?.emoji ?? '🎉';
};

export const getPartyTypeLabel = (type, fallback = '') => {
  if (!type) {
    return fallback;
  }
  if (typeof type === 'string') {
    return type;
  }
  return I18nManager.isRTL
    ? type?.name_ar || type?.name_en || fallback
    : type?.name_en || type?.name_ar || fallback;
};

export const getPartyDisplayName = party => {
  const customName = party?.name?.trim();
  if (customName) {
    return customName;
  }
  return getPartyTypeLabel(party?.type, '');
};

export const hydratePartyMetaCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(PARTY_META_CACHE_KEY);
    partyMetaCache = raw ? JSON.parse(raw) : {};
  } catch {
    partyMetaCache = {};
  }
  notifyPartyMetaCacheListeners();
};

export const rememberPartyMeta = async (partyId, meta) => {
  const cacheKey = partyId != null ? String(partyId) : null;
  if (!cacheKey || !meta) {
    return;
  }
  partyMetaCache[cacheKey] = {...partyMetaCache[cacheKey], ...meta};
  notifyPartyMetaCacheListeners();
  try {
    await AsyncStorage.setItem(
      PARTY_META_CACHE_KEY,
      JSON.stringify(partyMetaCache),
    );
  } catch {
    // ignore cache write failures
  }
};

export const getCachedPartyMeta = partyId => {
  const cacheKey = partyId != null ? String(partyId) : null;
  return cacheKey ? partyMetaCache[cacheKey] ?? null : null;
};

export const mergePartyRecords = (primary, fallback) => {
  if (!primary && !fallback) {
    return null;
  }
  if (!primary) {
    return fallback;
  }
  if (!fallback) {
    return primary;
  }

  const merged = {...fallback, ...primary};
  const resolvedDate =
    getPartyOccasionDateRaw(primary) ?? getPartyOccasionDateRaw(fallback);

  if (resolvedDate != null && resolvedDate !== '') {
    merged.date = resolvedDate;
    merged.occasion_date = resolvedDate;
    merged.occasionDate = resolvedDate;
  }

  if (!merged.description?.trim?.()) {
    merged.description = fallback.description ?? primary.description;
  }

  return merged;
};

export const enrichPartyWithCachedMeta = party => {
  const partyId = getPartyId(party);
  if (!partyId) {
    return party;
  }
  const cached = getCachedPartyMeta(partyId);
  if (!cached) {
    return party;
  }
  return mergePartyRecords(party, cached);
};

export const enrichPartiesFromCache = parties =>
  (parties ?? []).map(enrichPartyWithCachedMeta);

/** Read occasion date from party/occasion API shapes (legacy + party module). */
export const getPartyOccasionDateRaw = party => {
  if (!party) {
    return null;
  }
  const cached = getCachedPartyMeta(getPartyId(party));
  const candidates = [
    party.date,
    party.occasion_date,
    party.occasionDate,
    party.event_date,
    party.eventDate,
    party.party_date,
    party.partyDate,
    party.occasion?.date,
    party.occasion?.occasion_date,
    party.occasion?.occasionDate,
    cached?.date,
    cached?.occasion_date,
    cached?.occasionDate,
  ]
    .map(normalizePartyDateValue)
    .filter(value => value != null && value !== '');
  return candidates[0] ?? null;
};

/** Parse occasion date using device local calendar (matches picker + device clock). */
export const parsePartyOccasionMoment = value => {
  if (value == null || value === '') {
    return null;
  }

  if (typeof value === 'number') {
    const parsed = moment(value);
    return parsed.isValid() ? parsed.local().startOf('day') : null;
  }

  if (value instanceof Date) {
    const parsed = moment(value);
    return parsed.isValid() ? parsed.local().startOf('day') : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const dateOnly = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateOnly) {
      const parsed = moment(dateOnly[1], 'YYYY-MM-DD', true);
      return parsed.isValid() ? parsed.startOf('day') : null;
    }
    const knownFormats = ['DD/MM/YYYY', 'DD MMM YYYY', 'MMM DD, YYYY'];
    for (const fmt of knownFormats) {
      const parsed = moment(trimmed, fmt, true);
      if (parsed.isValid()) {
        return parsed.startOf('day');
      }
    }
  }

  const parsed = moment(value);
  if (!parsed.isValid()) {
    return null;
  }
  return parsed.local().startOf('day');
};

export const getPartyOccasionMoment = party => {
  return parsePartyOccasionMoment(getPartyOccasionDateRaw(party));
};

export const getPartyDaysUntilOccasion = party => {
  const occasionMoment = getPartyOccasionMoment(party);
  if (!occasionMoment) {
    return null;
  }
  return occasionMoment.diff(moment().startOf('day'), 'days');
};

/** expired | today | upcoming | null — compared to device local date. */
export const getPartyDateStatus = party => {
  const daysUntil = getPartyDaysUntilOccasion(party);
  if (daysUntil == null) {
    return null;
  }
  if (daysUntil < 0) {
    return 'expired';
  }
  if (daysUntil === 0) {
    return 'today';
  }
  return 'upcoming';
};

export const getPartyDateStatusLabel = party => {
  const status = getPartyDateStatus(party);
  if (!status) {
    return null;
  }
  return {
    status,
    daysUntil: getPartyDaysUntilOccasion(party),
  };
};

export const isPartyDateExpired = party =>
  getPartyDateStatus(party) === 'expired';

export const formatPartyOccasionDate = (party, dateFormat = 'DD MMM YYYY') => {
  const occasionMoment = getPartyOccasionMoment(party);
  if (!occasionMoment) {
    return '';
  }
  return occasionMoment.format(dateFormat);
};

export const formatPartyCreatedDate = (party, dateFormat = 'DD MMM YYYY') => {
  if (!party?.createdAt) {
    return '';
  }
  return moment(party.createdAt).local().format(dateFormat);
};

/** Type + occasion date + created date for list/card subtitles. */
export const formatPartyMetaLine = party => {
  return [
    getPartyTypeLabel(party?.type),
    formatPartyOccasionDate(party),
    formatPartyCreatedDate(party),
  ]
    .filter(Boolean)
    .join(' · ');
};

/** Occasion + created dates for a dedicated date line on compact cards. */
export const formatPartyDatesLine = party => {
  const occasionDate = formatPartyOccasionDate(party);
  if (occasionDate) {
    return occasionDate;
  }
  return formatPartyCreatedDate(party);
};

export const hasPartyOccasionDate = party =>
  getPartyOccasionMoment(party) != null;

export const normalizePartyServiceForDisplay = partyService => {
  const svc = partyService?.service || {};
  return {
    _id: svc?._id || partyService?.service,
    partyServiceId: partyService?._id,
    name_en: svc?.name_en || svc?.name,
    name_ar: svc?.name_ar,
    name: svc?.name,
    images: svc?.images,
    image: svc?.image || svc?.images?.[0],
    price: partyService?.price ?? svc?.price,
    quantity: partyService?.quantity,
    isCombo: false,
  };
};

export const normalizePartyComboForDisplay = partyCombo => {
  const combo = partyCombo?.combo || {};
  const typeCount = Array.isArray(combo?.type) ? combo.type.length : 0;
  return {
    _id: combo?._id || partyCombo?.combo,
    partyServiceId: partyCombo?._id,
    name_en: combo?.name_en || combo?.name,
    name_ar: combo?.name_ar,
    name: combo?.name,
    image: combo?.image || combo?.images?.[0],
    price: partyCombo?.price ?? partyCombo?.comboPrice ?? combo?.comboPrice,
    comboPrice: partyCombo?.comboPrice ?? combo?.comboPrice,
    typeCount,
    isCombo: true,
  };
};
