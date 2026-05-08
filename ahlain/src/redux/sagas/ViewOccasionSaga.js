import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveViewOccasion,
  saveViewOccasionResponse,
} from '../reducers/ViewOccasionReducer';
import {UIReducer} from '../reducers';

export function* ViewOccasion(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.VIEW_OCCASION,
    action.payload,
  );
  console.log('ViewOccasion', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveViewOccasion(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ViewOccasionResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveViewOccasionResponse(ViewOccasionResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchViewOccasion() {
  yield takeLatest(SagaActions.VIEW_OCCASION, ViewOccasion);
}
