import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetRequestData: null,
  GetRequestResponse: null,
};
const saveGetRequestData = (state, action) => {
  state.GetRequestData = action.payload;
  state.GetRequestResponse = null;
};

const saveGetRequestResponseData = (state, action) => {
  state.GetRequestResponse = action.payload || state.GetRequestResponse;
};

const removeGetRequestResponseData = state => {
  state.GetRequestResponse = null;
  state.GetRequestData = null;
};

const GetRequestSlice = createSlice({
  name: 'GetRequest',
  initialState,

  reducers: {
    saveGetRequest: saveGetRequestData,
    saveGetRequestResponse: saveGetRequestResponseData,
    removeGetRequestResponse: removeGetRequestResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveGetRequest, saveGetRequestResponse, removeGetRequestResponse} =
  GetRequestSlice.actions;

const GetRequestSliceReducer = GetRequestSlice.reducer;

const selectGetRequestData = ({GetRequestReducer}) =>
  GetRequestReducer.GetRequestData ?? null;
const selectGetRequestResponse = ({GetRequestReducer}) =>
  GetRequestReducer.GetRequestResponse ?? null;

export {
  GetRequestSliceReducer,
  saveGetRequest,
  saveGetRequestResponse,
  removeGetRequestResponse,
  selectGetRequestData,
  selectGetRequestResponse,
};
