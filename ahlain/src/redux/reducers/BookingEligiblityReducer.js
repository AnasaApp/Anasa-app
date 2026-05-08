import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  BookingEligiblityData: null,
  BookingEligiblityResponse: null,
};
const saveBookingEligiblityData = (state, action) => {
  state.BookingEligiblityData = action.payload;
  state.BookingEligiblityResponse = null;
};

const saveBookingEligiblityResponseData = (state, action) => {
  state.BookingEligiblityResponse =
    action.payload || state.BookingEligiblityResponse;
};

const removeBookingEligiblityResponseData = state => {
  state.BookingEligiblityResponse = null;
  state.BookingEligiblityData = null;
};

const BookingEligiblitySlice = createSlice({
  name: 'BookingEligiblity',
  initialState,

  reducers: {
    saveBookingEligiblity: saveBookingEligiblityData,
    saveBookingEligiblityResponse: saveBookingEligiblityResponseData,
    removeBookingEligiblityResponse: removeBookingEligiblityResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveBookingEligiblity,
  saveBookingEligiblityResponse,
  removeBookingEligiblityResponse,
} = BookingEligiblitySlice.actions;

const BookingEligiblitySliceReducer = BookingEligiblitySlice.reducer;

const selectBookingEligiblityData = ({BookingEligiblityReducer}) =>
  BookingEligiblityReducer.BookingEligiblityData ?? null;
const selectBookingEligiblityResponse = ({BookingEligiblityReducer}) =>
  BookingEligiblityReducer.BookingEligiblityResponse ?? null;

export {
  BookingEligiblitySliceReducer,
  saveBookingEligiblity,
  saveBookingEligiblityResponse,
  removeBookingEligiblityResponse,
  selectBookingEligiblityData,
  selectBookingEligiblityResponse,
};
