import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveSignUpUser, saveSignUpUserResponse } from '../reducers/SignUpUserReducer';
import { UIReducer } from '../reducers';


export function* SignUpUser(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.SIGNUP_USER,
    action.payload
  );
  console.log('SignUpUser', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveSignUpUser(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const SignUpUserResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveSignUpUserResponse(SignUpUserResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchSignUpUser() {
  yield takeLatest(SagaActions.SIGNUP_USER, SignUpUser);
}
