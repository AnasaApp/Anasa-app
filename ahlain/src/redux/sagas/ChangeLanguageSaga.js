import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveChangeLanguage, saveChangeLanguageResponse } from '../reducers/ChangeLanguageReducer';
import { UIReducer } from '../reducers';


export function* ChangeLanguage(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHANGE_LANGUAGE,
    action.payload
  );
  console.log('ChangeLanguage', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveChangeLanguage(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const ChangeLanguageResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveChangeLanguageResponse(ChangeLanguageResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchChangeLanguage() {
  yield takeLatest(SagaActions.CHANGE_LANGUAGE, ChangeLanguage);
}
