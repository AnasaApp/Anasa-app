import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveAddAddress, saveAddAddressResponse } from '../reducers/AddAddressReducer';
import { UIReducer } from '../reducers';


export function* AddAddress(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.ADD_ADDRESS,
    action.payload
  );
  console.log('AddAddress', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveAddAddress(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const AddAddressResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveAddAddressResponse(AddAddressResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchAddAddress() {
  yield takeLatest(SagaActions.ADD_ADDRESS, AddAddress);
}
