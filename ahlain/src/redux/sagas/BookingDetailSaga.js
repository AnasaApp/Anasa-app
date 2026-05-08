import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveBookingDetail, saveBookingDetailResponse } from '../reducers/BookingDetailReducer';
import { UIReducer } from '../reducers';


export function* BookingDetail(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.BOOKING_DETAIL,
    action.payload
  );
  console.log('BookingDetail', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveBookingDetail(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const BookingDetailResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveBookingDetailResponse(BookingDetailResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchBookingDetail() {
  yield takeLatest(SagaActions.BOOKING_DETAIL, BookingDetail);
}
