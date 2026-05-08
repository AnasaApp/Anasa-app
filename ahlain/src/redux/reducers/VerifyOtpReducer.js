import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  verifyOtpData: null,
  verifyOtpResponse: null,
};
const saveVerifyOtpData = (state, action) => {
  state.verifyOtpData = action.payload;
  state.verifyOtpResponse = null;
};

const saveVerifyOtpResponseData = (state, action) => {
  state.verifyOtpResponse = action.payload || state.verifyOtpResponse;
};

const removeVerifyOtpResponseData = state => {
  state.verifyOtpResponse = null;
  state.verifyOtpData = null;
};

const VerifyOtpSlice = createSlice({
  name: 'VerifyOtp',
  initialState,

  reducers: {
    saveVerifyOtp: saveVerifyOtpData,
    saveVerifyOtpResponse: saveVerifyOtpResponseData,
    removeVerifyOtpResponse: removeVerifyOtpResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveVerifyOtp, saveVerifyOtpResponse, removeVerifyOtpResponse} =
  VerifyOtpSlice.actions;

const VerifyOtpSliceReducer = VerifyOtpSlice.reducer;

const selectVerifyOtpData = ({VerifyOtpReducer}) =>
  VerifyOtpReducer.verifyOtpData ?? null;
const selectVerifyOtpResponse = ({VerifyOtpReducer}) =>
  VerifyOtpReducer.verifyOtpResponse ?? null;

export {
  VerifyOtpSliceReducer,
  saveVerifyOtp,
  saveVerifyOtpResponse,
  removeVerifyOtpResponse,
  selectVerifyOtpData,
  selectVerifyOtpResponse,
};
