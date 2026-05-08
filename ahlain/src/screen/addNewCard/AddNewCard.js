import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import config from '../../config';
import AppButton from '../../conponents/AppButton';
import AppHeader from '../../conponents/AppHeader';

const AddNewCard = ({navigation}) => {
  const [number, setNumber] = useState('');

  const handleCardNumber = text => {
    let formattedText = text.split(' ').join('');
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    setNumber(formattedText);
    return formattedText;
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title="Add New Card"
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Image
          resizeMode="cover"
          style={styles.cardIcon}
          source={require('../../assets/images/card1.png')}
        />
        <View style={styles.mainCss}>
          <Text style={styles.cardname}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="XXXX XXXX XXXX XXXX"
            onChangeText={val => handleCardNumber(val)}
            value={number}
            keyboardType="numeric"
            maxLength={20}
          />
          <Text style={styles.cardname}>Cardholder Name</Text>
          <TextInput style={styles.input} placeholder="Name" />
          <View style={styles.validMainCss}>
            <View style={styles.firstCss}>
              <Text style={styles.cardname}>Valid Thru</Text>
              <TextInput
                style={styles.input}
                placeholder="00 / 00"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.secondCss}>
              <Text style={styles.cardname}>Security Code (CVV)</Text>
              <TextInput
                style={styles.input}
                placeholder="000"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <AppButton
          text="Add Card"
          onPress={() => navigation.navigate(config.routes.MY_SAVED_CARD)}
          viewStyle={{marginHorizontal: 15}}
        />
      </ScrollView>
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
    marginHorizontal: 25,
    flex: 1,
    marginTop: 15,
  },
  cardIcon: {
    height: 185,
    width: '100%',
    marginTop: 10,
  },
  cardname: {
    fontFamily: config.fonts.Poppins_SemiBold,
    color: config.colors.Light_Black,
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 3,
    borderColor: '#ECECEC',
    backgroundColor:'#F6F6F64D',
    borderWidth: 0.7,
    paddingHorizontal: 10,
    // fontSize: 12,
    fontFamily: config.fonts.Poppins_SemiBold,
    marginTop: 12,
    color:config.colors.Black,

  },
  validMainCss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  firstCss: {
    width: '40%',
  },
  secondCss: {
    width: '55%',
  },
});

export default AddNewCard;
