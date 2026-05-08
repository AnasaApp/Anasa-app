import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetMyBookingsData: null,
  GetMyBookingsResponse: null,
};
const saveGetMyBookingsData = (state, action) => {
  state.GetMyBookingsData = action.payload;
  state.GetMyBookingsResponse = null;
};

const saveGetMyBookingsResponseData = (state, action) => {
  state.GetMyBookingsResponse = action.payload || state.GetMyBookingsResponse;
};

const removeGetMyBookingsResponseData = state => {
  state.GetMyBookingsResponse = null;
  state.GetMyBookingsData = null;
};

const GetMyBookingsSlice = createSlice({
  name: 'GetMyBookings',
  initialState,

  reducers: {
    saveGetMyBookings: saveGetMyBookingsData,
    saveGetMyBookingsResponse: saveGetMyBookingsResponseData,
    removeGetMyBookingsResponse: removeGetMyBookingsResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetMyBookings,
  saveGetMyBookingsResponse,
  removeGetMyBookingsResponse,
} = GetMyBookingsSlice.actions;

const GetMyBookingsSliceReducer = GetMyBookingsSlice.reducer;

const selectGetMyBookingsData = ({GetMyBookingsReducer}) =>
  GetMyBookingsReducer.GetMyBookingsData ?? null;
const selectGetMyBookingsResponse = ({GetMyBookingsReducer}) =>
  GetMyBookingsReducer.GetMyBookingsResponse ?? null;

export {
  GetMyBookingsSliceReducer,
  saveGetMyBookings,
  saveGetMyBookingsResponse,
  removeGetMyBookingsResponse,
  selectGetMyBookingsData,
  selectGetMyBookingsResponse,
};
