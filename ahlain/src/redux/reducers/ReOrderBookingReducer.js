import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ReOrderBookingData: null,
  ReOrderBookingResponse: null,
};
const saveReOrderBookingData = (state, action) => {
  state.ReOrderBookingData = action.payload;
  state.ReOrderBookingResponse = null;
};

const saveReOrderBookingResponseData = (state, action) => {
  state.ReOrderBookingResponse = action.payload || state.ReOrderBookingResponse;
};

const removeReOrderBookingResponseData = state => {
  state.ReOrderBookingResponse = null;
  state.ReOrderBookingData = null;
};

const ReOrderBookingSlice = createSlice({
  name: 'ReOrderBooking',
  initialState,

  reducers: {
    saveReOrderBooking: saveReOrderBookingData,
    saveReOrderBookingResponse: saveReOrderBookingResponseData,
    removeReOrderBookingResponse: removeReOrderBookingResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveReOrderBooking,
  saveReOrderBookingResponse,
  removeReOrderBookingResponse,
} = ReOrderBookingSlice.actions;

const ReOrderBookingSliceReducer = ReOrderBookingSlice.reducer;

const selectReOrderBookingData = ({ReOrderBookingReducer}) =>
  ReOrderBookingReducer.ReOrderBookingData ?? null;
const selectReOrderBookingResponse = ({ReOrderBookingReducer}) =>
  ReOrderBookingReducer.ReOrderBookingResponse ?? null;

export {
  ReOrderBookingSliceReducer,
  saveReOrderBooking,
  saveReOrderBookingResponse,
  removeReOrderBookingResponse,
  selectReOrderBookingData,
  selectReOrderBookingResponse,
};
