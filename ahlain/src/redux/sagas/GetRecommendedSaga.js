import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetRecommended,
  saveGetRecommendedResponse,
} from '../reducers/GetRecommendedReducer';
import {UIReducer} from '../reducers';

export function* GetRecommended(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_RECOMMENDATION,
    action.payload,
  );
  console.log('GetRecommended', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetRecommended(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetRecommendedResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetRecommendedResponse(GetRecommendedResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetRecommended() {
  yield takeLatest(SagaActions.GET_RECOMMENDATION, GetRecommended);
}
