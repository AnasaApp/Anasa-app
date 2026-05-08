import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetWalletInfoData: null,
  GetWalletInfoResponse: null,
};
const saveGetWalletInfoData = (state, action) => {
  state.GetWalletInfoData = action.payload;
  state.GetWalletInfoResponse = null;
};

const saveGetWalletInfoResponseData = (state, action) => {
  state.GetWalletInfoResponse = action.payload || state.GetWalletInfoResponse;
};

const removeGetWalletInfoResponseData = state => {
  state.GetWalletInfoResponse = null;
  state.GetWalletInfoData = null;
};

const GetWalletInfoSlice = createSlice({
  name: 'GetWalletInfo',
  initialState,

  reducers: {
    saveGetWalletInfo: saveGetWalletInfoData,
    saveGetWalletInfoResponse: saveGetWalletInfoResponseData,
    removeGetWalletInfoResponse: removeGetWalletInfoResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetWalletInfo,
  saveGetWalletInfoResponse,
  removeGetWalletInfoResponse,
} = GetWalletInfoSlice.actions;

const GetWalletInfoSliceReducer = GetWalletInfoSlice.reducer;

const selectGetWalletInfoData = ({GetWalletInfoReducer}) =>
  GetWalletInfoReducer.GetWalletInfoData ?? null;
const selectGetWalletInfoResponse = ({GetWalletInfoReducer}) =>
  GetWalletInfoReducer.GetWalletInfoResponse ?? null;

export {
  GetWalletInfoSliceReducer,
  saveGetWalletInfo,
  saveGetWalletInfoResponse,
  removeGetWalletInfoResponse,
  selectGetWalletInfoData,
  selectGetWalletInfoResponse,
};
