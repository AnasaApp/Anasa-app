import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetRequest, saveGetRequestResponse } from '../reducers/GetRequestReducer';
import { UIReducer } from '../reducers';


export function* GetRequest(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_REQUEST,
    action.payload
  );
  console.log('GetRequest', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetRequest(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetRequestResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetRequestResponse(GetRequestResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetRequest() {
  yield takeLatest(SagaActions.GET_REQUEST, GetRequest);
}
