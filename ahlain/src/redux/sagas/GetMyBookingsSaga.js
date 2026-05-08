import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetMyBookings, saveGetMyBookingsResponse } from '../reducers/GetMyBookingsReducer';
import { UIReducer } from '../reducers';


export function* GetMyBookings(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_MY_BOOKINGS,
    action.payload
  );
  console.log('GetMyBookings', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetMyBookings(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetMyBookingsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetMyBookingsResponse(GetMyBookingsResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetMyBookings() {
  yield takeLatest(SagaActions.GET_MY_BOOKINGS, GetMyBookings);
}
