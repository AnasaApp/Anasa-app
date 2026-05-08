import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetTandCData: null,
  GetTandCResponse: null,
};
const saveGetTandCData = (state, action) => {
  state.GetTandCData = action.payload;
  state.GetTandCResponse = null;
};

const saveGetTandCResponseData = (state, action) => {
  state.GetTandCResponse = action.payload || state.GetTandCResponse;
};

const removeGetTandCResponseData = state => {
  state.GetTandCResponse = null;
  state.GetTandCData = null;
};

const GetTandCSlice = createSlice({
  name: 'GetTandC',
  initialState,

  reducers: {
    saveGetTandC: saveGetTandCData,
    saveGetTandCResponse: saveGetTandCResponseData,
    removeGetTandCResponse: removeGetTandCResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetTandC, saveGetTandCResponse, removeGetTandCResponse} =
  GetTandCSlice.actions;

const GetTandCSliceReducer = GetTandCSlice.reducer;

const selectGetTandCData = ({GetTandCReducer}) =>
  GetTandCReducer.GetTandCData ?? null;
const selectGetTandCResponse = ({GetTandCReducer}) =>
  GetTandCReducer.GetTandCResponse ?? null;

export {
  GetTandCSliceReducer,
  saveGetTandC,
  saveGetTandCResponse,
  removeGetTandCResponse,
  selectGetTandCData,
  selectGetTandCResponse,
};
