import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  RateServiceData: null,
  RateServiceResponse: null,
};
const saveRateServiceData = (state, action) => {
  state.RateServiceData = action.payload;
  state.RateServiceResponse = null;
};

const saveRateServiceResponseData = (state, action) => {
  state.RateServiceResponse = action.payload || state.RateServiceResponse;
};

const removeRateServiceResponseData = state => {
  state.RateServiceResponse = null;
  state.RateServiceData = null;
};

const RateServiceSlice = createSlice({
  name: 'RateService',
  initialState,

  reducers: {
    saveRateService: saveRateServiceData,
    saveRateServiceResponse: saveRateServiceResponseData,
    removeRateServiceResponse: removeRateServiceResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveRateService, saveRateServiceResponse, removeRateServiceResponse} =
  RateServiceSlice.actions;

const RateServiceSliceReducer = RateServiceSlice.reducer;

const selectRateServiceData = ({RateServiceReducer}) =>
  RateServiceReducer.RateServiceData ?? null;
const selectRateServiceResponse = ({RateServiceReducer}) =>
  RateServiceReducer.RateServiceResponse ?? null;

export {
  RateServiceSliceReducer,
  saveRateService,
  saveRateServiceResponse,
  removeRateServiceResponse,
  selectRateServiceData,
  selectRateServiceResponse,
};
