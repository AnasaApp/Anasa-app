import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetAboutUs, saveGetAboutUsResponse } from '../reducers/GetAboutUsReducer';
import { UIReducer } from '../reducers';


export function* GetAboutUs(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_ABOUT_US,
    action.payload
  );
  console.log('GetAboutUs', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetAboutUs(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetAboutUsResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetAboutUsResponse(GetAboutUsResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetAboutUs() {
  yield takeLatest(SagaActions.GET_ABOUT_US, GetAboutUs);
}
