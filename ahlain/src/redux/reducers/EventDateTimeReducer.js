import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  EventDateTimeData: null,
  EventDateTimeResponse: null,
};
const saveEventDateTimeData = (state, action) => {
  state.EventDateTimeData = action.payload;
  state.EventDateTimeResponse = null;
};

const saveEventDateTimeResponseData = (state, action) => {
  state.EventDateTimeResponse = action.payload || state.EventDateTimeResponse;
};

const removeEventDateTimeResponseData = state => {
  state.EventDateTimeResponse = null;
  state.EventDateTimeData = null;
};

const EventDateTimeSlice = createSlice({
  name: 'EventDateTime',
  initialState,

  reducers: {
    saveEventDateTime: saveEventDateTimeData,
    saveEventDateTimeResponse: saveEventDateTimeResponseData,
    removeEventDateTimeResponse: removeEventDateTimeResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveEventDateTime,
  saveEventDateTimeResponse,
  removeEventDateTimeResponse,
} = EventDateTimeSlice.actions;

const EventDateTimeSliceReducer = EventDateTimeSlice.reducer;

const selectEventDateTimeData = ({EventDateTimeReducer}) =>
  EventDateTimeReducer.EventDateTimeData ?? null;
const selectEventDateTimeResponse = ({EventDateTimeReducer}) =>
  EventDateTimeReducer.EventDateTimeResponse ?? null;

export {
  EventDateTimeSliceReducer,
  saveEventDateTime,
  saveEventDateTimeResponse,
  removeEventDateTimeResponse,
  selectEventDateTimeData,
  selectEventDateTimeResponse,
};
