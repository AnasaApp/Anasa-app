import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ReplySupportData: null,
  ReplySupportResponse: null,
};
const saveReplySupportData = (state, action) => {
  state.ReplySupportData = action.payload;
  state.ReplySupportResponse = null;
};

const saveReplySupportResponseData = (state, action) => {
  state.ReplySupportResponse = action.payload || state.ReplySupportResponse;
};

const removeReplySupportResponseData = state => {
  state.ReplySupportResponse = null;
  state.ReplySupportData = null;
};

const ReplySupportSlice = createSlice({
  name: 'ReplySupport',
  initialState,

  reducers: {
    saveReplySupport: saveReplySupportData,
    saveReplySupportResponse: saveReplySupportResponseData,
    removeReplySupportResponse: removeReplySupportResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveReplySupport, saveReplySupportResponse, removeReplySupportResponse} =
  ReplySupportSlice.actions;

const ReplySupportSliceReducer = ReplySupportSlice.reducer;

const selectReplySupportData = ({ReplySupportReducer}) =>
  ReplySupportReducer.ReplySupportData ?? null;
const selectReplySupportResponse = ({ReplySupportReducer}) =>
  ReplySupportReducer.ReplySupportResponse ?? null;

export {
  ReplySupportSliceReducer,
  saveReplySupport,
  saveReplySupportResponse,
  removeReplySupportResponse,
  selectReplySupportData,
  selectReplySupportResponse,
};
