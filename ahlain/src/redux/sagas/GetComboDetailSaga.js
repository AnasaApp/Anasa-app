import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetComboDetail, saveGetComboDetailResponse } from '../reducers/GetComboDetailReducer';
import { UIReducer } from '../reducers';


export function* GetComboDetail(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_COMBO_DETAIL,
    action.payload
  );
  console.log('GetComboDetail', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetComboDetail(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetComboDetailResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetComboDetailResponse(GetComboDetailResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetComboDetail() {
  yield takeLatest(SagaActions.GET_COMBO_DETAIL, GetComboDetail);
}
