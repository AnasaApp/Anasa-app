import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import config from '../config';
import {getPartyDateStatusLabel} from '../utils/partyHelpers';

const STATUS_STYLES = {
  expired: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
  today: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  upcoming: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
};

const OccasionDateStatusTag = ({party, status, daysUntil, style, textStyle}) => {
  const {t} = useTranslation();
  const resolvedStatus = status ?? (party ? getPartyDateStatusLabel(party)?.status : null);
  const resolvedDays =
    daysUntil ??
    (party ? getPartyDateStatusLabel(party)?.daysUntil : null);

  if (!resolvedStatus) {
    return null;
  }

  const palette = STATUS_STYLES[resolvedStatus] ?? STATUS_STYLES.upcoming;
  let label = t('Upcoming');
  if (resolvedStatus === 'expired') {
    label = t('Expired');
  } else if (resolvedStatus === 'today') {
    label = t('Today');
  } else if (resolvedDays === 1) {
    label = t('Tomorrow');
  } else if (resolvedDays > 1) {
    label = t('In {{count}} days', {count: resolvedDays});
  }

  return (
    <View style={[styles.tag, {backgroundColor: palette.backgroundColor}, style]}>
      <Text style={[styles.tagText, {color: palette.color}, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: config.fonts.Poppins_SemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default OccasionDateStatusTag;
