import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  ChangePasswordData: null,
  ChangePasswordResponse: null,
};
const saveChangePasswordData = (state, action) => {
  state.ChangePasswordData = action.payload;
  state.ChangePasswordResponse = null;
};

const saveChangePasswordResponseData = (state, action) => {
  state.ChangePasswordResponse = action.payload || state.ChangePasswordResponse;
};

const removeChangePasswordResponseData = state => {
  state.ChangePasswordResponse = null;
  state.ChangePasswordData = null;
};

const ChangePasswordSlice = createSlice({
  name: 'ChangePassword',
  initialState,

  reducers: {
    saveChangePassword: saveChangePasswordData,
    saveChangePasswordResponse: saveChangePasswordResponseData,
    removeChangePasswordResponse: removeChangePasswordResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveChangePassword,
  saveChangePasswordResponse,
  removeChangePasswordResponse,
} = ChangePasswordSlice.actions;

const ChangePasswordSliceReducer = ChangePasswordSlice.reducer;

const selectChangePasswordData = ({ChangePasswordReducer}) =>
  ChangePasswordReducer.ChangePasswordData ?? null;
const selectChangePasswordResponse = ({ChangePasswordReducer}) =>
  ChangePasswordReducer.ChangePasswordResponse ?? null;

export {
  ChangePasswordSliceReducer,
  saveChangePassword,
  saveChangePasswordResponse,
  removeChangePasswordResponse,
  selectChangePasswordData,
  selectChangePasswordResponse,
};
