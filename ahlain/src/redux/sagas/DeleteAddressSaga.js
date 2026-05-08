import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveDeleteAddress,
  saveDeleteAddressResponse,
} from '../reducers/DeleteAddressReducer';
import {UIReducer} from '../reducers';

export function* DeleteAddress(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_ADDRESS,
    action.payload,
  );
  console.log('DeleteAddress', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveDeleteAddress(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeleteAddressResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeleteAddressResponse(DeleteAddressResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchDeleteAddress() {
  yield takeLatest(SagaActions.DELETE_ADDRESS, DeleteAddress);
}
