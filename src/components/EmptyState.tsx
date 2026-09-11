interface EmptyStateProps {
  icon: 'pin' | 'search';
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__icon">
        {icon === 'pin' ? (
          <svg
            width="28"
            height="28"
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
        ) : (
          <svg
            width="28"
            height="28"
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
        )}
      </div>
      <h3 className="empty__title">{title}</h3>
      <p className="empty__body">{body}</p>
      {action && (
        <button
          type="button"
          className="btn btn--secondary empty__action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}