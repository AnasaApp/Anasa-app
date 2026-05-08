import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetServicesData: null,
  GetServicesResponse: null,
};
const saveGetServicesData = (state, action) => {
  state.GetServicesData = action.payload;
  state.GetServicesResponse = null;
};

const saveGetServicesResponseData = (state, action) => {
  state.GetServicesResponse = action.payload || state.GetServicesResponse;
};

const removeGetServicesResponseData = state => {
  state.GetServicesResponse = null;
  state.GetServicesData = null;
};

const GetServicesSlice = createSlice({
  name: 'GetServices',
  initialState,

  reducers: {
    saveGetServices: saveGetServicesData,
    saveGetServicesResponse: saveGetServicesResponseData,
    removeGetServicesResponse: removeGetServicesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetServices, saveGetServicesResponse, removeGetServicesResponse} =
  GetServicesSlice.actions;

const GetServicesSliceReducer = GetServicesSlice.reducer;

const selectGetServicesData = ({GetServicesReducer}) =>
  GetServicesReducer.GetServicesData ?? null;
const selectGetServicesResponse = ({GetServicesReducer}) =>
  GetServicesReducer.GetServicesResponse ?? null;

export {
  GetServicesSliceReducer,
  saveGetServices,
  saveGetServicesResponse,
  removeGetServicesResponse,
  selectGetServicesData,
  selectGetServicesResponse,
};
