import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  DeleteNotificationData: null,
  DeleteNotificationResponse: null,
};
const saveDeleteNotificationData = (state, action) => {
  state.DeleteNotificationData = action.payload;
  state.DeleteNotificationResponse = null;
};

const saveDeleteNotificationResponseData = (state, action) => {
  state.DeleteNotificationResponse =
    action.payload || state.DeleteNotificationResponse;
};

const removeDeleteNotificationResponseData = state => {
  state.DeleteNotificationResponse = null;
  state.DeleteNotificationData = null;
};

const DeleteNotificationSlice = createSlice({
  name: 'DeleteNotification',
  initialState,

  reducers: {
    saveDeleteNotification: saveDeleteNotificationData,
    saveDeleteNotificationResponse: saveDeleteNotificationResponseData,
    removeDeleteNotificationResponse: removeDeleteNotificationResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveDeleteNotification,
  saveDeleteNotificationResponse,
  removeDeleteNotificationResponse,
} = DeleteNotificationSlice.actions;

const DeleteNotificationSliceReducer = DeleteNotificationSlice.reducer;

const selectDeleteNotificationData = ({DeleteNotificationReducer}) =>
  DeleteNotificationReducer.DeleteNotificationData ?? null;
const selectDeleteNotificationResponse = ({DeleteNotificationReducer}) =>
  DeleteNotificationReducer.DeleteNotificationResponse ?? null;

export {
  DeleteNotificationSliceReducer,
  saveDeleteNotification,
  saveDeleteNotificationResponse,
  removeDeleteNotificationResponse,
  selectDeleteNotificationData,
  selectDeleteNotificationResponse,
};
