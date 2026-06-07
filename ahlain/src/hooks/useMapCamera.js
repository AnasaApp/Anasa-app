import {useCallback, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {applyMapCamera, buildMapRegion, isValidCoordinate} from '../utils/mapHelpers';

/**
 * Map camera via animateToRegion only (no controlled region prop).
 */
export default function useMapCamera(initialLat, initialLng) {
  const mapRef = useRef(null);
  const mapReadyRef = useRef(false);
  const pendingCoordsRef = useRef(null);
  const suppressRegionEventsRef = useRef(true);

  const [isMapReady, setIsMapReady] = useState(false);
  const [mapRegion, setMapRegion] = useState(() =>
    buildMapRegion(initialLat, initialLng),
  );

  const runCameraMove = useCallback((lat, lng) => {
    if (!isValidCoordinate(lat, lng)) {
      return null;
    }
    const region = buildMapRegion(lat, lng);
    suppressRegionEventsRef.current = true;
    setMapRegion(region);
    applyMapCamera(mapRef, lat, lng);
    setTimeout(() => {
      suppressRegionEventsRef.current = false;
    }, 800);
    return region;
  }, []);

  const moveMapTo = useCallback(
    (lat, lng) => {
      if (!isValidCoordinate(lat, lng)) {
        return null;
      }
      const nLat = Number(lat);
      const nLng = Number(lng);
      pendingCoordsRef.current = {lat: nLat, lng: nLng};

      if (mapReadyRef.current) {
        runCameraMove(nLat, nLng);
        if (Platform.OS === 'android') {
          setTimeout(() => runCameraMove(nLat, nLng), 400);
        }
      }

      return buildMapRegion(nLat, nLng);
    },
    [runCameraMove],
  );

  const onMapReady = useCallback(() => {
    mapReadyRef.current = true;
    setIsMapReady(true);

    const pending = pendingCoordsRef.current;
    if (pending && isValidCoordinate(pending.lat, pending.lng)) {
      runCameraMove(pending.lat, pending.lng);
      if (Platform.OS === 'android') {
        setTimeout(() => runCameraMove(pending.lat, pending.lng), 400);
      }
    } else if (isValidCoordinate(initialLat, initialLng)) {
      runCameraMove(initialLat, initialLng);
    }

    setTimeout(() => {
      suppressRegionEventsRef.current = false;
    }, 1000);
  }, [initialLat, initialLng, runCameraMove]);

  const onRegionChangeComplete = useCallback((region, onUserMoved) => {
    if (suppressRegionEventsRef.current) {
      return;
    }
    if (!isValidCoordinate(region?.latitude, region?.longitude)) {
      return;
    }
    setMapRegion(region);
    onUserMoved?.(region.latitude, region.longitude);
  }, []);

  return {
    mapRef,
    mapRegion,
    isMapReady,
    moveMapTo,
    onMapReady,
    onRegionChangeComplete,
    suppressRegionEventsRef,
  };
};
