import React from 'react';
import {View, StyleSheet, SafeAreaView, Image, ScrollView} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';

const MySavedCard = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title="My Saved Card"
      />

      <View style={styles.mainCss}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <Image
            resizeMode="cover"
            style={styles.cardIcon}
            source={require('../../assets/images/card1.png')}
          />
          <Image
            resizeMode="cover"
            style={styles.cardIcon}
            source={require('../../assets/images/card2.png')}
          />
          <Image
            resizeMode="cover"
            style={styles.cardIcon}
            source={require('../../assets/images/card3.png')}
          />
          <Image
            resizeMode="cover"
            style={styles.cardIcon}
            source={require('../../assets/images/card3.png')}
          />
        </ScrollView>
        <AppButton
          text="Add New Card"
          onPress={() => navigation.navigate(config.routes.ADD_NEW_CARD)}
          viewStyle={{marginHorizontal: 15}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    paddingBottom: 10,
  },
  mainCss: {
    // marginHorizontal: 15,
    flex: 1,
  },
  cardIcon: {
    height: 200,
    width: '100%',
    marginTop: 10,
  },
});

export default MySavedCard;
