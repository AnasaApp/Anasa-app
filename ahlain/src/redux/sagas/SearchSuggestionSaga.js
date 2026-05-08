import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSearchSuggestion, saveSearchSuggestionResponse } from '../reducers/SearchSuggestionReducer';
import { UIReducer } from '../reducers';


export function* SearchSuggestion(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SEARCH_SUGGESTION,
    action.payload
  );
  console.log('SearchSuggestion', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSearchSuggestion(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SearchSuggestionResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSearchSuggestionResponse(SearchSuggestionResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSearchSuggestion() {
  yield takeLatest(SagaActions.SEARCH_SUGGESTION, SearchSuggestion);
}
