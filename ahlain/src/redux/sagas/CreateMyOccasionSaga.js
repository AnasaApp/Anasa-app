import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveCreateMyOccasion,
  saveCreateMyOccasionResponse,
} from '../reducers/CreateMyOccasionReducer';
import {UIReducer} from '../reducers';

export function* CreateMyOccasion(action) {
  yield put(UIReducer.showLoader(true));
  const data = yield call(
    callApiService,
    SagaActions.CREATE_MY_OCCASION,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveCreateMyOccasion(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }
  const CreateMyOccasionResponse = {
    error: true,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCreateMyOccasionResponse(CreateMyOccasionResponse));
  yield put(UIReducer.showLoader(false));
}

export function* watchCreateMyOccasion() {
  yield takeLatest(SagaActions.CREATE_MY_OCCASION, CreateMyOccasion);
}

