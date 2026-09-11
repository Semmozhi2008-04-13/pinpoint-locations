import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocations } from '../state/LocationsProvider';

export function MapController() {
  const map = useMap();
  const { state } = useLocations();
  const { locations, selectedId, focusNonce } = state;
  const initialFitDone = useRef(false);

  useEffect(() => {
    if (initialFitDone.current) return;
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    initialFitDone.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const selected = locations.find((l) => l.id === selectedId);
    if (!selected) return;
    const targetZoom = Math.max(map.getZoom(), 13);
    map.flyTo([selected.lat, selected.lng], targetZoom, { duration: 0.7 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce]);

  return null;
}