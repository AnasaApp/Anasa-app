import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  savePlanForMe,
  savePlanForMeResponse,
} from '../reducers/PlanForMeReducer';
import {UIReducer} from '../reducers';

export function* PlanForMe(action) {
  yield put(UIReducer.showLoader(true));
  const data = yield call(
    callApiService,
    SagaActions.PLAN_FOR_ME,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(savePlanForMe(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }
  const PlanForMeResponse = {
    error: true,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(savePlanForMeResponse(PlanForMeResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchPlanForMe() {
  yield takeLatest(SagaActions.PLAN_FOR_ME, PlanForMe);
}

