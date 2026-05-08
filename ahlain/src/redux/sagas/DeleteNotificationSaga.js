import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveDeleteNotification, saveDeleteNotificationResponse } from '../reducers/DeleteNotificationReducer';
import { UIReducer } from '../reducers';


export function* DeleteNotification(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_NOTIFICATION,
    action.payload
  );
  console.log('DeleteNotification', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveDeleteNotification(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeleteNotificationResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeleteNotificationResponse(DeleteNotificationResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchDeleteNotification() {
  yield takeLatest(SagaActions.DELETE_NOTIFICATION, DeleteNotification);
}
