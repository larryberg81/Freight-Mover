// Leaflet must only ever be imported inside a lazy-loaded chunk.
// This file is intentionally isolated so React.lazy() can defer it
// until after the browser environment is confirmed available.
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  originCoords:      [number, number];
  currentCoords:     [number, number];
  destinationCoords: [number, number];
}

export default function TrackingMap({ originCoords, currentCoords, destinationCoords }: Props) {
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
      <CircleMarker center={originCoords} radius={10} pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 1 }}>
        <Tooltip permanent direction="top" offset={[0, -10]}>Origin</Tooltip>
      </CircleMarker>
      <CircleMarker center={currentCoords} radius={12} pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 1 }}>
        <Tooltip permanent direction="top" offset={[0, -12]}>Current</Tooltip>
      </CircleMarker>
      <CircleMarker center={destinationCoords} radius={10} pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 1 }}>
        <Tooltip permanent direction="top" offset={[0, -10]}>Destination</Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
