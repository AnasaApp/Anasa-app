import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveForgotPassword, saveForgotPasswordResponse } from '../reducers/ForgotPasswordReducer';
import { UIReducer } from '../reducers';


export function* ForgotPassword(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.FORGOT_PASSWORD,
    action.payload
  );
  console.log('Forgot Password', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveForgotPassword(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ForgotPasswordResponse = {
    status: false,
    message:data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveForgotPasswordResponse(ForgotPasswordResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchForgotPassword() {
  yield takeLatest(SagaActions.FORGOT_PASSWORD, ForgotPassword);
}
