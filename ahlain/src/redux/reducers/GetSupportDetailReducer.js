import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetSupportDetailData: null,
  GetSupportDetailResponse: null,
};
const saveGetSupportDetailData = (state, action) => {
  state.GetSupportDetailData = action.payload;
  state.GetSupportDetailResponse = null;
};

const saveGetSupportDetailResponseData = (state, action) => {
  state.GetSupportDetailResponse =
    action.payload || state.GetSupportDetailResponse;
};

const removeGetSupportDetailResponseData = state => {
  state.GetSupportDetailResponse = null;
  state.GetSupportDetailData = null;
};

const GetSupportDetailSlice = createSlice({
  name: 'GetSupportDetail',
  initialState,

  reducers: {
    saveGetSupportDetail: saveGetSupportDetailData,
    saveGetSupportDetailResponse: saveGetSupportDetailResponseData,
    removeGetSupportDetailResponse: removeGetSupportDetailResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetSupportDetail,
  saveGetSupportDetailResponse,
  removeGetSupportDetailResponse,
} = GetSupportDetailSlice.actions;

const GetSupportDetailSliceReducer = GetSupportDetailSlice.reducer;

const selectGetSupportDetailData = ({GetSupportDetailReducer}) =>
  GetSupportDetailReducer.GetSupportDetailData ?? null;
const selectGetSupportDetailResponse = ({GetSupportDetailReducer}) =>
  GetSupportDetailReducer.GetSupportDetailResponse ?? null;

export {
  GetSupportDetailSliceReducer,
  saveGetSupportDetail,
  saveGetSupportDetailResponse,
  removeGetSupportDetailResponse,
  selectGetSupportDetailData,
  selectGetSupportDetailResponse,
};
