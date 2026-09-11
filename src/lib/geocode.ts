export async function reverseGeocode(
  lat: number,
  lng: number,
  signal: AbortSignal,
): Promise<string | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lng));
    url.searchParams.set('zoom', '14');

    const res = await fetch(url, {
      signal,
      headers: { 'Accept-Language': navigator.language || 'en' },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (typeof data !== 'object' || data === null) return null;
    const name = (data as { name?: string; display_name?: string }).name;
    const display = (data as { display_name?: string }).display_name;
    const raw = name || display || '';
    return raw.split(',')[0]?.trim() || null;
  } catch {
    return null;
  }
}