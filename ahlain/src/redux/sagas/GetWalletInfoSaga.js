import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetWalletInfo,
  saveGetWalletInfoResponse,
} from '../reducers/GetWalletInfoReducer';
import {UIReducer} from '../reducers';

export function* GetWalletInfo(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_WALLET_INFO,
    action.payload,
  );
  console.log('GetWalletInfo', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetWalletInfo(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetWalletInfoResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetWalletInfoResponse(GetWalletInfoResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetWalletInfo() {
  yield takeLatest(SagaActions.GET_WALLET_INFO, GetWalletInfo);
}
