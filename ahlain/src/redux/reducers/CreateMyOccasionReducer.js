import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  CreateMyOccasionData: null,
  CreateMyOccasionResponse: null,
};

const saveCreateMyOccasionData = (state, action) => {
  state.CreateMyOccasionData = action.payload;
  state.CreateMyOccasionResponse = null;
};

const saveCreateMyOccasionResponseData = (state, action) => {
  state.CreateMyOccasionResponse =
    action.payload || state.CreateMyOccasionResponse;
};

const removeCreateMyOccasionResponseData = state => {
  state.CreateMyOccasionResponse = null;
  state.CreateMyOccasionData = null;
};

const CreateMyOccasionSlice = createSlice({
  name: 'CreateMyOccasion',
  initialState,
  reducers: {
    saveCreateMyOccasion: saveCreateMyOccasionData,
    saveCreateMyOccasionResponse: saveCreateMyOccasionResponseData,
    removeCreateMyOccasionResponse: removeCreateMyOccasionResponseData,
  },
});

const {
  saveCreateMyOccasion,
  saveCreateMyOccasionResponse,
  removeCreateMyOccasionResponse,
} = CreateMyOccasionSlice.actions;

const CreateMyOccasionSliceReducer = CreateMyOccasionSlice.reducer;

const selectCreateMyOccasionData = ({CreateMyOccasionReducer}) =>
  CreateMyOccasionReducer.CreateMyOccasionData ?? null;
const selectCreateMyOccasionResponse = ({CreateMyOccasionReducer}) =>
  CreateMyOccasionReducer.CreateMyOccasionResponse ?? null;

export {
  CreateMyOccasionSliceReducer,
  saveCreateMyOccasion,
  saveCreateMyOccasionResponse,
  removeCreateMyOccasionResponse,
  selectCreateMyOccasionData,
  selectCreateMyOccasionResponse,
};

