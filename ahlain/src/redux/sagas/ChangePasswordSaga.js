import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveChangePassword, saveChangePasswordResponse } from '../reducers/ChangePasswordReducer';
import { UIReducer } from '../reducers';


export function* ChangePassword(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHANGE_PASSWORD,
    action.payload
  );
  console.log('Change Password', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveChangePassword(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ChangePasswordResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  console.log('ChangePasswordResponse', ChangePasswordResponse);
  yield put(saveChangePasswordResponse(ChangePasswordResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchChangePassword() {
  yield takeLatest(SagaActions.CHANGE_PASSWORD, ChangePassword);
}
