import type { SavedLocation } from '../types';
import { useLocations } from '../state/LocationsProvider';
import { LocationItem } from './LocationItem';

export function LocationList({
  locations,
  highlight = false,
}: {
  locations: SavedLocation[];
  highlight?: boolean;
}) {
  const { state } = useLocations();
  return (
    <ul className={`list ${highlight ? 'list--filtered' : ''}`}>
      {locations.map((loc) => (
        <li key={loc.id}>
          <LocationItem location={loc} selected={loc.id === state.selectedId} />
        </li>
      ))}
    </ul>
  );
}