import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { SavedLocation } from '../types';
import { CATEGORY_META } from '../types';
import { useLocations } from '../state/LocationsProvider';

function pinIcon(selected: boolean, category: keyof typeof CATEGORY_META) {
  const size = selected ? 24 : 18;
  const meta = CATEGORY_META[category];
  const bg = selected ? '#dc2626' : meta.color;
  const border = selected ? 3 : 2;
  return L.divIcon({
    className: 'pin-icon',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${bg};border:${border}px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.05),0 2px 6px rgba(0,0,0,.25);${
      selected ? 'box-shadow:0 0 0 4px rgba(220,38,38,.2),0 4px 10px rgba(0,0,0,.3);' : ''
    }"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LocationMarker({
  location,
  selected,
}: {
  location: SavedLocation;
  selected: boolean;
}) {
  const { dispatch } = useLocations();
  const meta = CATEGORY_META[location.category];

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={pinIcon(selected, location.category)}
      zIndexOffset={selected ? 1000 : 0}
      draggable
      eventHandlers={{
        click: () => dispatch({ type: 'SELECT', id: location.id }),
        dragend: (e) => {
          const { lat, lng } = (e.target as L.Marker).getLatLng();
          dispatch({ type: 'UPDATE', id: location.id, patch: { lat, lng } });
        },
      }}
    >
      <Popup>
        <div className="popup">
          <div className="popup__row">
            <span
              className="popup__dot"
              style={{ background: meta.color }}
              aria-hidden
            />
            <strong className="popup__name">{location.name}</strong>
          </div>
          <div className="popup__cat">
            {meta.emoji} {meta.label}
          </div>
          <div className="popup__coords">
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>
          <div className="popup__hint">Drag the pin to move</div>
        </div>
      </Popup>
    </Marker>
  );
}