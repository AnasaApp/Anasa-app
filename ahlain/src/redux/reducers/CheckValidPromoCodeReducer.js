import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CheckValidPromoCodeData: null,
  CheckValidPromoCodeResponse: null,
};
const saveCheckValidPromoCodeData = (state, action) => {
  state.CheckValidPromoCodeData = action.payload;
  state.CheckValidPromoCodeResponse = null;
};

const saveCheckValidPromoCodeResponseData = (state, action) => {
  state.CheckValidPromoCodeResponse =
    action.payload || state.CheckValidPromoCodeResponse;
};

const removeCheckValidPromoCodeResponseData = state => {
  state.CheckValidPromoCodeResponse = null;
  state.CheckValidPromoCodeData = null;
};

const CheckValidPromoCodeSlice = createSlice({
  name: 'CheckValidPromoCode',
  initialState,

  reducers: {
    saveCheckValidPromoCode: saveCheckValidPromoCodeData,
    saveCheckValidPromoCodeResponse: saveCheckValidPromoCodeResponseData,
    removeCheckValidPromoCodeResponse: removeCheckValidPromoCodeResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCheckValidPromoCode,
  saveCheckValidPromoCodeResponse,
  removeCheckValidPromoCodeResponse,
} = CheckValidPromoCodeSlice.actions;

const CheckValidPromoCodeSliceReducer = CheckValidPromoCodeSlice.reducer;

const selectCheckValidPromoCodeData = ({CheckValidPromoCodeReducer}) =>
  CheckValidPromoCodeReducer.CheckValidPromoCodeData ?? null;
const selectCheckValidPromoCodeResponse = ({CheckValidPromoCodeReducer}) =>
  CheckValidPromoCodeReducer.CheckValidPromoCodeResponse ?? null;

export {
  CheckValidPromoCodeSliceReducer,
  saveCheckValidPromoCode,
  saveCheckValidPromoCodeResponse,
  removeCheckValidPromoCodeResponse,
  selectCheckValidPromoCodeData,
  selectCheckValidPromoCodeResponse,
};
