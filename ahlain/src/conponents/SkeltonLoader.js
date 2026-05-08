import {
  Animated,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Easing,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import config from '../config';

const SkeltonLoader = ({
  width,
  height,
  variant,
  count = 1,
  direction = 'column',
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 2000,
      useNativeDriver: true,
    };
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0,
          easing: Easing.in(Easing.ease),
        }),
      ]),
    ).start();

    return () => {
      // cleanup
      pulseAnim.stopAnimation();
    };
  }, []);

  const opacityAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.07, 0.18],
  });
  const getAnimatedLayout = () => {
    const countArray = new Array(count).fill(0);
    let layout = <View />;
    if (variant == 'rectangle') {
      return (
        <Animated.View
          style={{
            opacity: opacityAnim,
            height: height,
            width: width,
            backgroundColor: config.colors.placeHolderColor,
            borderRadius: 8,
          }} />
      );
    } else if (variant == 'rectangle_multiple') {
      layout = (
        <ScrollView
          horizontal={direction == 'row' ? true : false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {countArray?.map((item, index) => {
            return (
              <Animated.View
                key={index}
                style={{
                  opacity: opacityAnim,
                  height: height,
                  width: width,
                  backgroundColor: config.colors.placeHolderColor,
                  borderRadius: 8,
                  marginRight: 10,
                  marginTop: direction == 'row' ? 0 : 10,
                }} />
            );
          })}
        </ScrollView>
      );
    } else if (variant == 'box') {
      layout = (
        <View style={{flexDirection: 'row'}}>
          <Animated.View
            style={{
              opacity: opacityAnim,
              width: 40,
              height: height,
              borderRadius: height / 2,
              backgroundColor: config.colors.placeHolderColor,
            }} />
          <View>
            <Animated.View
              style={{
                opacity: opacityAnim,
                width: 200,
                height: 16,
                backgroundColor: config.colors.placeHolderColor,
                borderRadius: 8,
                marginLeft: 10,
              }} />
            <Animated.View
              style={{
                opacity: opacityAnim,
                width: 100,
                height: 14,
                backgroundColor: config.colors.placeHolderColor,
                borderRadius: 8,
                marginLeft: 10,
                marginTop: 5,
              }} />
          </View>
        </View>
      );
    } else if (variant == 'circle') {
      layout = (
        <Animated.View
          style={{
            opacity: opacityAnim,
            height: height,
            width: width,
            backgroundColor: config.colors.placeHolderColor,
            borderRadius: height / 2,
          }} />
      );
    } else if (variant == 'circle_multiple') {
      layout = (
        <ScrollView
          horizontal={(direction = 'row' ? true : false)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {countArray?.map((item, index) => {
            return (
              <Animated.View
                key={index}
                style={{
                  opacity: opacityAnim,
                  height: height,
                  width: width,
                  backgroundColor: config.colors.placeHolderColor,
                  borderRadius: height / 2,
                  marginRight: 10,
                }} />
            );
          })}
        </ScrollView>
      );
    }
    return layout;
  };
  return (
    <SafeAreaView style={styles.container}>{getAnimatedLayout()}</SafeAreaView>
  );
};

export default SkeltonLoader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.colors.blackColor,
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: config.colors.placeHolderColor,
  },
});
