import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  locationsReducer,
  initialState,
  type Action,
  type AppState,
} from './locationsReducer';
import { loadLocations, saveLocations } from '../lib/storage';
import {
  readLocationIdFromUrl,
  writeLocationIdToUrl,
} from '../lib/urlState';

interface ContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const LocationsContext = createContext<ContextValue | null>(null);

export function LocationsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    locationsReducer,
    initialState,
    (init): AppState => {
      const locations = loadLocations();
      const urlId = readLocationIdFromUrl();
      const validId =
        urlId && locations.some((l) => l.id === urlId) ? urlId : null;
      return {
        ...init,
        locations,
        selectedId: validId,
        focusNonce: validId ? 1 : 0,
      };
    },
  );

  useEffect(() => {
    saveLocations(state.locations);
  }, [state.locations]);

  useEffect(() => {
    writeLocationIdToUrl(state.selectedId);
  }, [state.selectedId]);

  return (
    <LocationsContext.Provider value={{ state, dispatch }}>
      {children}
    </LocationsContext.Provider>
  );
}

export function useLocations(): ContextValue {
  const ctx = useContext(LocationsContext);
  if (!ctx) throw new Error('useLocations must be used inside <LocationsProvider>');
  return ctx;
}