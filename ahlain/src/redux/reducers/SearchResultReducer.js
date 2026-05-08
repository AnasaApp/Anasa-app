import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SearchResultData: null,
  SearchResultResponse: null,
};
const saveSearchResultData = (state, action) => {
  state.SearchResultData = action.payload;
  state.SearchResultResponse = null;
};

const saveSearchResultResponseData = (state, action) => {
  state.SearchResultResponse = action.payload || state.SearchResultResponse;
};

const removeSearchResultResponseData = state => {
  state.SearchResultResponse = null;
  state.SearchResultData = null;
};

const SearchResultSlice = createSlice({
  name: 'SearchResult',
  initialState,

  reducers: {
    saveSearchResult: saveSearchResultData,
    saveSearchResultResponse: saveSearchResultResponseData,
    removeSearchResultResponse: removeSearchResultResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveSearchResult, saveSearchResultResponse, removeSearchResultResponse} =
  SearchResultSlice.actions;

const SearchResultSliceReducer = SearchResultSlice.reducer;

const selectSearchResultData = ({SearchResultReducer}) =>
  SearchResultReducer.SearchResultData ?? null;
const selectSearchResultResponse = ({SearchResultReducer}) =>
  SearchResultReducer.SearchResultResponse ?? null;

export {
  SearchResultSliceReducer,
  saveSearchResult,
  saveSearchResultResponse,
  removeSearchResultResponse,
  selectSearchResultData,
  selectSearchResultResponse,
};
