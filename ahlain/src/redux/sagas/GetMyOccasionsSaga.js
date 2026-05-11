import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetMyOccasions,
  saveGetMyOccasionsResponse,
} from '../reducers/GetMyOccasionsReducer';
import {UIReducer} from '../reducers';

export function* GetMyOccasions(action) {
  yield put(UIReducer.showLoader(true));
  const data = yield call(
    callApiService,
    SagaActions.GET_MY_OCCASIONS,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveGetMyOccasions(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }
  const GetMyOccasionsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetMyOccasionsResponse(GetMyOccasionsResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchGetMyOccasions() {
  yield takeLatest(SagaActions.GET_MY_OCCASIONS, GetMyOccasions);
}

