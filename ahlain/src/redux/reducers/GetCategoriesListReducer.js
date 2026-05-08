import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetCategoriesListData: null,
  GetCategoriesListResponse: null,
};
const saveGetCategoriesListData = (state, action) => {
  state.GetCategoriesListData = action.payload;
  state.GetCategoriesListResponse = null;
};

const saveGetCategoriesListResponseData = (state, action) => {
  state.GetCategoriesListResponse =
    action.payload || state.GetCategoriesListResponse;
};

const removeGetCategoriesListResponseData = state => {
  state.GetCategoriesListResponse = null;
  state.GetCategoriesListData = null;
};

const GetCategoriesListSlice = createSlice({
  name: 'GetCategoriesList',
  initialState,

  reducers: {
    saveGetCategoriesList: saveGetCategoriesListData,
    saveGetCategoriesListResponse: saveGetCategoriesListResponseData,
    removeGetCategoriesListResponse: removeGetCategoriesListResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetCategoriesList,
  saveGetCategoriesListResponse,
  removeGetCategoriesListResponse,
} = GetCategoriesListSlice.actions;

const GetCategoriesListSliceReducer = GetCategoriesListSlice.reducer;

const selectGetCategoriesListData = ({GetCategoriesListReducer}) =>
  GetCategoriesListReducer.GetCategoriesListData ?? null;
const selectGetCategoriesListResponse = ({GetCategoriesListReducer}) =>
  GetCategoriesListReducer.GetCategoriesListResponse ?? null;

export {
  GetCategoriesListSliceReducer,
  saveGetCategoriesList,
  saveGetCategoriesListResponse,
  removeGetCategoriesListResponse,
  selectGetCategoriesListData,
  selectGetCategoriesListResponse,
};
