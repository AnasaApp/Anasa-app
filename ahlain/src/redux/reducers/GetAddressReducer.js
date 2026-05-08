import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetAddressData: null,
  GetAddressResponse: null,
};
const saveGetAddressData = (state, action) => {
  state.GetAddressData = action.payload;
  state.GetAddressResponse = null;
};

const saveGetAddressResponseData = (state, action) => {
  state.GetAddressResponse = action.payload || state.GetAddressResponse;
};

const removeGetAddressResponseData = state => {
  state.GetAddressResponse = null;
  state.GetAddressData = null;
};

const GetAddressSlice = createSlice({
  name: 'GetAddress',
  initialState,

  reducers: {
    saveGetAddress: saveGetAddressData,
    saveGetAddressResponse: saveGetAddressResponseData,
    removeGetAddressResponse: removeGetAddressResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetAddress, saveGetAddressResponse, removeGetAddressResponse} =
  GetAddressSlice.actions;

const GetAddressSliceReducer = GetAddressSlice.reducer;

const selectGetAddressData = ({GetAddressReducer}) =>
  GetAddressReducer.GetAddressData ?? null;
const selectGetAddressResponse = ({GetAddressReducer}) =>
  GetAddressReducer.GetAddressResponse ?? null;

export {
  GetAddressSliceReducer,
  saveGetAddress,
  saveGetAddressResponse,
  removeGetAddressResponse,
  selectGetAddressData,
  selectGetAddressResponse,
};
