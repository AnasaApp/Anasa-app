import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetNotificationList, saveGetNotificationListResponse } from '../reducers/GetNotificationListReducer';
import { UIReducer } from '../reducers';


export function* GetNotificationList(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_NOTIFICATION_LIST,
    action.payload
  );
  console.log('GetNotificationList', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetNotificationList(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetNotificationListResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetNotificationListResponse(GetNotificationListResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetNotificationList() {
  yield takeLatest(SagaActions.GET_NOTIFICATION_LIST, GetNotificationList);
}
