import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCreateServiceEligiblity, saveCreateServiceEligiblityResponse } from '../reducers/CreateServiceEligiblityReducer';
import { UIReducer } from '../reducers';


export function* CreateServiceEligiblity(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CREATE_SERVICE_ELIGIBILITY,
    action.payload
  );
  console.log('CreateServiceEligiblity', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCreateServiceEligiblity(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CreateServiceEligiblityResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCreateServiceEligiblityResponse(CreateServiceEligiblityResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCreateServiceEligiblity() {
  yield takeLatest(SagaActions.CREATE_SERVICE_ELIGIBILITY, CreateServiceEligiblity);
}
