import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSearchResult, saveSearchResultResponse } from '../reducers/SearchResultReducer';
import { UIReducer } from '../reducers';


export function* SearchResult(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SEARCH_RESULT,
    action.payload
  );
  console.log('SearchResult', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSearchResult(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SearchResultResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSearchResultResponse(SearchResultResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSearchResult() {
  yield takeLatest(SagaActions.SEARCH_RESULT, SearchResult);
}
