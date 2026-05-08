import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  EditProfileData: null,
  EditProfileResponse: null,
};
const saveEditProfileData = (state, action) => {
  state.EditProfileData = action.payload;
  state.EditProfileResponse = null;
};

const saveEditProfileResponseData = (state, action) => {
  state.EditProfileResponse = action.payload || state.EditProfileResponse;
};

const removeEditProfileResponseData = state => {
  state.EditProfileResponse = null;
  state.EditProfileData = null;
};

const EditProfileSlice = createSlice({
  name: 'EditProfile',
  initialState,

  reducers: {
    saveEditProfile: saveEditProfileData,
    saveEditProfileResponse: saveEditProfileResponseData,
    removeEditProfileResponse: removeEditProfileResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {saveEditProfile, saveEditProfileResponse, removeEditProfileResponse} =
  EditProfileSlice.actions;

const EditProfileSliceReducer = EditProfileSlice.reducer;

const selectEditProfileData = ({EditProfileReducer}) =>
  EditProfileReducer.EditProfileData ?? null;
const selectEditProfileResponse = ({EditProfileReducer}) =>
  EditProfileReducer.EditProfileResponse ?? null;

export {
  EditProfileSliceReducer,
  saveEditProfile,
  saveEditProfileResponse,
  removeEditProfileResponse,
  selectEditProfileData,
  selectEditProfileResponse,
};
