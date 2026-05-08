import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveServiceDetail, saveServiceDetailResponse } from '../reducers/ServiceDetailReducer';
import { UIReducer } from '../reducers';


export function* ServiceDetail(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_SERVICE_DETAIL,
    action.payload
  );
  console.log('ServiceDetail', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveServiceDetail(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ServiceDetailResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveServiceDetailResponse(ServiceDetailResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchServiceDetail() {
  yield takeLatest(SagaActions.GET_SERVICE_DETAIL, ServiceDetail);
}
