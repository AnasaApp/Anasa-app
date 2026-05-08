import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  SearchSuggestionData: null,
  SearchSuggestionResponse: null,
};
const saveSearchSuggestionData = (state, action) => {
  state.SearchSuggestionData = action.payload;
  state.SearchSuggestionResponse = null;
};

const saveSearchSuggestionResponseData = (state, action) => {
  state.SearchSuggestionResponse =
    action.payload || state.SearchSuggestionResponse;
};

const removeSearchSuggestionResponseData = state => {
  state.SearchSuggestionResponse = null;
  state.SearchSuggestionData = null;
};

const SearchSuggestionSlice = createSlice({
  name: 'SearchSuggestion',
  initialState,

  reducers: {
    saveSearchSuggestion: saveSearchSuggestionData,
    saveSearchSuggestionResponse: saveSearchSuggestionResponseData,
    removeSearchSuggestionResponse: removeSearchSuggestionResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveSearchSuggestion,
  saveSearchSuggestionResponse,
  removeSearchSuggestionResponse,
} = SearchSuggestionSlice.actions;

const SearchSuggestionSliceReducer = SearchSuggestionSlice.reducer;

const selectSearchSuggestionData = ({SearchSuggestionReducer}) =>
  SearchSuggestionReducer.SearchSuggestionData ?? null;
const selectSearchSuggestionResponse = ({SearchSuggestionReducer}) =>
  SearchSuggestionReducer.SearchSuggestionResponse ?? null;

export {
  SearchSuggestionSliceReducer,
  saveSearchSuggestion,
  saveSearchSuggestionResponse,
  removeSearchSuggestionResponse,
  selectSearchSuggestionData,
  selectSearchSuggestionResponse,
};
