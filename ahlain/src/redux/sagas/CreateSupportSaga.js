import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCreateSupport, saveCreateSupportResponse } from '../reducers/CreateSupportReducer';
import { UIReducer } from '../reducers';


export function* CreateSupport(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CREATE_SUPPORT,
    action.payload
  );
  console.log('CreateSupport', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCreateSupport(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CreateSupportResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCreateSupportResponse(CreateSupportResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCreateSupport() {
  yield takeLatest(SagaActions.CREATE_SUPPORT, CreateSupport);
}
