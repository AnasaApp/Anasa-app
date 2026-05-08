import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ViewRequestData: null,
  ViewRequestResponse: null,
};
const saveViewRequestData = (state, action) => {
  state.ViewRequestData = action.payload;
  state.ViewRequestResponse = null;
};

const saveViewRequestResponseData = (state, action) => {
  state.ViewRequestResponse = action.payload || state.ViewRequestResponse;
};

const removeViewRequestResponseData = state => {
  state.ViewRequestResponse = null;
  state.ViewRequestData = null;
};

const ViewRequestSlice = createSlice({
  name: 'ViewRequest',
  initialState,

  reducers: {
    saveViewRequest: saveViewRequestData,
    saveViewRequestResponse: saveViewRequestResponseData,
    removeViewRequestResponse: removeViewRequestResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveViewRequest, saveViewRequestResponse, removeViewRequestResponse} =
  ViewRequestSlice.actions;

const ViewRequestSliceReducer = ViewRequestSlice.reducer;

const selectViewRequestData = ({ViewRequestReducer}) =>
  ViewRequestReducer.ViewRequestData ?? null;
const selectViewRequestResponse = ({ViewRequestReducer}) =>
  ViewRequestReducer.ViewRequestResponse ?? null;

export {
  ViewRequestSliceReducer,
  saveViewRequest,
  saveViewRequestResponse,
  removeViewRequestResponse,
  selectViewRequestData,
  selectViewRequestResponse,
};
