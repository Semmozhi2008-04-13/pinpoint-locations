import { Marker } from 'react-leaflet';
import L from 'leaflet';

const draftIcon = L.divIcon({
  className: 'pin-icon',
  html: '<span class="pin pin--draft" style="width:20px;height:20px;"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function DraftMarker({ point }: { point: { lat: number; lng: number } }) {
  return <Marker position={[point.lat, point.lng]} icon={draftIcon} />;
}