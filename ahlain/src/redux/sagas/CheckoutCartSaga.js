import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveCheckoutCart, saveCheckoutCartResponse } from '../reducers/CheckoutCartReducer';
import { UIReducer } from '../reducers';


export function* CheckoutCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CHECKOUT_CART,
    action.payload
  );
  console.log('CheckoutCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCheckoutCart(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CheckoutCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveCheckoutCartResponse(CheckoutCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCheckoutCart() {
  yield takeLatest(SagaActions.CHECKOUT_CART, CheckoutCart);
}
