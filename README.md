# Pinpoint Locations

A React + TypeScript web app for saving and managing favorite places on an interactive map.

**Live demo:** https://semmozhi2008-04-13.github.io/pinpoint-locations/
**Repository:** https://github.com/Semmozhi2008-04-13/pinpoint-locations

---

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

**Requirements:** Node.js 20.19+ or 22.12+ (required by Vite 8).

---

## Environment variables

**None required.** The app uses Leaflet with public OpenStreetMap tiles — no API key, no signup, no billing. A reviewer can clone, `npm install`, and `npm run dev` and see it working immediately.

---

## Features

**Core**
- Interactive map (Leaflet + OpenStreetMap) with pan, zoom, and click-to-add
- Click the map → name it → saved as a marker and a sidebar row, always in sync
- Select from sidebar → map flies to it, pin enlarges and turns red
- Edit name inline · Delete with a 5-second undo toast
- Live search · Persistence via `localStorage`

**Extras**
- ⭐ Favorite · ✅ Visited · 📝 Notes (up to 200 chars)
- Categories with color-coded pins (Home, Work, Food, Travel, Other)
- Filter by category or favorites · Sort by recent, name, or category
- Reverse geocoding — pre-fills the name on map click (Nominatim)
- Drag markers to reposition · Rich popups · Hover tooltips
- Dark / light theme toggle
- URL sharing via `?loc=<id>` · Copy coordinates
- Responsive: desktop sidebar ↔ mobile bottom sheet
- Keyboard accessible

**Edge cases handled**
- Empty state (search disabled when nothing to search)
- "No results for X" state with clear-filters action
- "No favorites yet" state
- Deleting the selected location clears the selection cleanly
- Corrupted `localStorage` boots clean
- Invalid names (empty, whitespace-only, over 60 chars) are blocked

---

## Architecture

**Single source of truth.** One `locations: SavedLocation[]` array lives in a `useReducer` store. Map markers and sidebar rows are both derived from it — no duplicated state anywhere.

```
        ┌─────────────────────────┐
        │   locations: []         │  ← the only truth
        │   selectedId, draft     │
        │   query, filters, theme │
        └────────────┬────────────┘
                     │ derived
         ┌───────────┴───────────┐
         ▼                       ▼
   <Marker> per loc       <LocationItem> per loc
         └─── both disappear together ───┘
```

**Reducer over scattered `useState`.** All 16 mutations (`ADD`, `UPDATE`, `REMOVE`, `SELECT`, `TOGGLE_FAVORITE`, …) go through one pure reducer. Invariants like *"deleting the selected location clears the selection"* live in one place.

**Imperative map isolated.** `MapController` is the only component that calls `map.flyTo` / `map.fitBounds`. Everything else stays declarative. Swapping Leaflet for Mapbox would touch only 3 files.

**Persistence at the edge.** `storage.ts` owns the versioned key, `JSON.parse` guard, and shape validation. Old v1 data auto-migrates to v2. Corrupted storage boots clean. Unavailable storage fails silently.

**Lazy hydration.** `localStorage` is read inside the reducer's initializer — not in a `useEffect` — so there's no flash of empty state and no risk of an effect wiping data on load.

**Theme at the document level.** The active theme is applied as `data-theme="dark"` on `<html>`. All colors are CSS variables, so switching is one attribute change. The map is darkened via a CSS `filter` on the tile pane — no API key needed.

---

## Project structure

```
src/
├── main.tsx                 # React root + Leaflet CSS
├── App.tsx                  # Layout + theme + provider
├── index.css                # Design tokens + all styles
├── types.ts                 # SavedLocation, CATEGORY_META
├── lib/
│   ├── id.ts                # UUID with fallback
│   ├── format.ts            # Coordinate formatting
│   ├── storage.ts           # localStorage read/write/validate
│   ├── sort.ts              # Sort modes
│   ├── urlState.ts          # ?loc= sync
│   └── geocode.ts           # Nominatim reverse geocoding
├── state/
│   ├── locationsReducer.ts  # All state transitions
│   └── LocationsProvider.tsx
└── components/
    ├── MapView.tsx
    ├── MapController.tsx
    ├── LocationMarker.tsx
    ├── DraftMarker.tsx
    ├── Sidebar.tsx
    ├── SearchBar.tsx
    ├── LocationList.tsx
    ├── LocationItem.tsx
    ├── LocationForm.tsx
    ├── EmptyState.tsx
    └── Toast.tsx
```

---

## Key decisions

- **Leaflet over Mapbox/Google** — zero credentials, runs instantly for any reviewer.
- **`L.divIcon` markers** — avoids the well-known bundler asset-path issue; selection is a pure CSS swap.
- **`focusNonce` counter** — re-selecting the same row still re-centers the map; a plain `selectedId` effect wouldn't re-fire.
- **Reducer + Context over Zustand/Redux** — small state, well-defined mutations, zero dependencies.
- **Inline edit over modal** — click pencil → type → Enter. One interaction instead of four.
- **Undo toast over confirmation dialog** — friction-free for the common case, still safe for accidents.

---

## Testing checklist

- [x] Add / view / select / edit / delete locations
- [x] Search live · no-results state · disabled when empty
- [x] Delete selected location → selection clears cleanly
- [x] Undo delete within 5 seconds
- [x] Refresh persists data · corrupted storage boots clean
- [x] Favorites, visited, notes, categories, filters, sorting
- [x] Dark/light theme · drag markers · URL sharing
- [x] Responsive at 375px and 1440px
- [x] Keyboard navigation

---

## Known limitations

- No cross-tab sync (would need a `storage` event listener).
- No backend — all data is client-side; clearing browser storage deletes everything.
- Nominatim is rate-limited; reverse geocoding is for demonstration only.

---

## License

MIT
