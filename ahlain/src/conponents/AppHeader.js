import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
  Platform,
} from 'react-native';
import config from '../config';

const AppHeader = ({
  title,
  navigation,
  rightimg,
  onRightPress,
  onPress,
  tintColor,
  color,
  backgroundColor,
  rightImageStyle,
  rightimgContainerStyle,
  leftImageEnabled = true,
}) => {
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColor ? backgroundColor : '#f6f6f7'},
      ]}>
      {leftImageEnabled && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            alignItems: 'center',
            backgroundColor: config.colors.white,
            width: 40,
            height: 40,
            justifyContent: 'center',
            borderRadius: 50,
          }}
          onPress={() => (onPress ? onPress() : navigation.goBack())}>
          <Image
            source={require('../assets/images/backArrowIcon.png')}
            style={[
              styles.backimgStyle,
              {tintColor: tintColor ? '#fff' : '#333333'},
            ]}
          />
        </TouchableOpacity>
      )}

      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style={[styles.textStyle]}>{title}</Text>
      </View>

      {rightimg && (
        <TouchableOpacity
          style={rightimgContainerStyle}
          activeOpacity={0.6}
          onPress={onRightPress}>
          <Image
            source={rightimg}
            style={[styles.rightimgStyle, rightImageStyle]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: Platform.OS == 'ios' ? 60 : 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  textStyle: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.white,
    fontSize: 18,
    textAlign: 'left',
  },
  backimgStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    transform: [{rotate: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  rightimgStyle: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    // right: 10,
  },
});
