import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  DeleteAllNotificationData: null,
  DeleteAllNotificationResponse: null,
};
const saveDeleteAllNotificationData = (state, action) => {
  state.DeleteAllNotificationData = action.payload;
  state.DeleteAllNotificationResponse = null;
};

const saveDeleteAllNotificationResponseData = (state, action) => {
  state.DeleteAllNotificationResponse =
    action.payload || state.DeleteAllNotificationResponse;
};

const removeDeleteAllNotificationResponseData = state => {
  state.DeleteAllNotificationResponse = null;
  state.DeleteAllNotificationData = null;
};

const DeleteAllNotificationSlice = createSlice({
  name: 'DeleteAllNotification',
  initialState,

  reducers: {
    saveDeleteAllNotification: saveDeleteAllNotificationData,
    saveDeleteAllNotificationResponse: saveDeleteAllNotificationResponseData,
    removeDeleteAllNotificationResponse:
      removeDeleteAllNotificationResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveDeleteAllNotification,
  saveDeleteAllNotificationResponse,
  removeDeleteAllNotificationResponse,
} = DeleteAllNotificationSlice.actions;

const DeleteAllNotificationSliceReducer = DeleteAllNotificationSlice.reducer;

const selectDeleteAllNotificationData = ({DeleteAllNotificationReducer}) =>
  DeleteAllNotificationReducer.DeleteAllNotificationData ?? null;
const selectDeleteAllNotificationResponse = ({DeleteAllNotificationReducer}) =>
  DeleteAllNotificationReducer.DeleteAllNotificationResponse ?? null;

export {
  DeleteAllNotificationSliceReducer,
  saveDeleteAllNotification,
  saveDeleteAllNotificationResponse,
  removeDeleteAllNotificationResponse,
  selectDeleteAllNotificationData,
  selectDeleteAllNotificationResponse,
};
