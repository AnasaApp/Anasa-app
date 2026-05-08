import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveUpdateLatLong, saveUpdateLatLongResponse } from '../reducers/UpdateLatLongReducer';
import { UIReducer } from '../reducers';


export function* UpdateLatLong(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.UPDATE_LAT_LONG,
    action.payload
  );
  console.log('UpdateLatLong', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveUpdateLatLong(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const UpdateLatLongResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveUpdateLatLongResponse(UpdateLatLongResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchUpdateLatLong() {
  yield takeLatest(SagaActions.UPDATE_LAT_LONG, UpdateLatLong);
}
