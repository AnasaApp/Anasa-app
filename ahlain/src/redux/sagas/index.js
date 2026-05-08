import {all, fork} from 'redux-saga/effects';
import {watchAddAddress} from './AddAddressSaga';
import {watchAddToCart} from './AddToCartSaga';
import {watchBookingDetail} from './BookingDetailSaga';
import {watchCancelBooking} from './CancelBookingSaga';
import {watchChangeDefaultAddress} from './ChangeDefaultAddress';
import {watchChangeLanguage} from './ChangeLanguageSaga';
import {watchChangeNotification} from './ChangeNotificationSaga';
import {watchChangePassword} from './ChangePasswordSaga';
import {watchCheckoutCart} from './CheckoutCartSaga';
import {watchCheckValidPromoCode} from './CheckValidPromoCodeSaga';
import {watchCreateSupport} from './CreateSupportSaga';
import {watchDeleteAllNotification} from './DeleteAllNotificationSaga';
import {watchDeleteNotification} from './DeleteNotificationSaga';
import {watchEditAddress} from './EditAddressSaga';
import {watchEditProfile} from './EditProfileSaga';
import {watchEventDateTime} from './EventDateTimeSaga';
import {watchForgotPassword} from './ForgotPasswordSaga';
import {watchGetAllMyBookings} from './GetAllMyBookingsSaga';
import {watchGetCategories} from './GetCategoriesSaga';
import {watchGetMarketingOffers} from './GetMarketingOffersSaga';
import {watchGetMyBookings} from './GetMyBookingsSaga';
import {watchGetMyCart} from './GetMyCartSaga';
import {watchGetNotificationList} from './GetNotificationListSaga';
import {watchGetSupportDetail} from './GetSupportDetailSaga';
import {watchGetSupport} from './GetSupportSaga';
import {watchLoginUser} from './LoginUserSaga';
import {watchLogoutUser} from './LogoutUserSaga';
import {watchMyProfile} from './MyProfileSaga';
import {watchRateService} from './RateServiceSaga';
import {watchRemoveCart} from './RemoveCartSaga';
import {watchReplySupport} from './ReplySupportSaga';
import {watchSearchHistory} from './SearchHistorySaga';
import {watchSearchMostRecent} from './SearchMostRecentSaga';
import {watchSearchResult} from './SearchResultSaga';
import {watchSearchSuggestion} from './SearchSuggestionSaga';
import {watchServiceDetail} from './ServiceDetailSaga';
import {watchSignUpUser} from './SignUpUserSaga';
import {watchSubCategories} from './SubCategoriesSaga';
import {watchTopRated} from './TopRatedSaga';
import {watchUpdateCart} from './UpdateCartSaga';
import {watchUpdatePassword} from './UpdatePasswordSaga';
import {watchVendorProfile} from './VendorProfileSaga';
import {watchVerifyOtp} from './VerifyOtpSaga';
import {watchPopularCategories} from './PopularCategoriesSaga';
import {watchCreateRequest} from './CreateRequestSaga';
import {watchEditRequest} from './EditRequestSaga';
import {watchViewRequest} from './ViewRequestSaga';
import {watchGetRequest} from './GetRequestSaga';
import {watchAddPacakageToCart} from './AddPacakageToCartSaga';
import {watchGetAboutUs} from './GetAboutUsSaga';
import {watchGetPrivacyPolicy} from './GetPrivacyPolicySaga';
import {watchGetTandC} from './GetTandCSaga';
import {watchMakePayment} from './MakePaymentSaga';
import {watchCheckPayment} from './CheckPaymentSaga';
import {watchAddServiceNote} from './AddServiceNoteSaga';
import {watchUpdateLatLong} from './UpdateLatLongSaga';
import {watchBookingEligiblity} from './BookingEligiblitySaga';
import {watchCreateServiceEligiblity} from './CreateServiceEligiblitySaga';
import {watchDeleteAccount} from './DeleteAccountSaga';
import {watchGetCities} from './GetCitiesSaga';
import {watchCalculateDeliveryCharges} from './CalculateDeliveryChargesSaga';
import {watchGetComboDetail} from './GetComboDetailSaga';
import {watchGetAllVendors} from './GetAllVendorsSaga';
import {watchGetServices} from './GetServicesSaga';
import {watchGetCategoriesList} from './GetCategoriesListSaga';
import {watchGetAddress} from './GetAddressSaga';
import {watchDeleteAddress} from './DeleteAddressSaga';
import {watchGetFAQ} from './GetFAQSaga';
import {watchGetRecommended} from './GetRecommendedSaga';
import {watchGetOccasions} from './GetOccasionsSaga';
import {watchViewOccasion} from './ViewOccasionSaga';
import {watchReOrderBooking} from './ReOrderBookingSaga';
import {watchGetWalletInfo} from './GetWalletInfoSaga';

export default function* rootSaga() {
  return yield all([
    fork(watchLoginUser),
    fork(watchSignUpUser),
    fork(watchVerifyOtp),
    fork(watchForgotPassword),
    fork(watchChangePassword),
    fork(watchUpdatePassword),
    fork(watchMyProfile),
    fork(watchEditProfile),
    fork(watchChangeLanguage),
    fork(watchChangeNotification),
    fork(watchLogoutUser),
    fork(watchGetCategories),
    fork(watchSubCategories),
    fork(watchSearchSuggestion),
    fork(watchSearchResult),
    fork(watchSearchHistory),
    fork(watchSearchMostRecent),
    fork(watchTopRated),
    fork(watchAddAddress),
    fork(watchChangeDefaultAddress),
    fork(watchEditAddress),
    fork(watchVendorProfile),
    fork(watchServiceDetail),
    fork(watchGetSupport),
    fork(watchGetSupportDetail),
    fork(watchReplySupport),
    fork(watchAddToCart),
    fork(watchGetMyCart),
    fork(watchRemoveCart),
    fork(watchUpdateCart),
    fork(watchCheckoutCart),
    fork(watchRateService),
    fork(watchGetMyBookings),
    fork(watchBookingDetail),
    fork(watchCancelBooking),
    fork(watchEventDateTime),
    fork(watchGetNotificationList),
    fork(watchDeleteNotification),
    fork(watchDeleteAllNotification),
    fork(watchGetMarketingOffers),
    fork(watchCheckValidPromoCode),
    fork(watchCreateSupport),
    fork(watchGetAllMyBookings),
    fork(watchPopularCategories),
    fork(watchCreateRequest),
    fork(watchEditRequest),
    fork(watchViewRequest),
    fork(watchGetRequest),
    fork(watchAddPacakageToCart),
    fork(watchGetAboutUs),
    fork(watchGetPrivacyPolicy),
    fork(watchGetTandC),
    fork(watchMakePayment),
    fork(watchCheckPayment),
    fork(watchAddServiceNote),
    fork(watchUpdateLatLong),
    fork(watchBookingEligiblity),
    fork(watchCreateServiceEligiblity),
    fork(watchDeleteAccount),
    fork(watchGetCities),
    fork(watchCalculateDeliveryCharges),
    fork(watchGetComboDetail),
    fork(watchGetAllVendors),
    fork(watchGetServices),
    fork(watchGetCategoriesList),
    fork(watchGetAddress),
    fork(watchDeleteAddress),
    fork(watchGetFAQ),
    fork(watchGetRecommended),
    fork(watchGetOccasions),
    fork(watchViewOccasion),
    fork(watchReOrderBooking),
    fork(watchGetWalletInfo),
  ]);
}
