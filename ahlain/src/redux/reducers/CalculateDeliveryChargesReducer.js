import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CalculateDeliveryChargesData: null,
  CalculateDeliveryChargesResponse: null,
};
const saveCalculateDeliveryChargesData = (state, action) => {
  state.CalculateDeliveryChargesData = action.payload;
  state.CalculateDeliveryChargesResponse = null;
};

const saveCalculateDeliveryChargesResponseData = (state, action) => {
  state.CalculateDeliveryChargesResponse =
    action.payload || state.CalculateDeliveryChargesResponse;
};

const removeCalculateDeliveryChargesResponseData = state => {
  state.CalculateDeliveryChargesResponse = null;
  state.CalculateDeliveryChargesData = null;
};

const CalculateDeliveryChargesSlice = createSlice({
  name: 'CalculateDeliveryCharges',
  initialState,

  reducers: {
    saveCalculateDeliveryCharges: saveCalculateDeliveryChargesData,
    saveCalculateDeliveryChargesResponse:
      saveCalculateDeliveryChargesResponseData,
    removeCalculateDeliveryChargesResponse:
      removeCalculateDeliveryChargesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCalculateDeliveryCharges,
  saveCalculateDeliveryChargesResponse,
  removeCalculateDeliveryChargesResponse,
} = CalculateDeliveryChargesSlice.actions;

const CalculateDeliveryChargesSliceReducer =
  CalculateDeliveryChargesSlice.reducer;

const selectCalculateDeliveryChargesData = ({
  CalculateDeliveryChargesReducer,
}) => CalculateDeliveryChargesReducer.CalculateDeliveryChargesData ?? null;
const selectCalculateDeliveryChargesResponse = ({
  CalculateDeliveryChargesReducer,
}) => CalculateDeliveryChargesReducer.CalculateDeliveryChargesResponse ?? null;

export {
  CalculateDeliveryChargesSliceReducer,
  saveCalculateDeliveryCharges,
  saveCalculateDeliveryChargesResponse,
  removeCalculateDeliveryChargesResponse,
  selectCalculateDeliveryChargesData,
  selectCalculateDeliveryChargesResponse,
};
