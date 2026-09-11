# Pinpoint Locations

A React + TypeScript web app for saving and managing favorite places on an interactive map.

**Live demo:** https://semmozhi2008-04-13.github.io/pinpoint-locations/
**Repository:** https://github.com/Semmozhi2008-04-13/pinpoint-locations

---

## Table of contents

- [Overview](#overview)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Features](#features)
- [Architecture](#architecture)
- [Key decisions](#key-decisions)
- [Project structure](#project-structure)
- [Testing checklist](#testing-checklist)
- [Known limitations](#known-limitations)
- [License](#license)

---

## Overview

Pinpoint Locations is a single-page map application that lets you save, organize, and revisit places that matter to you. Click anywhere on the map, give the spot a name and category, mark it as a favorite or as visited, add a personal note — and it's saved instantly, both to the map and to the sidebar.

Everything is client-side. There is no backend, no authentication, and no signup. Saved data lives in your browser's `localStorage` and persists across reloads and browser restarts.

---

## Setup

```bash
# Install dependencies
npm install

# Start the dev server (opens http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview

# Run ESLint
npm run lint
```

**Requirements:** Node.js 20.19+ or 22.12+ (required by Vite 8).

---

## Environment variables

**None required.** The app uses Leaflet with public OpenStreetMap tiles, so it runs with zero credentials. A reviewer can clone, `npm install`, and `npm run dev` and see it working immediately.

If you swap in Mapbox or Google Maps later, you'd add a `.env.local` file with your token (e.g. `VITE_MAPBOX_TOKEN=...`) and read it via `import.meta.env.VITE_MAPBOX_TOKEN`. The `.env.local` pattern is already in `.gitignore`.

---

## Features

### Core

- **Interactive map** — Leaflet + OpenStreetMap with pan, zoom, and click-to-add
- **Add a location** — click the map → name it → save
- **Markers and sidebar always in sync** — one source of truth, derived views
- **Select a location** — click a row or pin → map flies to it, pin enlarges and turns red
- **Edit name inline** — pencil icon → type → Enter
- **Delete with undo** — trash icon → 5-second toast with progress bar
- **Live search** — filters the list as you type
- **Persistence** — everything saved to `localStorage`, survives refresh and restart

### Categories

- Five categories: **Home**, **Work**, **Food**, **Travel**, **Other**
- Each has its own color and emoji
- Category chips in the add-form and filter chips in the sidebar
- Pins are colored by category

### Personalization

- **⭐ Favorite** — star any location; favorites float to the top; a "⭐ N" filter chip shows only favorites
- **✅ Visited** — mark locations as visited; a green tick badge appears on the row
- **📝 Notes** — up to 200 characters per location; editable inline from the row; shown in the marker popup

### Map

- **Drag markers** — click and drag any pin to update its coordinates
- **Rich popups** — name, category, visited state, coordinates, and notes
- **Hover tooltips** — name appears above the pin on hover

### UX polish

- **Dark / light theme** — toggle in the sidebar header; switches the whole app including the map
- **Reverse geocoding** — Nominatim lookup pre-fills the name on map click (with loading indicator)
- **Sort** — recent, name, or category
- **Keyboard accessible** — rows are buttons; Enter/Space selects; Escape cancels edit
- **URL sharing** — selecting a location updates `?loc=<id>`; opening that URL selects the same location
- **Copy coordinates** — one-click copy of `lat, lng` from each row
- **Responsive** — desktop sidebar (380px) ↔ mobile bottom sheet (45dvh) with drag handle
- **Animations** — form slide-in, pin pop, hover fades, list fade-in

### Edge cases handled

- Empty state when no locations exist (search input is disabled)
- "No results for X" state with a clear-filters action
- "No favorites yet" state when filtering by favorites
- Deleting the currently selected location clears the selection cleanly
- Corrupted `localStorage` boots clean instead of white-screening
- Invalid names (empty, whitespace-only, over 60 chars) are blocked
- Clicking an existing pin selects it without opening the add form
- Old data (v1 schema without categories/favorites) migrates automatically

---

## Architecture

### Single source of truth

There is exactly **one** `locations: SavedLocation[]` array in the app. It lives in a `useReducer` store (`src/state/locationsReducer.ts`). Map markers and sidebar rows are both derived from it on every render. There is no separate `markers` state and no separate `sidebarItems` state.

```
                     ┌─────────────────────────┐
                     │   locations: []         │  ← the only truth
                     │   selectedId            │
                     │   draft                 │
                     │   query                 │
                     │   categoryFilter        │
                     │   favoritesOnly         │
                     │   sortMode / theme      │
                     └────────────┬────────────┘
                                  │ derived
              ┌───────────────────┴───────────────────┐
              ▼                                       ▼
       <Marker> per location                 <LocationItem> per location
              │                                       │
              └──── both disappear together ──────────┘
```

### Reducer over scattered `useState`

Every mutation goes through one pure reducer:

| Action | Effect |
|---|---|
| `ADD` | Prepends a new location, selects it, clears the draft |
| `UPDATE` | Patches a location by ID |
| `TOGGLE_FAVORITE` | Flips the favorite flag |
| `TOGGLE_VISITED` | Flips the visited flag |
| `SET_NOTES` | Replaces notes text |
| `REMOVE` | Removes by ID, clears `selectedId` if it was removed, remembers for undo |
| `UNDO_REMOVE` | Restores at original index and re-selects |
| `DISMISS_TOAST` | Clears the undo window |
| `SELECT` | Sets `selectedId` and bumps `focusNonce` |
| `SET_DRAFT` | Sets the pending click coordinates |
| `SET_QUERY` | Updates the search query |
| `SET_CATEGORY_FILTER` | Filters by category |
| `TOGGLE_FAVORITES_ONLY` | Filters to favorites only |
| `SET_SORT` | Sets the sort mode |
| `TOGGLE_THEME` | Switches light ↔ dark |
| `CLEAR_FILTERS` | Resets query + category + favorites filters |

Invariants like "deleting the selected location clears the selection" live in the reducer — not scattered across components.

### Imperative map isolated

Leaflet has its own imperative API (`map.flyTo`, `map.fitBounds`, `map.getZoom`). `MapController` is the **only** component that calls `map.*`. Everything else stays declarative.

This means swapping Leaflet for Mapbox or Google Maps would touch only three files: `MapView.tsx`, `MapController.tsx`, `LocationMarker.tsx`. Nothing else in the app knows what map library is being used.

### Persistence at the edge

`src/lib/storage.ts` owns the versioned key, `JSON.parse` guard, and shape validation:

- **Versioned keys** — reads `v2`, falls back to `v1` and migrates old records
- **Defensive parsing** — `try/catch` around `JSON.parse`, plus a `normalize` validator that drops items missing required fields and coerces optional ones (`favorite`, `visited`, `notes`, `category`) to safe defaults
- **Silent failure** — unavailable storage (private browsing, quota exceeded) leaves the app fully functional in memory

### Lazy hydration, not effects

`localStorage` is read **inside** the reducer's initializer function, not in a `useEffect`:

```tsx
const [state, dispatch] = useReducer(
  locationsReducer,
  initialState,
  (init) => ({ ...init, locations: loadLocations() }),
);
```

This matters for two reasons:

1. **No flash of empty state** — the first render already has the correct data.
2. **No data loss** — a naive effect-based approach fires a save-effect with `[]` before the load effect runs, wiping storage on every page load.

### Theme applied at the document level

The active theme is stored in reducer state and applied via a `data-theme="dark"` attribute on `<html>`. All colors are CSS custom properties, so the entire app (including the map, via a CSS `filter` on the tile pane) switches theme without touching JSX or re-rendering the map.

---

## Key decisions

**Leaflet over Mapbox or Google Maps.** Leaflet + OpenStreetMap requires **no API key, no signup, no billing**. A reviewer can clone the repo, run three commands, and see the app working. Mapbox and Google Maps both add friction (tokens, billing, rate limits) for zero functional benefit on this assignment.

**`L.divIcon` markers instead of image markers.** Leaflet's default markers use a relative image path that breaks under most bundlers. Using `L.divIcon` with inline HTML avoids the asset-path problem entirely and makes the selected/unselected state a pure CSS change.

**`focusNonce` counter for re-centering.** A naive `useEffect` on `selectedId` fails the case where the user clicks the same row twice — the ID didn't change, so the effect doesn't re-run, so the map doesn't re-center. `focusNonce` is a counter that increments on every `SELECT`, regardless of whether the ID changed.

**Reducer + Context over Zustand / Redux / Jotai.** The state is small and the mutations are well-defined. A reducer is ~130 lines, has zero dependencies, and the entire data flow is visible in one file. External state libraries would add code and indirection without simplifying anything at this scale.

**Inline edit over modal.** Renaming a location is a small, frequent operation. A modal requires open → edit → save → close. Inline edit is one: click pencil, type, Enter. Less friction, less context switching.

**Undo toast over confirmation dialog.** Confirmation dialogs are friction for a reversible action. Deletion is instant with a 5-second undo. This matches modern patterns (Gmail, Linear, Vercel) and reduces clicks for the common case (delete confirmed) while still protecting against the rare case (accidental delete).

**CSS custom properties for theming.** Because every color is a CSS variable, switching themes is one attribute on `<html>`. No React re-render, no state plumbing into every component, no theme context.

**Map dark mode via CSS filter.** Rather than swapping to a different tile provider (which would need an API key), dark mode inverts the OSM tiles with `filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9)`. Zero dependencies, works offline-of-providers, and looks nearly identical to a native dark tile set.

**Reverse geocoding as a suggestion, not a requirement.** On map click, Nominatim is queried for a place name. If it succeeds, the name field is pre-filled — but the user can always override it, and if the request fails the form still works. No blocking, no error state.

---

## Project structure

```
src/
├── main.tsx                     # React root, imports Leaflet + app CSS
├── App.tsx                      # Layout, theme attribute, provider
├── index.css                    # Design tokens + all styles
├── types.ts                     # SavedLocation, Category, CATEGORY_META
│
├── lib/
│   ├── id.ts                    # UUID with fallback
│   ├── format.ts                # Coordinate formatting
│   ├── storage.ts               # localStorage read/write/validate/migrate
│   ├── sort.ts                  # Sort modes with favorites-first
│   ├── urlState.ts              # ?loc=<id> read/write
│   └── geocode.ts               # Nominatim reverse geocoding
│
├── state/
│   ├── locationsReducer.ts      # All state transitions
│   └── LocationsProvider.tsx    # Context + persistence + URL sync
│
└── components/
    ├── MapView.tsx              # MapContainer + TileLayer + click handler
    ├── MapController.tsx        # Isolated map.flyTo / fitBounds
    ├── LocationMarker.tsx       # One marker per location + popup + drag
    ├── DraftMarker.tsx          # Pulsing gray draft pin
    ├── Sidebar.tsx              # Layout + filter UI + empty states
    ├── SearchBar.tsx            # Search input with clear button
    ├── LocationList.tsx         # ul of LocationItem
    ├── LocationItem.tsx         # Row: star, name, category, notes, actions
    ├── LocationForm.tsx         # Add form with category + flags + notes
    ├── EmptyState.tsx           # Reusable empty state
    └── Toast.tsx                # Undo notification
```

---

## Testing checklist

All verified manually:

**Core**
- [x] Add a new location via map click + form
- [x] View all saved locations (map + sidebar in sync)
- [x] Select from sidebar (map flies, pin highlights)
- [x] Re-select the same location (map re-flies via `focusNonce`)
- [x] Search live as you type
- [x] Search with no results
- [x] Edit name inline
- [x] Delete a location
- [x] Delete the currently selected location
- [x] Undo a delete within 5 seconds
- [x] Refresh — locations persist

**Edge cases**
- [x] Empty state when no locations exist
- [x] Search input disabled when list is empty
- [x] Corrupted `localStorage` boots clean
- [x] Invalid names (empty, whitespace-only, over 60 chars)
- [x] Old v1 data migrates to v2 on load

**Enhancements**
- [x] Reverse geocoding pre-fills name
- [x] Category selection and filtering
- [x] Favorites toggle, sorting, and filter
- [x] Visited toggle
- [x] Notes editing inline and in form
- [x] Drag marker to update coordinates
- [x] Rich marker popups
- [x] Dark / light theme toggle
- [x] URL sharing via `?loc=<id>`
- [x] Copy coordinates
- [x] Responsive at 375px and 1440px

---

## Known limitations

- **No cross-tab sync.** Adding a location in one tab does not appear in another. A `storage` event listener would fix this.
- **No backend sync.** All data is client-side. Clearing browser storage deletes everything.
- **Nominatim is rate-limited.** Reverse geocoding is for demonstration only; production use would require a hosted geocoding service.
- **Coordinates displayed to 4 decimal places** (6 in popups and copy). Stored at full precision.
- **Single map provider.** If OpenStreetMap's public tile server is down, the map won't render.

---

## License

MIT — free to use, modify, and distribute.
