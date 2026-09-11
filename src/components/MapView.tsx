import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useLocations } from '../state/LocationsProvider';
import { LocationMarker } from './LocationMarker';
import { DraftMarker } from './DraftMarker';
import { MapController } from './MapController';

function MapClickHandler() {
  const { dispatch } = useLocations();
  useMapEvents({
    click(e) {
      dispatch({
        type: 'SET_DRAFT',
        point: { lat: e.latlng.lat, lng: e.latlng.lng },
      });
    },
  });
  return null;
}

export function MapView() {
  const { state } = useLocations();
  const { locations, selectedId, draft, theme } = state;

  const initialCenter: [number, number] =
    locations.length > 0 ? [locations[0].lat, locations[0].lng] : [20.5937, 78.9629];
  const initialZoom = locations.length > 0 ? 5 : 4;

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      className={`map-container ${theme === 'dark' ? 'map-container--dark' : ''}`}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {locations.map((loc) => (
        <LocationMarker key={loc.id} location={loc} selected={loc.id === selectedId} />
      ))}
      {draft && <DraftMarker point={draft} />}
      <MapController />
    </MapContainer>
  );
}