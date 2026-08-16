// Leaflet must only ever be imported inside a lazy-loaded chunk.
// This file is intentionally isolated so React.lazy() can defer it
// until after the browser environment is confirmed available.
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  originCoords:      [number, number];
  currentCoords:     [number, number];
  destinationCoords: [number, number];
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

export default function TrackingMap({ originCoords, currentCoords, destinationCoords }: Props) {
  // Route line: origin → current → destination
  const routePoints: [number, number][] = [originCoords, currentCoords, destinationCoords];

  return (
    <MapContainer
      center={currentCoords}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Route line */}
      <Polyline
        positions={routePoints}
        pathOptions={{ color: "#00b8d4", weight: 3, opacity: 0.7, dashArray: "8 6" }}
      />

      {/* Origin pin */}
      <CircleMarker
        center={originCoords}
        radius={10}
        pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 1 }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>Origin</Tooltip>
      </CircleMarker>

      {/* Current location pin */}
      <CircleMarker
        center={currentCoords}
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
      <MapFitter origin={originCoords} destination={destinationCoords} current={currentCoords} />
    </MapContainer>
  );
}
