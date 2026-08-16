// Geocoding utility — calls the /api/geocode server-side proxy.
// The proxy handles the Nominatim request with a proper User-Agent and
// server-side caching, keeping address data off the browser's network traffic.

// Default coords when geocoding cannot resolve an address.
// Geographic centre of Australia — visually obvious as "wrong" so the UI
// knows to signal a lookup failure rather than silently show a bad pin.
export const AUSTRALIA_CENTRE: [number, number] = [-25.2744, 133.7751];

/**
 * Resolve an address string to [lat, lng] via the server-side geocoding proxy.
 * Returns null when the lookup fails (caller should apply a fallback).
 */
export async function geocodeAddress(
  address: string,
  signal?: AbortSignal
): Promise<[number, number] | null> {
  const q = address.trim();
  if (!q) return null;

  try {
    const url = `/api/geocode?q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { signal });

    if (!res.ok) return null;

    const data = await res.json() as { lat?: number; lng?: number };
    if (typeof data.lat === "number" && typeof data.lng === "number") {
      return [data.lat, data.lng];
    }
  } catch (err) {
    // AbortError from a cancelled lookup or other network errors — return null.
  }

  return null;
}

/**
 * Linearly interpolate between two coordinate pairs by fraction t ∈ [0, 1].
 * Used to place the "current location" pin along the route.
 */
export function lerpCoords(
  a: [number, number],
  b: [number, number],
  t: number
): [number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * clamped,
    a[1] + (b[1] - a[1]) * clamped,
  ];
}
