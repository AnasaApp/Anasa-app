import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveDeleteAccount, saveDeleteAccountResponse } from '../reducers/DeleteAccountReducer';
import { UIReducer } from '../reducers';


export function* DeleteAccount(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_ACCOUNT,
    action.payload
  );
  console.log('DeleteAccount', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveDeleteAccount(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeleteAccountResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeleteAccountResponse(DeleteAccountResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchDeleteAccount() {
  yield takeLatest(SagaActions.DELETE_ACCOUNT, DeleteAccount);
}
