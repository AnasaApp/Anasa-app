import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CreateRequestData: null,
  CreateRequestResponse: null,
};
const saveCreateRequestData = (state, action) => {
  state.CreateRequestData = action.payload;
  state.CreateRequestResponse = null;
};

const saveCreateRequestResponseData = (state, action) => {
  state.CreateRequestResponse = action.payload || state.CreateRequestResponse;
};

const removeCreateRequestResponseData = state => {
  state.CreateRequestResponse = null;
  state.CreateRequestData = null;
};

const CreateRequestSlice = createSlice({
  name: 'CreateRequest',
  initialState,

  reducers: {
    saveCreateRequest: saveCreateRequestData,
    saveCreateRequestResponse: saveCreateRequestResponseData,
    removeCreateRequestResponse: removeCreateRequestResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCreateRequest,
  saveCreateRequestResponse,
  removeCreateRequestResponse,
} = CreateRequestSlice.actions;

const CreateRequestSliceReducer = CreateRequestSlice.reducer;

const selectCreateRequestData = ({CreateRequestReducer}) =>
  CreateRequestReducer.CreateRequestData ?? null;
const selectCreateRequestResponse = ({CreateRequestReducer}) =>
  CreateRequestReducer.CreateRequestResponse ?? null;

export {
  CreateRequestSliceReducer,
  saveCreateRequest,
  saveCreateRequestResponse,
  removeCreateRequestResponse,
  selectCreateRequestData,
  selectCreateRequestResponse,
};
