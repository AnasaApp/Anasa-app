import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveViewParty,
  saveViewPartyResponse,
} from '../reducers/ViewPartyReducer';
import {UIReducer} from '../reducers';
import {syncPartyMetaFromApiParty} from '../../utils/partyHelpers';

export function* ViewParty(action) {
  yield put(UIReducer.showLoader(true));
  const data = yield call(callApiService, SagaActions.VIEW_PARTY, action.payload);
  if (data.isSucceded) {
    const response = data?.result?.data;
    const party = response?.results?.party;
    if (party) {
      yield call(syncPartyMetaFromApiParty, party);
    }
    yield put(saveViewParty(response));
    yield put(UIReducer.showLoader(false));
    return;
  }
  const ViewPartyResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveViewPartyResponse(ViewPartyResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchViewParty() {
  yield takeLatest(SagaActions.VIEW_PARTY, ViewParty);
}
