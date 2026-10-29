// Leaflet must only ever be imported inside a lazy-loaded chunk.
// This file is intentionally isolated so React.lazy() can defer it
// until after the browser environment is confirmed available.
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getRoute, lerpAlongPath } from "../lib/geocode";

interface Props {
  originCoords:      [number, number];
  /** Straight-line fallback position; only used when road routing is unavailable. */
  currentCoords:     [number, number];
  destinationCoords: [number, number];
  /** Progress fraction 0–1 along the route; used to place the pin on real roads. */
  progress?: number;
}

/** Recenter + re-fit the map whenever coordinates change (e.g. after geocoding). */
function MapFitter({ origin, destination, current }: {
  origin: [number, number];
  destination: [number, number];
  current: [number, number];
}) {
  const map = useMap();
  useEffect(() => {
    const bounds: [number, number][] = [origin, current, destination];
    // If all three points are identical (geocoding failed / same address), just centre on that point.
    const unique = bounds.filter(
      (b, i) => i === 0 || b[0] !== bounds[i - 1][0] || b[1] !== bounds[i - 1][1]
    );
    if (unique.length === 1) {
      map.setView(unique[0], 10, { animate: true });
    } else {
      map.fitBounds(bounds, { padding: [40, 40], animate: true, maxZoom: 12 });
    }
  }, [origin[0], origin[1], destination[0], destination[1], current[0], current[1]]);
  return null;
}

export default function TrackingMap({
  originCoords,
  currentCoords,
  destinationCoords,
  progress = 0.5,
}: Props) {
  // Road-geometry state; null = not yet fetched, [] = fetch failed (use fallback)
  const [roadPath, setRoadPath] = useState<[number, number][] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any in-flight routing request before starting a new one
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setRoadPath(null); // show straight line while fetching

    getRoute(originCoords, destinationCoords, ctrl.signal).then((path) => {
      if (ctrl.signal.aborted) return;
      // null = API failed → keep null so we fall back to straight-line rendering
      setRoadPath(path);
    });

    return () => ctrl.abort();
  }, [
    originCoords[0], originCoords[1],
    destinationCoords[0], destinationCoords[1],
  ]);

  // Resolved current position: on-road when routing succeeded, straight-line fallback otherwise
  const resolvedCurrent: [number, number] =
    roadPath && roadPath.length >= 2
      ? lerpAlongPath(roadPath, progress)
      : currentCoords;

  // Polyline positions: road geometry when available, straight line as fallback
  const polylinePositions: [number, number][] =
    roadPath && roadPath.length >= 2
      ? roadPath
      : [originCoords, currentCoords, destinationCoords];

  // While the route is loading show the straight dashed line until road data arrives
  const isDashed = !roadPath || roadPath.length < 2;

  return (
    <MapContainer
      center={resolvedCurrent}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route line — solid road geometry when available, dashed straight line as fallback */}
      <Polyline
        positions={polylinePositions}
        pathOptions={
          isDashed
            ? { color: "#00b8d4", weight: 3, opacity: 0.7, dashArray: "8 6" }
            : { color: "#00b8d4", weight: 3, opacity: 0.85 }
        }
      />

      {/* Origin pin */}
      <CircleMarker
        center={originCoords}
        radius={10}
        pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>Origin</Tooltip>
      </CircleMarker>

      {/* Current location pin — on real road when route is available */}
      <CircleMarker
        center={resolvedCurrent}
        radius={12}
        pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -12]}>Current</Tooltip>
      </CircleMarker>

      {/* Destination pin */}
      <CircleMarker
        center={destinationCoords}
        radius={10}
        pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>Destination</Tooltip>
      </CircleMarker>

      {/* Auto-fit map bounds after geocoding resolves */}
      <MapFitter origin={originCoords} destination={destinationCoords} current={resolvedCurrent} />
    </MapContainer>
  );
}
