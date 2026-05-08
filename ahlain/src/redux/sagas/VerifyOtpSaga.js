import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveVerifyOtp, saveVerifyOtpResponse } from '../reducers/VerifyOtpReducer';
import { UIReducer } from '../reducers';


export function* verifyOtp(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.VERIFY_OTP,
    action.payload
  );
  console.log('Verify Otp', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveVerifyOtp(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const verifyOtpResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveVerifyOtpResponse(verifyOtpResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchVerifyOtp() {
  yield takeLatest(SagaActions.VERIFY_OTP, verifyOtp);
}
