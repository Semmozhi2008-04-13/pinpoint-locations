import { useMemo } from 'react';
import { useLocations } from '../state/LocationsProvider';
import { SearchBar } from './SearchBar';
import { LocationList } from './LocationList';
import { LocationForm } from './LocationForm';
import { EmptyState } from './EmptyState';
import { Toast } from './Toast';
import { sortLocations } from '../lib/sort';
import { CATEGORY_META, type LocationCategory } from '../types';
import type { SortMode } from '../state/locationsReducer';

export function Sidebar() {
  const { state, dispatch } = useLocations();
  const {
    locations,
    query,
    draft,
    lastDeleted,
    categoryFilter,
    favoritesOnly,
    sortMode,
    theme,
  } = state;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = locations;
    if (q) list = list.filter((l) => l.name.toLowerCase().includes(q));
    if (categoryFilter) list = list.filter((l) => l.category === categoryFilter);
    if (favoritesOnly) list = list.filter((l) => l.favorite);
    return sortLocations(list, sortMode);
  }, [locations, query, categoryFilter, favoritesOnly, sortMode]);

  const hasLocations = locations.length > 0;
  const hasResults = filtered.length > 0;
  const filterActive =
    query.trim().length > 0 || categoryFilter !== null || favoritesOnly;

  const favoriteCount = locations.filter((l) => l.favorite).length;

  return (
    <aside className="app__sidebar sidebar">
      <div className="sidebar__handle" aria-hidden="true" />

      <header className="sidebar__header">
        <div className="sidebar__title-row">
          <h1 className="sidebar__title">Saved Locations</h1>
          <div className="sidebar__title-actions">
            <button
              type="button"
              className="icon-btn"
              title={
                theme === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
              }
              aria-label="Toggle theme"
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span className="sidebar__badge">({locations.length})</span>
          </div>
        </div>

        <SearchBar />

        {hasLocations && (
          <div className="toolbar">
            <div className="toolbar__chips">
              <button
                type="button"
                className={`cat-chip cat-chip--sm ${
                  !favoritesOnly && categoryFilter === null
                    ? 'cat-chip--active'
                    : ''
                }`}
                onClick={() => {
                  dispatch({ type: 'SET_CATEGORY_FILTER', category: null });
                  if (favoritesOnly) dispatch({ type: 'TOGGLE_FAVORITES_ONLY' });
                }}
              >
                All
              </button>

              <button
                type="button"
                className={`cat-chip cat-chip--sm cat-chip--star ${
                  favoritesOnly ? 'cat-chip--active' : ''
                }`}
                onClick={() => dispatch({ type: 'TOGGLE_FAVORITES_ONLY' })}
                title={`Favorites (${favoriteCount})`}
              >
                ⭐ {favoriteCount}
              </button>

              {(Object.keys(CATEGORY_META) as LocationCategory[]).map((key) => {
                const meta = CATEGORY_META[key];
                const active = categoryFilter === key;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`cat-chip cat-chip--sm ${
                      active ? 'cat-chip--active' : ''
                    }`}
                    style={{
                      borderColor: active ? meta.color : undefined,
                      background: active ? `${meta.color}1a` : undefined,
                      color: active ? meta.color : undefined,
                    }}
                    title={meta.label}
                    onClick={() =>
                      dispatch({
                        type: 'SET_CATEGORY_FILTER',
                        category: active ? null : key,
                      })
                    }
                  >
                    {meta.emoji}
                  </button>
                );
              })}
            </div>

            <select
              className="sort-select"
              value={sortMode}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SORT',
                  mode: e.target.value as SortMode,
                })
              }
              aria-label="Sort locations"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
            </select>
          </div>
        )}
      </header>

      <div className="sidebar__body">
        {draft && <LocationForm />}

        {!hasLocations && !draft && (
          <EmptyState
            icon="pin"
            title="No saved locations yet"
            body="Click anywhere on the map to add your first place."
          />
        )}

        {hasLocations && !hasResults && !draft && (
          <EmptyState
            icon="search"
            title={
              favoritesOnly
                ? 'No favorites yet'
                : query.trim()
                  ? `No results for "${query}"`
                  : 'No locations in this category'
            }
            body={
              favoritesOnly
                ? 'Star a location to see it here.'
                : 'Try a different filter or clear it.'
            }
            action={{
              label: 'Clear filters',
              onClick: () => dispatch({ type: 'CLEAR_FILTERS' }),
            }}
          />
        )}

        {hasLocations && hasResults && (
          <LocationList locations={filtered} highlight={filterActive} />
        )}
      </div>

      {lastDeleted && <Toast />}
    </aside>
  );
}