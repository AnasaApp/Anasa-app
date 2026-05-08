import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  PopularCategoriesData: null,
  PopularCategoriesResponse: null,
};
const savePopularCategoriesData = (state, action) => {
  state.PopularCategoriesData = action.payload;
  state.PopularCategoriesResponse = null;
};

const savePopularCategoriesResponseData = (state, action) => {
  state.PopularCategoriesResponse =
    action.payload || state.PopularCategoriesResponse;
};

const removePopularCategoriesResponseData = state => {
  state.PopularCategoriesResponse = null;
  state.PopularCategoriesData = null;
};

const PopularCategoriesSlice = createSlice({
  name: 'PopularCategories',
  initialState,

  reducers: {
    savePopularCategories: savePopularCategoriesData,
    savePopularCategoriesResponse: savePopularCategoriesResponseData,
    removePopularCategoriesResponse: removePopularCategoriesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  savePopularCategories,
  savePopularCategoriesResponse,
  removePopularCategoriesResponse,
} = PopularCategoriesSlice.actions;

const PopularCategoriesSliceReducer = PopularCategoriesSlice.reducer;

const selectPopularCategoriesData = ({PopularCategoriesReducer}) =>
  PopularCategoriesReducer.PopularCategoriesData ?? null;
const selectPopularCategoriesResponse = ({PopularCategoriesReducer}) =>
  PopularCategoriesReducer.PopularCategoriesResponse ?? null;

export {
  PopularCategoriesSliceReducer,
  savePopularCategories,
  savePopularCategoriesResponse,
  removePopularCategoriesResponse,
  selectPopularCategoriesData,
  selectPopularCategoriesResponse,
};
