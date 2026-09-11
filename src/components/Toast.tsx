import { useEffect } from 'react';
import { useLocations } from '../state/LocationsProvider';

export function Toast() {
  const { state, dispatch } = useLocations();
  const { lastDeleted } = state;

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST' });
    }, 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted, dispatch]);

  if (!lastDeleted) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__message">{lastDeleted.location.name} deleted.</span>
      <button
        className="toast__action"
        onClick={() => dispatch({ type: 'UNDO_REMOVE' })}
      >
        Undo
      </button>
      <div className="toast__progress" key={lastDeleted.timestamp} />
    </div>
  );
}