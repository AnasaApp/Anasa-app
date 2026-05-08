import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetCategories, saveGetCategoriesResponse } from '../reducers/GetCategoriesReducer';
import { UIReducer } from '../reducers';


export function* GetCategories(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_CATEGORIES,
    action.payload
  );
  console.log('GetCategories', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetCategories(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetCategoriesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetCategoriesResponse(GetCategoriesResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetCategories() {
  yield takeLatest(SagaActions.GET_CATEGORIES, GetCategories);
}
