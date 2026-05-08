import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  UpdateLatLongData: null,
  UpdateLatLongResponse: null,
};
const saveUpdateLatLongData = (state, action) => {
  state.UpdateLatLongData = action.payload;
  state.UpdateLatLongResponse = null;
};

const saveUpdateLatLongResponseData = (state, action) => {
  state.UpdateLatLongResponse = action.payload || state.UpdateLatLongResponse;
};

const removeUpdateLatLongResponseData = state => {
  state.UpdateLatLongResponse = null;
  state.UpdateLatLongData = null;
};

const UpdateLatLongSlice = createSlice({
  name: 'UpdateLatLong',
  initialState,

  reducers: {
    saveUpdateLatLong: saveUpdateLatLongData,
    saveUpdateLatLongResponse: saveUpdateLatLongResponseData,
    removeUpdateLatLongResponse: removeUpdateLatLongResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveUpdateLatLong,
  saveUpdateLatLongResponse,
  removeUpdateLatLongResponse,
} = UpdateLatLongSlice.actions;

const UpdateLatLongSliceReducer = UpdateLatLongSlice.reducer;

const selectUpdateLatLongData = ({UpdateLatLongReducer}) =>
  UpdateLatLongReducer.UpdateLatLongData ?? null;
const selectUpdateLatLongResponse = ({UpdateLatLongReducer}) =>
  UpdateLatLongReducer.UpdateLatLongResponse ?? null;

export {
  UpdateLatLongSliceReducer,
  saveUpdateLatLong,
  saveUpdateLatLongResponse,
  removeUpdateLatLongResponse,
  selectUpdateLatLongData,
  selectUpdateLatLongResponse,
};
