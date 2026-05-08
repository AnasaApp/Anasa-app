import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveDeleteAllNotification, saveDeleteAllNotificationResponse } from '../reducers/DeleteAllNotificationReducer';
import { UIReducer } from '../reducers';


export function* DeleteAllNotification(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_ALL_NOTIFICATION,
    action.payload
  );
  console.log('DeleteAllNotification', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveDeleteAllNotification(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeleteAllNotificationResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeleteAllNotificationResponse(DeleteAllNotificationResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchDeleteAllNotification() {
  yield takeLatest(SagaActions.DELETE_ALL_NOTIFICATION, DeleteAllNotification);
}
