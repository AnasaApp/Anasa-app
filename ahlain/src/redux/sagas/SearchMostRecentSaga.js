import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSearchMostRecent, saveSearchMostRecentResponse } from '../reducers/SearchMostRecentReducer';
import { UIReducer } from '../reducers';


export function* SearchMostRecent(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SEARCH_MOST_RECENT,
    action.payload
  );
  console.log('SearchMostRecent', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSearchMostRecent(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SearchMostRecentResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSearchMostRecentResponse(SearchMostRecentResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSearchMostRecent() {
  yield takeLatest(SagaActions.SEARCH_MOST_RECENT, SearchMostRecent);
}
