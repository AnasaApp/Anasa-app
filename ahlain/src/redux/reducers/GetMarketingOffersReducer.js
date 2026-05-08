import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetMarketingOffersData: null,
  GetMarketingOffersResponse: null,
};
const saveGetMarketingOffersData = (state, action) => {
  state.GetMarketingOffersData = action.payload;
  state.GetMarketingOffersResponse = null;
};

const saveGetMarketingOffersResponseData = (state, action) => {
  state.GetMarketingOffersResponse =
    action.payload || state.GetMarketingOffersResponse;
};

const removeGetMarketingOffersResponseData = state => {
  state.GetMarketingOffersResponse = null;
  state.GetMarketingOffersData = null;
};

const GetMarketingOffersSlice = createSlice({
  name: 'GetMarketingOffers',
  initialState,

  reducers: {
    saveGetMarketingOffers: saveGetMarketingOffersData,
    saveGetMarketingOffersResponse: saveGetMarketingOffersResponseData,
    removeGetMarketingOffersResponse: removeGetMarketingOffersResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetMarketingOffers,
  saveGetMarketingOffersResponse,
  removeGetMarketingOffersResponse,
} = GetMarketingOffersSlice.actions;

const GetMarketingOffersSliceReducer = GetMarketingOffersSlice.reducer;

const selectGetMarketingOffersData = ({GetMarketingOffersReducer}) =>
  GetMarketingOffersReducer.GetMarketingOffersData ?? null;
const selectGetMarketingOffersResponse = ({GetMarketingOffersReducer}) =>
  GetMarketingOffersReducer.GetMarketingOffersResponse ?? null;

export {
  GetMarketingOffersSliceReducer,
  saveGetMarketingOffers,
  saveGetMarketingOffersResponse,
  removeGetMarketingOffersResponse,
  selectGetMarketingOffersData,
  selectGetMarketingOffersResponse,
};
