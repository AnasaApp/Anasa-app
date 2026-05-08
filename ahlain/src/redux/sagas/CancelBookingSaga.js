import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCancelBooking, saveCancelBookingResponse } from '../reducers/CancelBookingReducer';
import { UIReducer } from '../reducers';


export function* CancelBooking(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CANCEL_BOOKING,
    action.payload
  );
  console.log('CancelBooking', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCancelBooking(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CancelBookingResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCancelBookingResponse(CancelBookingResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCancelBooking() {
  yield takeLatest(SagaActions.CANCEL_BOOKING, CancelBooking);
}
