import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetComboDetailData: null,
  GetComboDetailResponse: null,
};
const saveGetComboDetailData = (state, action) => {
  state.GetComboDetailData = action.payload;
  state.GetComboDetailResponse = null;
};

const saveGetComboDetailResponseData = (state, action) => {
  state.GetComboDetailResponse = action.payload || state.GetComboDetailResponse;
};

const removeGetComboDetailResponseData = state => {
  state.GetComboDetailResponse = null;
  state.GetComboDetailData = null;
};

const GetComboDetailSlice = createSlice({
  name: 'GetComboDetail',
  initialState,

  reducers: {
    saveGetComboDetail: saveGetComboDetailData,
    saveGetComboDetailResponse: saveGetComboDetailResponseData,
    removeGetComboDetailResponse: removeGetComboDetailResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetComboDetail,
  saveGetComboDetailResponse,
  removeGetComboDetailResponse,
} = GetComboDetailSlice.actions;

const GetComboDetailSliceReducer = GetComboDetailSlice.reducer;

const selectGetComboDetailData = ({GetComboDetailReducer}) =>
  GetComboDetailReducer.GetComboDetailData ?? null;
const selectGetComboDetailResponse = ({GetComboDetailReducer}) =>
  GetComboDetailReducer.GetComboDetailResponse ?? null;

export {
  GetComboDetailSliceReducer,
  saveGetComboDetail,
  saveGetComboDetailResponse,
  removeGetComboDetailResponse,
  selectGetComboDetailData,
  selectGetComboDetailResponse,
};
