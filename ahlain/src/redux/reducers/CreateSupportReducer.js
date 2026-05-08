import {createSlice, createAction} from '@reduxjs/toolkit';

const initialState = {
  CreateSupportData: null,
  CreateSupportResponse: null,
};
const saveCreateSupportData = (state, action) => {
  state.CreateSupportData = action.payload;
  state.CreateSupportResponse = null;
};

const saveCreateSupportResponseData = (state, action) => {
  state.CreateSupportResponse = action.payload || state.CreateSupportResponse;
};

const removeCreateSupportResponseData = state => {
  state.CreateSupportResponse = null;
  state.CreateSupportData = null;
};

const CreateSupportSlice = createSlice({
  name: 'CreateSupport',
  initialState,

  reducers: {
    saveCreateSupport: saveCreateSupportData,
    saveCreateSupportResponse: saveCreateSupportResponseData,
    removeCreateSupportResponse: removeCreateSupportResponseData,
  },
});

// Get actions from created OtpVerify Slice
const {
  saveCreateSupport,
  saveCreateSupportResponse,
  removeCreateSupportResponse,
} = CreateSupportSlice.actions;

const CreateSupportSliceReducer = CreateSupportSlice.reducer;

const selectCreateSupportData = ({CreateSupportReducer}) =>
  CreateSupportReducer.CreateSupportData ?? null;
const selectCreateSupportResponse = ({CreateSupportReducer}) =>
  CreateSupportReducer.CreateSupportResponse ?? null;

export {
  CreateSupportSliceReducer,
  saveCreateSupport,
  saveCreateSupportResponse,
  removeCreateSupportResponse,
  selectCreateSupportData,
  selectCreateSupportResponse,
};
