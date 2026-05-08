import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveReOrderBooking,
  saveReOrderBookingResponse,
} from '../reducers/ReOrderBookingReducer';
import {UIReducer} from '../reducers';

export function* ReOrderBooking(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.RE_ORDER_BOOKING,
    action.payload,
  );
  console.log('ReOrderBooking', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveReOrderBooking(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ReOrderBookingResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveReOrderBookingResponse(ReOrderBookingResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchReOrderBooking() {
  yield takeLatest(SagaActions.RE_ORDER_BOOKING, ReOrderBooking);
}
