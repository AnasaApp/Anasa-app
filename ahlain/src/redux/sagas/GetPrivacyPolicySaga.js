import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetPrivacyPolicy, saveGetPrivacyPolicyResponse } from '../reducers/GetPrivacyPolicyReducer';
import { UIReducer } from '../reducers';


export function* GetPrivacyPolicy(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_PRIVACY_POLICY,
    action.payload
  );
  console.log('GetPrivacyPolicy', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetPrivacyPolicy(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetPrivacyPolicyResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetPrivacyPolicyResponse(GetPrivacyPolicyResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetPrivacyPolicy() {
  yield takeLatest(SagaActions.GET_PRIVACY_POLICY, GetPrivacyPolicy);
}
