import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetSupportData: null,
  GetSupportResponse: null,
};
const saveGetSupportData = (state, action) => {
  state.GetSupportData = action.payload;
  state.GetSupportResponse = null;
};

const saveGetSupportResponseData = (state, action) => {
  state.GetSupportResponse = action.payload || state.GetSupportResponse;
};

const removeGetSupportResponseData = state => {
  state.GetSupportResponse = null;
  state.GetSupportData = null;
};

const GetSupportSlice = createSlice({
  name: 'GetSupport',
  initialState,

  reducers: {
    saveGetSupport: saveGetSupportData,
    saveGetSupportResponse: saveGetSupportResponseData,
    removeGetSupportResponse: removeGetSupportResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetSupport, saveGetSupportResponse, removeGetSupportResponse} =
  GetSupportSlice.actions;

const GetSupportSliceReducer = GetSupportSlice.reducer;

const selectGetSupportData = ({GetSupportReducer}) =>
  GetSupportReducer.GetSupportData ?? null;
const selectGetSupportResponse = ({GetSupportReducer}) =>
  GetSupportReducer.GetSupportResponse ?? null;

export {
  GetSupportSliceReducer,
  saveGetSupport,
  saveGetSupportResponse,
  removeGetSupportResponse,
  selectGetSupportData,
  selectGetSupportResponse,
};
