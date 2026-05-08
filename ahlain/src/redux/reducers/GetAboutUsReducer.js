import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetAboutUsData: null,
  GetAboutUsResponse: null,
};
const saveGetAboutUsData = (state, action) => {
  state.GetAboutUsData = action.payload;
  state.GetAboutUsResponse = null;
};

const saveGetAboutUsResponseData = (state, action) => {
  state.GetAboutUsResponse = action.payload || state.GetAboutUsResponse;
};

const removeGetAboutUsResponseData = state => {
  state.GetAboutUsResponse = null;
  state.GetAboutUsData = null;
};

const GetAboutUsSlice = createSlice({
  name: 'GetAboutUs',
  initialState,

  reducers: {
    saveGetAboutUs: saveGetAboutUsData,
    saveGetAboutUsResponse: saveGetAboutUsResponseData,
    removeGetAboutUsResponse: removeGetAboutUsResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetAboutUs, saveGetAboutUsResponse, removeGetAboutUsResponse} =
  GetAboutUsSlice.actions;

const GetAboutUsSliceReducer = GetAboutUsSlice.reducer;

const selectGetAboutUsData = ({GetAboutUsReducer}) =>
  GetAboutUsReducer.GetAboutUsData ?? null;
const selectGetAboutUsResponse = ({GetAboutUsReducer}) =>
  GetAboutUsReducer.GetAboutUsResponse ?? null;

export {
  GetAboutUsSliceReducer,
  saveGetAboutUs,
  saveGetAboutUsResponse,
  removeGetAboutUsResponse,
  selectGetAboutUsData,
  selectGetAboutUsResponse,
};
