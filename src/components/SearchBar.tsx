import { useLocations } from '../state/LocationsProvider';

export function SearchBar() {
  const { state, dispatch } = useLocations();
  const { query, locations } = state;
  const disabled = locations.length === 0;

  return (
    <div className="search">
      <span className="search__icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        className="search__input"
        type="text"
        value={query}
        onChange={(e) => dispatch({ type: 'SET_QUERY', query: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Escape') dispatch({ type: 'SET_QUERY', query: '' });
        }}
        placeholder="Search places…"
        disabled={disabled}
        aria-label="Search saved locations"
      />
      {query && (
        <button
          className="search__clear"
          onClick={() => dispatch({ type: 'SET_QUERY', query: '' })}
          aria-label="Clear search"
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}