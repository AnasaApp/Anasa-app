import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  RemoveCartData: null,
  RemoveCartResponse: null,
};
const saveRemoveCartData = (state, action) => {
  state.RemoveCartData = action.payload;
  state.RemoveCartResponse = null;
};

const saveRemoveCartResponseData = (state, action) => {
  state.RemoveCartResponse = action.payload || state.RemoveCartResponse;
};

const removeRemoveCartResponseData = state => {
  state.RemoveCartResponse = null;
  state.RemoveCartData = null;
};

const RemoveCartSlice = createSlice({
  name: 'RemoveCart',
  initialState,

  reducers: {
    saveRemoveCart: saveRemoveCartData,
    saveRemoveCartResponse: saveRemoveCartResponseData,
    removeRemoveCartResponse: removeRemoveCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveRemoveCart, saveRemoveCartResponse, removeRemoveCartResponse} =
  RemoveCartSlice.actions;

const RemoveCartSliceReducer = RemoveCartSlice.reducer;

const selectRemoveCartData = ({RemoveCartReducer}) =>
  RemoveCartReducer.RemoveCartData ?? null;
const selectRemoveCartResponse = ({RemoveCartReducer}) =>
  RemoveCartReducer.RemoveCartResponse ?? null;

export {
  RemoveCartSliceReducer,
  saveRemoveCart,
  saveRemoveCartResponse,
  removeRemoveCartResponse,
  selectRemoveCartData,
  selectRemoveCartResponse,
};
