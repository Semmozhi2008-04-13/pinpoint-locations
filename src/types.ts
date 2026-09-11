export type LocationCategory = 'home' | 'work' | 'food' | 'travel' | 'other';

export interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: LocationCategory;
  favorite: boolean;
  visited: boolean;
  notes: string;
  createdAt: number;
}

export const CATEGORY_META: Record<
  LocationCategory,
  { label: string; color: string; emoji: string }
> = {
  home:   { label: 'Home',   color: '#10b981', emoji: '🏠' },
  work:   { label: 'Work',   color: '#3b82f6', emoji: '💼' },
  food:   { label: 'Food',   color: '#f59e0b', emoji: '🍽️' },
  travel: { label: 'Travel', color: '#8b5cf6', emoji: '✈️' },
  other:  { label: 'Other',  color: '#6b7280', emoji: '📍' },
};

export const MAX_NOTES = 200;
export const MAX_NAME = 60;