import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveRateService, saveRateServiceResponse } from '../reducers/RateServiceReducer';
import { UIReducer } from '../reducers';


export function* RateService(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.RATE_SERVICE,
    action.payload
  );
  console.log('RateService', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveRateService(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const RateServiceResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveRateServiceResponse(RateServiceResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchRateService() {
  yield takeLatest(SagaActions.RATE_SERVICE, RateService);
}
