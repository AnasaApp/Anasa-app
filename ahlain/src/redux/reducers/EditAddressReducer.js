import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  EditAddressData: null,
  EditAddressResponse: null,
};
const saveEditAddressData = (state, action) => {
  state.EditAddressData = action.payload;
  state.EditAddressResponse = null;
};

const saveEditAddressResponseData = (state, action) => {
  state.EditAddressResponse = action.payload || state.EditAddressResponse;
};

const removeEditAddressResponseData = state => {
  state.EditAddressResponse = null;
  state.EditAddressData = null;
};

const EditAddressSlice = createSlice({
  name: 'EditAddress',
  initialState,

  reducers: {
    saveEditAddress: saveEditAddressData,
    saveEditAddressResponse: saveEditAddressResponseData,
    removeEditAddressResponse: removeEditAddressResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveEditAddress, saveEditAddressResponse, removeEditAddressResponse} =
  EditAddressSlice.actions;

const EditAddressSliceReducer = EditAddressSlice.reducer;

const selectEditAddressData = ({EditAddressReducer}) =>
  EditAddressReducer.EditAddressData ?? null;
const selectEditAddressResponse = ({EditAddressReducer}) =>
  EditAddressReducer.EditAddressResponse ?? null;

export {
  EditAddressSliceReducer,
  saveEditAddress,
  saveEditAddressResponse,
  removeEditAddressResponse,
  selectEditAddressData,
  selectEditAddressResponse,
};
