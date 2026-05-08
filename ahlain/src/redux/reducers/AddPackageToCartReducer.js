import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  AddPacakageToCartData: null,
  AddPacakageToCartResponse: null,
};
const saveAddPacakageToCartData = (state, action) => {
  state.AddPacakageToCartData = action.payload;
  state.AddPacakageToCartResponse = null;
};

const saveAddPacakageToCartResponseData = (state, action) => {
  state.AddPacakageToCartResponse =
    action.payload || state.AddPacakageToCartResponse;
};

const removeAddPacakageToCartResponseData = state => {
  state.AddPacakageToCartResponse = null;
  state.AddPacakageToCartData = null;
};

const AddPacakageToCartSlice = createSlice({
  name: 'AddPacakageToCart',
  initialState,

  reducers: {
    saveAddPacakageToCart: saveAddPacakageToCartData,
    saveAddPacakageToCartResponse: saveAddPacakageToCartResponseData,
    removeAddPacakageToCartResponse: removeAddPacakageToCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveAddPacakageToCart,
  saveAddPacakageToCartResponse,
  removeAddPacakageToCartResponse,
} = AddPacakageToCartSlice.actions;

const AddPacakageToCartSliceReducer = AddPacakageToCartSlice.reducer;

const selectAddPacakageToCartData = ({AddPacakageToCartReducer}) =>
  AddPacakageToCartReducer.AddPacakageToCartData ?? null;
const selectAddPacakageToCartResponse = ({AddPacakageToCartReducer}) =>
  AddPacakageToCartReducer.AddPacakageToCartResponse ?? null;

export {
  AddPacakageToCartSliceReducer,
  saveAddPacakageToCart,
  saveAddPacakageToCartResponse,
  removeAddPacakageToCartResponse,
  selectAddPacakageToCartData,
  selectAddPacakageToCartResponse,
};
