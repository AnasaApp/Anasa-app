import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveMakePayment, saveMakePaymentResponse } from '../reducers/MakePaymentReducer';
import { UIReducer } from '../reducers';


export function* MakePayment(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.MAKE_PAYMENT,
    action.payload
  );
  console.log('MakePayment', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveMakePayment(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const MakePaymentResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveMakePaymentResponse(MakePaymentResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchMakePayment() {
  yield takeLatest(SagaActions.MAKE_PAYMENT, MakePayment);
}
