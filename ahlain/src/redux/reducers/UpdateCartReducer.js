import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  UpdateCartData: null,
  UpdateCartResponse: null,
};
const saveUpdateCartData = (state, action) => {
  state.UpdateCartData = action.payload;
  state.UpdateCartResponse = null;
};

const saveUpdateCartResponseData = (state, action) => {
  state.UpdateCartResponse = action.payload || state.UpdateCartResponse;
};

const removeUpdateCartResponseData = state => {
  state.UpdateCartResponse = null;
  state.UpdateCartData = null;
};

const UpdateCartSlice = createSlice({
  name: 'UpdateCart',
  initialState,

  reducers: {
    saveUpdateCart: saveUpdateCartData,
    saveUpdateCartResponse: saveUpdateCartResponseData,
    removeUpdateCartResponse: removeUpdateCartResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveUpdateCart, saveUpdateCartResponse, removeUpdateCartResponse} =
  UpdateCartSlice.actions;

const UpdateCartSliceReducer = UpdateCartSlice.reducer;

const selectUpdateCartData = ({UpdateCartReducer}) =>
  UpdateCartReducer.UpdateCartData ?? null;
const selectUpdateCartResponse = ({UpdateCartReducer}) =>
  UpdateCartReducer.UpdateCartResponse ?? null;

export {
  UpdateCartSliceReducer,
  saveUpdateCart,
  saveUpdateCartResponse,
  removeUpdateCartResponse,
  selectUpdateCartData,
  selectUpdateCartResponse,
};
