import {takeLatest, call, put} from 'redux-saga/effects';

import {SagaActions} from './SagaActions';

import {callApiService} from '../../services/ApiInstance';

import {

  saveCreateMyOccasion,

  saveCreateMyOccasionResponse,

} from '../reducers/CreateMyOccasionReducer';

import {UIReducer} from '../reducers';

import {

  extractPartyMetaFromPayload,
  extractPartyMetaFromParty,
  getPartyId,
  rememberPartyMeta,
} from '../../utils/partyHelpers';



export function* CreateMyOccasion(action) {

  yield put(UIReducer.showLoader(true));

  const data = yield call(

    callApiService,

    SagaActions.CREATE_MY_OCCASION,

    action.payload,

  );

  if (data.isSucceded) {

    const response = data?.result?.data;

    const party = response?.results?.party;

    const meta =
      extractPartyMetaFromParty(party) ??
      extractPartyMetaFromPayload(action.payload);

    const partyId = getPartyId(party);

    if (partyId && meta) {

      yield call(rememberPartyMeta, partyId, meta);

    }

    yield put(saveCreateMyOccasion(response));

    yield put(UIReducer.showLoader(false));

    return;

  }

  const CreateMyOccasionResponse = {

    error: true,

    message: data?.result?.data?.message ?? 'Server Error!!',

  };

  yield put(saveCreateMyOccasionResponse(CreateMyOccasionResponse));

  yield put(UIReducer.showLoader(false));

}



export function* watchCreateMyOccasion() {

  yield takeLatest(SagaActions.CREATE_MY_OCCASION, CreateMyOccasion);

}


