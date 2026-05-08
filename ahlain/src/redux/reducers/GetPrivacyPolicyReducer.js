import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  GetPrivacyPolicyData: null,
  GetPrivacyPolicyResponse: null,
};
const saveGetPrivacyPolicyData = (state, action) => {
  state.GetPrivacyPolicyData = action.payload;
  state.GetPrivacyPolicyResponse = null;
};

const saveGetPrivacyPolicyResponseData = (state, action) => {
  state.GetPrivacyPolicyResponse =
    action.payload || state.GetPrivacyPolicyResponse;
};

const removeGetPrivacyPolicyResponseData = state => {
  state.GetPrivacyPolicyResponse = null;
  state.GetPrivacyPolicyData = null;
};

const GetPrivacyPolicySlice = createSlice({
  name: 'GetPrivacyPolicy',
  initialState,

  reducers: {
    saveGetPrivacyPolicy: saveGetPrivacyPolicyData,
    saveGetPrivacyPolicyResponse: saveGetPrivacyPolicyResponseData,
    removeGetPrivacyPolicyResponse: removeGetPrivacyPolicyResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveGetPrivacyPolicy,
  saveGetPrivacyPolicyResponse,
  removeGetPrivacyPolicyResponse,
} = GetPrivacyPolicySlice.actions;

const GetPrivacyPolicySliceReducer = GetPrivacyPolicySlice.reducer;

const selectGetPrivacyPolicyData = ({GetPrivacyPolicyReducer}) =>
  GetPrivacyPolicyReducer.GetPrivacyPolicyData ?? null;
const selectGetPrivacyPolicyResponse = ({GetPrivacyPolicyReducer}) =>
  GetPrivacyPolicyReducer.GetPrivacyPolicyResponse ?? null;

export {
  GetPrivacyPolicySliceReducer,
  saveGetPrivacyPolicy,
  saveGetPrivacyPolicyResponse,
  removeGetPrivacyPolicyResponse,
  selectGetPrivacyPolicyData,
  selectGetPrivacyPolicyResponse,
};
