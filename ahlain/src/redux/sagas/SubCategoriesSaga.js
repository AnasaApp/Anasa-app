import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSubCategories, saveSubCategoriesResponse } from '../reducers/SubCategoriesReducer';
import { UIReducer } from '../reducers';


export function* SubCategories(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SUB_CATEGORIES,
    action.payload
  );
  console.log('SubCategories', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSubCategories(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SubCategoriesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSubCategoriesResponse(SubCategoriesResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSubCategories() {
  yield takeLatest(SagaActions.SUB_CATEGORIES, SubCategories);
}
