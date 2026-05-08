import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveTopRated, saveTopRatedResponse } from '../reducers/TopRatedReducer';
import { UIReducer } from '../reducers';


export function* TopRated(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.TOP_RATED,
    action.payload
  );
  console.log('TopRated', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveTopRated(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const TopRatedResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveTopRatedResponse(TopRatedResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchTopRated() {
  yield takeLatest(SagaActions.TOP_RATED, TopRated);
}
