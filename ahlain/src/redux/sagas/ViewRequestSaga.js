import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveViewRequest, saveViewRequestResponse } from '../reducers/ViewRequestReducer';
import { UIReducer } from '../reducers';


export function* ViewRequest(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.VIEW_REQUEST,
    action.payload
  );
  console.log('ViewRequest', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveViewRequest(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ViewRequestResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveViewRequestResponse(ViewRequestResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchViewRequest() {
  yield takeLatest(SagaActions.VIEW_REQUEST, ViewRequest);
}
