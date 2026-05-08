import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetFAQData: null,
  GetFAQResponse: null,
};
const saveGetFAQData = (state, action) => {
  state.GetFAQData = action.payload;
  state.GetFAQResponse = null;
};

const saveGetFAQResponseData = (state, action) => {
  state.GetFAQResponse = action.payload || state.GetFAQResponse;
};

const removeGetFAQResponseData = state => {
  state.GetFAQResponse = null;
  state.GetFAQData = null;
};

const GetFAQSlice = createSlice({
  name: 'GetFAQ',
  initialState,

  reducers: {
    saveGetFAQ: saveGetFAQData,
    saveGetFAQResponse: saveGetFAQResponseData,
    removeGetFAQResponse: removeGetFAQResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetFAQ, saveGetFAQResponse, removeGetFAQResponse} =
  GetFAQSlice.actions;

const GetFAQSliceReducer = GetFAQSlice.reducer;

const selectGetFAQData = ({GetFAQReducer}) => GetFAQReducer.GetFAQData ?? null;
const selectGetFAQResponse = ({GetFAQReducer}) =>
  GetFAQReducer.GetFAQResponse ?? null;

export {
  GetFAQSliceReducer,
  saveGetFAQ,
  saveGetFAQResponse,
  removeGetFAQResponse,
  selectGetFAQData,
  selectGetFAQResponse,
};
