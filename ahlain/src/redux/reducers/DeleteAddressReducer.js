import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  DeleteAddressData: null,
  DeleteAddressResponse: null,
};
const saveDeleteAddressData = (state, action) => {
  state.DeleteAddressData = action.payload;
  state.DeleteAddressResponse = null;
};

const saveDeleteAddressResponseData = (state, action) => {
  state.DeleteAddressResponse = action.payload || state.DeleteAddressResponse;
};

const removeDeleteAddressResponseData = state => {
  state.DeleteAddressResponse = null;
  state.DeleteAddressData = null;
};

const DeleteAddressSlice = createSlice({
  name: 'DeleteAddress',
  initialState,

  reducers: {
    saveDeleteAddress: saveDeleteAddressData,
    saveDeleteAddressResponse: saveDeleteAddressResponseData,
    removeDeleteAddressResponse: removeDeleteAddressResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveDeleteAddress,
  saveDeleteAddressResponse,
  removeDeleteAddressResponse,
} = DeleteAddressSlice.actions;

const DeleteAddressSliceReducer = DeleteAddressSlice.reducer;

const selectDeleteAddressData = ({DeleteAddressReducer}) =>
  DeleteAddressReducer.DeleteAddressData ?? null;
const selectDeleteAddressResponse = ({DeleteAddressReducer}) =>
  DeleteAddressReducer.DeleteAddressResponse ?? null;

export {
  DeleteAddressSliceReducer,
  saveDeleteAddress,
  saveDeleteAddressResponse,
  removeDeleteAddressResponse,
  selectDeleteAddressData,
  selectDeleteAddressResponse,
};
