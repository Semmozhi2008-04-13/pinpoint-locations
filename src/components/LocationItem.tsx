import { useState } from 'react';
import type { SavedLocation } from '../types';
import { CATEGORY_META, MAX_NAME, MAX_NOTES } from '../types';
import { useLocations } from '../state/LocationsProvider';
import { formatLatLng } from '../lib/format';

export function LocationItem({
  location,
  selected,
}: {
  location: SavedLocation;
  selected: boolean;
}) {
  const { dispatch } = useLocations();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(location.name);
  const [notes, setNotes] = useState(location.notes);
  const [editingNotes, setEditingNotes] = useState(false);
  const meta = CATEGORY_META[location.category];

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && trimmed.length <= MAX_NAME;

  function handleSelect() {
    if (editing || editingNotes) return;
    dispatch({ type: 'SELECT', id: location.id });
  }

  function handleStar(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', id: location.id });
  }

  function handleVisited(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_VISITED', id: location.id });
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setName(location.name);
    setEditing(true);
  }

  function handleEditNotes(e: React.MouseEvent) {
    e.stopPropagation();
    setNotes(location.notes);
    setEditingNotes(true);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'REMOVE', id: location.id });
  }

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const text = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    void navigator.clipboard?.writeText(text);
  }

  function handleSaveName(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSave) return;
    dispatch({ type: 'UPDATE', id: location.id, patch: { name: trimmed } });
    setEditing(false);
  }

  function handleCancelName(e?: React.MouseEvent) {
    e?.stopPropagation();
    setName(location.name);
    setEditing(false);
  }

  function handleSaveNotes(e?: React.FormEvent) {
    e?.preventDefault();
    dispatch({ type: 'SET_NOTES', id: location.id, notes: notes.trim() });
    setEditingNotes(false);
  }

  function handleCancelNotes(e?: React.MouseEvent) {
    e?.stopPropagation();
    setNotes(location.notes);
    setEditingNotes(false);
  }

  if (editing) {
    return (
      <div
        className={`list__item list__item--edit ${
          selected ? 'list__item--selected' : ''
        }`}
      >
        <span className={`list__dot ${selected ? 'list__dot--selected' : ''}`} />
        <form className="list__edit-form" onSubmit={handleSaveName}>
          <input
            autoFocus
            className="list__edit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancelName();
            }}
            onBlur={(e) => {
              const next = e.relatedTarget as Node | null;
              if (next && e.currentTarget.parentElement?.contains(next)) return;
              handleCancelName();
            }}
          />
          <button
            type="submit"
            className="icon-btn icon-btn--save"
            disabled={!canSave}
            aria-label="Save name"
            onMouseDown={(e) => e.preventDefault()}
          >
            ✓
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={handleCancelName}
            aria-label="Cancel edit"
            onMouseDown={(e) => e.preventDefault()}
          >
            ✕
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`list__item ${selected ? 'list__item--selected' : ''} ${
        location.favorite ? 'list__item--favorite' : ''
      }`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      aria-current={selected ? 'true' : undefined}
    >
      <button
        type="button"
        className={`star-btn ${location.favorite ? 'star-btn--on' : ''}`}
        onClick={handleStar}
        aria-label={location.favorite ? 'Unfavorite' : 'Favorite'}
        title={location.favorite ? 'Unfavorite' : 'Favorite'}
      >
        {location.favorite ? '★' : '☆'}
      </button>

      <div className="list__content">
        <div className="list__name-row">
          <span className="list__name" title={location.name}>
            {location.name}
          </span>
          {location.visited && (
            <span className="list__visited" title="Visited">
              ✓
            </span>
          )}
        </div>

        <div className="list__coords">
          <span className="list__cat" style={{ color: meta.color }}>
            {meta.emoji} {meta.label}
          </span>
          <span className="list__sep">·</span>
          <span className="list__coord-num">
            {formatLatLng(location.lat, location.lng)}
          </span>
        </div>

        {editingNotes ? (
          <form className="list__notes-form" onSubmit={handleSaveNotes}>
            <textarea
              autoFocus
              className="list__notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={MAX_NOTES}
              rows={2}
              placeholder="Add a note…"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCancelNotes();
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSaveNotes(e);
                }
              }}
            />
            <div className="list__notes-actions">
              <button
                type="submit"
                className="icon-btn icon-btn--save"
                aria-label="Save note"
              >
                ✓
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={handleCancelNotes}
                aria-label="Cancel note"
              >
                ✕
              </button>
            </div>
          </form>
        ) : location.notes ? (
          <div
            className="list__note-preview"
            onClick={handleEditNotes}
            role="button"
            tabIndex={-1}
            title="Click to edit note"
          >
            📝 {location.notes}
          </div>
        ) : null}
      </div>

      <div className="list__actions">
        <button
          className="icon-btn"
          aria-label="Toggle visited"
          title={location.visited ? 'Mark unvisited' : 'Mark visited'}
          onClick={handleVisited}
        >
          {location.visited ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          )}
        </button>
        <button
          className="icon-btn"
          aria-label="Edit note"
          title="Edit note"
          onClick={handleEditNotes}
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </button>
        <button
          className="icon-btn"
          aria-label="Copy coordinates"
          title="Copy coordinates"
          onClick={handleCopy}
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
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        <button
          className="icon-btn"
          aria-label="Edit name"
          title="Edit name"
          onClick={handleEdit}
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
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="icon-btn icon-btn--danger"
          aria-label="Delete location"
          title="Delete"
          onClick={handleDelete}
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
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}