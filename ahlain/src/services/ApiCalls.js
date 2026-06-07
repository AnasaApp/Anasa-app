import {SagaActions} from '../redux/sagas/SagaActions';
import ApiUrls from './ApiUrls';

export const ApiCalls = ({apiType}) => {
  let requestType = '';
  let requestUrl = '';
  switch (apiType) {
    /* -------------------------------- POST REQUESTS BEGINS ----------------------------------  */
    /* POST request */
    case SagaActions.LOGIN_USER:
      requestType = 'POST';
      requestUrl = ApiUrls.LOGIN_URL;
      break;
    case SagaActions.SIGNUP_USER:
      requestType = 'POST';
      requestUrl = ApiUrls.SIGNUP_USER_URL;
      break;
    case SagaActions.VERIFY_OTP:
      requestType = 'POST';
      requestUrl = ApiUrls.VERIFY_OTP_URL;
      break;
    case SagaActions.FORGOT_PASSWORD:
      requestType = 'POST';
      requestUrl = ApiUrls.FORGOT_PASSWORD_URL;
      break;
    case SagaActions.CHANGE_PASSWORD:
      requestType = 'POST';
      requestUrl = ApiUrls.CHANGE_PASSWORD_URL;
      break;
    case SagaActions.UPDATE_PASSWORD:
      requestType = 'POST';
      requestUrl = ApiUrls.UPDATE_PASSWORD_URL;
      break;
    case SagaActions.EDIT_PROFILE:
      requestType = 'POST';
      requestUrl = ApiUrls.EDIT_PROFILE_URL;
      break;
    case SagaActions.CHANGE_LANGUAGE:
      requestType = 'POST';
      requestUrl = ApiUrls.CHANGE_LANGUAGE_URL;
      break;
    case SagaActions.SUB_CATEGORIES:
      requestType = 'POST';
      requestUrl = ApiUrls.SUB_CATEGORIES_URL;
      break;
    case SagaActions.SUB_CATEGORIES:
      requestType = 'POST';
      requestUrl = ApiUrls.SUB_CATEGORIES_URL;
      break;
    case SagaActions.SEARCH_SUGGESTION:
      requestType = 'POST';
      requestUrl = ApiUrls.SEARCH_SUGGESTION_URL;
      break;
    case SagaActions.SEARCH_RESULT:
      requestType = 'POST';
      requestUrl = ApiUrls.SEARCH_RESULT_URL;
      break;
    case SagaActions.ADD_ADDRESS:
      requestType = 'POST';
      requestUrl = ApiUrls.ADD_ADDRESS_URL;
      break;
    case SagaActions.EDIT_ADDRESS:
      requestType = 'POST';
      requestUrl = ApiUrls.EDIT_ADDRESS_URL;
      break;
    case SagaActions.REPLY_SUPPORT:
      requestType = 'POST';
      requestUrl = ApiUrls.REPLY_SUPPORT_URL;
      break;
    case SagaActions.ADD_TO_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.ADD_TO_CART_URL;
      break;
    case SagaActions.UPDATE_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.UPDATE_CART_URL;
      break;
    case SagaActions.CHECKOUT_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.CHECKOUT_CART_URL;
      break;
    case SagaActions.RATE_SERVICE:
      requestType = 'POST';
      requestUrl = ApiUrls.RATE_SERVICE_URL;
      break;
    case SagaActions.GET_MY_BOOKINGS:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_MY_BOOKINGS_URL;
      break;
    case SagaActions.CANCEL_BOOKING:
      requestType = 'POST';
      requestUrl = ApiUrls.CANCEL_BOOKING_URL;
      break;
    case SagaActions.EVENT_DATE_TIME:
      requestType = 'POST';
      requestUrl = ApiUrls.EVENT_DATE_TIME_URL;
      break;
    case SagaActions.CHECK_VALID_PROMOCODE:
      requestType = 'POST';
      requestUrl = ApiUrls.CHECK_VALID_PROMOCODE_URL;
      break;
    case SagaActions.CREATE_SUPPORT:
      requestType = 'POST';
      requestUrl = ApiUrls.CREATE_SUPPORT_URL;
      break;
    case SagaActions.CREATE_REQUEST:
      requestType = 'POST';
      requestUrl = ApiUrls.CREATE_REQUEST_URL;
      break;
    case SagaActions.EDIT_REQUEST:
      requestType = 'POST';
      requestUrl = ApiUrls.EDIT_REQUEST_URL;
      break;
    case SagaActions.GET_REQUEST:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_REQUEST_URL;
      break;
    case SagaActions.Add_PACKAGE_TO_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.ADD_PACKAGE_TO_CART_URL;
      break;
    case SagaActions.GET_MY_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_MY_CART_URL;
      break;
    case SagaActions.MAKE_PAYMENT:
      requestType = 'POST';
      requestUrl = ApiUrls.MAKE_PAYMENT_URL;
      break;
    case SagaActions.CHECK_PAYMENT:
      requestType = 'POST';
      requestUrl = ApiUrls.CHECK_PAYMENT_STATUS_URL;
      break;
    case SagaActions.ADD_SERVICE_NOTE:
      requestType = 'POST';
      requestUrl = ApiUrls.ADD_SERVICE_NOTE_URL;
      break;
    case SagaActions.UPDATE_LAT_LONG:
      requestType = 'POST';
      requestUrl = ApiUrls.UPDATE_LAT_LONG_URL;
      break;
    case SagaActions.BOOKING_ELIGIBILITY:
      requestType = 'POST';
      requestUrl = ApiUrls.BOOKING_ELIGIBILITY_URL;
      break;
    case SagaActions.CREATE_SERVICE_ELIGIBILITY:
      requestType = 'POST';
      requestUrl = ApiUrls.CREATE_SERVICE_ELIGIBILITY_URL;
      break;
    case SagaActions.GET_CITIES:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_CITIES_URL;
      break;

    case SagaActions.CALCULATE_DELIVERY_CHARGES:
      requestType = 'POST';
      requestUrl = ApiUrls.CALCULATE_DELIVERY_CHARGES_URL;
      break;

    case SagaActions.GET_ALL_VENDORS:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_ALL_VENDORS_URL;
      break;

    case SagaActions.GET_SERVICES:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_SERVICES_URL;
      break;

    case SagaActions.GET_CATEGORIES_LIST:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_CATEGORIES_LIST_URL;
      break;

    case SagaActions.GET_ADDRESS:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_ADDRESS_URL;
      break;

    case SagaActions.GET_RECOMMENDATION:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_RECOMMENDATION_URL;
      break;

    case SagaActions.GET_OCCASIONS:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_OCCASIONS_URL;
      break;

    case SagaActions.GET_WALLET_INFO:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_WALLET_INFO_URL;
      break;

    case SagaActions.CREATE_MY_OCCASION:
      requestType = 'POST';
      requestUrl = ApiUrls.CREATE_MY_OCCASION_URL;
      break;

    case SagaActions.PLAN_FOR_ME:
      requestType = 'POST';
      requestUrl = ApiUrls.PLAN_FOR_ME_URL;
      break;

    case SagaActions.GET_PARTY_TYPES:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_PARTY_TYPES_URL;
      break;

    case SagaActions.GET_MY_OCCASIONS:
      requestType = 'POST';
      requestUrl = ApiUrls.GET_MY_OCCASIONS_URL;
      break;

    case SagaActions.CREATE_PARTY_SERVICE:
      requestType = 'POST';
      requestUrl = ApiUrls.CREATE_PARTY_SERVICE_URL;
      break;

    case SagaActions.ADD_PARTY_TO_CART:
      requestType = 'POST';
      requestUrl = ApiUrls.ADD_PARTY_TO_CART_URL;
      break;

    // GET REQUESTS
    case SagaActions.MY_PROFILE:
      requestType = 'GET';
      requestUrl = ApiUrls.MY_PROFILE_URL;
      break;
    case SagaActions.CHANGE_NOTIFICATION:
      requestType = 'GET';
      requestUrl = ApiUrls.CHANGE_NOTIFICATION_URL;
      break;
    case SagaActions.LOGOUT_USER:
      requestType = 'GET';
      requestUrl = ApiUrls.LOGOUT_URL;
      break;
    case SagaActions.GET_CATEGORIES:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_CATEGORIES_URL;
      break;
    case SagaActions.POPULAR_CATEGORIES:
      requestType = 'GET';
      requestUrl = ApiUrls.POPULAR_CATEGORIES_URL;
      break;
    case SagaActions.TOP_RATED:
      requestType = 'GET';
      requestUrl = ApiUrls.TOP_RATED_URL;
      break;
    case SagaActions.CHANGE_DEFAULT_ADDRESS:
      requestType = 'GET';
      requestUrl = ApiUrls.CHANGE_DEFAULT_ADDRESS_URL;
      break;
    case SagaActions.SEARCH_HISTORY:
      requestType = 'GET';
      requestUrl = ApiUrls.SEARCH_HISTORY_URL;
      break;
    case SagaActions.SEARCH_MOST_RECENT:
      requestType = 'GET';
      requestUrl = ApiUrls.SEARCH_MOST_RECENT_URL;
      break;
    case SagaActions.GET_VENDOR_PROFILE:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_VENDOR_PROFILE_URL;
      break;

    case SagaActions.GET_SERVICE_DETAIL:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_SERVICE_DETAIL_URL;
      break;

    case SagaActions.GET_SUPPORT:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_SUPPORT_URL;
      break;
    case SagaActions.GET_SUPPORT_DETAIL:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_SUPPORT_DETAIL_URL;
      break;

    case SagaActions.REMOVE_CART:
      requestType = 'GET';
      requestUrl = ApiUrls.REMOVE_CART_URL;
      break;
    case SagaActions.GET_ALL_MY_BOOKINGS:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_ALL_MY_BOOKINGS_URL;
      break;
    case SagaActions.BOOKING_DETAIL:
      requestType = 'GET';
      requestUrl = ApiUrls.BOOKING_DETAIL_URL;
      break;
    case SagaActions.GET_NOTIFICATION_LIST:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_NOTIFICATION_LIST_URL;
      break;
    case SagaActions.DELETE_ALL_NOTIFICATION:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_ALL_NOTIFICATION_URL;
      break;
    case SagaActions.DELETE_NOTIFICATION:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_NOTIFICATION_URL;
      break;
    case SagaActions.GET_MARKETING_OFFERS:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_MARKETING_OFFERS_URL;
      break;

    case SagaActions.VIEW_REQUEST:
      requestType = 'GET';
      requestUrl = ApiUrls.VIEW_REQUEST_URL;
      break;
    case SagaActions.GET_ABOUT_US:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_ABOUT_US_URL;
      break;
    case SagaActions.GET_T_AND_C:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_T_AND_C_URL;
      break;
    case SagaActions.GET_PRIVACY_POLICY:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_PRIVACY_POLICY_URL;
      break;
    case SagaActions.DELETE_ACCOUNT:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_ACCOUNT_URL;
      break;

    case SagaActions.GET_COMBO_DETAIL:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_COMBO_DETAIL_URL;
      break;

    case SagaActions.DELETE_ADDRESS:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_ADDRESS_URL;
      break;

    case SagaActions.GET_FAQ:
      requestType = 'GET';
      requestUrl = ApiUrls.GET_FAQ_URL;
      break;

    case SagaActions.VIEW_OCCASION:
      requestType = 'GET';
      requestUrl = ApiUrls.VIEW_OCCASION_URL;
      break;

    case SagaActions.VIEW_PARTY:
      requestType = 'GET';
      requestUrl = ApiUrls.VIEW_PARTY_URL;
      break;

    case SagaActions.DELETE_PARTY:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_PARTY_URL;
      break;

    case SagaActions.DELETE_PARTY_SERVICE:
      requestType = 'GET';
      requestUrl = ApiUrls.DELETE_PARTY_SERVICE_URL;
      break;

    case SagaActions.RE_ORDER_BOOKING:
      requestType = 'GET';
      requestUrl = ApiUrls.RE_ORDER_BOOKING_URL;
      break;

    default:
      requestType = '';
      requestUrl = '';
      break;
  }
  return {requestType, requestUrl};
};
