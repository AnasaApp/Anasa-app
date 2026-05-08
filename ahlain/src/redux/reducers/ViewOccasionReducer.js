import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ViewOccasionData: null,
  ViewOccasionResponse: null,
};
const saveViewOccasionData = (state, action) => {
  state.ViewOccasionData = action.payload;
  state.ViewOccasionResponse = null;
};

const saveViewOccasionResponseData = (state, action) => {
  state.ViewOccasionResponse = action.payload || state.ViewOccasionResponse;
};

const removeViewOccasionResponseData = state => {
  state.ViewOccasionResponse = null;
  state.ViewOccasionData = null;
};

const ViewOccasionSlice = createSlice({
  name: 'ViewOccasion',
  initialState,

  reducers: {
    saveViewOccasion: saveViewOccasionData,
    saveViewOccasionResponse: saveViewOccasionResponseData,
    removeViewOccasionResponse: removeViewOccasionResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveViewOccasion, saveViewOccasionResponse, removeViewOccasionResponse} =
  ViewOccasionSlice.actions;

const ViewOccasionSliceReducer = ViewOccasionSlice.reducer;

const selectViewOccasionData = ({ViewOccasionReducer}) =>
  ViewOccasionReducer.ViewOccasionData ?? null;
const selectViewOccasionResponse = ({ViewOccasionReducer}) =>
  ViewOccasionReducer.ViewOccasionResponse ?? null;

export {
  ViewOccasionSliceReducer,
  saveViewOccasion,
  saveViewOccasionResponse,
  removeViewOccasionResponse,
  selectViewOccasionData,
  selectViewOccasionResponse,
};
