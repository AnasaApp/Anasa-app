import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  loginResponse: null,
  fcmDeviceToken: null,
};

const saveLoginUserData = (state, action) => {

  state.userData = action.payload;
  state.loginResponse = null;
};

const saveFCMTokenData = (state, action) => {
  state.fcmDeviceToken = action.payload;
};

const saveLoginResponseData = (state, action) => {
  state.loginResponse = action?.payload || state.loginResponse;
};

const removeLoginResponseData = (state) => {
  state.loginResponse = null;
};

/* Signout Action */
const signOutAction = createAction('signout');

/*  User Slice  */
const userSlice = createSlice({
  name: 'UserLogin',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(signOutAction, () => {
      return initialState;
    });
  },
  reducers: {
    saveUserLogin: saveLoginUserData,
    saveFCMToken: saveFCMTokenData,
    saveLoginResponse: saveLoginResponseData,
    removeLoginResponse: removeLoginResponseData,
  },
});

// Get actions from created UserSlice
const { saveUserLogin, saveFCMToken, saveLoginResponse, removeLoginResponse } =
  userSlice.actions;

// SELECTOR
const selectLoginUser = ({ loginUserReducer }) => loginUserReducer.userData ?? null;
const selectLoginErrorResponse = ({ loginUserReducer }) => loginUserReducer.loginResponse ?? null;

const loginUserSliceReducer = userSlice.reducer;

export {
  loginUserSliceReducer,
  saveUserLogin,
  saveLoginResponse,
  selectLoginUser,
  saveFCMToken,
  signOutAction,
  removeLoginResponse,
  selectLoginErrorResponse,
};
