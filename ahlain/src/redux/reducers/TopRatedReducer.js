import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  TopRatedData: null,
  TopRatedResponse: null,
};
const saveTopRatedData = (state, action) => {
  state.TopRatedData = action.payload;
  state.TopRatedResponse = null;
};

const saveTopRatedResponseData = (state, action) => {
  state.TopRatedResponse = action.payload || state.TopRatedResponse;
};

const removeTopRatedResponseData = state => {
  state.TopRatedResponse = null;
  state.TopRatedData = null;
};

const TopRatedSlice = createSlice({
  name: 'TopRated',
  initialState,

  reducers: {
    saveTopRated: saveTopRatedData,
    saveTopRatedResponse: saveTopRatedResponseData,
    removeTopRatedResponse: removeTopRatedResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveTopRated, saveTopRatedResponse, removeTopRatedResponse} =
  TopRatedSlice.actions;

const TopRatedSliceReducer = TopRatedSlice.reducer;

const selectTopRatedData = ({TopRatedReducer}) =>
  TopRatedReducer.TopRatedData ?? null;
const selectTopRatedResponse = ({TopRatedReducer}) =>
  TopRatedReducer.TopRatedResponse ?? null;

export {
  TopRatedSliceReducer,
  saveTopRated,
  saveTopRatedResponse,
  removeTopRatedResponse,
  selectTopRatedData,
  selectTopRatedResponse,
};
