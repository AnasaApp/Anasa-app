import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  LogoutUserData: null,
  LogoutUserResponse: null,
};
const saveLogoutUserData = (state, action) => {
  state.LogoutUserData = action.payload;
  state.LogoutUserResponse = null;
};

const saveLogoutUserResponseData = (state, action) => {
  state.LogoutUserResponse = action.payload || state.LogoutUserResponse;
};

const removeLogoutUserResponseData = state => {
  state.LogoutUserResponse = null;
  state.LogoutUserData = null;
};

const LogoutUserSlice = createSlice({
  name: 'LogoutUser',
  initialState,

  reducers: {
    saveLogoutUser: saveLogoutUserData,
    saveLogoutUserResponse: saveLogoutUserResponseData,
    removeLogoutUserResponse: removeLogoutUserResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveLogoutUser, saveLogoutUserResponse, removeLogoutUserResponse} =
  LogoutUserSlice.actions;

const LogoutUserSliceReducer = LogoutUserSlice.reducer;

const selectLogoutUserData = ({LogoutUserReducer}) =>
  LogoutUserReducer.LogoutUserData ?? null;
const selectLogoutUserResponse = ({LogoutUserReducer}) =>
  LogoutUserReducer.LogoutUserResponse ?? null;

export {
  LogoutUserSliceReducer,
  saveLogoutUser,
  saveLogoutUserResponse,
  removeLogoutUserResponse,
  selectLogoutUserData,
  selectLogoutUserResponse,
};
