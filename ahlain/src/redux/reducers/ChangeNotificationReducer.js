import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ChangeNotificationData: null,
  ChangeNotificationResponse: null,
};
const saveChangeNotificationData = (state, action) => {
  state.ChangeNotificationData = action.payload;
  state.ChangeNotificationResponse = null;
};

const saveChangeNotificationResponseData = (state, action) => {
  state.ChangeNotificationResponse =
    action.payload || state.ChangeNotificationResponse;
};

const removeChangeNotificationResponseData = state => {
  state.ChangeNotificationResponse = null;
  state.ChangeNotificationData = null;
};

const ChangeNotificationSlice = createSlice({
  name: 'ChangeNotification',
  initialState,

  reducers: {
    saveChangeNotification: saveChangeNotificationData,
    saveChangeNotificationResponse: saveChangeNotificationResponseData,
    removeChangeNotificationResponse: removeChangeNotificationResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveChangeNotification,
  saveChangeNotificationResponse,
  removeChangeNotificationResponse,
} = ChangeNotificationSlice.actions;

const ChangeNotificationSliceReducer = ChangeNotificationSlice.reducer;

const selectChangeNotificationData = ({ChangeNotificationReducer}) =>
  ChangeNotificationReducer.ChangeNotificationData ?? null;
const selectChangeNotificationResponse = ({ChangeNotificationReducer}) =>
  ChangeNotificationReducer.ChangeNotificationResponse ?? null;

export {
  ChangeNotificationSliceReducer,
  saveChangeNotification,
  saveChangeNotificationResponse,
  removeChangeNotificationResponse,
  selectChangeNotificationData,
  selectChangeNotificationResponse,
};
