import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Flag,
  CalendarDays,
  Weight,
  Truck,
  Download,
  Clock,
  Bell,
  Info,
  Globe,
} from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ── Mock shipment data ──────────────────────────────────────────────────────
const MOCK_SHIPMENT = {
  trackingId: "STN5088840683",
  status: "Pending",
  statusLocation: "422 wyee farms road, wyee NSW 2259 Australia",
  progress: 10,
  origin: "3175 Dandenong Vic",
  destination: "422 wyee farms road, wyee NSW 2259",
  estDelivery: "Aug 06, 2026",
  weight: "12 kg",
  serviceType: "Overnight",
  dimensions: "40 × 30 × 20 cm",
  insurance: "$0.00 Coverage",
  signatureRequired: "Yes",
  // Approximate lat/lng: origin = Dandenong VIC, destination = Wyee NSW
  originCoords: [-37.9878, 145.2151] as [number, number],
  currentCoords: [-33.5, 146.5] as [number, number], // midway (in transit)
  destinationCoords: [-33.0978, 151.4967] as [number, number],
  timeline: [
    {
      date: "Aug 06, 2026",
      time: null,
      event: "Expected Delivery",
      location: "422 wyee farms road, wyee NSW 2259",
      note: null,
      status: "pending",
    },
    {
      date: "Aug 04, 2026",
      time: "03:15 PM",
      event: "Pending",
      location: "422 wyee farms road, wyee NSW 2259 Australia",
      note: "ARB bullbar complete and white drivers side guard for 2014 holden colorado",
      status: "active",
    },
    {
      date: "Aug 04, 2026",
      time: "02:37 PM",
      event: "Pending",
      location: "Shipment information received",
      note: null,
      status: "done",
    },
  ],
};

const STEPS = ["Picked Up", "In Transit", "Out for Delivery", "Delivered"];

function getStepIndex(progress: number) {
  if (progress <= 0) return -1;
  if (progress <= 25) return 0;
  if (progress <= 50) return 1;
  if (progress <= 75) return 2;
  return 3;
}

// ── Subcomponents ───────────────────────────────────────────────────────────

function ShipmentResult({ data }: { data: typeof MOCK_SHIPMENT }) {
  const stepIdx = getStepIndex(data.progress);

  return (
    <div className="space-y-5">

      {/* ── Top card: ID / Status / Progress / Info cells ── */}
      <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-6 space-y-6">

        {/* Row 1: ID + Receipt + Status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[#00b8d4] text-xs font-semibold uppercase tracking-widest mb-1">Tracking ID</div>
            <div className="text-3xl font-bold text-white">{data.trackingId}</div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[#00b8d4] text-xs font-semibold uppercase tracking-widest mb-1">Current Status</div>
                <div className="text-white text-sm font-medium bg-[#111827] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 max-w-xs">
                  <Truck className="w-5 h-5 text-white/50 flex-shrink-0" />
                  <span className="text-white/80">{data.status} – {data.statusLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile status */}
        <div className="sm:hidden bg-[#111827] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <Truck className="w-5 h-5 text-white/50 flex-shrink-0" />
          <div>
            <div className="text-[#00b8d4] text-xs font-semibold uppercase tracking-widest mb-0.5">Current Status</div>
            <span className="text-white/80 text-sm">{data.status} – {data.statusLocation}</span>
          </div>
        </div>

        {/* Row 2: Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#00b8d4] text-sm font-semibold">Shipment Progress</span>
            <span className="text-[#00b8d4] text-sm font-semibold">{data.progress}% Complete</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full mb-3">
            <div
              className="absolute left-0 top-0 h-2 bg-[#00b8d4] rounded-full transition-all duration-700"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            {STEPS.map((step, i) => (
              <span
                key={step}
                className={`text-xs font-medium ${i <= stepIdx ? "text-[#00b8d4]" : "text-white/35"}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Row 3: 4 info cells */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MapPin, color: "text-green-400", label: "Origin", value: data.origin },
            { icon: Flag, color: "text-red-400", label: "Destination", value: data.destination },
            { icon: CalendarDays, color: "text-blue-400", label: "Est. Delivery", value: data.estDelivery },
            { icon: Weight, color: "text-purple-400", label: "Weight", value: data.weight },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="bg-[#111827] border border-white/8 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-white font-semibold text-sm">{label}</span>
              </div>
              <div className="text-white/60 text-sm leading-snug">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Tracking Map ── */}
      <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#00b8d4]" />
          <h3 className="text-white font-bold text-lg">Live Tracking Map</h3>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ height: 320 }}>
          <MapContainer
            center={data.currentCoords}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {/* Origin */}
            <CircleMarker center={data.originCoords} radius={10} pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 1 }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>Origin</Tooltip>
            </CircleMarker>
            {/* Current */}
            <CircleMarker center={data.currentCoords} radius={12} pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 1 }}>
              <Tooltip permanent direction="top" offset={[0, -12]}>Current</Tooltip>
            </CircleMarker>
            {/* Destination */}
            <CircleMarker center={data.destinationCoords} radius={10} pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 1 }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>Destination</Tooltip>
            </CircleMarker>
          </MapContainer>
        </div>
        <div className="flex items-center gap-6 mt-3">
          {[
            { color: "bg-green-500", label: "Origin" },
            { color: "bg-yellow-500", label: "Current Location" },
            { color: "bg-red-500", label: "Destination" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-white/60">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Shipment Timeline ── */}
      <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[#00b8d4]" />
          <h3 className="text-white font-bold text-lg">Shipment Timeline</h3>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />

          <div className="space-y-4">
            {data.timeline.map((entry, i) => {
              const isActive = entry.status === "active";
              const isPending = entry.status === "pending";
              return (
                <div key={i} className="flex gap-5">
                  {/* Icon bubble */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? "bg-[#0d1627] border-[#00b8d4]"
                      : isPending
                      ? "bg-[#0d1627] border-white/20"
                      : "bg-[#00b8d4]/20 border-[#00b8d4]/60"
                  }`}>
                    {isPending
                      ? <Clock className="w-4 h-4 text-white/30" />
                      : isActive
                      ? <Truck className="w-4 h-4 text-[#00b8d4]" />
                      : <MapPin className="w-4 h-4 text-[#00b8d4]" />
                    }
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-xl border px-5 py-4 mb-1 ${
                    isActive
                      ? "bg-[#111f3a] border-[#00b8d4]/30"
                      : "bg-[#111827] border-white/8"
                  }`}>
                    <div className={`text-xs font-semibold mb-1 ${isActive ? "text-[#00b8d4]" : "text-white/40"}`}>
                      {entry.date}{entry.time ? ` - ${entry.time}` : ""}
                    </div>
                    <div className="text-white font-bold text-sm mb-1">{entry.event}</div>
                    <div className="flex items-start gap-1 text-white/50 text-xs">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {entry.location}
                    </div>
                    {entry.note && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-[#00b8d4]/10 border border-[#00b8d4]/20 text-[#00b8d4] text-xs px-3 py-1 rounded-full">
                        <Info className="w-3 h-3" />
                        {entry.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Notifications + Package Details ── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Notifications */}
        <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-bold text-lg">Notifications</h3>
          </div>
          <p className="text-white/40 text-sm">No notifications available</p>
        </div>

        {/* Package Details */}
        <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info className="w-5 h-5 text-[#00b8d4]" />
            <h3 className="text-white font-bold text-lg">Package Details</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Service Type:", value: data.serviceType, valueClass: "text-white font-bold" },
              { label: "Dimensions:", value: data.dimensions, valueClass: "text-white/70" },
              { label: "Insurance:", value: data.insurance, valueClass: "text-green-400 font-semibold" },
              { label: "Signature Required:", value: data.signatureRequired, valueClass: "text-white font-bold" },
            ].map(({ label, value, valueClass }) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-white/50">{label}</span>
                <span className={valueClass}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export function Track() {
  const [trackingId, setTrackingId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<typeof MOCK_SHIPMENT | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setTrackingId(id);
      setSubmitted(true);
      setResult(MOCK_SHIPMENT);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setSubmitted(true);
    // Return mock data for any input (demo)
    setResult({ ...MOCK_SHIPMENT, trackingId: trackingId.trim() });
  }

  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">

      {/* ── Page header ── */}
      <div className="pt-32 pb-10 px-6 text-center border-b border-white/5">
        <span className="text-[#00b8d4] font-semibold tracking-widest uppercase text-sm mb-4 block">
          Real-Time Tracking
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Track Your Shipment</h1>
        <p className="text-white/55 text-lg max-w-xl mx-auto">
          Enter your tracking ID for live location updates, delivery estimates, and full shipment history.
        </p>
      </div>

      {/* ── Search + results ── */}
      <div className="flex-1 py-10 px-6">
        <div className="container mx-auto max-w-5xl space-y-6">

          {/* Search bar */}
          <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00b8d4]">
                    <path d="M3 5v14M8 5v14M12 5v14M17 5v14M21 5v14" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID (e.g. STN5088840683)"
                  className="w-full h-13 py-3.5 pl-12 pr-4 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b8d4] transition-colors text-base"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                Track Package
              </button>
            </form>
          </div>

          {/* Results */}
          {submitted && result && <ShipmentResult data={result} />}

          {/* Empty state */}
          {!submitted && (
            <div className="text-center py-16 text-white/25 text-sm">
              Enter a tracking ID above to view shipment details.
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
