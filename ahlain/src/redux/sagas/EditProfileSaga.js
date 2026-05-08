import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveEditProfile, saveEditProfileResponse } from '../reducers/EditProfileReducer';
import { UIReducer } from '../reducers';


export function* EditProfile(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.EDIT_PROFILE,
    action.payload
  );
  console.log('EditProfile', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveEditProfile(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const EditProfileResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveEditProfileResponse(EditProfileResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchEditProfile() {
  yield takeLatest(SagaActions.EDIT_PROFILE, EditProfile);
}
