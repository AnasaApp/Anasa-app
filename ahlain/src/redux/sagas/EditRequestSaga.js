import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveEditRequest, saveEditRequestResponse } from '../reducers/EditRequestReducer';
import { UIReducer } from '../reducers';


export function* EditRequest(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.EDIT_REQUEST,
    action.payload
  );
  console.log('EditRequest', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveEditRequest(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const EditRequestResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveEditRequestResponse(EditRequestResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchEditRequest() {
  yield takeLatest(SagaActions.EDIT_REQUEST, EditRequest);
}
