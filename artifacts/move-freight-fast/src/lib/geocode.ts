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

/**
 * Fetch road-following geometry between two points via the OSRM public API.
 * Returns an ordered array of [lat, lng] pairs following real roads,
 * or null if the request fails (caller should fall back to a straight line).
 */
export async function getRoute(
  origin: [number, number],
  dest: [number, number],
  signal?: AbortSignal
): Promise<[number, number][] | null> {
  try {
    // OSRM expects coordinates as lng,lat
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${origin[1]},${origin[0]};${dest[1]},${dest[0]}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json() as {
      code: string;
      routes?: { geometry?: { coordinates?: [number, number][] } }[];
    };
    if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) {
      return null;
    }
    // GeoJSON coords are [lng, lat] — convert to Leaflet [lat, lng]
    return data.routes[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );
  } catch {
    return null;
  }
}

/**
 * Interpolate a point along a multi-segment polyline at fraction t ∈ [0, 1].
 * Uses Euclidean distance between coordinate pairs (adequate for the map scales
 * involved in freight routing — no need for haversine precision here).
 */
export function lerpAlongPath(
  path: [number, number][],
  t: number
): [number, number] {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return path[0];
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped === 0) return path[0];
  if (clamped === 1) return path[path.length - 1];

  // Build cumulative distance array
  const dists: number[] = [0];
  for (let i = 1; i < path.length; i++) {
    const [la1, ln1] = path[i - 1];
    const [la2, ln2] = path[i];
    dists.push(dists[i - 1] + Math.sqrt((la2 - la1) ** 2 + (ln2 - ln1) ** 2));
  }
  const total = dists[dists.length - 1];
  const target = clamped * total;

  for (let i = 1; i < dists.length; i++) {
    if (dists[i] >= target) {
      const frac = (target - dists[i - 1]) / (dists[i] - dists[i - 1]);
      const [la1, ln1] = path[i - 1];
      const [la2, ln2] = path[i];
      return [la1 + (la2 - la1) * frac, ln1 + (ln2 - ln1) * frac];
    }
  }
  return path[path.length - 1];
}
