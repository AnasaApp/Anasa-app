import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CheckPaymentData: null,
  CheckPaymentResponse: null,
};
const saveCheckPaymentData = (state, action) => {
  state.CheckPaymentData = action.payload;
  state.CheckPaymentResponse = null;
};

const saveCheckPaymentResponseData = (state, action) => {
  state.CheckPaymentResponse = action.payload || state.CheckPaymentResponse;
};

const removeCheckPaymentResponseData = state => {
  state.CheckPaymentResponse = null;
  state.CheckPaymentData = null;
};

const CheckPaymentSlice = createSlice({
  name: 'CheckPayment',
  initialState,

  reducers: {
    saveCheckPayment: saveCheckPaymentData,
    saveCheckPaymentResponse: saveCheckPaymentResponseData,
    removeCheckPaymentResponse: removeCheckPaymentResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveCheckPayment, saveCheckPaymentResponse, removeCheckPaymentResponse} =
  CheckPaymentSlice.actions;

const CheckPaymentSliceReducer = CheckPaymentSlice.reducer;

const selectCheckPaymentData = ({CheckPaymentReducer}) =>
  CheckPaymentReducer.CheckPaymentData ?? null;
const selectCheckPaymentResponse = ({CheckPaymentReducer}) =>
  CheckPaymentReducer.CheckPaymentResponse ?? null;

export {
  CheckPaymentSliceReducer,
  saveCheckPayment,
  saveCheckPaymentResponse,
  removeCheckPaymentResponse,
  selectCheckPaymentData,
  selectCheckPaymentResponse,
};
