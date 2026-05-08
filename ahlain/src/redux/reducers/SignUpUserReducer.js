import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SignUpUserData: null,
  SignUpUserResponse: null,
};
const saveSignUpUserData = (state, action) => {
  state.SignUpUserData = action.payload;
  state.SignUpUserResponse = null;
};

const saveSignUpUserResponseData = (state, action) => {
  state.SignUpUserResponse = action.payload || state.SignUpUserResponse;
};

const removeSignUpUserResponseData = state => {
  state.SignUpUserResponse = null;
  state.SignUpUserData = null;
};

const SignUpUserSlice = createSlice({
  name: 'SignUpUser',
  initialState,

  reducers: {
    saveSignUpUser: saveSignUpUserData,
    saveSignUpUserResponse: saveSignUpUserResponseData,
    removeSignUpUserResponse: removeSignUpUserResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveSignUpUser, saveSignUpUserResponse, removeSignUpUserResponse} =
  SignUpUserSlice.actions;

const SignUpUserSliceReducer = SignUpUserSlice.reducer;

const selectSignUpUserData = ({SignUpUserReducer}) =>
  SignUpUserReducer.SignUpUserData ?? null;
const selectSignUpUserResponse = ({SignUpUserReducer}) =>
  SignUpUserReducer.SignUpUserResponse ?? null;

export {
  SignUpUserSliceReducer,
  saveSignUpUser,
  saveSignUpUserResponse,
  removeSignUpUserResponse,
  selectSignUpUserData,
  selectSignUpUserResponse,
};
