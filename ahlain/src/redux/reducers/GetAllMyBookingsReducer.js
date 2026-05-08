import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetAllMyBookingsData: null,
  GetAllMyBookingsResponse: null,
};
const saveGetAllMyBookingsData = (state, action) => {
  state.GetAllMyBookingsData = action.payload;
  state.GetAllMyBookingsResponse = null;
};

const saveGetAllMyBookingsResponseData = (state, action) => {
  state.GetAllMyBookingsResponse =
    action.payload || state.GetAllMyBookingsResponse;
};

const removeGetAllMyBookingsResponseData = state => {
  state.GetAllMyBookingsResponse = null;
  state.GetAllMyBookingsData = null;
};

const GetAllMyBookingsSlice = createSlice({
  name: 'GetAllMyBookings',
  initialState,

  reducers: {
    saveGetAllMyBookings: saveGetAllMyBookingsData,
    saveGetAllMyBookingsResponse: saveGetAllMyBookingsResponseData,
    removeGetAllMyBookingsResponse: removeGetAllMyBookingsResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetAllMyBookings,
  saveGetAllMyBookingsResponse,
  removeGetAllMyBookingsResponse,
} = GetAllMyBookingsSlice.actions;

const GetAllMyBookingsSliceReducer = GetAllMyBookingsSlice.reducer;

const selectGetAllMyBookingsData = ({GetAllMyBookingsReducer}) =>
  GetAllMyBookingsReducer.GetAllMyBookingsData ?? null;
const selectGetAllMyBookingsResponse = ({GetAllMyBookingsReducer}) =>
  GetAllMyBookingsReducer.GetAllMyBookingsResponse ?? null;

export {
  GetAllMyBookingsSliceReducer,
  saveGetAllMyBookings,
  saveGetAllMyBookingsResponse,
  removeGetAllMyBookingsResponse,
  selectGetAllMyBookingsData,
  selectGetAllMyBookingsResponse,
};
