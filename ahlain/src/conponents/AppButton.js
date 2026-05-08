import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import config from '../config';
import AppImage from './AppImage';

const AppButton = ({
  buttonStyle,
  textStyle,
  text,
  onPress,
  disabled,
  leftImage,
  leftImageStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, buttonStyle]}>
      {leftImage && (
        <AppImage
          imageSource={leftImage}
          imageStyle={[styles.imageStyle, leftImageStyle]}
        />
      )}
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // marginHorizontal: 20,
  },
  button: {
    borderRadius: 10,
    height: 48,
    backgroundColor: config.colors.orangeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row',
  },
  text: {
    color: config.colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: config.fonts.Poppins_SemiBold,
    lineHeight: 24,
  },
  imageStyle: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});

export default AppButton;
