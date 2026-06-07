import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  GetPartyTypesData: null,
  GetPartyTypesResponse: null,
};

const saveGetPartyTypesData = (state, action) => {
  state.GetPartyTypesData = action.payload;
  state.GetPartyTypesResponse = null;
};

const saveGetPartyTypesResponseData = (state, action) => {
  state.GetPartyTypesResponse =
    action.payload || state.GetPartyTypesResponse;
};

const removeGetPartyTypesResponseData = state => {
  state.GetPartyTypesResponse = null;
  state.GetPartyTypesData = null;
};

const GetPartyTypesSlice = createSlice({
  name: 'GetPartyTypes',
  initialState,
  reducers: {
    saveGetPartyTypes: saveGetPartyTypesData,
    saveGetPartyTypesResponse: saveGetPartyTypesResponseData,
    removeGetPartyTypesResponse: removeGetPartyTypesResponseData,
  },
});

const {
  saveGetPartyTypes,
  saveGetPartyTypesResponse,
  removeGetPartyTypesResponse,
} = GetPartyTypesSlice.actions;

const GetPartyTypesSliceReducer = GetPartyTypesSlice.reducer;

const selectGetPartyTypesData = ({GetPartyTypesReducer}) =>
  GetPartyTypesReducer.GetPartyTypesData ?? null;
const selectGetPartyTypesResponse = ({GetPartyTypesReducer}) =>
  GetPartyTypesReducer.GetPartyTypesResponse ?? null;

export {
  GetPartyTypesSliceReducer,
  saveGetPartyTypes,
  saveGetPartyTypesResponse,
  removeGetPartyTypesResponse,
  selectGetPartyTypesData,
  selectGetPartyTypesResponse,
};
