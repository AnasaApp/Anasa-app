import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  AddAddressData: null,
  AddAddressResponse: null,
};
const saveAddAddressData = (state, action) => {
  state.AddAddressData = action.payload;
  state.AddAddressResponse = null;
};

const saveAddAddressResponseData = (state, action) => {
  state.AddAddressResponse = action.payload || state.AddAddressResponse;
};

const removeAddAddressResponseData = state => {
  state.AddAddressResponse = null;
  state.AddAddressData = null;
};

const AddAddressSlice = createSlice({
  name: 'AddAddress',
  initialState,

  reducers: {
    saveAddAddress: saveAddAddressData,
    saveAddAddressResponse: saveAddAddressResponseData,
    removeAddAddressResponse: removeAddAddressResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveAddAddress, saveAddAddressResponse, removeAddAddressResponse} =
  AddAddressSlice.actions;

const AddAddressSliceReducer = AddAddressSlice.reducer;

const selectAddAddressData = ({AddAddressReducer}) =>
  AddAddressReducer.AddAddressData ?? null;
const selectAddAddressResponse = ({AddAddressReducer}) =>
  AddAddressReducer.AddAddressResponse ?? null;

export {
  AddAddressSliceReducer,
  saveAddAddress,
  saveAddAddressResponse,
  removeAddAddressResponse,
  selectAddAddressData,
  selectAddAddressResponse,
};
