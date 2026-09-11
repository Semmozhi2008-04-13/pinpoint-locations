const PARAM = 'loc';

export function readLocationIdFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(PARAM);
  } catch {
    return null;
  }
}

export function writeLocationIdToUrl(id: string | null): void {
  try {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set(PARAM, id);
    } else {
      url.searchParams.delete(PARAM);
    }
    window.history.replaceState({}, '', url.toString());
  } catch {
    /* ignore */
  }
}