import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  GetMyOccasionsData: null,
  GetMyOccasionsResponse: null,
};

const saveGetMyOccasionsData = (state, action) => {
  state.GetMyOccasionsData = action.payload;
  state.GetMyOccasionsResponse = null;
};

const saveGetMyOccasionsResponseData = (state, action) => {
  state.GetMyOccasionsResponse =
    action.payload || state.GetMyOccasionsResponse;
};

const removeGetMyOccasionsResponseData = state => {
  state.GetMyOccasionsResponse = null;
  state.GetMyOccasionsData = null;
};

const GetMyOccasionsSlice = createSlice({
  name: 'GetMyOccasions',
  initialState,
  reducers: {
    saveGetMyOccasions: saveGetMyOccasionsData,
    saveGetMyOccasionsResponse: saveGetMyOccasionsResponseData,
    removeGetMyOccasionsResponse: removeGetMyOccasionsResponseData,
  },
});

const {
  saveGetMyOccasions,
  saveGetMyOccasionsResponse,
  removeGetMyOccasionsResponse,
} = GetMyOccasionsSlice.actions;

const GetMyOccasionsSliceReducer = GetMyOccasionsSlice.reducer;

const selectGetMyOccasionsData = ({GetMyOccasionsReducer}) =>
  GetMyOccasionsReducer.GetMyOccasionsData ?? null;
const selectGetMyOccasionsResponse = ({GetMyOccasionsReducer}) =>
  GetMyOccasionsReducer.GetMyOccasionsResponse ?? null;

export {
  GetMyOccasionsSliceReducer,
  saveGetMyOccasions,
  saveGetMyOccasionsResponse,
  removeGetMyOccasionsResponse,
  selectGetMyOccasionsData,
  selectGetMyOccasionsResponse,
};

