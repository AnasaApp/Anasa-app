import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ServiceDetailData: null,
  ServiceDetailResponse: null,
};
const saveServiceDetailData = (state, action) => {
  state.ServiceDetailData = action.payload;
  state.ServiceDetailResponse = null;
};

const saveServiceDetailResponseData = (state, action) => {
  state.ServiceDetailResponse = action.payload || state.ServiceDetailResponse;
};

const removeServiceDetailResponseData = state => {
  state.ServiceDetailResponse = null;
  state.ServiceDetailData = null;
};

const ServiceDetailSlice = createSlice({
  name: 'ServiceDetail',
  initialState,

  reducers: {
    saveServiceDetail: saveServiceDetailData,
    saveServiceDetailResponse: saveServiceDetailResponseData,
    removeServiceDetailResponse: removeServiceDetailResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveServiceDetail,
  saveServiceDetailResponse,
  removeServiceDetailResponse,
} = ServiceDetailSlice.actions;

const ServiceDetailSliceReducer = ServiceDetailSlice.reducer;

const selectServiceDetailData = ({ServiceDetailReducer}) =>
  ServiceDetailReducer.ServiceDetailData ?? null;
const selectServiceDetailResponse = ({ServiceDetailReducer}) =>
  ServiceDetailReducer.ServiceDetailResponse ?? null;

export {
  ServiceDetailSliceReducer,
  saveServiceDetail,
  saveServiceDetailResponse,
  removeServiceDetailResponse,
  selectServiceDetailData,
  selectServiceDetailResponse,
};
