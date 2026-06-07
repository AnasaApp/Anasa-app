import {Platform} from 'react-native';

/** Default map center — Riyadh, SA */
export const DEFAULT_MAP_REGION = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/** Street-level zoom when picking an address */
export const MAP_ADDRESS_ZOOM_DELTA = 0.008;

export const isValidCoordinate = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }
  if (Math.abs(latitude) < 0.0001 && Math.abs(longitude) < 0.0001) {
    return false;
  }
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const buildMapRegion = (lat, lng, delta = MAP_ADDRESS_ZOOM_DELTA) => {
  if (isValidCoordinate(lat, lng)) {
    return {
      latitude: Number(lat),
      longitude: Number(lng),
      latitudeDelta: delta,
      longitudeDelta: delta,
    };
  }
  return {
    ...DEFAULT_MAP_REGION,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
};

/**
 * Move map camera when the MapView ref is ready.
 * Returns the target region; queues coords if ref is not ready yet.
 */
export const applyMapCamera = (
  mapRef,
  lat,
  lng,
  {delta = MAP_ADDRESS_ZOOM_DELTA, duration = 400} = {},
) => {
  const region = buildMapRegion(lat, lng, delta);
  const map = mapRef?.current;

  const animate = () => {
    if (!map) {
      return false;
    }
    if (typeof map.animateToRegion === 'function') {
      map.animateToRegion(region, duration);
      return true;
    }
    if (typeof map.animateCamera === 'function') {
      map.animateCamera(
        {
          center: {latitude: region.latitude, longitude: region.longitude},
          zoom: 16,
        },
        {duration},
      );
      return true;
    }
    return false;
  };

  if (!animate()) {
    return region;
  }

  if (Platform.OS === 'android') {
    setTimeout(animate, 300);
  }

  return region;
};

export const getMapProvider = () => {
  if (Platform.OS === 'android') {
    const {PROVIDER_GOOGLE} = require('react-native-maps');
    return PROVID_GOOGLE;
  }
  return undefined;
};
