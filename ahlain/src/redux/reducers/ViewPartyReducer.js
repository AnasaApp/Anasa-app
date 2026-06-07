import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  ViewPartyData: null,
  ViewPartyResponse: null,
};

const saveViewPartyData = (state, action) => {
  state.ViewPartyData = action.payload;
  state.ViewPartyResponse = null;
};

const saveViewPartyResponseData = (state, action) => {
  state.ViewPartyResponse = action.payload || state.ViewPartyResponse;
};

const removeViewPartyResponseData = state => {
  state.ViewPartyResponse = null;
  state.ViewPartyData = null;
};

const ViewPartySlice = createSlice({
  name: 'ViewParty',
  initialState,
  reducers: {
    saveViewParty: saveViewPartyData,
    saveViewPartyResponse: saveViewPartyResponseData,
    removeViewPartyResponse: removeViewPartyResponseData,
  },
});

const {saveViewParty, saveViewPartyResponse, removeViewPartyResponse} =
  ViewPartySlice.actions;

const ViewPartySliceReducer = ViewPartySlice.reducer;

const selectViewPartyData = ({ViewPartyReducer}) =>
  ViewPartyReducer.ViewPartyData ?? null;
const selectViewPartyResponse = ({ViewPartyReducer}) =>
  ViewPartyReducer.ViewPartyResponse ?? null;

export {
  ViewPartySliceReducer,
  saveViewParty,
  saveViewPartyResponse,
  removeViewPartyResponse,
  selectViewPartyData,
  selectViewPartyResponse,
};
