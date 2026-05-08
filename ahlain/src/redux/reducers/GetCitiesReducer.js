import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetCitiesData: null,
  GetCitiesResponse: null,
};
const saveGetCitiesData = (state, action) => {
  state.GetCitiesData = action.payload;
  state.GetCitiesResponse = null;
};

const saveGetCitiesResponseData = (state, action) => {
  state.GetCitiesResponse = action.payload || state.GetCitiesResponse;
};

const removeGetCitiesResponseData = state => {
  state.GetCitiesResponse = null;
  state.GetCitiesData = null;
};

const GetCitiesSlice = createSlice({
  name: 'GetCities',
  initialState,

  reducers: {
    saveGetCities: saveGetCitiesData,
    saveGetCitiesResponse: saveGetCitiesResponseData,
    removeGetCitiesResponse: removeGetCitiesResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetCities, saveGetCitiesResponse, removeGetCitiesResponse} =
  GetCitiesSlice.actions;

const GetCitiesSliceReducer = GetCitiesSlice.reducer;

const selectGetCitiesData = ({GetCitiesReducer}) =>
  GetCitiesReducer.GetCitiesData ?? null;
const selectGetCitiesResponse = ({GetCitiesReducer}) =>
  GetCitiesReducer.GetCitiesResponse ?? null;

export {
  GetCitiesSliceReducer,
  saveGetCities,
  saveGetCitiesResponse,
  removeGetCitiesResponse,
  selectGetCitiesData,
  selectGetCitiesResponse,
};
