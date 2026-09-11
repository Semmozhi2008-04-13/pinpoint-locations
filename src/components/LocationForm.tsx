import { useEffect, useRef, useState } from 'react';
import { useLocations } from '../state/LocationsProvider';
import { createId } from '../lib/id';
import { formatLatLng } from '../lib/format';
import { reverseGeocode } from '../lib/geocode';
import {
  CATEGORY_META,
  MAX_NAME,
  MAX_NOTES,
  type LocationCategory,
} from '../types';

export function LocationForm() {
  const { state, dispatch } = useLocations();
  const { draft } = state;
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<LocationCategory>('other');
  const [favorite, setFavorite] = useState(false);
  const [visited, setVisited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft) return;
    const controller = new AbortController();
    setLoading(true);
    setSuggested(null);
    reverseGeocode(draft.lat, draft.lng, controller.signal)
      .then((result) => {
        if (result) {
          setSuggested(result);
          setName((current) => (current.trim() ? current : result));
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [draft?.lat, draft?.lng]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [draft?.lat, draft?.lng]);

  if (!draft) return null;

  const trimmed = name.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= MAX_NAME;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !draft) return;
    dispatch({
      type: 'ADD',
      location: {
        id: createId(),
        name: trimmed,
        lat: draft.lat,
        lng: draft.lng,
        category,
        favorite,
        visited,
        notes: notes.trim(),
        createdAt: Date.now(),
      },
    });
  }

  function handleCancel() {
    dispatch({ type: 'SET_DRAFT', point: null });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__header">
        <span className="form__label">New location</span>
        <button
          type="button"
          className="form__close"
          onClick={handleCancel}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <input
        ref={inputRef}
        className="form__input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={MAX_NAME}
        placeholder={loading ? 'Looking up place…' : 'Name this place…'}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleCancel();
        }}
      />

      {suggested && (
        <div className="form__suggestion">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 2" />
          </svg>
          Suggested: {suggested}
        </div>
      )}

      <div className="form__cats">
        {(Object.keys(CATEGORY_META) as LocationCategory[]).map((key) => {
          const meta = CATEGORY_META[key];
          const active = category === key;
          return (
            <button
              type="button"
              key={key}
              className={`cat-chip ${active ? 'cat-chip--active' : ''}`}
              style={{
                borderColor: active ? meta.color : undefined,
                background: active ? `${meta.color}1a` : undefined,
                color: active ? meta.color : undefined,
              }}
              onClick={() => setCategory(key)}
            >
              <span>{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="form__flags">
        <button
          type="button"
          className={`flag-toggle ${favorite ? 'flag-toggle--active' : ''}`}
          onClick={() => setFavorite((v) => !v)}
          aria-pressed={favorite}
        >
          <span className="flag-toggle__icon">{favorite ? '⭐' : '☆'}</span>
          {favorite ? 'Favorited' : 'Add to favorites'}
        </button>
        <button
          type="button"
          className={`flag-toggle ${visited ? 'flag-toggle--active' : ''}`}
          onClick={() => setVisited((v) => !v)}
          aria-pressed={visited}
        >
          <span className="flag-toggle__icon">{visited ? '✅' : '☐'}</span>
          {visited ? 'Visited' : 'Mark visited'}
        </button>
      </div>

      {!showMore ? (
        <button
          type="button"
          className="form__more"
          onClick={() => setShowMore(true)}
        >
          + Add a note
        </button>
      ) : (
        <div className="form__notes-wrap">
          <textarea
            className="form__textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={MAX_NOTES}
            placeholder="Add a personal note, wish, or memory…"
            rows={3}
          />
          <div className="form__counter">
            {notes.length}/{MAX_NOTES}
          </div>
        </div>
      )}

      <div className="form__coords">
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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{formatLatLng(draft.lat, draft.lng)}</span>
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn--secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!isValid}>
          Save
        </button>
      </div>
    </form>
  );
}