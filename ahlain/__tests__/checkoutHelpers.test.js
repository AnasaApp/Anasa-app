import {
  getCheckoutLocationId,
} from '../src/utils/checkoutHelpers';

describe('checkoutHelpers', () => {
  it('returns address _id for checkout APIs', () => {
    const selected = {_id: 'addr-selected-123', city: 'Greater Noida'};
    expect(getCheckoutLocationId(selected)).toBe('addr-selected-123');
  });

  it('returns null when address is missing', () => {
    expect(getCheckoutLocationId(null)).toBeNull();
    expect(getCheckoutLocationId(undefined)).toBeNull();
  });

  it('accepts raw id string', () => {
    expect(getCheckoutLocationId('addr-raw-id')).toBe('addr-raw-id');
  });
});
