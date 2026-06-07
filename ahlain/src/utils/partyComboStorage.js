import AsyncStorage from '@react-native-async-storage/async-storage';

const PARTY_COMBO_SELECTIONS_KEY = 'party_combo_package_selections';

const selectionKey = (partyId, comboOfferId) =>
  `${String(partyId)}_${String(comboOfferId)}`;

const loadAllSelections = async () => {
  try {
    const raw = await AsyncStorage.getItem(PARTY_COMBO_SELECTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/** Persist combo line items (with package picks) for addPartyToCart. */
export const rememberPartyComboSelections = async (
  partyId,
  comboOfferId,
  typeItems,
) => {
  if (!partyId || !comboOfferId || !typeItems?.length) {
    return;
  }
  const all = await loadAllSelections();
  all[selectionKey(partyId, comboOfferId)] = typeItems;
  try {
    await AsyncStorage.setItem(
      PARTY_COMBO_SELECTIONS_KEY,
      JSON.stringify(all),
    );
  } catch {
    // ignore cache write failures
  }
};

export const getPartyComboSelections = async (partyId, comboOfferId) => {
  if (!partyId || !comboOfferId) {
    return null;
  }
  const all = await loadAllSelections();
  return all[selectionKey(partyId, comboOfferId)] ?? null;
};

export const removePartyComboSelections = async (partyId, comboOfferId) => {
  if (!partyId || !comboOfferId) {
    return;
  }
  const all = await loadAllSelections();
  delete all[selectionKey(partyId, comboOfferId)];
  try {
    await AsyncStorage.setItem(
      PARTY_COMBO_SELECTIONS_KEY,
      JSON.stringify(all),
    );
  } catch {
    // ignore cache write failures
  }
};
