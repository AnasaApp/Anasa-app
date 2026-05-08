import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveBookingEligiblity, saveBookingEligiblityResponse } from '../reducers/BookingEligiblityReducer';
import { UIReducer } from '../reducers';


export function* BookingEligiblity(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.BOOKING_ELIGIBILITY,
    action.payload
  );
  console.log('BookingEligiblity', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveBookingEligiblity(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const BookingEligiblityResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveBookingEligiblityResponse(BookingEligiblityResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchBookingEligiblity() {
  yield takeLatest(SagaActions.BOOKING_ELIGIBILITY, BookingEligiblity);
}
