import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveDeleteParty,
  saveDeletePartyResponse,
} from '../reducers/DeletePartyReducer';
import {UIReducer} from '../reducers';

export function* DeleteParty(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_PARTY,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveDeleteParty(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeletePartyResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeletePartyResponse(DeletePartyResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchDeleteParty() {
  yield takeLatest(SagaActions.DELETE_PARTY, DeleteParty);
}
