import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CreateServiceEligiblityData: null,
  CreateServiceEligiblityResponse: null,
};
const saveCreateServiceEligiblityData = (state, action) => {
  state.CreateServiceEligiblityData = action.payload;
  state.CreateServiceEligiblityResponse = null;
};

const saveCreateServiceEligiblityResponseData = (state, action) => {
  state.CreateServiceEligiblityResponse =
    action.payload || state.CreateServiceEligiblityResponse;
};

const removeCreateServiceEligiblityResponseData = state => {
  state.CreateServiceEligiblityResponse = null;
  state.CreateServiceEligiblityData = null;
};

const CreateServiceEligiblitySlice = createSlice({
  name: 'CreateServiceEligiblity',
  initialState,

  reducers: {
    saveCreateServiceEligiblity: saveCreateServiceEligiblityData,
    saveCreateServiceEligiblityResponse:
      saveCreateServiceEligiblityResponseData,
    removeCreateServiceEligiblityResponse:
      removeCreateServiceEligiblityResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCreateServiceEligiblity,
  saveCreateServiceEligiblityResponse,
  removeCreateServiceEligiblityResponse,
} = CreateServiceEligiblitySlice.actions;

const CreateServiceEligiblitySliceReducer =
  CreateServiceEligiblitySlice.reducer;

const selectCreateServiceEligiblityData = ({CreateServiceEligiblityReducer}) =>
  CreateServiceEligiblityReducer.CreateServiceEligiblityData ?? null;
const selectCreateServiceEligiblityResponse = ({
  CreateServiceEligiblityReducer,
}) => CreateServiceEligiblityReducer.CreateServiceEligiblityResponse ?? null;

export {
  CreateServiceEligiblitySliceReducer,
  saveCreateServiceEligiblity,
  saveCreateServiceEligiblityResponse,
  removeCreateServiceEligiblityResponse,
  selectCreateServiceEligiblityData,
  selectCreateServiceEligiblityResponse,
};
