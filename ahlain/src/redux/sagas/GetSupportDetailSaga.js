import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetSupportDetail, saveGetSupportDetailResponse } from '../reducers/GetSupportDetailReducer';
import { UIReducer } from '../reducers';


export function* GetSupportDetail(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_SUPPORT_DETAIL,
    action.payload
  );
  console.log('GetSupportDetail', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetSupportDetail(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetSupportDetailResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetSupportDetailResponse(GetSupportDetailResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetSupportDetail() {
  yield takeLatest(SagaActions.GET_SUPPORT_DETAIL, GetSupportDetail);
}
