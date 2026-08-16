import { Router } from "express";

const router = Router();

// In-memory cache: normalised address string → [lat, lng]
// Lives for the lifetime of the server process; avoids redundant Nominatim hits.
const cache = new Map<string, [number, number]>();

/**
 * GET /api/geocode?q=<address>
 *
 * Proxies to Nominatim so the browser never sends User-Agent or the raw
 * address string directly to a third-party service.
 *
 * Response shapes:
 *   200  { lat: number, lng: number }   – successfully resolved
 *   400  { error: string }              – missing/empty query
 *   404  { error: string }              – no result found
 *   502  { error: string }              – upstream fetch failed
 */
router.get("/geocode", async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim();
  if (!q) {
    res.status(400).json({ error: "Missing query parameter: q" });
    return;
  }

  const key = q.toLowerCase();

  // Serve from cache when available
  const cached = cache.get(key);
  if (cached) {
    res.json({ lat: cached[0], lng: cached[1] });
    return;
  }

  try {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json` +
      `&q=${encodeURIComponent(q)}` +
      `&countrycodes=au` +
      `&limit=1`;

    const upstream = await fetch(url, {
      headers: {
        // Server-side fetch allows setting User-Agent; required by Nominatim ToS.
        "User-Agent": "MoveFreightFast/1.0 (freight-tracking-demo; server-proxy)",
        "Accept-Language": "en",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      res.status(502).json({ error: `Nominatim returned ${upstream.status}` });
      return;
    }

    const data = await upstream.json() as Array<{ lat: string; lon: string }>;

    if (!Array.isArray(data) || data.length === 0) {
      res.status(404).json({ error: "No result found for that address" });
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    cache.set(key, [lat, lng]);

    res.json({ lat, lng });
  } catch (err) {
    res.status(502).json({ error: "Geocoding upstream request failed" });
  }
});

export default router;
