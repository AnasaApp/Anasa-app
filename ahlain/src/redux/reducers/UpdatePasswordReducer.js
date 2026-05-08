import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  UpdatePasswordData: null,
  UpdatePasswordResponse: null,
};
const saveUpdatePasswordData = (state, action) => {
  state.UpdatePasswordData = action.payload;
  state.UpdatePasswordResponse = null;
};

const saveUpdatePasswordResponseData = (state, action) => {
  state.UpdatePasswordResponse = action.payload || state.UpdatePasswordResponse;
};

const removeUpdatePasswordResponseData = state => {
  state.UpdatePasswordResponse = null;
  state.UpdatePasswordData = null;
};

const UpdatePasswordSlice = createSlice({
  name: 'UpdatePassword',
  initialState,

  reducers: {
    saveUpdatePassword: saveUpdatePasswordData,
    saveUpdatePasswordResponse: saveUpdatePasswordResponseData,
    removeUpdatePasswordResponse: removeUpdatePasswordResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveUpdatePassword,
  saveUpdatePasswordResponse,
  removeUpdatePasswordResponse,
} = UpdatePasswordSlice.actions;

const UpdatePasswordSliceReducer = UpdatePasswordSlice.reducer;

const selectUpdatePasswordData = ({UpdatePasswordReducer}) =>
  UpdatePasswordReducer.UpdatePasswordData ?? null;
const selectUpdatePasswordResponse = ({UpdatePasswordReducer}) =>
  UpdatePasswordReducer.UpdatePasswordResponse ?? null;

export {
  UpdatePasswordSliceReducer,
  saveUpdatePassword,
  saveUpdatePasswordResponse,
  removeUpdatePasswordResponse,
  selectUpdatePasswordData,
  selectUpdatePasswordResponse,
};
