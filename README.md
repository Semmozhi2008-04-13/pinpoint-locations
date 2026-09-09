# cit-frontend-eval-2026
# Frontend Engineer Assignment

## Problem Statement

Build a web application that allows users to mark and manage their favorite locations using an interactive map.

Users should be able to click on the map to add a new favorite location. Each saved location should be displayed as a marker on the map and as an item in a sidebar list.

Users should be able to select a location from the sidebar to focus the map on that location, edit its information, or remove it from their saved locations.

The application should maintain a consistent state between the map and the sidebar at all times.

---

## Core Requirements

### 1. Interactive Map

Integrate an interactive map using a mapping library or provider of your choice, such as Mapbox or Google Maps.

Users should be able to:

- Navigate and zoom the map.
- Click on the map to select a location.
- Add the selected location to their saved locations.
- View saved locations as markers on the map.

Each saved location should contain at least:

- Unique ID
- Name
- Latitude
- Longitude

---

### 2. Saved Locations

Display all saved locations in a sidebar or dedicated panel.

Each location should provide enough information for the user to identify it.

Example:

```
Saved Locations

Bangalore
12.9716, 77.5946

Hyderabad
17.3850, 78.4867

Mumbai
19.0760, 72.8777
```

The map and sidebar must always reflect the same underlying data.

---

### 3. Location Selection

When a user selects a saved location from the sidebar:

- The location should be visually highlighted.
- The map should move or zoom to that location.
- The corresponding marker should be clearly distinguishable from other markers.

---

### 4. Edit Location

Users should be able to edit the information associated with a saved location.

At minimum, the user should be able to modify the location name.

After editing:

- The updated information should immediately appear in the sidebar.
- The corresponding marker should continue to represent the correct location.
- The updated data should be persisted.

---

### 5. Remove Location

Users should be able to remove a saved location.

When a location is removed:

- It should disappear from the sidebar.
- Its marker should be removed from the map.
- Any related selection state should be handled appropriately.

---

## Additional Requirements

### Search Locations

Add a search field that allows users to search through their saved locations by name.

The search results should update dynamically as the user types.

When a search result is selected:

- The corresponding location should become active.
- The map should automatically focus on that location.

The search should handle cases where no matching locations are found.

---

### Persist Favorite Locations

Saved locations should remain available after the page is refreshed or the browser is reopened.

You may use browser storage such as `localStorage` or another client-side persistence mechanism.

The application should correctly restore the saved locations when it is loaded again.

---

## Expected Behavior

The application should support the following flow:

```
User clicks on map
        ↓
Location is selected
        ↓
User provides a name
        ↓
Location is saved
        ↓
 ┌───────────────┐
 │               │
 ▼               ▼
Map Marker    Sidebar Item
 │               │
 └───────┬───────┘
         │
    User selects
         │
         ▼
Map focuses on location
```

The following scenarios should work correctly:

- Add a new location.
- View all saved locations.
- Select a saved location.
- Search saved locations.
- Edit a saved location.
- Delete a saved location.
- Refresh the page and retain saved locations.
- Search when no locations exist.
- Delete the currently selected location.
- Handle an empty saved-location state gracefully.

---

## Technical Expectations

Use **React** and follow a component-based architecture.

The implementation should demonstrate:

- Appropriate state management.
- Reusable components.
- Clear separation of responsibilities.
- Proper handling of user interactions.
- Responsive UI design.
- Clean and maintainable code.
- Appropriate handling of loading and error states.
- Sensible handling of browser storage and application state.

Avoid maintaining multiple independent sources of truth for the same location data.

---

## UI / UX Expectations

The application should be intuitive and usable without additional instructions.

The interface should:

- Work well on desktop and smaller screens.
- Clearly distinguish selected and unselected locations.
- Provide useful feedback when there are no saved locations.
- Provide useful feedback when a search returns no results.
- Prevent or appropriately handle invalid location names.
- Provide a clear way to add, edit, and remove locations.

The visual design is up to you. We are not looking for a specific design, but the interface should demonstrate good frontend judgment.

---

## Optional Enhancements

The following are optional and can be implemented to demonstrate additional frontend skills:

- Reverse geocoding to automatically retrieve a place name.
- Location categories or tags.
- Filtering by category.
- Sorting saved locations.
- Marker popups with additional information.
- Dragging a marker to update its coordinates.
- Undo after deleting a location.
- Dark/light map theme.
- Keyboard accessibility.
- Animations and transitions.
- URL-based sharing of a selected location.

---

## Evaluation Criteria

The submission will be evaluated based on:

1. **Functional correctness**
2. **React fundamentals**
3. **State management**
4. **Component architecture**
5. **Code quality and maintainability**
6. **User experience**
7. **Responsive design**
8. **Error and edge-case handling**
9. **Map integration**
10. **Search, editing, and persistence implementation**

Additional features will not compensate for missing or poorly implemented core requirements.

We are primarily interested in understanding how you approach the problem, structure the application, manage state, and make frontend engineering decisions.

---

## Submission Requirements

Please provide:

- Source code in a Git repository.
- A `README.md` containing setup and run instructions.
- Details of any required environment variables.
- A short explanation of the application's architecture and key technical decisions.

If optional enhancements are implemented, briefly document them in the README.
