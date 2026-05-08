import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetAddress,
  saveGetAddressResponse,
} from '../reducers/GetAddressReducer';
import {UIReducer} from '../reducers';

export function* GetAddress(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_ADDRESS,
    action.payload,
  );
  console.log('GetAddress', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetAddress(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetAddressResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetAddressResponse(GetAddressResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetAddress() {
  yield takeLatest(SagaActions.GET_ADDRESS, GetAddress);
}
