import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveUpdateCart,
  saveUpdateCartResponse,
} from '../reducers/UpdateCartReducer';
import {UIReducer} from '../reducers';

export function* UpdateCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.UPDATE_CART,
    action.payload,
  );
  console.log('UpdateCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveUpdateCart(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const UpdateCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Invalid login credentials!!',
  };
  yield put(saveUpdateCartResponse(UpdateCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchUpdateCart() {
  yield takeLatest(SagaActions.UPDATE_CART, UpdateCart);
}
