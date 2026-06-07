import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  DeletePartyServiceData: null,
  DeletePartyServiceResponse: null,
};
const saveDeletePartyServiceData = (state, action) => {
  state.DeletePartyServiceData = action.payload;
  state.DeletePartyServiceResponse = null;
};

const saveDeletePartyServiceResponseData = (state, action) => {
  state.DeletePartyServiceResponse =
    action.payload || state.DeletePartyServiceResponse;
};

const removeDeletePartyServiceResponseData = state => {
  state.DeletePartyServiceResponse = null;
  state.DeletePartyServiceData = null;
};

const DeletePartyServiceSlice = createSlice({
  name: 'DeletePartyService',
  initialState,
  reducers: {
    saveDeletePartyService: saveDeletePartyServiceData,
    saveDeletePartyServiceResponse: saveDeletePartyServiceResponseData,
    removeDeletePartyServiceResponse: removeDeletePartyServiceResponseData,
  },
});

const {
  saveDeletePartyService,
  saveDeletePartyServiceResponse,
  removeDeletePartyServiceResponse,
} = DeletePartyServiceSlice.actions;

const DeletePartyServiceSliceReducer = DeletePartyServiceSlice.reducer;

const selectDeletePartyServiceData = ({DeletePartyServiceReducer}) =>
  DeletePartyServiceReducer.DeletePartyServiceData ?? null;
const selectDeletePartyServiceResponse = ({DeletePartyServiceReducer}) =>
  DeletePartyServiceReducer.DeletePartyServiceResponse ?? null;

export {
  DeletePartyServiceSliceReducer,
  saveDeletePartyService,
  saveDeletePartyServiceResponse,
  removeDeletePartyServiceResponse,
  selectDeletePartyServiceData,
  selectDeletePartyServiceResponse,
};
