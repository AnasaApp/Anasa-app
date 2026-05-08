import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveVendorProfile, saveVendorProfileResponse } from '../reducers/VendorProfileReducer';
import { UIReducer } from '../reducers';


export function* VendorProfile(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_VENDOR_PROFILE,
    action.payload
  );
  console.log('VendorProfile', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveVendorProfile(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const VendorProfileResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveVendorProfileResponse(VendorProfileResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchVendorProfile() {
  yield takeLatest(SagaActions.GET_VENDOR_PROFILE, VendorProfile);
}
