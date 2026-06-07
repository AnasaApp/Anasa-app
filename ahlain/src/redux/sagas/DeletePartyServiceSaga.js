import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveDeletePartyService,
  saveDeletePartyServiceResponse,
} from '../reducers/DeletePartyServiceReducer';
import {UIReducer} from '../reducers';

export function* DeletePartyService(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.DELETE_PARTY_SERVICE,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveDeletePartyService(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const DeletePartyServiceResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveDeletePartyServiceResponse(DeletePartyServiceResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchDeletePartyService() {
  yield takeLatest(SagaActions.DELETE_PARTY_SERVICE, DeletePartyService);
}
