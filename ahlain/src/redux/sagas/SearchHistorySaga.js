import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSearchHistory, saveSearchHistoryResponse } from '../reducers/SearchHistoryReducer';
import { UIReducer } from '../reducers';


export function* SearchHistory(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SEARCH_HISTORY,
    action.payload
  );
  console.log('SearchHistory', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSearchHistory(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SearchHistoryResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSearchHistoryResponse(SearchHistoryResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSearchHistory() {
  yield takeLatest(SagaActions.SEARCH_HISTORY, SearchHistory);
}
