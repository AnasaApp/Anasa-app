import {Dimensions} from 'react-native';

const Constants = {
  PrimaryFontSize: 14,
  MediumFontSize: 16,
  HeadingFontSize: 18,
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,
  MAP_API_KEY: 'AIzaSyBIk9oE4wqqpQ3Yt-bj3LvPbKJhLyc5g5Q',
  // BASE_API_URL:
  //   'http://ec2-18-189-236-47.us-east-2.compute.amazonaws.com:2053/api/', // testing
  BASE_API_URL: 'https://anasa.site:2053/api/', // live
};

export default Constants;
