import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import config from '../config';
import AppImage from './AppImage';

export const CommonModal = ({
  isCommonModalVisible,
  setIsCommonModalVisible,
  image = '',
  cancelbutton = false,
  title = '',
  subTitle = '',
  FirstButton = '',
  SecondButton = '',
  showButtonInRow,
  navigation,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isCommonModalVisible}
      onRequestClose={() => {
        // setIsCommonModalVisible(!setIsCommonModalVisible);
      }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(60, 61, 62, 0.8)"
      />
      <TouchableWithoutFeedback
        onPress={() => {
          setIsCommonModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(60, 61, 62, 0.8)',
          }}>
          <View
            style={{
              width: '85%',
              borderRadius: 15,
              backgroundColor: config.colors.white,
              paddingHorizontal: 20,
            }}>
            {cancelbutton && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsCommonModalVisible(false);
                }}
                style={{alignSelf: 'flex-end', top: 12}}>
                <AppImage
                  imageSource={config.ImageList.closeIcon}
                  imageStyle={{
                    width: 28,
                    height: 28,
                    tintColor: config.colors.orangeColor,
                  }}
                />
              </TouchableOpacity>
            )}
            {image && (
              <AppImage
                imageSource={image}
                imageStyle={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  marginTop: 20,
                  position: 'absolute',
                  top: -65,
                }}
              />
            )}
            <Text
              style={{
                fontFamily: config.fonts.Poppins_SemiBold,
                fontSize: 22,
                color: config.colors.blackColor,
                textAlign: 'center',
                lineHeight: 28,
                marginTop: 50,
              }}>
              {title}
            </Text>
            <Text
              style={{
                fontFamily: config.fonts.Poppins_Regular,
                fontSize: 14,
                color: config.colors.greyColor,
                alignSelf: 'center',
                textAlign: 'center',
                lineHeight: 20,

                marginTop: 10,
              }}>
              {subTitle}
            </Text>
            {showButtonInRow ? (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 20,
                }}>
                <FirstButton />
                {SecondButton && <SecondButton />}
              </View>
            ) : (
              <View>
                <FirstButton />
                {SecondButton && <SecondButton />}
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({});
