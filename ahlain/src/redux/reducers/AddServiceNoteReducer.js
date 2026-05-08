import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  AddServiceNoteData: null,
  AddServiceNoteResponse: null,
};
const saveAddServiceNoteData = (state, action) => {
  state.AddServiceNoteData = action.payload;
  state.AddServiceNoteResponse = null;
};

const saveAddServiceNoteResponseData = (state, action) => {
  state.AddServiceNoteResponse = action.payload || state.AddServiceNoteResponse;
};

const removeAddServiceNoteResponseData = state => {
  state.AddServiceNoteResponse = null;
  state.AddServiceNoteData = null;
};

const AddServiceNoteSlice = createSlice({
  name: 'AddServiceNote',
  initialState,

  reducers: {
    saveAddServiceNote: saveAddServiceNoteData,
    saveAddServiceNoteResponse: saveAddServiceNoteResponseData,
    removeAddServiceNoteResponse: removeAddServiceNoteResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveAddServiceNote,
  saveAddServiceNoteResponse,
  removeAddServiceNoteResponse,
} = AddServiceNoteSlice.actions;

const AddServiceNoteSliceReducer = AddServiceNoteSlice.reducer;

const selectAddServiceNoteData = ({AddServiceNoteReducer}) =>
  AddServiceNoteReducer.AddServiceNoteData ?? null;
const selectAddServiceNoteResponse = ({AddServiceNoteReducer}) =>
  AddServiceNoteReducer.AddServiceNoteResponse ?? null;

export {
  AddServiceNoteSliceReducer,
  saveAddServiceNote,
  saveAddServiceNoteResponse,
  removeAddServiceNoteResponse,
  selectAddServiceNoteData,
  selectAddServiceNoteResponse,
};
