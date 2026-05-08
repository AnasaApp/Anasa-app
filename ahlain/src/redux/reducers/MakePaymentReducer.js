import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  MakePaymentData: null,
  MakePaymentResponse: null,
};
const saveMakePaymentData = (state, action) => {
  state.MakePaymentData = action.payload;
  state.MakePaymentResponse = null;
};

const saveMakePaymentResponseData = (state, action) => {
  state.MakePaymentResponse = action.payload || state.MakePaymentResponse;
};

const removeMakePaymentResponseData = state => {
  state.MakePaymentResponse = null;
  state.MakePaymentData = null;
};

const MakePaymentSlice = createSlice({
  name: 'MakePayment',
  initialState,

  reducers: {
    saveMakePayment: saveMakePaymentData,
    saveMakePaymentResponse: saveMakePaymentResponseData,
    removeMakePaymentResponse: removeMakePaymentResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveMakePayment, saveMakePaymentResponse, removeMakePaymentResponse} =
  MakePaymentSlice.actions;

const MakePaymentSliceReducer = MakePaymentSlice.reducer;

const selectMakePaymentData = ({MakePaymentReducer}) =>
  MakePaymentReducer.MakePaymentData ?? null;
const selectMakePaymentResponse = ({MakePaymentReducer}) =>
  MakePaymentReducer.MakePaymentResponse ?? null;

export {
  MakePaymentSliceReducer,
  saveMakePayment,
  saveMakePaymentResponse,
  removeMakePaymentResponse,
  selectMakePaymentData,
  selectMakePaymentResponse,
};
