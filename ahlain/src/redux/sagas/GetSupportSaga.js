import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetSupport, saveGetSupportResponse } from '../reducers/GetSupportReducer';
import { UIReducer } from '../reducers';


export function* GetSupport(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_SUPPORT,
    action.payload
  );
  console.log('GetSupport', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetSupport(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetSupportResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetSupportResponse(GetSupportResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetSupport() {
  yield takeLatest(SagaActions.GET_SUPPORT, GetSupport);
}
