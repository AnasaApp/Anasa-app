import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveChangeNotification, saveChangeNotificationResponse } from '../reducers/ChangeNotificationReducer';
import { UIReducer } from '../reducers';


export function* ChangeNotification(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHANGE_NOTIFICATION,
    action.payload
  );
  console.log('ChangeNotification', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveChangeNotification(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ChangeNotificationResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveChangeNotificationResponse(ChangeNotificationResponse));
  yield put(UIReducer.showLoader(true));
}

/**
 * Watch login function
 */
export function* watchChangeNotification() {
  yield takeLatest(SagaActions.CHANGE_NOTIFICATION, ChangeNotification);
}
