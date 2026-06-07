import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {saveLoginResponse, saveUserLogin} from '../reducers/LoginUserReducer';
import {UIReducer} from '../reducers';
import {logLoginFlow} from '../../utils/apiLogger';

export function* login(action) {
  yield put(UIReducer.showLoader(true));

  logLoginFlow('SAGA_START', {
    email: action.payload?.email,
    country_code: action.payload?.country_code,
  });

  const data = yield call(
    callApiService,
    SagaActions.LOGIN_USER,
    action.payload,
  );

  const body = data?.result?.data;
  const token = body?.results?.token;

  logLoginFlow('SAGA_RESPONSE', {
    isSucceded: data.isSucceded,
    error: body?.error,
    error_code: body?.error_code,
    message: body?.message,
    hasToken: !!token,
    verifyAccount: body?.results?.verifyAccount,
  });

  if (data.isSucceded && token) {
    yield put(saveUserLogin(body));
    yield put(UIReducer.showLoader(false));
    return;
  }

  if (data.isSucceded && !token) {
    logLoginFlow('SAGA_ERROR', 'API error=false but results.token is missing');
    yield put(
      saveLoginResponse({
        status: false,
        message:
          body?.message ?? 'Login failed: no access token in server response',
      }),
    );
    yield put(UIReducer.showLoader(false));
    return;
  }

  const loginResponse = {
    status: false,
    message:
      body?.message ??
      data?.message?.message ??
      data?.result?.message ??
      'Server Error!!',
  };
  logLoginFlow('SAGA_FAIL', loginResponse);
  yield put(saveLoginResponse(loginResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchLoginUser() {
  yield takeLatest(SagaActions.LOGIN_USER, login);
}
