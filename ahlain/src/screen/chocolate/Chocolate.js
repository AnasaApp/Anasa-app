import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import config from '../../config';
import AppHeader from '../../conponents/AppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const Chocolate = ({navigation}) => {
  const [Data, setData] = useState([
    {
      cakeImg: require('../../assets/images/Chocolate.png'),
      cakeText: 'Chocolate Sachertorte',
      fruitImg: require('../../assets/images/Fruit.png'),
      fruitText: 'Chocolate fudge',
      oreoImg: require('../../assets/images/ChocolateTruffle.png'),
      oreoText: 'Chocolate Truffle',
    },
    {
      cakeImg: require('../../assets/images/ChocolateOreo.png'),
      cakeText: 'Chocolate Oreo',
      fruitImg: require('../../assets/images/ChocolateSourCream.png'),
      fruitText: 'Chocolate Sour Cream',
      oreoImg: require('../../assets/images/ChocolateLava.png'),
      oreoText: 'Chocolate Lava',
    },
  ]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.flatlistCss}>
        <TouchableOpacity style={styles.cakeCss} activeOpacity={0.5}>
          <Image style={styles.cakeImg} source={item.cakeImg} />
          <Text style={styles.cakeText}>{item.cakeText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cakeCss} activeOpacity={0.5}>
          <Image style={styles.cakeImg} source={item.fruitImg} />
          <Text style={styles.cakeText}>{item.fruitText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cakeCss} activeOpacity={0.5}>
          <Image style={styles.cakeImg} source={item.oreoImg} />
          <Text style={styles.cakeText}>{item.oreoText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        navigation={navigation}
        onPress={() => navigation.goBack()}
        title="Chocolate"
      />
      <ScrollView>
        <View>
          <FlatList
            data={Data}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            // horizontal={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.colors.BACKGROUNDCOLOR,
  },
  flatlistCss: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('95%'),
    marginTop: 10,
  },
  cakeCss: {
    width: '30%',
    alignItems: 'center',
  },
  cakeImg: {
    height: 95,
    width: 95,
  },
  cakeText: {
    fontSize: 14,
    color: config.colors.Black,
    fontFamily: config.fonts.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: 7,
  },
});

export default Chocolate;
