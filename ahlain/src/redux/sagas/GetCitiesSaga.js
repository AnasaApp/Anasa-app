import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveGetCities,
  saveGetCitiesResponse,
} from '../reducers/GetCitiesReducer';
import {UIReducer} from '../reducers';

export function* GetCities(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_CITIES,
    action.payload,
  );
  if (data.isSucceded) {
    yield put(saveGetCities(data?.result?.data));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetCitiesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetCitiesResponse(GetCitiesResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch GetCities function
 */
export function* watchGetCities() {
  yield takeLatest(SagaActions.GET_CITIES, GetCities);
}
