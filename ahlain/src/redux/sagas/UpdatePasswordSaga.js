import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveUpdatePassword, saveUpdatePasswordResponse } from '../reducers/UpdatePasswordReducer';
import { UIReducer } from '../reducers';


export function* UpdatePassword(action) {

  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.UPDATE_PASSWORD,
    action.payload
  );
  console.log('Update Password', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveUpdatePassword(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const UpdatePasswordResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveUpdatePasswordResponse(UpdatePasswordResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchUpdatePassword() {
  yield takeLatest(SagaActions.UPDATE_PASSWORD, UpdatePassword);
}
