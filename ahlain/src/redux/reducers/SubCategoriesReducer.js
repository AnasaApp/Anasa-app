import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SubCategoriesData: null,
  SubCategoriesResponse: null,
};
const saveSubCategoriesData = (state, action) => {
  state.SubCategoriesData = action.payload;
  state.SubCategoriesResponse = null;
};

const saveSubCategoriesResponseData = (state, action) => {
  state.SubCategoriesResponse = action.payload || state.SubCategoriesResponse;
};

const removeSubCategoriesResponseData = state => {
  state.SubCategoriesResponse = null;
  state.SubCategoriesData = null;
};

const SubCategoriesSlice = createSlice({
  name: 'SubCategories',
  initialState,

  reducers: {
    saveSubCategories: saveSubCategoriesData,
    saveSubCategoriesResponse: saveSubCategoriesResponseData,
    removeSubCategoriesResponse: removeSubCategoriesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveSubCategories,
  saveSubCategoriesResponse,
  removeSubCategoriesResponse,
} = SubCategoriesSlice.actions;

const SubCategoriesSliceReducer = SubCategoriesSlice.reducer;

const selectSubCategoriesData = ({SubCategoriesReducer}) =>
  SubCategoriesReducer.SubCategoriesData ?? null;
const selectSubCategoriesResponse = ({SubCategoriesReducer}) =>
  SubCategoriesReducer.SubCategoriesResponse ?? null;

export {
  SubCategoriesSliceReducer,
  saveSubCategories,
  saveSubCategoriesResponse,
  removeSubCategoriesResponse,
  selectSubCategoriesData,
  selectSubCategoriesResponse,
};
