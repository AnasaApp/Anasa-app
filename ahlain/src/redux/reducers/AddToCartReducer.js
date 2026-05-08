import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  AddToCartData: null,
  AddToCartResponse: null,
};
const saveAddToCartData = (state, action) => {
  state.AddToCartData = action.payload;
  state.AddToCartResponse = null;
};

const saveAddToCartResponseData = (state, action) => {
  state.AddToCartResponse = action.payload || state.AddToCartResponse;
};

const removeAddToCartResponseData = state => {
  state.AddToCartResponse = null;
  state.AddToCartData = null;
};

const AddToCartSlice = createSlice({
  name: 'AddToCart',
  initialState,

  reducers: {
    saveAddToCart: saveAddToCartData,
    saveAddToCartResponse: saveAddToCartResponseData,
    removeAddToCartResponse: removeAddToCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveAddToCart, saveAddToCartResponse, removeAddToCartResponse} =
  AddToCartSlice.actions;

const AddToCartSliceReducer = AddToCartSlice.reducer;

const selectAddToCartData = ({AddToCartReducer}) =>
  AddToCartReducer.AddToCartData ?? null;
const selectAddToCartResponse = ({AddToCartReducer}) =>
  AddToCartReducer.AddToCartResponse ?? null;

export {
  AddToCartSliceReducer,
  saveAddToCart,
  saveAddToCartResponse,
  removeAddToCartResponse,
  selectAddToCartData,
  selectAddToCartResponse,
};
