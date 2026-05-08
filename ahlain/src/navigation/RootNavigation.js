import * as React from 'react';
import {View, Text, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import config from '../config';
import Splash from '../screen/splash/Splash';
import Language from '../screen/language/Language';
import Slider from '../screen/slider/Slider';
import AuthNavigation from './AuthNavigation';
import UserAddress from '../screen/address/UserAddress';
import AddNewLocation from '../screen/addNewLocation/AddNewLocation';
import HomeScreen from '../screen/homeScreen/HomeScreen';
import Search from '../screen/search/Search';
import Chocolate from '../screen/chocolate/Chocolate';
import Service from '../screen/service/Service';
import VendorDetails from '../screen/vendor/VendorDetails';
import Cart from '../screen/cart/Cart';
import Payment from '../screen/payment/Payment';
import CheckPayment from '../screen/payment/CheckPayment';
import Notification from '../screen/notification/Notification';
import Sidebar from '../screen/sidebar/Sidebar';
import EditProfile from '../screen/editProfile/EditProfile';
import MyBookings from '../screen/myBookings/MyBookings';
import BookingDetails from '../screen/myBookings/BookingDetails';
import BillDetails from '../screen/billDetail/BillDetails';
import MySavedCard from '../screen/mySavedCard/MySavedCard';
import AddNewCard from '../screen/addNewCard/AddNewCard';
import Settings from '../screen/settings/Settings';
import ChangePassword from '../screen/changePassword/ChangePassword';
import AboutUs from '../screen/about Us/AboutUs';
import PrivacyPolicy from '../screen/privacyPolicy/PrivacyPolicy';
import TermsAndConditions from '../screen/term&Condition/TermsAndConditions';
import HelpSupport from '../screen/help&Support/HelpSupport';
import Raiseticket from '../screen/raiseTicket/Raiseticket';
import Tickets from '../screen/tickets/Tickets';
import Chat from '../screen/chat/Chat';
import SubCategories from '../screen/subCategories/SubCategories';
import SearchResult from '../screen/search/SearchResult';
import Categories from '../screen/categories/Categories';
import TopRated from '../screen/topRated/TopRated';
import {navigationRef} from '../conponents/NavigationRef';
import BannerDetail from '../screen/homeScreen/BannerDetail';
import PushController from '../conponents/PushController';
import PushControllerIos from '../conponents/PushControllerIos';
import CreateServiceRequest from '../screen/service Request/CreateServiceRequest';
import ServiceRequest from '../screen/service Request/ServiceRequest';
import SearchBooking from '../screen/myBookings/SearchBooking';
import ChooseDelivery from '../screen/cart/ChooseDelivery';
import Confirmation from '../screen/confirmation/Confirmation';
import StartServiceRequest from '../screen/service Request/StartServiceRequest';
import AllVendors from '../screen/vendor/AllVendors';
import MapViewLocation from '../screen/address/MapViewLocation';
import AddNewAddress from '../screen/address/AddNewAddress';
import FAQ from '../screen/Faq/FAQ';
import OccasionsList from '../screen/homeScreen/ViewOccasion';
import ViewOccasion from '../screen/homeScreen/ViewOccasion';
import MyEarnings from '../screen/myEarnings/MyEarnings';

const Stack = createStackNavigator();

function RootNavigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {Platform.OS == 'android' ? (
          <Stack.Screen name="PushController" component={PushController} />
        ) : (
          <Stack.Screen
            name="PushControllerIos"
            component={PushControllerIos}
          />
        )}
        {/* <Stack.Screen component={Splash} name={config.routes.SPLASH} /> */}
        <Stack.Screen component={Language} name={config.routes.LANGUAGE} />
        <Stack.Screen component={Slider} name={config.routes.SLIDER} />
        <Stack.Screen
          component={AuthNavigation}
          name={config.routes.AUTH_NAVIGATION}
        />
        <Stack.Screen component={HomeScreen} name={config.routes.HOME_SCREEN} />
        <Stack.Screen
          component={UserAddress}
          name={config.routes.USER_ADDRESS}
        />
        <Stack.Screen
          component={AddNewLocation}
          name={config.routes.ADD_NEW_LOCATION}
        />
        <Stack.Screen component={Search} name={config.routes.SEARCH} />
        <Stack.Screen
          component={SearchResult}
          name={config.routes.SEARCH_RESULT}
        />
        <Stack.Screen component={Categories} name={config.routes.CATEGORIES} />
        <Stack.Screen
          component={SubCategories}
          name={config.routes.SUBCATEGORIES}
        />
        <Stack.Screen component={TopRated} name={config.routes.TOP_RATED} />
        <Stack.Screen component={Chocolate} name={config.routes.CHOCOLATE} />
        <Stack.Screen component={Service} name={config.routes.SERVICE} />
        <Stack.Screen
          component={VendorDetails}
          name={config.routes.VENDOR_DETAILS}
        />
        <Stack.Screen component={Cart} name={config.routes.CART} />
        <Stack.Screen component={Payment} name={config.routes.PAYMENT_STATUS} />
        <Stack.Screen
          component={Notification}
          name={config.routes.NOTIFICATION}
        />
        <Stack.Screen component={Sidebar} name={config.routes.SIDE_BAR} />
        <Stack.Screen
          component={EditProfile}
          name={config.routes.EDIT_PROFILE}
        />
        <Stack.Screen component={MyBookings} name={config.routes.MY_BOOKINGS} />
        <Stack.Screen
          component={BookingDetails}
          name={config.routes.BOOKING_DETAILS}
        />
        <Stack.Screen
          component={BillDetails}
          name={config.routes.BILL_DETAILS}
        />
        <Stack.Screen
          component={MySavedCard}
          name={config.routes.MY_SAVED_CARD}
        />
        <Stack.Screen
          component={AddNewCard}
          name={config.routes.ADD_NEW_CARD}
        />
        <Stack.Screen component={Settings} name={config.routes.SETTINGS} />
        <Stack.Screen
          component={ChangePassword}
          name={config.routes.CHANGE_PASSWORD}
        />
        <Stack.Screen component={AboutUs} name={config.routes.ABOUT_US} />
        <Stack.Screen
          component={PrivacyPolicy}
          name={config.routes.PRIVACY_POLICY}
        />
        <Stack.Screen
          component={TermsAndConditions}
          name={config.routes.TERMS_AND_CONDITIONS}
        />
        <Stack.Screen
          component={HelpSupport}
          name={config.routes.HELP_AND_SUPPORT}
        />
        <Stack.Screen
          component={Raiseticket}
          name={config.routes.RAISE_TICKET}
        />
        <Stack.Screen component={Tickets} name={config.routes.TICKETS} />
        <Stack.Screen component={Chat} name={config.routes.CHAT_SCREEN} />
        <Stack.Screen
          component={BannerDetail}
          name={config.routes.Banner_Detail}
        />
        <Stack.Screen
          component={CreateServiceRequest}
          name={config.routes.CREATE_SERVICE_REQUEST}
        />
        <Stack.Screen
          component={ServiceRequest}
          name={config.routes.SERVICE_REQUEST}
        />
        <Stack.Screen
          component={CheckPayment}
          name={config.routes.CHECK_PAYMENT}
        />
        <Stack.Screen
          component={SearchBooking}
          name={config.routes.SEARCH_BOOKING}
        />
        <Stack.Screen
          component={ChooseDelivery}
          name={config.routes.CHOOSE_DELIVERY}
        />
        <Stack.Screen
          component={Confirmation}
          name={config.routes.CONFIRMATION}
        />
        <Stack.Screen
          component={StartServiceRequest}
          name={config.routes.START_SERVICE_REQUEST}
        />
        <Stack.Screen component={AllVendors} name={config.routes.ALL_VENDORS} />
        <Stack.Screen
          component={MapViewLocation}
          name={config.routes.MAP_VIEW_LOCATION}
        />
        <Stack.Screen
          component={AddNewAddress}
          name={config.routes.ADD_NEW_ADDRESS}
        />
        <Stack.Screen component={FAQ} name={config.routes.FAQ} />
        <Stack.Screen
          component={ViewOccasion}
          name={config.routes.VIEW_OCCASION}
        />
        <Stack.Screen component={MyEarnings} name={config.routes.MY_EARNINGS} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;
