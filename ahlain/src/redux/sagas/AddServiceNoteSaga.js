import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveAddServiceNote, saveAddServiceNoteResponse } from '../reducers/AddServiceNoteReducer';
import { UIReducer } from '../reducers';


export function* AddServiceNote(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.ADD_SERVICE_NOTE,
    action.payload
  );
  console.log('AddServiceNote', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveAddServiceNote(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const AddServiceNoteResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveAddServiceNoteResponse(AddServiceNoteResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchAddServiceNote() {
  yield takeLatest(SagaActions.ADD_SERVICE_NOTE, AddServiceNote);
}
