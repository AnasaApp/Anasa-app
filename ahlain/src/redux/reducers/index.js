import {combineReducers} from '@reduxjs/toolkit';
import * as LoginUserReducer from './LoginUserReducer';
import * as VerifyOtpReducer from './VerifyOtpReducer';
import * as ForgotPasswordReducer from './ForgotPasswordReducer';
import * as ChangePasswordReducer from './ChangePasswordReducer';
import * as UpdatePasswordReducer from './UpdatePasswordReducer';
import * as SignUpUserReducer from './SignUpUserReducer';
import * as MyProfileReducer from './MyProfileReducer';
import * as EditProfileReducer from './EditProfileReducer';
import * as ChangeLanguageReducer from './ChangeLanguageReducer';
import * as ChangeNotificationReducer from './ChangeNotificationReducer';
import * as LogoutUserReducer from './LogoutUserReducer';
import * as GetCategoriesReducer from './GetCategoriesReducer';
import * as SubCategoriesReducer from './SubCategoriesReducer';
import * as SearchSuggestionReducer from './SearchSuggestionReducer';
import * as SearchHistoryReducer from './SearchHistoryReducer';
import * as SearchMostRecentReducer from './SearchMostRecentReducer';
import * as SearchResultReducer from './SearchResultReducer';
import * as TopRatedReducer from './TopRatedReducer';
import * as AddAddressReducer from './AddAddressReducer';
import * as ChangeDefaultAddressReducer from './ChangeDefaultAddressReducer';
import * as EditAddressReducer from './EditAddressReducer';
import * as VendorProfileReducer from './VendorProfileReducer';
import * as ServiceDetailReducer from './ServiceDetailReducer';
import * as UIReducer from './UIReducer';
import * as GetSupportReducer from './GetSupportReducer';
import * as GetSupportDetailReducer from './GetSupportDetailReducer';
import * as ReplySupportReducer from './ReplySupportReducer';
import * as AddToCartReducer from './AddToCartReducer';
import * as GetMyCartReducer from './GetMyCartReducer';
import * as RemoveCartReducer from './RemoveCartReducer';
import * as UpdateCartReducer from './UpdateCartReducer';
import * as CheckoutCartReducer from './CheckoutCartReducer';
import * as RateServiceReducer from './RateServiceReducer';
import * as GetMyBookingsReducer from './GetMyBookingsReducer';
import * as BookingDetailReducer from './BookingDetailReducer';
import * as CancelBookingReducer from './CancelBookingReducer';
import * as EventDateTimeReducer from './EventDateTimeReducer';
import * as GetNotificationListReducer from './GetNotificationListReducer';
import * as DeleteAllNotificationReducer from './DeleteAllNotificationReducer';
import * as DeleteNotificationReducer from './DeleteNotificationReducer';
import * as GetMarketingOffersReducer from './GetMarketingOffersReducer';
import * as CheckValidPromoCodeReducer from './CheckValidPromoCodeReducer';
import * as CreateSupportReducer from './CreateSupportReducer';
import * as GetAllMyBookingsReducer from './GetAllMyBookingsReducer';
import * as PopularCategoriesReducer from './PopularCategoriesReducer';
import * as CreateRequestReducer from './CreateRequestReducer';
import * as ViewRequestReducer from './ViewRequestReducer';
import * as EditRequestReducer from './EditRequestReducer';
import * as GetRequestReducer from './GetRequestReducer';
import * as AddPacakageToCartReducer from './AddPackageToCartReducer';
import * as GetAboutUsReducer from './GetAboutUsReducer';
import * as GetTandCReducer from './GetTandCReducer';
import * as GetPrivacyPolicyReducer from './GetPrivacyPolicyReducer';
import * as MakePaymentReducer from './MakePaymentReducer';
import * as CheckPaymentReducer from './CheckPaymentReducer';
import * as AddServiceNoteReducer from './AddServiceNoteReducer';
import * as UpdateLatLongReducer from './UpdateLatLongReducer';
import * as BookingEligiblityReducer from './BookingEligiblityReducer';
import * as CreateServiceEligiblityReducer from './CreateServiceEligiblityReducer';
import * as DeleteAccountReducer from './DeleteAccountReducer';
import * as GetCitiesReducer from './GetCitiesReducer';
import * as CalculateDeliveryChargesReducer from './CalculateDeliveryChargesReducer';
import * as GetComboDetailReducer from './GetComboDetailReducer';
import * as GetAllVendorsReducer from './GetAllVendorsReducer';
import * as GetServicesReducer from './GetServicesReducer';
import * as GetCategoriesListReducer from './GetCategoriesListReducer';
import * as GetAddressReducer from './GetAddressReducer';
import * as DeleteAddressReducer from './DeleteAddressReducer';
import * as GetFAQReducer from './GetFAQReducer';
import * as GetRecommendedReducer from './GetRecommendedReducer';
import * as GetOccasionsReducer from './GetOccasionsReducer';
import * as ViewOccasionReducer from './ViewOccasionReducer';
import * as ReOrderBookingReducer from './ReOrderBookingReducer';
import * as GetWalletInfoReducer from './GetWalletInfoReducer';
import * as GetMyOccasionsReducer from './GetMyOccasionsReducer';
import * as CreateMyOccasionReducer from './CreateMyOccasionReducer';
import * as PlanForMeReducer from './PlanForMeReducer';

const reducers = combineReducers({
  loginUserReducer: LoginUserReducer.loginUserSliceReducer,
  SignUpUserReducer: SignUpUserReducer.SignUpUserSliceReducer,
  VerifyOtpReducer: VerifyOtpReducer.VerifyOtpSliceReducer,
  ForgotPasswordReducer: ForgotPasswordReducer.ForgotPasswordSliceReducer,
  ChangePasswordReducer: ChangePasswordReducer.ChangePasswordSliceReducer,
  UpdatePasswordReducer: UpdatePasswordReducer.UpdatePasswordSliceReducer,
  MyProfileReducer: MyProfileReducer.MyProfileSliceReducer,
  EditProfileReducer: EditProfileReducer.EditProfileSliceReducer,
  ChangeLanguageReducer: ChangeLanguageReducer.ChangeLanguageSliceReducer,
  ChangeNotificationReducer:
    ChangeNotificationReducer.ChangeNotificationSliceReducer,
  LogoutUserReducer: LogoutUserReducer.LogoutUserSliceReducer,
  GetCategoriesReducer: GetCategoriesReducer.GetCategoriesSliceReducer,
  SubCategoriesReducer: SubCategoriesReducer.SubCategoriesSliceReducer,
  SearchSuggestionReducer: SearchSuggestionReducer.SearchSuggestionSliceReducer,
  SearchResultReducer: SearchResultReducer.SearchResultSliceReducer,
  SearchHistoryReducer: SearchHistoryReducer.SearchHistorySliceReducer,
  SearchMostRecentReducer: SearchMostRecentReducer.SearchMostRecentSliceReducer,
  TopRatedReducer: TopRatedReducer.TopRatedSliceReducer,
  AddAddressReducer: AddAddressReducer.AddAddressSliceReducer,
  ChangeDefaultAddressReducer:
    ChangeDefaultAddressReducer.ChangeDefaultAddressSliceReducer,
  EditAddressReducer: EditAddressReducer.EditAddressSliceReducer,
  VendorProfileReducer: VendorProfileReducer.VendorProfileSliceReducer,
  ServiceDetailReducer: ServiceDetailReducer.ServiceDetailSliceReducer,
  UIReducer: UIReducer.uiSliceReducer,
  GetSupportReducer: GetSupportReducer.GetSupportSliceReducer,
  GetSupportDetailReducer: GetSupportDetailReducer.GetSupportDetailSliceReducer,
  ReplySupportReducer: ReplySupportReducer.ReplySupportSliceReducer,
  AddToCartReducer: AddToCartReducer.AddToCartSliceReducer,
  GetMyCartReducer: GetMyCartReducer.GetMyCartSliceReducer,
  RemoveCartReducer: RemoveCartReducer.RemoveCartSliceReducer,
  UpdateCartReducer: UpdateCartReducer.UpdateCartSliceReducer,
  CheckoutCartReducer: CheckoutCartReducer.CheckoutCartSliceReducer,
  RateServiceReducer: RateServiceReducer.RateServiceSliceReducer,
  GetMyBookingsReducer: GetMyBookingsReducer.GetMyBookingsSliceReducer,
  BookingDetailReducer: BookingDetailReducer.BookingDetailSliceReducer,
  CancelBookingReducer: CancelBookingReducer.CancelBookingSliceReducer,
  EventDateTimeReducer: EventDateTimeReducer.EventDateTimeSliceReducer,
  GetNotificationListReducer:
    GetNotificationListReducer.GetNotificationListSliceReducer,
  DeleteAllNotificationReducer:
    DeleteAllNotificationReducer.DeleteAllNotificationSliceReducer,
  DeleteNotificationReducer:
    DeleteNotificationReducer.DeleteNotificationSliceReducer,
  GetMarketingOffersReducer:
    GetMarketingOffersReducer.GetMarketingOffersSliceReducer,
  CheckValidPromoCodeReducer:
    CheckValidPromoCodeReducer.CheckValidPromoCodeSliceReducer,
  CreateSupportReducer: CreateSupportReducer.CreateSupportSliceReducer,
  GetAllMyBookingsReducer: GetAllMyBookingsReducer.GetAllMyBookingsSliceReducer,
  PopularCategoriesReducer:
    PopularCategoriesReducer.PopularCategoriesSliceReducer,
  CreateRequestReducer: CreateRequestReducer.CreateRequestSliceReducer,
  ViewRequestReducer: ViewRequestReducer.ViewRequestSliceReducer,
  EditRequestReducer: EditRequestReducer.EditRequestSliceReducer,
  GetRequestReducer: GetRequestReducer.GetRequestSliceReducer,
  AddPacakageToCartReducer:
    AddPacakageToCartReducer.AddPacakageToCartSliceReducer,
  GetAboutUsReducer: GetAboutUsReducer.GetAboutUsSliceReducer,
  GetTandCReducer: GetTandCReducer.GetTandCSliceReducer,
  GetPrivacyPolicyReducer: GetPrivacyPolicyReducer.GetPrivacyPolicySliceReducer,
  MakePaymentReducer: MakePaymentReducer.MakePaymentSliceReducer,
  CheckPaymentReducer: CheckPaymentReducer.CheckPaymentSliceReducer,
  AddServiceNoteReducer: AddServiceNoteReducer.AddServiceNoteSliceReducer,
  UpdateLatLongReducer: UpdateLatLongReducer.UpdateLatLongSliceReducer,
  BookingEligiblityReducer:
    BookingEligiblityReducer.BookingEligiblitySliceReducer,
  CreateServiceEligiblityReducer:
    CreateServiceEligiblityReducer.CreateServiceEligiblitySliceReducer,
  DeleteAccountReducer: DeleteAccountReducer.DeleteAccountSliceReducer,
  GetCitiesReducer: GetCitiesReducer.GetCitiesSliceReducer,
  CalculateDeliveryChargesReducer:
    CalculateDeliveryChargesReducer.CalculateDeliveryChargesSliceReducer,
  GetComboDetailReducer: GetComboDetailReducer.GetComboDetailSliceReducer,
  GetAllVendorsReducer: GetAllVendorsReducer.GetAllVendorsSliceReducer,
  GetServicesReducer: GetServicesReducer.GetServicesSliceReducer,
  GetCategoriesListReducer:
    GetCategoriesListReducer.GetCategoriesListSliceReducer,
  GetAddressReducer: GetAddressReducer.GetAddressSliceReducer,
  DeleteAddressReducer: DeleteAddressReducer.DeleteAddressSliceReducer,
  GetFAQReducer: GetFAQReducer.GetFAQSliceReducer,
  GetRecommendedReducer: GetRecommendedReducer.GetRecommendedSliceReducer,
  GetOccasionsReducer: GetOccasionsReducer.GetOccasionsSliceReducer,
  ViewOccasionReducer: ViewOccasionReducer.ViewOccasionSliceReducer,
  ReOrderBookingReducer: ReOrderBookingReducer.ReOrderBookingSliceReducer,
  GetWalletInfoReducer: GetWalletInfoReducer.GetWalletInfoSliceReducer,
  GetMyOccasionsReducer: GetMyOccasionsReducer.GetMyOccasionsSliceReducer,
  CreateMyOccasionReducer:
    CreateMyOccasionReducer.CreateMyOccasionSliceReducer,
  PlanForMeReducer: PlanForMeReducer.PlanForMeSliceReducer,
});

export {
  reducers,
  LoginUserReducer,
  SignUpUserReducer,
  VerifyOtpReducer,
  ForgotPasswordReducer,
  ChangePasswordReducer,
  UpdatePasswordReducer,
  MyProfileReducer,
  EditProfileReducer,
  ChangeLanguageReducer,
  ChangeNotificationReducer,
  LogoutUserReducer,
  GetCategoriesReducer,
  SubCategoriesReducer,
  SearchSuggestionReducer,
  SearchResultReducer,
  SearchHistoryReducer,
  SearchMostRecentReducer,
  TopRatedReducer,
  AddAddressReducer,
  ChangeDefaultAddressReducer,
  EditAddressReducer,
  VendorProfileReducer,
  ServiceDetailReducer,
  UIReducer,
  GetSupportReducer,
  GetSupportDetailReducer,
  ReplySupportReducer,
  AddToCartReducer,
  GetMyCartReducer,
  RemoveCartReducer,
  UpdateCartReducer,
  CheckoutCartReducer,
  RateServiceReducer,
  GetMyBookingsReducer,
  BookingDetailReducer,
  CancelBookingReducer,
  EventDateTimeReducer,
  GetNotificationListReducer,
  DeleteAllNotificationReducer,
  DeleteNotificationReducer,
  GetMarketingOffersReducer,
  CheckValidPromoCodeReducer,
  CreateSupportReducer,
  GetAllMyBookingsReducer,
  PopularCategoriesReducer,
  CreateRequestReducer,
  ViewRequestReducer,
  EditRequestReducer,
  GetRequestReducer,
  AddPacakageToCartReducer,
  GetAboutUsReducer,
  GetTandCReducer,
  GetPrivacyPolicyReducer,
  MakePaymentReducer,
  CheckPaymentReducer,
  AddServiceNoteReducer,
  UpdateLatLongReducer,
  BookingEligiblityReducer,
  CreateServiceEligiblityReducer,
  DeleteAccountReducer,
  GetCitiesReducer,
  CalculateDeliveryChargesReducer,
  GetComboDetailReducer,
  GetAllVendorsReducer,
  GetServicesReducer,
  GetCategoriesListReducer,
  GetAddressReducer,
  DeleteAddressReducer,
  GetFAQReducer,
  GetRecommendedReducer,
  GetOccasionsReducer,
  ViewOccasionReducer,
  ReOrderBookingReducer,
  GetWalletInfoReducer,
  GetMyOccasionsReducer,
  CreateMyOccasionReducer,
  PlanForMeReducer,
};
