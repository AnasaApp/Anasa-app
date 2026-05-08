import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetAllMyBookings, saveGetAllMyBookingsResponse } from '../reducers/GetAllMyBookingsReducer';
import { UIReducer } from '../reducers';


export function* GetAllMyBookings(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_ALL_MY_BOOKINGS,
    action.payload
  );
  console.log('GetAllMyBookings', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetAllMyBookings(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetAllMyBookingsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetAllMyBookingsResponse(GetAllMyBookingsResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetAllMyBookings() {
  yield takeLatest(SagaActions.GET_ALL_MY_BOOKINGS, GetAllMyBookings);
}
