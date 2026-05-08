import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveChangeDefaultAddress, saveChangeDefaultAddressResponse } from '../reducers/ChangeDefaultAddressReducer';
import { UIReducer } from '../reducers';


export function* ChangeDefaultAddress(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHANGE_DEFAULT_ADDRESS,
    action.payload
  );
  console.log('ChangeDefaultAddress', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveChangeDefaultAddress(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ChangeDefaultAddressResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveChangeDefaultAddressResponse(ChangeDefaultAddressResponse));
  yield put(UIReducer.showLoader(false));

}

/**
 * Watch login function
 */
export function* watchChangeDefaultAddress() {
  yield takeLatest(SagaActions.CHANGE_DEFAULT_ADDRESS, ChangeDefaultAddress);
}
