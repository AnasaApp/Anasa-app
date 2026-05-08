import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetAllVendors,
  saveGetAllVendorsResponse,
} from '../reducers/GetAllVendorsReducer';
import {UIReducer} from '../reducers';

export function* GetAllVendors(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_ALL_VENDORS,
    action.payload,
  );
  console.log('GetAllVendors', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetAllVendors(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetAllVendorsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetAllVendorsResponse(GetAllVendorsResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetAllVendors() {
  yield takeLatest(SagaActions.GET_ALL_VENDORS, GetAllVendors);
}
