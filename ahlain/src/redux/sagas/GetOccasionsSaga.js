import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetOccasions,
  saveGetOccasionsResponse,
} from '../reducers/GetOccasionsReducer';
export function* GetOccasions(action) {
  const data = yield call(
    callApiService,
    SagaActions.GET_OCCASIONS,
    action.payload || {},
  );
  console.log('GetOccasions', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetOccasions(data?.result?.data));
    return;
  }

  const GetOccasionsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetOccasionsResponse(GetOccasionsResponse));
}

/**
 * Watch login function
 */
export function* watchGetOccasions() {
  yield takeLatest(SagaActions.GET_OCCASIONS, GetOccasions);
}
