import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  BookingDetailData: null,
  BookingDetailResponse: null,
};
const saveBookingDetailData = (state, action) => {
  state.BookingDetailData = action.payload;
  state.BookingDetailResponse = null;
};

const saveBookingDetailResponseData = (state, action) => {
  state.BookingDetailResponse = action.payload || state.BookingDetailResponse;
};

const removeBookingDetailResponseData = state => {
  state.BookingDetailResponse = null;
  state.BookingDetailData = null;
};

const BookingDetailSlice = createSlice({
  name: 'BookingDetail',
  initialState,

  reducers: {
    saveBookingDetail: saveBookingDetailData,
    saveBookingDetailResponse: saveBookingDetailResponseData,
    removeBookingDetailResponse: removeBookingDetailResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveBookingDetail,
  saveBookingDetailResponse,
  removeBookingDetailResponse,
} = BookingDetailSlice.actions;

const BookingDetailSliceReducer = BookingDetailSlice.reducer;

const selectBookingDetailData = ({BookingDetailReducer}) =>
  BookingDetailReducer.BookingDetailData ?? null;
const selectBookingDetailResponse = ({BookingDetailReducer}) =>
  BookingDetailReducer.BookingDetailResponse ?? null;

export {
  BookingDetailSliceReducer,
  saveBookingDetail,
  saveBookingDetailResponse,
  removeBookingDetailResponse,
  selectBookingDetailData,
  selectBookingDetailResponse,
};
