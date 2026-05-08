import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import config from '../config';


/**
 * This component is for custom loader. Whenever loading state changed in redux
 * it will show/hide loader
 */
const Apiloader = () => {


  return (
    <View style={styles.mainBackViewStyle}>
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={config.colors.buttonColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBackViewStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderStyle: {
    backgroundColor: '#eee',
    maxWidth: '80%',
    zIndex: 5,
    borderRadius: 16,
    justifyContent: 'space-around',
    padding: 20,
  },
});

export default Apiloader;
