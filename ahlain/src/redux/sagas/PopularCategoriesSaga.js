import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { savePopularCategories, savePopularCategoriesResponse } from '../reducers/PopularCategoriesReducer';
import { UIReducer } from '../reducers';


export function* PopularCategories(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.POPULAR_CATEGORIES,
    action.payload
  );
  console.log('PopularCategories', data?.result?.data);
  if (data.isSucceded) {
    yield put(savePopularCategories(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const PopularCategoriesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(savePopularCategoriesResponse(PopularCategoriesResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchPopularCategories() {
  yield takeLatest(SagaActions.POPULAR_CATEGORIES, PopularCategories);
}
