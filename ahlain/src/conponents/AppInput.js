import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import config from '../config';

const AppTextInput = ({
  containerStyle,
  inputTextLabelVisible = true,
  inputTextLabel,
  showVerticalLine,
  viewStyle,
  textInputStyle,
  onChangeText,
  editable,
  value,
  textAlignVertical,
  autoCapitalize,
  leftIcon,
  leftIconPress,
  rightIcon,
  rightIconPress,
  rightIconStyle,
  onRefs,
  secureTextEntry,
  placeholder,
  keyboardType,
  inputLabelmarginHorizontal,
  multiline = false,
  returnKeyType,
  numberOfLines,
  labelStyle,
  maxLength,
  inputTextSubLabel,
  pressable = false,
  ...props
}) => {
  return (
    <View style={[containerStyle]}>
      {inputTextLabelVisible && (
        <View style={styles.labelContiner}>
          <Text
            style={[
              {
                ...styles.labelText,
                textAlign: 'left',
                marginHorizontal:
                  inputLabelmarginHorizontal && inputLabelmarginHorizontal,
              },
              labelStyle,
            ]}>
            {inputTextLabel && inputTextLabel}
          </Text>
        </View>
      )}
      {inputTextSubLabel && (
        <View style={[styles.labelContiner, {marginTop: 5}]}>
          <Text
            style={[
              {
                ...styles.labelSbText,
                textAlign: 'left',
              },
              labelStyle,
            ]}>
            {inputTextSubLabel}
          </Text>
        </View>
      )}
      <View style={[styles.contentView, viewStyle, {flexDirection: 'row'}]}>
        {leftIcon && (
          <TouchableOpacity
            onPress={leftIconPress}
            style={{
              borderLeftColor: '#D6D6D6',
              borderLeftWidth:
                showVerticalLine && showVerticalLine == true ? 1 : 0,
            }}>
            <Image
              source={leftIcon && leftIcon}
              style={styles.rightIconImage}
            />
          </TouchableOpacity>
        )}
        {pressable ? (
          <Text style={[styles.textInput, textInputStyle, {textAlign: 'left'}]}>
            {placeholder ? placeholder : value}
          </Text>
        ) : (
          <TextInput
            {...props}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            style={[styles.textInput, textInputStyle]}
            ref={onRefs}
            autoCorrect={false}
            pointerEvents={editable == false ? 'none' : 'auto'}
            placeholderTextColor={config.colors.placeholderTextColor}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onChangeText={onChangeText}
            autoCapitalize={'none'}
            textAlignVertical={textAlignVertical}
            editable={editable}
            value={value}
            caretHidden={false}
            maxLength={maxLength}
            returnKeyType={returnKeyType ? returnKeyType : 'done'}
          />
        )}
        {rightIcon && (
          <TouchableOpacity
            onPress={rightIconPress}
            style={{
              borderLeftColor: '#D6D6D6',
              borderLeftWidth:
                showVerticalLine && showVerticalLine == true ? 1 : 0,
            }}>
            <Image
              source={rightIcon && rightIcon}
              style={[styles.rightIconImage, rightIconStyle]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
    borderColor: config.colors.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: config.colors.white,
  },
  textInput: {
    flex: 1,
    height: 50,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_Regular,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  eyeIcon: {
    height: 40,
    width: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContiner: {
    marginTop: 10,
  },
  labelText: {
    fontFamily: config.fonts.Poppins_Medium,
    color: config.colors.Black,
    fontSize: 14,
  },
  rightIconImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginHorizontal: 7,
  },
  labelSbText: {
    fontFamily: config.fonts.Poppins_Regular,
    color: config.colors.Gray,
    fontSize: 12,
  },
});

export default AppTextInput;
