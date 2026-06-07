import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import {saveAddToCart, saveAddToCartResponse} from '../reducers/AddToCartReducer';
import {saveGetMyCart} from '../reducers/GetMyCartReducer';
import {UIReducer} from '../reducers';


export function* AddToCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.ADD_TO_CART,
    action.payload
  );
  console.log('AddToCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveAddToCart(data?.result?.data));

    const cartData = yield call(callApiService, SagaActions.GET_MY_CART, {
      promoCodeId: '',
    });
    if (cartData.isSucceded) {
      yield put(saveGetMyCart(cartData?.result?.data));
    }

    yield put(UIReducer.showLoader(false));
    return;
  }

  const AddToCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveAddToCartResponse(AddToCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchAddToCart() {
  yield takeLatest(SagaActions.ADD_TO_CART, AddToCart);
}
