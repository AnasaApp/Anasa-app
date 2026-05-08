import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetMyCartData: null,
  GetMyCartResponse: null,
};
const saveGetMyCartData = (state, action) => {
  state.GetMyCartData = action.payload;
  state.GetMyCartResponse = null;
};

const saveGetMyCartResponseData = (state, action) => {
  state.GetMyCartResponse = action.payload || state.GetMyCartResponse;
};

const removeGetMyCartResponseData = state => {
  state.GetMyCartResponse = null;
  state.GetMyCartData = null;
};

const GetMyCartSlice = createSlice({
  name: 'GetMyCart',
  initialState,

  reducers: {
    saveGetMyCart: saveGetMyCartData,
    saveGetMyCartResponse: saveGetMyCartResponseData,
    removeGetMyCartResponse: removeGetMyCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetMyCart, saveGetMyCartResponse, removeGetMyCartResponse} =
  GetMyCartSlice.actions;

const GetMyCartSliceReducer = GetMyCartSlice.reducer;

const selectGetMyCartData = ({GetMyCartReducer}) =>
  GetMyCartReducer.GetMyCartData ?? null;
const selectGetMyCartResponse = ({GetMyCartReducer}) =>
  GetMyCartReducer.GetMyCartResponse ?? null;

export {
  GetMyCartSliceReducer,
  saveGetMyCart,
  saveGetMyCartResponse,
  removeGetMyCartResponse,
  selectGetMyCartData,
  selectGetMyCartResponse,
};
