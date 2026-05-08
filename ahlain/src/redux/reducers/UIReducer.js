import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  /* is loading default value */
  isLoading: false,
  /* is internet connected default value */
  isInternetConnected: false,
};

/**
 * Show/Hide loader reducer handler
 * @param {Object} state - redux state
 * @param {Object} action - type and payload
 */
const showLoaderReducer = (state, action) => {
  state.isLoading = action.payload;
};

/**
 * internet connectivity reducer handler
 * @param {Object} state - redux state
 * @param {Object} action - type and payload
 */
const changeInternetConnectivityStateReducer = (state, action) => {
  state.isInternetConnected = action.payload;
};


// REDUCER
const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    showLoader: showLoaderReducer,
    changeInternetConnectivityState: changeInternetConnectivityStateReducer,
  },
});

// ACTIONS
const { showLoader, changeInternetConnectivityState } = uiSlice.actions;

// SELECTOR
const selectLoader = ({ UIReducer }) => UIReducer?.isLoading ?? false;
const selectInternetConnectivity = ({ UIReducer }) => UIReducer?.isInternetConnected ?? false;

const uiSliceReducer = uiSlice.reducer;

export {
  showLoader,
  changeInternetConnectivityState,
  selectLoader,
  selectInternetConnectivity,
  uiSliceReducer,
};
