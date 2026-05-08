import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetTandC, saveGetTandCResponse } from '../reducers/GetTandCReducer';
import { UIReducer } from '../reducers';


export function* GetTandC(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_T_AND_C,
    action.payload
  );
  console.log('GetTandC', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetTandC(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetTandCResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetTandCResponse(GetTandCResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetTandC() {
  yield takeLatest(SagaActions.GET_T_AND_C, GetTandC);
}
