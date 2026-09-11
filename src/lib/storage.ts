import type { SavedLocation, LocationCategory } from '../types';

const KEY = 'cit-frontend-eval-2026:locations:v2';
const LEGACY_KEY = 'cit-frontend-eval-2026:locations:v1';

const VALID_CATEGORIES: LocationCategory[] = [
  'home', 'work', 'food', 'travel', 'other',
];

function isCategory(v: unknown): v is LocationCategory {
  return typeof v === 'string' && VALID_CATEGORIES.includes(v as LocationCategory);
}

function normalize(v: unknown): SavedLocation | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;
  if (
    typeof o.id !== 'string' ||
    typeof o.name !== 'string' ||
    typeof o.lat !== 'number' ||
    typeof o.lng !== 'number' ||
    !Number.isFinite(o.lat) ||
    !Number.isFinite(o.lng) ||
    o.lat < -90 ||
    o.lat > 90 ||
    o.lng < -180 ||
    o.lng > 180
  ) {
    return null;
  }
  return {
    id: o.id,
    name: o.name,
    lat: o.lat,
    lng: o.lng,
    category: isCategory(o.category) ? o.category : 'other',
    favorite: typeof o.favorite === 'boolean' ? o.favorite : false,
    visited: typeof o.visited === 'boolean' ? o.visited : false,
    notes: typeof o.notes === 'string' ? o.notes : '',
    createdAt: typeof o.createdAt === 'number' ? o.createdAt : Date.now(),
  };
}

export function loadLocations(): SavedLocation[] {
  try {
    let raw = localStorage.getItem(KEY);
    if (!raw) raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalize).filter((l): l is SavedLocation => l !== null);
  } catch {
    return [];
  }
}

export function saveLocations(locations: SavedLocation[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(locations));
  } catch {
    /* quota exceeded / disabled */
  }
}