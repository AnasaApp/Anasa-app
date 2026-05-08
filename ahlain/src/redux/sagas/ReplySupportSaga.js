import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveReplySupport, saveReplySupportResponse } from '../reducers/ReplySupportReducer';
import { UIReducer } from '../reducers';


export function* ReplySupport(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.REPLY_SUPPORT,
    action.payload
  );
  console.log('ReplySupport', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveReplySupport(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ReplySupportResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveReplySupportResponse(ReplySupportResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchReplySupport() {
  yield takeLatest(SagaActions.REPLY_SUPPORT, ReplySupport);
}
