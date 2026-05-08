import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetMyCart, saveGetMyCartResponse } from '../reducers/GetMyCartReducer';
import { UIReducer } from '../reducers';


export function* GetMyCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_MY_CART,
    action.payload
  );
  console.log('GetMyCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetMyCart(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetMyCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetMyCartResponse(GetMyCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetMyCart() {
  yield takeLatest(SagaActions.GET_MY_CART, GetMyCart);
}
