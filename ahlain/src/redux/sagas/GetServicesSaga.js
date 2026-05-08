import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetServices,
  saveGetServicesResponse,
} from '../reducers/GetServicesReducer';
import {UIReducer} from '../reducers';

export function* GetServices(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_SERVICES,
    action.payload,
  );
  console.log('GetServices', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetServices(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetServicesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetServicesResponse(GetServicesResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetServices() {
  yield takeLatest(SagaActions.GET_SERVICES, GetServices);
}
