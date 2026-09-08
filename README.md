# cit-frontend-eval-2026
# Frontend Engineer Assignment

## Problem Statement

Build a web application that allows users to mark and manage their favorite locations using an interactive map.

Users should be able to click on the map to add a new favorite location. Each saved location should be displayed as a marker on the map and as an item in a sidebar list.

Users should be able to select a location from the sidebar to focus the map on that location and remove locations they no longer want to keep.

### Additional Requirements

**Search Locations**

Add a search field that allows users to search through their saved locations by name. The list should update dynamically as the user types.

When a search result is selected, the map should automatically focus on the corresponding location.

**Persist Favorite Locations**

Saved locations should remain available after the page is refreshed or the browser is reopened. You may use browser storage such as `localStorage` to implement persistence.

The application should also handle cases where there are no saved locations and provide appropriate feedback to the user.

### Expected Behavior

* Clicking on the map allows a new location to be added.
* Saved locations are displayed both on the map and in the sidebar.
* Selecting a saved location focuses the map on that location.
* Locations can be removed from the sidebar.
* Removing a location also removes its marker from the map.
* Users can search/filter their saved locations.
* Selecting a search result focuses the map on that location.
* Saved locations persist across page refreshes.

### Technical Expectations

Use React and follow a component-based architecture.

The implementation should demonstrate:

* Appropriate state management
* Reusable components
* Clear separation of responsibilities
* Proper handling of user interactions
* Responsive UI
* Handling of empty and error states
* Clean and maintainable code

The application should use the existing map integration provided in the starter project.

### Evaluation

The solution will be evaluated based on:

1. Functionality
2. React fundamentals and state management
3. Component design
4. Code quality and maintainability
5. User experience
6. Responsive design
7. Handling of edge cases
8. Implementation of the additional search and persistence requirements
