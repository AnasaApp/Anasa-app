import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ChangeDefaultAddressData: null,
  ChangeDefaultAddressResponse: null,
};
const saveChangeDefaultAddressData = (state, action) => {
  state.ChangeDefaultAddressData = action.payload;
  state.ChangeDefaultAddressResponse = null;
};

const saveChangeDefaultAddressResponseData = (state, action) => {
  state.ChangeDefaultAddressResponse =
    action.payload || state.ChangeDefaultAddressResponse;
};

const removeChangeDefaultAddressResponseData = state => {
  state.ChangeDefaultAddressResponse = null;
  state.ChangeDefaultAddressData = null;
};

const ChangeDefaultAddressSlice = createSlice({
  name: 'ChangeDefaultAddress',
  initialState,

  reducers: {
    saveChangeDefaultAddress: saveChangeDefaultAddressData,
    saveChangeDefaultAddressResponse: saveChangeDefaultAddressResponseData,
    removeChangeDefaultAddressResponse: removeChangeDefaultAddressResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveChangeDefaultAddress,
  saveChangeDefaultAddressResponse,
  removeChangeDefaultAddressResponse,
} = ChangeDefaultAddressSlice.actions;

const ChangeDefaultAddressSliceReducer = ChangeDefaultAddressSlice.reducer;

const selectChangeDefaultAddressData = ({ChangeDefaultAddressReducer}) =>
  ChangeDefaultAddressReducer.ChangeDefaultAddressData ?? null;
const selectChangeDefaultAddressResponse = ({ChangeDefaultAddressReducer}) =>
  ChangeDefaultAddressReducer.ChangeDefaultAddressResponse ?? null;

export {
  ChangeDefaultAddressSliceReducer,
  saveChangeDefaultAddress,
  saveChangeDefaultAddressResponse,
  removeChangeDefaultAddressResponse,
  selectChangeDefaultAddressData,
  selectChangeDefaultAddressResponse,
};
