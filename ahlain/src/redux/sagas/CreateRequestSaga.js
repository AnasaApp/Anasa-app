import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCreateRequest, saveCreateRequestResponse } from '../reducers/CreateRequestReducer';
import { UIReducer } from '../reducers';


export function* CreateRequest(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CREATE_REQUEST,
    action.payload
  );
  console.log('CreateRequest', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCreateRequest(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CreateRequestResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCreateRequestResponse(CreateRequestResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCreateRequest() {
  yield takeLatest(SagaActions.CREATE_REQUEST, CreateRequest);
}
