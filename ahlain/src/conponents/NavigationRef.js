import { CommonActions,createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();


export const goToLogin = (routeName) => {
  if (navigationRef.isReady()) {
    const gotoLogin = CommonActions.reset({
      index: 0,
      routes: [
        {
          name: routeName,
        },

      ],
    });
    navigationRef.dispatch(gotoLogin);
  }else{
    console.log('Navigation not ready');
  }

};
export const goToRoute = (routeName,params) => {
  if (navigationRef.isReady()) {

    navigationRef.navigate(routeName,params);
  }else{
    console.log('Navigation not ready');
  }

};
