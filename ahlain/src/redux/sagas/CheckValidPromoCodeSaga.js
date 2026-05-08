import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCheckValidPromoCode, saveCheckValidPromoCodeResponse } from '../reducers/CheckValidPromoCodeReducer';
import { UIReducer } from '../reducers';


export function* CheckValidPromoCode(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHECK_VALID_PROMOCODE,
    action.payload
  );
  console.log('CheckValidPromoCode', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCheckValidPromoCode(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CheckValidPromoCodeResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCheckValidPromoCodeResponse(CheckValidPromoCodeResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCheckValidPromoCode() {
  yield takeLatest(SagaActions.CHECK_VALID_PROMOCODE, CheckValidPromoCode);
}
