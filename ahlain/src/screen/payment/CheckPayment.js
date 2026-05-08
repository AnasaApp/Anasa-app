import React, {Component, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import config from '../../config';
import {CommonActions} from '@react-navigation/native';
import {SagaActions} from '../../redux/sagas/SagaActions';
import {useDispatch, useSelector} from 'react-redux';
import {CheckPaymentReducer, CheckoutCartReducer} from '../../redux/reducers';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Apiloader from '../../conponents/ApiLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {trackEvents} from '../../config/FCMEvents';

// const CheckPayment = ({navigation, route}) => {
//   const [link, setLink] = useState(route?.params?.link);

//   return link && <WebView

//   source={{uri: link}} style={{flex: 1}} />;
// };

// export default CheckPayment;

const CheckPayment = ({navigation, route}) => {
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const dispatch = useDispatch();
  const CheckPaymentResponse = useSelector(
    CheckPaymentReducer.selectCheckPaymentData,
  );
  const CheckoutCartResponse = useSelector(
    CheckoutCartReducer.selectCheckoutCartData,
  );
  const webviewRef = React.useRef(null);
  const [link, setLink] = useState(route?.params?.link);
  function webViewgoback() {
    if (webviewRef.current) {webviewRef.current.goBack();}
  }

  console.log('route?.params?.linkroute?.params?.linkroute?.params?.link',route?.params?.link);


  function webViewNext() {
    if (webviewRef.current) {webviewRef.current.goForward();}
  }

  function LoadingIndicatorView() {
    return (
      <ActivityIndicator
        color="#009b88"
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
  useEffect(() => {
    setTimeout(() => {
      setButtonVisible(true);
    }, 1000 * 40);
  }, []);

  useEffect(() => {
    if (CheckoutCartResponse != null) {
      if (CheckoutCartResponse?.error == false) {
        console.log(
          'CheckoutCartResponse',
          JSON.stringify(CheckoutCartResponse),
        );
        navigation.replace(config.routes.PAYMENT_STATUS, {
          service_id: route?.params?.service_id,
          CheckoutCartResponse: CheckoutCartResponse,
        });
        trackEvents('booking', {service_id: route?.params?.service_id});

        dispatch(CheckoutCartReducer.removeCheckoutCartResponse());
      }
    }
  }, [CheckoutCartResponse]);

  const callCreateServiceRequestApi = async () => {
    setIsApiLoading(true);
    const userData = JSON.parse(
      await AsyncStorage.getItem(config.AsyncKeys.USER_DATA),
    );
    let language = 'English';
    language = await AsyncStorage.getItem('user_language');
    var formData = new FormData();
    formData.append('status', 'Paid');
    axios({
      method: 'post',
      url:
        config.constants.BASE_API_URL +
        'buyer/editRequestedEvent/' +
        route?.params?.request_id,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'x-auth-token-buyer': userData && userData?.token,
        'x-buyer-language': language,
      },
      data: formData,
    })
      .then(res => {
        setIsApiLoading(false);
        console.log('res?.data', res?.data);
        trackEvents('service_request', {
          request_id: route?.params?.request_id,
          message: res?.data?.message,
        });

        Toast.show(res?.data?.message, Toast.LONG);
        navigation.replace(config.routes.SERVICE_REQUEST);
      })
      .catch(e => {
        setIsApiLoading(false);
        console.log('e', e);
      });
  };
  useEffect(() => {
    if (CheckPaymentResponse != null) {
      if (CheckPaymentResponse?.error == false) {
        if (CheckPaymentResponse?.results?.result?.result == 'Successful') {
          if (route?.params?.from == 'cart') {
            dispatch({
              type: SagaActions.CHECKOUT_CART,
              payload: route?.params?.checkoutPayload,
            });
          } else if (route?.params?.from == 'createServiceRequest') {
            callCreateServiceRequestApi();
          }
        } else {
          navigation.replace(config.routes.CART);
          Toast.show(CheckPaymentResponse?.message, Toast.LONG);
        }
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: config.routes.HOME_SCREEN}],
        //   }),
        // );
        console.log(
          'CheckPaymentResponse',
          JSON.stringify(CheckPaymentResponse),
        );
        dispatch(CheckPaymentReducer.removeCheckPaymentResponse());
      }
    }
  }, [CheckPaymentResponse]);

  const onCheckPaymentApi = () => {
    const payload = {
      transactionID: route?.params?.transactionID,
      action: 10,
    };
    dispatch({type: SagaActions.CHECK_PAYMENT, payload});
  };
  const _onMessage = event => {
    console.log('_onMessage', JSON.parse(event.nativeEvent.data));
    const res = JSON.parse(event.nativeEvent.data);
    if (res.message === 'ok') {
      if (route?.params?.from == 'cart') {
        dispatch({
          type: SagaActions.CHECKOUT_CART,
          payload: route?.params?.checkoutPayload,
        });
      } else if (route?.params?.from == 'createServiceRequest') {
        callCreateServiceRequestApi();
      }
    } else {
      navigation.replace(config.routes.CART);
      Toast.show(CheckPaymentResponse?.message, Toast.LONG);
    }
  };
  const jsCode = `document.querySelector('a.ActionButton').addEventListener("click", function() {  
    
    window.ReactNativeWebView.postMessage(JSON.stringify({type: "click", message : "ok"}));
}); 
true;`;
  return (
    <>
      <SafeAreaView style={styles.flexContainer}>
        <WebView
          source={{uri: link}}
          renderLoading={LoadingIndicatorView}
          startInLoadingState={true}
          ref={webviewRef}
          injectedJavaScript={jsCode}
          onMessage={_onMessage}
        />
        {/* {buttonVisible && (
          <TouchableOpacity
            onPress={() => onCheckPaymentApi()}
            style={styles.tabBarContainer}>


            <Text
              style={{
                color: config.colors.buttonColor,
                fontFamily: config.fonts.Poppins_Medium,
                fontSize: 14,
              }}>
              Continue
            </Text>

          </TouchableOpacity>
        )} */}
        {isApiLoading && Apiloader()}
      </SafeAreaView>
    </>
  );
};
export default CheckPayment;
const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: config.colors.BACKGROUNDCOLOR,
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    // justifyContent: 'space-between',
    justifyContent: 'center',
  },
  button: {
    fontSize: 24,
  },
  arrow: {
    color: '#ef4771',
  },
  icon: {
    width: 20,
    height: 20,
  },
});
