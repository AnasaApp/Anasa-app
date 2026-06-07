import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  CreatePartyServiceData: null,
  CreatePartyServiceResponse: null,
};

const saveCreatePartyServiceData = (state, action) => {
  state.CreatePartyServiceData = action.payload;
  state.CreatePartyServiceResponse = null;
};

const saveCreatePartyServiceResponseData = (state, action) => {
  state.CreatePartyServiceResponse =
    action.payload || state.CreatePartyServiceResponse;
};

const removeCreatePartyServiceResponseData = state => {
  state.CreatePartyServiceResponse = null;
  state.CreatePartyServiceData = null;
};

const CreatePartyServiceSlice = createSlice({
  name: 'CreatePartyService',
  initialState,
  reducers: {
    saveCreatePartyService: saveCreatePartyServiceData,
    saveCreatePartyServiceResponse: saveCreatePartyServiceResponseData,
    removeCreatePartyServiceResponse: removeCreatePartyServiceResponseData,
  },
});

const {
  saveCreatePartyService,
  saveCreatePartyServiceResponse,
  removeCreatePartyServiceResponse,
} = CreatePartyServiceSlice.actions;

const CreatePartyServiceSliceReducer = CreatePartyServiceSlice.reducer;

const selectCreatePartyServiceData = ({CreatePartyServiceReducer}) =>
  CreatePartyServiceReducer.CreatePartyServiceData ?? null;
const selectCreatePartyServiceResponse = ({CreatePartyServiceReducer}) =>
  CreatePartyServiceReducer.CreatePartyServiceResponse ?? null;

export {
  CreatePartyServiceSliceReducer,
  saveCreatePartyService,
  saveCreatePartyServiceResponse,
  removeCreatePartyServiceResponse,
  selectCreatePartyServiceData,
  selectCreatePartyServiceResponse,
};
