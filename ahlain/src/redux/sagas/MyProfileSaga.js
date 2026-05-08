import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveMyProfile, saveMyProfileResponse } from '../reducers/MyProfileReducer';
import { UIReducer } from '../reducers';


export function* MyProfile(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.MY_PROFILE,
    action.payload
  );
  console.log('MyProfile', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveMyProfile(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const MyProfileResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveMyProfileResponse(MyProfileResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchMyProfile() {
  yield takeLatest(SagaActions.MY_PROFILE, MyProfile);
}
