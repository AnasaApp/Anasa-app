import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  DeletePartyData: null,
  DeletePartyResponse: null,
};
const saveDeletePartyData = (state, action) => {
  state.DeletePartyData = action.payload;
  state.DeletePartyResponse = null;
};

const saveDeletePartyResponseData = (state, action) => {
  state.DeletePartyResponse = action.payload || state.DeletePartyResponse;
};

const removeDeletePartyResponseData = state => {
  state.DeletePartyResponse = null;
  state.DeletePartyData = null;
};

const DeletePartySlice = createSlice({
  name: 'DeleteParty',
  initialState,
  reducers: {
    saveDeleteParty: saveDeletePartyData,
    saveDeletePartyResponse: saveDeletePartyResponseData,
    removeDeletePartyResponse: removeDeletePartyResponseData,
  },
});

const {
  saveDeleteParty,
  saveDeletePartyResponse,
  removeDeletePartyResponse,
} = DeletePartySlice.actions;

const DeletePartySliceReducer = DeletePartySlice.reducer;

const selectDeletePartyData = ({DeletePartyReducer}) =>
  DeletePartyReducer.DeletePartyData ?? null;
const selectDeletePartyResponse = ({DeletePartyReducer}) =>
  DeletePartyReducer.DeletePartyResponse ?? null;

export {
  DeletePartySliceReducer,
  saveDeleteParty,
  saveDeletePartyResponse,
  removeDeletePartyResponse,
  selectDeletePartyData,
  selectDeletePartyResponse,
};
