/** Resolve address document id used by checkout / booking APIs. */
export const getCheckoutLocationId = address => {
  if (!address) {
    return null;
  }
  if (typeof address === 'string') {
    return address;
  }
  return address._id ?? null;
};

/** Dev-only trace so pay flow uses the cart-selected address, not profile default. */
export const logCheckoutLocation = (stage, address) => {
  if (!__DEV__) {
    return;
  }
  const locationId = getCheckoutLocationId(address);
  console.log('[CHECKOUT]', stage, {
    locationId,
    addressType: address?.addressType,
    city: address?.city,
    locality: address?.locality,
  });
};
