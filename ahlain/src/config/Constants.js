import {Dimensions} from 'react-native';

// Switch SERVER_ORIGIN for client QA vs live; API + Share links stay in sync.
// const SERVER_ORIGIN = 'http://ec2-18-189-236-47.us-east-2.compute.amazonaws.com:2053'; // testing
const SERVER_ORIGIN = 'https://anasa.site:2053'; // live

const Constants = {
  PrimaryFontSize: 14,
  MediumFontSize: 16,
  HeadingFontSize: 18,
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,
  MAP_API_KEY: 'AIzaSyBIk9oE4wqqpQ3Yt-bj3LvPbKJhLyc5g5Q',
  BASE_API_URL: `${SERVER_ORIGIN}/api/`,
  /** Combo/service Share links (no trailing slash): `${PUBLIC_WEB_ORIGIN}/combo/` etc. */
  PUBLIC_WEB_ORIGIN: SERVER_ORIGIN,
};


export default Constants;
