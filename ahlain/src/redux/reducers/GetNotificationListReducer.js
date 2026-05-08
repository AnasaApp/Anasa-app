import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetNotificationListData: null,
  GetNotificationListResponse: null,
};
const saveGetNotificationListData = (state, action) => {
  state.GetNotificationListData = action.payload;
  state.GetNotificationListResponse = null;
};

const saveGetNotificationListResponseData = (state, action) => {
  state.GetNotificationListResponse =
    action.payload || state.GetNotificationListResponse;
};

const removeGetNotificationListResponseData = state => {
  state.GetNotificationListResponse = null;
  state.GetNotificationListData = null;
};

const GetNotificationListSlice = createSlice({
  name: 'GetNotificationList',
  initialState,

  reducers: {
    saveGetNotificationList: saveGetNotificationListData,
    saveGetNotificationListResponse: saveGetNotificationListResponseData,
    removeGetNotificationListResponse: removeGetNotificationListResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetNotificationList,
  saveGetNotificationListResponse,
  removeGetNotificationListResponse,
} = GetNotificationListSlice.actions;

const GetNotificationListSliceReducer = GetNotificationListSlice.reducer;

const selectGetNotificationListData = ({GetNotificationListReducer}) =>
  GetNotificationListReducer.GetNotificationListData ?? null;
const selectGetNotificationListResponse = ({GetNotificationListReducer}) =>
  GetNotificationListReducer.GetNotificationListResponse ?? null;

export {
  GetNotificationListSliceReducer,
  saveGetNotificationList,
  saveGetNotificationListResponse,
  removeGetNotificationListResponse,
  selectGetNotificationListData,
  selectGetNotificationListResponse,
};
