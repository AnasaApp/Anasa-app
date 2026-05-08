import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  MyProfileData: null,
  MyProfileResponse: null,
};
const saveMyProfileData = (state, action) => {
  state.MyProfileData = action.payload;
  state.MyProfileResponse = null;
};

const saveMyProfileResponseData = (state, action) => {
  state.MyProfileResponse = action.payload || state.MyProfileResponse;
};

const removeMyProfileResponseData = state => {
  state.MyProfileResponse = null;
  state.MyProfileData = null;
};

const MyProfileSlice = createSlice({
  name: 'MyProfile',
  initialState,

  reducers: {
    saveMyProfile: saveMyProfileData,
    saveMyProfileResponse: saveMyProfileResponseData,
    removeMyProfileResponse: removeMyProfileResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveMyProfile, saveMyProfileResponse, removeMyProfileResponse} =
  MyProfileSlice.actions;

const MyProfileSliceReducer = MyProfileSlice.reducer;

const selectMyProfileData = ({MyProfileReducer}) =>
  MyProfileReducer.MyProfileData ?? null;
const selectMyProfileResponse = ({MyProfileReducer}) =>
  MyProfileReducer.MyProfileResponse ?? null;

export {
  MyProfileSliceReducer,
  saveMyProfile,
  saveMyProfileResponse,
  removeMyProfileResponse,
  selectMyProfileData,
  selectMyProfileResponse,
};
