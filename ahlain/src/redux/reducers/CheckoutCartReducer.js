import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CheckoutCartData: null,
  CheckoutCartResponse: null,
};
const saveCheckoutCartData = (state, action) => {
  state.CheckoutCartData = action.payload;
  state.CheckoutCartResponse = null;
};

const saveCheckoutCartResponseData = (state, action) => {
  state.CheckoutCartResponse = action.payload || state.CheckoutCartResponse;
};

const removeCheckoutCartResponseData = state => {
  state.CheckoutCartResponse = null;
  state.CheckoutCartData = null;
};

const CheckoutCartSlice = createSlice({
  name: 'CheckoutCart',
  initialState,

  reducers: {
    saveCheckoutCart: saveCheckoutCartData,
    saveCheckoutCartResponse: saveCheckoutCartResponseData,
    removeCheckoutCartResponse: removeCheckoutCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveCheckoutCart, saveCheckoutCartResponse, removeCheckoutCartResponse} =
  CheckoutCartSlice.actions;

const CheckoutCartSliceReducer = CheckoutCartSlice.reducer;

const selectCheckoutCartData = ({CheckoutCartReducer}) =>
  CheckoutCartReducer.CheckoutCartData ?? null;
const selectCheckoutCartResponse = ({CheckoutCartReducer}) =>
  CheckoutCartReducer.CheckoutCartResponse ?? null;

export {
  CheckoutCartSliceReducer,
  saveCheckoutCart,
  saveCheckoutCartResponse,
  removeCheckoutCartResponse,
  selectCheckoutCartData,
  selectCheckoutCartResponse,
};
