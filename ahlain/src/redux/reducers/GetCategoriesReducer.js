import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetCategoriesData: null,
  GetCategoriesResponse: null,
};
const saveGetCategoriesData = (state, action) => {
  state.GetCategoriesData = action.payload;
  state.GetCategoriesResponse = null;
};

const saveGetCategoriesResponseData = (state, action) => {
  state.GetCategoriesResponse = action.payload || state.GetCategoriesResponse;
};

const removeGetCategoriesResponseData = state => {
  state.GetCategoriesResponse = null;
  state.GetCategoriesData = null;
};

const GetCategoriesSlice = createSlice({
  name: 'GetCategories',
  initialState,

  reducers: {
    saveGetCategories: saveGetCategoriesData,
    saveGetCategoriesResponse: saveGetCategoriesResponseData,
    removeGetCategoriesResponse: removeGetCategoriesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetCategories,
  saveGetCategoriesResponse,
  removeGetCategoriesResponse,
} = GetCategoriesSlice.actions;

const GetCategoriesSliceReducer = GetCategoriesSlice.reducer;

const selectGetCategoriesData = ({GetCategoriesReducer}) =>
  GetCategoriesReducer.GetCategoriesData ?? null;
const selectGetCategoriesResponse = ({GetCategoriesReducer}) =>
  GetCategoriesReducer.GetCategoriesResponse ?? null;

export {
  GetCategoriesSliceReducer,
  saveGetCategories,
  saveGetCategoriesResponse,
  removeGetCategoriesResponse,
  selectGetCategoriesData,
  selectGetCategoriesResponse,
};
