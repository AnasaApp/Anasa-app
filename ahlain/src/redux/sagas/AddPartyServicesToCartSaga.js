import {takeLatest, call, put} from 'redux-saga/effects';
import {SagaActions} from './SagaActions';
import {callApiService} from '../../services/ApiInstance';
import {
  saveAddToCart,
  saveAddToCartResponse,
} from '../reducers/AddToCartReducer';
import {saveGetMyCart} from '../reducers/GetMyCartReducer';
import {UIReducer} from '../reducers';
import {getPartyComboSelections} from '../../utils/partyComboStorage';
import {
  buildComboPackageEntry,
  getComboCustomizeError,
  getComboOfferId,
} from '../../utils/partyComboHelpers';

export function* AddPartyServicesToCart(action) {
  const {partyId, partyCombos = [], promoCodeId = ''} = action.payload ?? {};

  if (!partyId) {
    yield put(
      saveAddToCartResponse({
        status: false,
        message: 'Please provide party id',
      }),
    );
    return;
  }

  yield put(UIReducer.showLoader(true));

  const comboPackages = [];
  for (const partyCombo of partyCombos) {
    const offerId = getComboOfferId(partyCombo);
    if (!offerId) {
      continue;
    }

    let typeItems = yield call(getPartyComboSelections, partyId, offerId);

    if (!typeItems?.length) {
      const comboData = yield call(callApiService, SagaActions.GET_COMBO_DETAIL, {
        uri: '/' + offerId,
      });
      if (!comboData.isSucceded) {
        yield put(
          saveAddToCartResponse({
            status: false,
            message:
              comboData?.result?.data?.message ??
              'Failed to load combo details',
          }),
        );
        yield put(UIReducer.showLoader(false));
        return;
      }
      typeItems =
        comboData?.result?.data?.results?.advertisement?.type ?? [];
    }

    const customizeError = getComboCustomizeError(typeItems);
    if (customizeError) {
      yield put(
        saveAddToCartResponse({
          status: false,
          message: customizeError,
        }),
      );
      yield put(UIReducer.showLoader(false));
      return;
    }

    comboPackages.push(buildComboPackageEntry(partyCombo, typeItems));
  }

  const requestBody = {partyId};
  if (comboPackages.length) {
    requestBody.comboPackages = comboPackages;
  }
  if (promoCodeId) {
    requestBody.promoCodeId = promoCodeId;
  }

  const data = yield call(
    callApiService,
    SagaActions.ADD_PARTY_TO_CART,
    requestBody,
  );

  if (data.isSucceded) {
    const cartResponse = data?.result?.data;
    yield put(saveGetMyCart(cartResponse));
    yield put(saveAddToCart(cartResponse));
    yield put(UIReducer.showLoader(false));
    return;
  }

  yield put(
    saveAddToCartResponse({
      status: false,
      message: data?.result?.data?.message ?? 'Server Error!!',
    }),
  );
  yield put(UIReducer.showLoader(false));
}

export function* watchAddPartyServicesToCart() {
  yield takeLatest(
    SagaActions.ADD_PARTY_SERVICES_TO_CART,
    AddPartyServicesToCart,
  );
}
