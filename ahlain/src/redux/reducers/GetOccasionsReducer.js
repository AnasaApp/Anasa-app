import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetOccasionsData: null,
  GetOccasionsResponse: null,
};
const saveGetOccasionsData = (state, action) => {
  state.GetOccasionsData = action.payload;
  state.GetOccasionsResponse = null;
};

const saveGetOccasionsResponseData = (state, action) => {
  state.GetOccasionsResponse = action.payload || state.GetOccasionsResponse;
};

const removeGetOccasionsResponseData = state => {
  state.GetOccasionsResponse = null;
  state.GetOccasionsData = null;
};

const GetOccasionsSlice = createSlice({
  name: 'GetOccasions',
  initialState,

  reducers: {
    saveGetOccasions: saveGetOccasionsData,
    saveGetOccasionsResponse: saveGetOccasionsResponseData,
    removeGetOccasionsResponse: removeGetOccasionsResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetOccasions, saveGetOccasionsResponse, removeGetOccasionsResponse} =
  GetOccasionsSlice.actions;

const GetOccasionsSliceReducer = GetOccasionsSlice.reducer;

const selectGetOccasionsData = ({GetOccasionsReducer}) =>
  GetOccasionsReducer.GetOccasionsData ?? null;
const selectGetOccasionsResponse = ({GetOccasionsReducer}) =>
  GetOccasionsReducer.GetOccasionsResponse ?? null;

export {
  GetOccasionsSliceReducer,
  saveGetOccasions,
  saveGetOccasionsResponse,
  removeGetOccasionsResponse,
  selectGetOccasionsData,
  selectGetOccasionsResponse,
};
