import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {saveGetFAQ, saveGetFAQResponse} from '../reducers/GetFAQReducer';
import {UIReducer} from '../reducers';

export function* GetFAQ(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(callApiService, SagaActions.GET_FAQ, action.payload);
  console.log('GetFAQ', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetFAQ(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetFAQResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetFAQResponse(GetFAQResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetFAQ() {
  yield takeLatest(SagaActions.GET_FAQ, GetFAQ);
}
