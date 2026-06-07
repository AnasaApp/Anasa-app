import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveCreatePartyService,
  saveCreatePartyServiceResponse,
} from '../reducers/CreatePartyServiceReducer';
import {UIReducer} from '../reducers';

export function* CreatePartyService(action) {
  yield put(UIReducer.showLoader(true));
  const data = yield call(
    callApiService,
    SagaActions.CREATE_PARTY_SERVICE,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveCreatePartyService(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }
  const CreatePartyServiceResponse = {
    error: true,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCreatePartyServiceResponse(CreatePartyServiceResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchCreatePartyService() {
  yield takeLatest(SagaActions.CREATE_PARTY_SERVICE, CreatePartyService);
}
