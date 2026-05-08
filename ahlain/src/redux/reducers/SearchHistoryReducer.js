import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SearchHistoryData: null,
  SearchHistoryResponse: null,
};
const saveSearchHistoryData = (state, action) => {
  state.SearchHistoryData = action.payload;
  state.SearchHistoryResponse = null;
};

const saveSearchHistoryResponseData = (state, action) => {
  state.SearchHistoryResponse = action.payload || state.SearchHistoryResponse;
};

const removeSearchHistoryResponseData = state => {
  state.SearchHistoryResponse = null;
  state.SearchHistoryData = null;
};

const SearchHistorySlice = createSlice({
  name: 'SearchHistory',
  initialState,

  reducers: {
    saveSearchHistory: saveSearchHistoryData,
    saveSearchHistoryResponse: saveSearchHistoryResponseData,
    removeSearchHistoryResponse: removeSearchHistoryResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveSearchHistory,
  saveSearchHistoryResponse,
  removeSearchHistoryResponse,
} = SearchHistorySlice.actions;

const SearchHistorySliceReducer = SearchHistorySlice.reducer;

const selectSearchHistoryData = ({SearchHistoryReducer}) =>
  SearchHistoryReducer.SearchHistoryData ?? null;
const selectSearchHistoryResponse = ({SearchHistoryReducer}) =>
  SearchHistoryReducer.SearchHistoryResponse ?? null;

export {
  SearchHistorySliceReducer,
  saveSearchHistory,
  saveSearchHistoryResponse,
  removeSearchHistoryResponse,
  selectSearchHistoryData,
  selectSearchHistoryResponse,
};
