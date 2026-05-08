import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveRemoveCart, saveRemoveCartResponse } from '../reducers/RemoveCartReducer';
import { UIReducer } from '../reducers';


export function* RemoveCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.REMOVE_CART,
    action.payload
  );
  console.log('RemoveCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveRemoveCart(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const RemoveCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveRemoveCartResponse(RemoveCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchRemoveCart() {
  yield takeLatest(SagaActions.REMOVE_CART, RemoveCart);
}
