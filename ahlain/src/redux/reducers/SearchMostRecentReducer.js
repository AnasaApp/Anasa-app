import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SearchMostRecentData: null,
  SearchMostRecentResponse: null,
};
const saveSearchMostRecentData = (state, action) => {
  state.SearchMostRecentData = action.payload;
  state.SearchMostRecentResponse = null;
};

const saveSearchMostRecentResponseData = (state, action) => {
  state.SearchMostRecentResponse =
    action.payload || state.SearchMostRecentResponse;
};

const removeSearchMostRecentResponseData = state => {
  state.SearchMostRecentResponse = null;
  state.SearchMostRecentData = null;
};

const SearchMostRecentSlice = createSlice({
  name: 'SearchMostRecent',
  initialState,

  reducers: {
    saveSearchMostRecent: saveSearchMostRecentData,
    saveSearchMostRecentResponse: saveSearchMostRecentResponseData,
    removeSearchMostRecentResponse: removeSearchMostRecentResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveSearchMostRecent,
  saveSearchMostRecentResponse,
  removeSearchMostRecentResponse,
} = SearchMostRecentSlice.actions;

const SearchMostRecentSliceReducer = SearchMostRecentSlice.reducer;

const selectSearchMostRecentData = ({SearchMostRecentReducer}) =>
  SearchMostRecentReducer.SearchMostRecentData ?? null;
const selectSearchMostRecentResponse = ({SearchMostRecentReducer}) =>
  SearchMostRecentReducer.SearchMostRecentResponse ?? null;

export {
  SearchMostRecentSliceReducer,
  saveSearchMostRecent,
  saveSearchMostRecentResponse,
  removeSearchMostRecentResponse,
  selectSearchMostRecentData,
  selectSearchMostRecentResponse,
};
