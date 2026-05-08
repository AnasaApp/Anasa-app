import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  DeleteAccountData: null,
  DeleteAccountResponse: null,
};
const saveDeleteAccountData = (state, action) => {
  state.DeleteAccountData = action.payload;
  state.DeleteAccountResponse = null;
};

const saveDeleteAccountResponseData = (state, action) => {
  state.DeleteAccountResponse = action.payload || state.DeleteAccountResponse;
};

const removeDeleteAccountResponseData = state => {
  state.DeleteAccountResponse = null;
  state.DeleteAccountData = null;
};

const DeleteAccountSlice = createSlice({
  name: 'DeleteAccount',
  initialState,

  reducers: {
    saveDeleteAccount: saveDeleteAccountData,
    saveDeleteAccountResponse: saveDeleteAccountResponseData,
    removeDeleteAccountResponse: removeDeleteAccountResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveDeleteAccount,
  saveDeleteAccountResponse,
  removeDeleteAccountResponse,
} = DeleteAccountSlice.actions;

const DeleteAccountSliceReducer = DeleteAccountSlice.reducer;

const selectDeleteAccountData = ({DeleteAccountReducer}) =>
  DeleteAccountReducer.DeleteAccountData ?? null;
const selectDeleteAccountResponse = ({DeleteAccountReducer}) =>
  DeleteAccountReducer.DeleteAccountResponse ?? null;

export {
  DeleteAccountSliceReducer,
  saveDeleteAccount,
  saveDeleteAccountResponse,
  removeDeleteAccountResponse,
  selectDeleteAccountData,
  selectDeleteAccountResponse,
};
