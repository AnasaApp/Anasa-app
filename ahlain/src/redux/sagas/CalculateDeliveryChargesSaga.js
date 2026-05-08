import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveCalculateDeliveryCharges,
  saveCalculateDeliveryChargesResponse,
} from '../reducers/CalculateDeliveryChargesReducer';
import {UIReducer} from '../reducers';

export function* CalculateDeliveryCharges(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.CALCULATE_DELIVERY_CHARGES,
    action.payload,
  );
  console.log('CalculateDeliveryCharges', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveCalculateDeliveryCharges(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const CalculateDeliveryChargesResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(
    saveCalculateDeliveryChargesResponse(CalculateDeliveryChargesResponse),
  );
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchCalculateDeliveryCharges() {
  yield takeLatest(
    SagaActions.CALCULATE_DELIVERY_CHARGES,
    CalculateDeliveryCharges,
  );
}
