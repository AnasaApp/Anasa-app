import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  PlanForMeData: null,
  PlanForMeResponse: null,
};

const savePlanForMeData = (state, action) => {
  state.PlanForMeData = action.payload;
  state.PlanForMeResponse = null;
};

const savePlanForMeResponseData = (state, action) => {
  state.PlanForMeResponse = action.payload || state.PlanForMeResponse;
};

const removePlanForMeResponseData = state => {
  state.PlanForMeResponse = null;
  state.PlanForMeData = null;
};

const PlanForMeSlice = createSlice({
  name: 'PlanForMe',
  initialState,
  reducers: {
    savePlanForMe: savePlanForMeData,
    savePlanForMeResponse: savePlanForMeResponseData,
    removePlanForMeResponse: removePlanForMeResponseData,
  },
});

const {savePlanForMe, savePlanForMeResponse, removePlanForMeResponse} =
  PlanForMeSlice.actions;

const PlanForMeSliceReducer = PlanForMeSlice.reducer;

const selectPlanForMeData = ({PlanForMeReducer}) =>
  PlanForMeReducer.PlanForMeData ?? null;
const selectPlanForMeResponse = ({PlanForMeReducer}) =>
  PlanForMeReducer.PlanForMeResponse ?? null;

export {
  PlanForMeSliceReducer,
  savePlanForMe,
  savePlanForMeResponse,
  removePlanForMeResponse,
  selectPlanForMeData,
  selectPlanForMeResponse,
};

