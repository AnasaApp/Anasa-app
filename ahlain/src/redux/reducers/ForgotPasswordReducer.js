import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ForgotPasswordData: null,
  ForgotPasswordResponse: null,
};
const saveForgotPasswordData = (state, action) => {
  state.ForgotPasswordData = action.payload;
  state.ForgotPasswordResponse = null;
};

const saveForgotPasswordResponseData = (state, action) => {
  state.ForgotPasswordResponse = action.payload || state.ForgotPasswordResponse;
};

const removeForgotPasswordResponseData = state => {
  state.ForgotPasswordResponse = null;
  state.ForgotPasswordData = null;
};

const ForgotPasswordSlice = createSlice({
  name: 'ForgotPassword',
  initialState,

  reducers: {
    saveForgotPassword: saveForgotPasswordData,
    saveForgotPasswordResponse: saveForgotPasswordResponseData,
    removeForgotPasswordResponse: removeForgotPasswordResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveForgotPassword,
  saveForgotPasswordResponse,
  removeForgotPasswordResponse,
} = ForgotPasswordSlice.actions;

const ForgotPasswordSliceReducer = ForgotPasswordSlice.reducer;

const selectForgotPasswordData = ({ForgotPasswordReducer}) =>
  ForgotPasswordReducer.ForgotPasswordData ?? null;
const selectForgotPasswordResponse = ({ForgotPasswordReducer}) =>
  ForgotPasswordReducer.ForgotPasswordResponse ?? null;

export {
  ForgotPasswordSliceReducer,
  saveForgotPassword,
  saveForgotPasswordResponse,
  removeForgotPasswordResponse,
  selectForgotPasswordData,
  selectForgotPasswordResponse,
};
