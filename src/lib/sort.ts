import type { SavedLocation } from '../types';
import type { SortMode } from '../state/locationsReducer';

export function sortLocations(
  locations: SavedLocation[],
  mode: SortMode,
): SavedLocation[] {
  const copy = [...locations];
  switch (mode) {
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':
      return copy.sort((a, b) => a.category.localeCompare(b.category));
    case 'recent':
    default:
      return copy; // array is already ordered newest-first
  }
}