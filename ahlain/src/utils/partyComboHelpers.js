import {I18nManager} from 'react-native';

export const getComboOfferId = partyCombo =>
  partyCombo?.combo?._id || partyCombo?.combo || null;

export const buildComboServicesFromType = (typeItems = []) =>
  (typeItems ?? []).map(item => ({
    service: item?.service?._id || item?.service,
    vendor: {city: item?.vendor?.city},
    package: item?.package ?? [],
  }));

export const buildComboPackageEntry = (partyCombo, typeItems) => {
  const entry = {
    comboServices: buildComboServicesFromType(typeItems),
  };
  if (partyCombo?._id) {
    entry.partyServiceId = partyCombo._id;
  }
  const comboId = getComboOfferId(partyCombo);
  if (comboId) {
    entry.combo = comboId;
  }
  return entry;
};

export const getComboCustomizeError = (typeItems, t) => {
  for (const attribute of typeItems ?? []) {
    if (attribute?.service?.packages?.length > 0 && !attribute?.package) {
      const name = I18nManager?.isRTL
        ? attribute?.service?.name_ar
        : attribute?.service?.name_en;
      if (typeof t === 'function') {
        return `${t('Please Choose')} ${name} ${t('option')}`;
      }
      return `Please choose ${name ?? 'option'}`;
    }
  }
  return '';
};
