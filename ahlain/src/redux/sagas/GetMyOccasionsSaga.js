import {takeLatest, call, put} from 'redux-saga/effects';

import {SagaActions} from './SagaActions';

import {callApiService} from '../../services/ApiInstance';

import {

  saveGetMyOccasions,

  saveGetMyOccasionsResponse,

} from '../reducers/GetMyOccasionsReducer';

import {UIReducer} from '../reducers';

import {
  enrichPartiesFromCache,
  hydratePartyMetaCache,
  syncPartyMetaFromApiParty,
} from '../../utils/partyHelpers';



export function* GetMyOccasions(action) {

  yield put(UIReducer.showLoader(true));

  yield call(hydratePartyMetaCache);



  const payload = action.payload || {page: 1, pageSize: 50};

  const data = yield call(

    callApiService,

    SagaActions.GET_MY_OCCASIONS,

    payload,

  );

  if (data.isSucceded) {

    const response = data?.result?.data;

    const parties = response?.results?.parties ?? [];

    for (const party of parties) {
      yield call(syncPartyMetaFromApiParty, party);
    }

    yield put(

      saveGetMyOccasions({

        ...response,

        results: {

          ...response?.results,

          parties: enrichPartiesFromCache(parties),

        },

      }),

    );

    yield put(UIReducer.showLoader(false));

    return;

  }

  const GetMyOccasionsResponse = {

    status: false,

    message: data?.result?.data?.message ?? 'Server Error!!',

  };

  yield put(saveGetMyOccasionsResponse(GetMyOccasionsResponse));

  yield put(UIReducer.showLoader(false));

}



export function* watchGetMyOccasions() {

  yield takeLatest(SagaActions.GET_MY_OCCASIONS, GetMyOccasions);

}


