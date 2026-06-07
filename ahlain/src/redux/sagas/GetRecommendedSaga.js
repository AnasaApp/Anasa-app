import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetRecommended,
  saveGetRecommendedResponse,
} from '../reducers/GetRecommendedReducer';
export function* GetRecommended(action) {
  const data = yield call(
    callApiService,
    SagaActions.GET_RECOMMENDATION,
    action.payload,
  );
  console.log('GetRecommended', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetRecommended(data?.result?.data));
    return;
  }

  const GetRecommendedResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetRecommendedResponse(GetRecommendedResponse));
}

/**
 * Watch login function
 */
export function* watchGetRecommended() {
  yield takeLatest(SagaActions.GET_RECOMMENDATION, GetRecommended);
}
