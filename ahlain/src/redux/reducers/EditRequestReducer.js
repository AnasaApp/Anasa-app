import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  EditRequestData: null,
  EditRequestResponse: null,
};
const saveEditRequestData = (state, action) => {
  state.EditRequestData = action.payload;
  state.EditRequestResponse = null;
};

const saveEditRequestResponseData = (state, action) => {
  state.EditRequestResponse = action.payload || state.EditRequestResponse;
};

const removeEditRequestResponseData = state => {
  state.EditRequestResponse = null;
  state.EditRequestData = null;
};

const EditRequestSlice = createSlice({
  name: 'EditRequest',
  initialState,

  reducers: {
    saveEditRequest: saveEditRequestData,
    saveEditRequestResponse: saveEditRequestResponseData,
    removeEditRequestResponse: removeEditRequestResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveEditRequest, saveEditRequestResponse, removeEditRequestResponse} =
  EditRequestSlice.actions;

const EditRequestSliceReducer = EditRequestSlice.reducer;

const selectEditRequestData = ({EditRequestReducer}) =>
  EditRequestReducer.EditRequestData ?? null;
const selectEditRequestResponse = ({EditRequestReducer}) =>
  EditRequestReducer.EditRequestResponse ?? null;

export {
  EditRequestSliceReducer,
  saveEditRequest,
  saveEditRequestResponse,
  removeEditRequestResponse,
  selectEditRequestData,
  selectEditRequestResponse,
};
