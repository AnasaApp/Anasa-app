import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import config from '../config';
import {SagaActions} from '../redux/sagas/SagaActions';
import {ApiCalls} from './ApiCalls';
import {goToLogin} from '../conponents/NavigationRef';

const httpPostRequest = async ({apiUrl, jsonBody, apiType}) => {
  let data;

  if (
    apiType == SagaActions.EDIT_PROFILE ||
    apiType == SagaActions.CREATE_SUPPORT
  ) {
    data = PrepareFormData(jsonBody);
  } else {
    data = jsonBody;
  }
  const userData = JSON.parse(
    await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
  );

  // Check if user is guest
  const isGuestRes = await AsyncStorage.getItem('IS_GUEST_USER');
  const isGuest = JSON.parse(isGuestRes);

  let language = 'English';
  language = await AsyncStorage.getItem('user_language');

  const headers = {
    Accept: 'application/json',
    'Content-Type':
      apiType == SagaActions.EDIT_PROFILE ||
      apiType == SagaActions.CREATE_SUPPORT
        ? 'multipart/form-data'
        : 'application/json',
    'x-buyer-language': language,
  };

  // Only add auth token if user is logged in (not guest)
  if (!isGuest && userData && userData?.token) {
    headers['x-auth-token-buyer'] = userData.token;
  }

  console.log('Request headers (POST):', {hasToken: !!headers['x-auth-token-buyer'], isGuest});

  const response = await Axios.post(apiUrl, data, {headers})
    .then(result => {
      console.log('result.data===', result.data);
      let isSucceded = false;
      if (result?.data?.error == false) {
        isSucceded = true;
      }
      return {result, isSucceded};
    })
    .catch(async error => {
      const excep = error;
      console.log('Error', JSON.stringify(error));
      const errorParse = JSON.parse(JSON.stringify(error));

      if (errorParse.status == 401) {
        // Check if user is guest before redirecting
        const isGuestRes = await AsyncStorage.getItem('IS_GUEST_USER');
        const isGuest = JSON.parse(isGuestRes);

        if (!isGuest) {
          // Only redirect to login if NOT a guest user
          goToLogin(config.routes.AUTH_NAVIGATION);
        } else {
          console.log('Guest user - ignoring 401 error');
        }

        return {
          result: excep,
          isSucceded: false,
          message: excep,
        };
      }

      return {
        result: excep,
        isSucceded: false,
        message: excep,
      };
    });
  return response;
};

const PrepareFormData = body => {
  try {
    const formData = new FormData();
    if (typeof body === 'object') {
      const keys = Object.keys(body);

      keys.forEach(key => {
        if (Array.isArray(body[key])) {
          for (let index = 0; index < body[key].length; index++) {
            let element = body[key][index];
            // if (typeof element === 'object') {
            //   element = JSON.stringify(body[key][index]);
            // }
            // formData.append(`${key}[${index}]`, element);
            // console.log("Elemnet", element);

            formData.append(`${key}`, element);
          }
        } else {
          formData.append(key, body[key]);
        }
      });
      console.log('formData', formData);
      return formData;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

const httpGetRequest = async ({apiUrl}) => {
  const userData = JSON.parse(
    await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
  );

  // Check if user is guest
  const isGuestRes = await AsyncStorage.getItem('IS_GUEST_USER');
  const isGuest = JSON.parse(isGuestRes);

  console.log('Get Token --' + apiUrl, userData?.token);
  let language = 'English';
  language = await AsyncStorage.getItem('user_language');

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-buyer-language': language,
  };

  // Only add auth token if user is logged in (not guest)
  if (!isGuest && userData && userData?.token) {
    headers['x-auth-token-buyer'] = userData.token;
  }

  console.log('Request headers (GET):', {hasToken: !!headers['x-auth-token-buyer'], isGuest, url: apiUrl});

  const response = await Axios.get(apiUrl, {headers})
    .then(result => {
      console.log('Get result.data===', result.data);
      let isSucceded = false;
      if (result?.data?.error == false) {
        isSucceded = true;
      }
      return {result, isSucceded};
    })
    .catch(async error => {
      const excep = error;
      console.log('Error', JSON.stringify(error));
      const errorParse = JSON.parse(JSON.stringify(error));

      if (errorParse.status == 401) {
        // Check if user is guest before redirecting
        const isGuestRes = await AsyncStorage.getItem('IS_GUEST_USER');
        const isGuest = JSON.parse(isGuestRes);

        if (!isGuest) {
          // Only redirect to login if NOT a guest user
          goToLogin(config.routes.AUTH_NAVIGATION);
        } else {
          console.log('Guest user - ignoring 401 error on GET request');
        }

        return {
          result: excep,
          isSucceded: false,
          message: excep,
        };
      }
      return {
        result: excep,
        isSucceded: false,
        message: excep,
      };
    });
  return response;
};

export const callApiService = async (apiType, jsonBody) => {
  const request = ApiCalls({apiType});
  let apiUrl = request.requestUrl;
  if (request.requestType === 'POST') {
    if (jsonBody.uri) {
      const extraUriStr = `${jsonBody.uri}`;
      console.log('extraUriStr', extraUriStr);
      apiUrl = `${apiUrl}${extraUriStr}`;
    }
    let language = 'English';
    language = await AsyncStorage.getItem('user_language');
    jsonBody.user_language = language;
    console.log('Post', jsonBody, apiType);
    const req = await httpPostRequest({apiUrl, jsonBody, apiType});
    return req;
  }
  if (request.requestType === 'GET') {
    if (jsonBody.uri) {
      const extraUriStr = `${jsonBody.uri}`;
      console.log('extraUriStr', extraUriStr);
      apiUrl = `${apiUrl}${extraUriStr}`;
    }
    console.log('Get ', apiUrl);
    const req = await httpGetRequest({apiUrl});
    return req;
  }
  return {message: 'error'};
};
