import { useEffect } from 'react';
import { LocationsProvider, useLocations } from './state/LocationsProvider';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/MapView';

function Shell() {
  const { state } = useLocations();
  const { theme } = state;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Sidebar />
      <main className="app__map">
        <MapView />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LocationsProvider>
      <Shell />
    </LocationsProvider>
  );
}