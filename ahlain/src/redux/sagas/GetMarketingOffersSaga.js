import { takeLatest, call, put } from 'redux-saga/effects';
import { SagaActions } from './SagaActions';
import { callApiService } from '../../services/ApiInstance';
import { saveGetMarketingOffers, saveGetMarketingOffersResponse } from '../reducers/GetMarketingOffersReducer';
import { UIReducer } from '../reducers';


export function* GetMarketingOffers(action) {
  yield put(UIReducer.showLoader(true));

  const data = yield call(
    callApiService,
    SagaActions.GET_MARKETING_OFFERS,
    action.payload
  );
  console.log('GetMarketingOffers', data?.result?.data);
  if (data.isSucceded) {
    yield put(saveGetMarketingOffers(data?.result?.data));
    // yield put(saveTokenAuth(data?.result?.data?.results?.token));
    yield put(UIReducer.showLoader(false));
    return;
  }

  const GetMarketingOffersResponse = {
    status: false,
    message: data?.result?.data?.message ?? 'Server Error!!',
  };
  yield put(saveGetMarketingOffersResponse(GetMarketingOffersResponse));
  yield put(UIReducer.showLoader(false));
}

/**
 * Watch login function
 */
export function* watchGetMarketingOffers() {
  yield takeLatest(SagaActions.GET_MARKETING_OFFERS, GetMarketingOffers);
}
