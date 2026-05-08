import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetCategoriesList,
  saveGetCategoriesListResponse,
} from '../reducers/GetCategoriesListReducer';
import {UIReducer} from '../reducers';

export function* GetCategoriesList(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_CATEGORIES_LIST,
    action.payload,
  );
  console.log('GetCategoriesList', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetCategoriesList(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetCategoriesListResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetCategoriesListResponse(GetCategoriesListResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetCategoriesList() {
  yield takeLatest(SagaActions.GET_CATEGORIES_LIST, GetCategoriesList);
}
