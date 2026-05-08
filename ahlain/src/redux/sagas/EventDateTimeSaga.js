import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveEventDateTime, saveEventDateTimeResponse } from '../reducers/EventDateTimeReducer';
import { UIReducer } from '../reducers';


export function* EventDateTime(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.EVENT_DATE_TIME,
    action.payload
  );
  console.log('EventDateTime', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveEventDateTime(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const EventDateTimeResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveEventDateTimeResponse(EventDateTimeResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchEventDateTime() {
  yield takeLatest(SagaActions.EVENT_DATE_TIME, EventDateTime);
}
