import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ChangeLanguageData: null,
  ChangeLanguageResponse: null,
};
const saveChangeLanguageData = (state, action) => {
  state.ChangeLanguageData = action.payload;
  state.ChangeLanguageResponse = null;
};

const saveChangeLanguageResponseData = (state, action) => {
  state.ChangeLanguageResponse = action.payload || state.ChangeLanguageResponse;
};

const removeChangeLanguageResponseData = state => {
  state.ChangeLanguageResponse = null;
  state.ChangeLanguageData = null;
};

const ChangeLanguageSlice = createSlice({
  name: 'ChangeLanguage',
  initialState,

  reducers: {
    saveChangeLanguage: saveChangeLanguageData,
    saveChangeLanguageResponse: saveChangeLanguageResponseData,
    removeChangeLanguageResponse: removeChangeLanguageResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveChangeLanguage,
  saveChangeLanguageResponse,
  removeChangeLanguageResponse,
} = ChangeLanguageSlice.actions;

const ChangeLanguageSliceReducer = ChangeLanguageSlice.reducer;

const selectChangeLanguageData = ({ChangeLanguageReducer}) =>
  ChangeLanguageReducer.ChangeLanguageData ?? null;
const selectChangeLanguageResponse = ({ChangeLanguageReducer}) =>
  ChangeLanguageReducer.ChangeLanguageResponse ?? null;

export {
  ChangeLanguageSliceReducer,
  saveChangeLanguage,
  saveChangeLanguageResponse,
  removeChangeLanguageResponse,
  selectChangeLanguageData,
  selectChangeLanguageResponse,
};
