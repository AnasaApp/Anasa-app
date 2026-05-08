import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetAllVendorsData: null,
  GetAllVendorsResponse: null,
};
const saveGetAllVendorsData = (state, action) => {
  state.GetAllVendorsData = action.payload;
  state.GetAllVendorsResponse = null;
};

const saveGetAllVendorsResponseData = (state, action) => {
  state.GetAllVendorsResponse = action.payload || state.GetAllVendorsResponse;
};

const removeGetAllVendorsResponseData = state => {
  state.GetAllVendorsResponse = null;
  state.GetAllVendorsData = null;
};

const GetAllVendorsSlice = createSlice({
  name: 'GetAllVendors',
  initialState,

  reducers: {
    saveGetAllVendors: saveGetAllVendorsData,
    saveGetAllVendorsResponse: saveGetAllVendorsResponseData,
    removeGetAllVendorsResponse: removeGetAllVendorsResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetAllVendors,
  saveGetAllVendorsResponse,
  removeGetAllVendorsResponse,
} = GetAllVendorsSlice.actions;

const GetAllVendorsSliceReducer = GetAllVendorsSlice.reducer;

const selectGetAllVendorsData = ({GetAllVendorsReducer}) =>
  GetAllVendorsReducer.GetAllVendorsData ?? null;
const selectGetAllVendorsResponse = ({GetAllVendorsReducer}) =>
  GetAllVendorsReducer.GetAllVendorsResponse ?? null;

export {
  GetAllVendorsSliceReducer,
  saveGetAllVendors,
  saveGetAllVendorsResponse,
  removeGetAllVendorsResponse,
  selectGetAllVendorsData,
  selectGetAllVendorsResponse,
};
