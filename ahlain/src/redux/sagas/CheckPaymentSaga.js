import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCheckPayment, saveCheckPaymentResponse } from '../reducers/CheckPaymentReducer';
import { UIReducer } from '../reducers';


export function* CheckPayment(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHECK_PAYMENT,
    action.payload
  );
  console.log('CheckPayment', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCheckPayment(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CheckPaymentResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCheckPaymentResponse(CheckPaymentResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCheckPayment() {
  yield takeLatest(SagaActions.CHECK_PAYMENT, CheckPayment);
}
