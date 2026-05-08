import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CancelBookingData: null,
  CancelBookingResponse: null,
};
const saveCancelBookingData = (state, action) => {
  state.CancelBookingData = action.payload;
  state.CancelBookingResponse = null;
};

const saveCancelBookingResponseData = (state, action) => {
  state.CancelBookingResponse = action.payload || state.CancelBookingResponse;
};

const removeCancelBookingResponseData = state => {
  state.CancelBookingResponse = null;
  state.CancelBookingData = null;
};

const CancelBookingSlice = createSlice({
  name: 'CancelBooking',
  initialState,

  reducers: {
    saveCancelBooking: saveCancelBookingData,
    saveCancelBookingResponse: saveCancelBookingResponseData,
    removeCancelBookingResponse: removeCancelBookingResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCancelBooking,
  saveCancelBookingResponse,
  removeCancelBookingResponse,
} = CancelBookingSlice.actions;

const CancelBookingSliceReducer = CancelBookingSlice.reducer;

const selectCancelBookingData = ({CancelBookingReducer}) =>
  CancelBookingReducer.CancelBookingData ?? null;
const selectCancelBookingResponse = ({CancelBookingReducer}) =>
  CancelBookingReducer.CancelBookingResponse ?? null;

export {
  CancelBookingSliceReducer,
  saveCancelBooking,
  saveCancelBookingResponse,
  removeCancelBookingResponse,
  selectCancelBookingData,
  selectCancelBookingResponse,
};
