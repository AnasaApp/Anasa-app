import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveLoginResponse, saveUserLogin } from '../reducers/LoginUserReducer';
import { UIReducer } from '../reducers';


export function* login(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.LOGIN_USER,
    action.payload
  );
  console.log('LOGIN', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveUserLogin(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const loginResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveLoginResponse(loginResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchLoginUser() {
  yield takeLatest(SagaActions.LOGIN_USER, login);
}
