import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveAddPacakageToCart, saveAddPacakageToCartResponse } from '../reducers/AddPackageToCartReducer';
import { UIReducer } from '../reducers';


export function* AddPacakageToCart(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.Add_PACKAGE_TO_CART,
    action.payload
  );
  console.log('AddPacakageToCart', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveAddPacakageToCart(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const AddPacakageToCartResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveAddPacakageToCartResponse(AddPacakageToCartResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchAddPacakageToCart() {
  yield takeLatest(SagaActions.Add_PACKAGE_TO_CART, AddPacakageToCart);
}
