import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetRecommendedData: null,
  GetRecommendedResponse: null,
};
const saveGetRecommendedData = (state, action) => {
  state.GetRecommendedData = action.payload;
  state.GetRecommendedResponse = null;
};

const saveGetRecommendedResponseData = (state, action) => {
  state.GetRecommendedResponse = action.payload || state.GetRecommendedResponse;
};

const removeGetRecommendedResponseData = state => {
  state.GetRecommendedResponse = null;
  state.GetRecommendedData = null;
};

const GetRecommendedSlice = createSlice({
  name: 'GetRecommended',
  initialState,

  reducers: {
    saveGetRecommended: saveGetRecommendedData,
    saveGetRecommendedResponse: saveGetRecommendedResponseData,
    removeGetRecommendedResponse: removeGetRecommendedResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetRecommended,
  saveGetRecommendedResponse,
  removeGetRecommendedResponse,
} = GetRecommendedSlice.actions;

const GetRecommendedSliceReducer = GetRecommendedSlice.reducer;

const selectGetRecommendedData = ({GetRecommendedReducer}) =>
  GetRecommendedReducer.GetRecommendedData ?? null;
const selectGetRecommendedResponse = ({GetRecommendedReducer}) =>
  GetRecommendedReducer.GetRecommendedResponse ?? null;

export {
  GetRecommendedSliceReducer,
  saveGetRecommended,
  saveGetRecommendedResponse,
  removeGetRecommendedResponse,
  selectGetRecommendedData,
  selectGetRecommendedResponse,
};
