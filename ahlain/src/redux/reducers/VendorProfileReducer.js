import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  VendorProfileData: null,
  VendorProfileResponse: null,
};
const saveVendorProfileData = (state, action) => {
  state.VendorProfileData = action.payload;
  state.VendorProfileResponse = null;
};

const saveVendorProfileResponseData = (state, action) => {
  state.VendorProfileResponse = action.payload || state.VendorProfileResponse;
};

const removeVendorProfileResponseData = state => {
  state.VendorProfileResponse = null;
  state.VendorProfileData = null;
};

const VendorProfileSlice = createSlice({
  name: 'VendorProfile',
  initialState,

  reducers: {
    saveVendorProfile: saveVendorProfileData,
    saveVendorProfileResponse: saveVendorProfileResponseData,
    removeVendorProfileResponse: removeVendorProfileResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveVendorProfile,
  saveVendorProfileResponse,
  removeVendorProfileResponse,
} = VendorProfileSlice.actions;

const VendorProfileSliceReducer = VendorProfileSlice.reducer;

const selectVendorProfileData = ({VendorProfileReducer}) =>
  VendorProfileReducer.VendorProfileData ?? null;
const selectVendorProfileResponse = ({VendorProfileReducer}) =>
  VendorProfileReducer.VendorProfileResponse ?? null;

export {
  VendorProfileSliceReducer,
  saveVendorProfile,
  saveVendorProfileResponse,
  removeVendorProfileResponse,
  selectVendorProfileData,
  selectVendorProfileResponse,
};
