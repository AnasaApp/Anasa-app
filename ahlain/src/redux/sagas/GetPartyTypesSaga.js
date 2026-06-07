import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetPartyTypes,
  saveGetPartyTypesResponse,
} from '../reducers/GetPartyTypesReducer';

export function* GetPartyTypes(action) {
  const data = yield call(
    callApiService,
    SagaActions.GET_PARTY_TYPES,
    action.payload || {},
  );
  if (data.isSucceded) {
    yield put(saveGetPartyTypes(data?.result?.data));
    return;
  }
  const GetPartyTypesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetPartyTypesResponse(GetPartyTypesResponse));
}

export function* watchGetPartyTypes() {
  yield takeLatest(SagaActions.GET_PARTY_TYPES, GetPartyTypes);
}
