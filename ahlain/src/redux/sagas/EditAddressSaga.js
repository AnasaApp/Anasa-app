import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveEditAddress, saveEditAddressResponse } from '../reducers/EditAddressReducer';
import { UIReducer } from '../reducers';


export function* EditAddress(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.EDIT_ADDRESS,
    action.payload
  );
  console.log('EditAddress', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveEditAddress(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const EditAddressResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveEditAddressResponse(EditAddressResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchEditAddress() {
  yield takeLatest(SagaActions.EDIT_ADDRESS, EditAddress);
}
