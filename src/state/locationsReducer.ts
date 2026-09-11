import type { SavedLocation } from '../types';

export type SortMode = 'recent' | 'name' | 'category';
export type ThemeMode = 'light' | 'dark';

export interface AppState {
  locations: SavedLocation[];
  selectedId: string | null;
  draft: { lat: number; lng: number } | null;
  focusNonce: number;
  query: string;
  categoryFilter: string | null;
  favoritesOnly: boolean;
  sortMode: SortMode;
  theme: ThemeMode;
  lastDeleted: {
    location: SavedLocation;
    index: number;
    timestamp: number;
  } | null;
}

export type Action =
  | { type: 'ADD'; location: SavedLocation }
  | { type: 'UPDATE'; id: string; patch: Partial<Omit<SavedLocation, 'id'>> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UNDO_REMOVE' }
  | { type: 'DISMISS_TOAST' }
  | { type: 'SELECT'; id: string | null }
  | { type: 'SET_DRAFT'; point: { lat: number; lng: number } | null }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_CATEGORY_FILTER'; category: string | null }
  | { type: 'SET_SORT'; mode: SortMode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'TOGGLE_VISITED'; id: string }
  | { type: 'SET_NOTES'; id: string; notes: string }
  | { type: 'TOGGLE_FAVORITES_ONLY' }
  | { type: 'CLEAR_FILTERS' };

export const initialState: AppState = {
  locations: [],
  selectedId: null,
  draft: null,
  focusNonce: 0,
  query: '',
  categoryFilter: null,
  favoritesOnly: false,
  sortMode: 'recent',
  theme: 'light',
  lastDeleted: null,
};

export function locationsReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        locations: [action.location, ...state.locations],
        selectedId: action.location.id,
        draft: null,
        focusNonce: state.focusNonce + 1,
      };

    case 'UPDATE':
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.id ? { ...l, ...action.patch } : l,
        ),
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.id ? { ...l, favorite: !l.favorite } : l,
        ),
      };

    case 'TOGGLE_VISITED':
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.id ? { ...l, visited: !l.visited } : l,
        ),
      };

    case 'SET_NOTES':
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.id ? { ...l, notes: action.notes } : l,
        ),
      };

    case 'REMOVE': {
      const index = state.locations.findIndex((l) => l.id === action.id);
      if (index === -1) return state;
      const removed = state.locations[index];
      return {
        ...state,
        locations: state.locations.filter((l) => l.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        lastDeleted: { location: removed, index, timestamp: Date.now() },
      };
    }

    case 'UNDO_REMOVE': {
      if (!state.lastDeleted) return state;
      const { location, index } = state.lastDeleted;
      const next = [...state.locations];
      next.splice(Math.min(index, next.length), 0, location);
      return {
        ...state,
        locations: next,
        selectedId: location.id,
        lastDeleted: null,
        focusNonce: state.focusNonce + 1,
      };
    }

    case 'DISMISS_TOAST':
      return { ...state, lastDeleted: null };

    case 'SELECT':
      return {
        ...state,
        selectedId: action.id,
        draft: action.id !== null ? null : state.draft,
        focusNonce: state.focusNonce + 1,
      };

    case 'SET_DRAFT':
      return {
        ...state,
        draft: action.point,
        selectedId: action.point !== null ? null : state.selectedId,
      };

    case 'SET_QUERY':
      return { ...state, query: action.query };

    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.category };

    case 'SET_SORT':
      return { ...state, sortMode: action.mode };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'TOGGLE_FAVORITES_ONLY':
      return { ...state, favoritesOnly: !state.favoritesOnly };

    case 'CLEAR_FILTERS':
      return { ...state, query: '', categoryFilter: null, favoritesOnly: false };

    default:
      return state;
  }
}