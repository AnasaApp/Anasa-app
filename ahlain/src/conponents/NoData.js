import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import config from '../config';

const NoData = ({text, visible}) => {
  return (
    visible && (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
          }}
          source={require('../assets/images/Search.png')}
        />
        <Text
          style={{
            fontFamily: config.fonts.Poppins_Medium,
            fontSize: 24,
            color: config.colors.Gray,
            lineHeight: 40,
            textAlign: 'center',
            marginTop: 10,
          }}>
          {text ?? 'No Data Found'}
        </Text>
      </View>
    )
  );
};

export default NoData;

const styles = StyleSheet.create({});
