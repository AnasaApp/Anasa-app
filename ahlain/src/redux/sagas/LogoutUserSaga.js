import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveLogoutUser, saveLogoutUserResponse } from '../reducers/LogoutUserReducer';
import { UIReducer } from '../reducers';


export function* LogoutUser(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.LOGOUT_USER,
    action.payload
  );
  console.log('LogoutUser', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveLogoutUser(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const LogoutUserResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveLogoutUserResponse(LogoutUserResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchLogoutUser() {
  yield takeLatest(SagaActions.LOGOUT_USER, LogoutUser);
}
