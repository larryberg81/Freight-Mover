import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "wouter";
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
  AlertCircle,
} from "lucide-react";
import { getShipments } from "../lib/shipmentStore";
import { geocodeAddress, lerpCoords, AUSTRALIA_CENTRE } from "../lib/geocode";

// Lazy-load the Leaflet map so it never runs at module-eval time in production.
// Leaflet accesses window/document on import, which crashes during SSR/build.
const TrackingMap = lazy(() => import("../components/TrackingMap"));

// ── Store lookup ─────────────────────────────────────────────────────────────

interface ShipmentDisplay {
  trackingId: string;
  receiptDate: string;
  status: string;
  paymentStatus: string;
  paymentMode: string;
  baseShippingRate: number;
  weightCharges: number;
  insuranceFee: number;
  statusLocation: string;
  progress: number;
  senderName: string;
  senderContact: string;
  senderEmail: string;
  senderAddress: string;
  receiverName: string;
  receiverContact: string;
  receiverEmail: string;
  receiverAddress: string;
  origin: string;
  destination: string;
  pickupDate: string;
  estDelivery: string;
  weight: string;
  notifications: string;
  serviceType: string;
  shipmentMode: string;
  carrier: string;
  dimensions: string;
  insurance: string;
  signatureRequired: string;
  originCoords: [number, number];
  currentCoords: [number, number];
  destinationCoords: [number, number];
  timeline: Array<{
    date: string;
    time: string | null;
    event: string;
    location: string;
    note: string | null;
    status: string;
  }>;
}

function progressFromStatus(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return 100;
  if (s.includes("out for delivery")) return 75;
  if (s.includes("in transit") || s.includes("transit")) return 50;
  if (s.includes("picked up") || s.includes("pickup")) return 25;
  return 10; // Pending / unknown
}

function storedToDisplay(s: ReturnType<typeof getShipments>[number]): ShipmentDisplay {
  const progress = progressFromStatus(s.shipmentStatus);
  const now = new Date();
  const estDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const estDelivery = estDate.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

  return {
    trackingId: s.id,
    receiptDate: s.createdAt,
    status: s.shipmentStatus,
    paymentStatus: s.paymentStatus,
    paymentMode: s.paymentMode,
    baseShippingRate: s.baseRate,
    weightCharges: 0,
    insuranceFee: 0,
    statusLocation: s.dest,
    progress,
    senderName: s.sender,
    senderContact: s.senderPhone,
    senderEmail: s.senderEmail,
    senderAddress: s.senderAddress,
    receiverName: s.recipient,
    receiverContact: s.recipientPhone,
    receiverEmail: s.recipientEmail,
    receiverAddress: s.dest,
    origin: s.senderAddress,
    destination: s.dest,
    pickupDate: s.pickupDate || "",
    estDelivery: s.deliveryDate || estDelivery,
    weight: s.weight,
    serviceType: s.service,
    shipmentMode: s.shipmentMode,
    carrier: s.carrier || "MoveFreight",
    dimensions: s.dimensions || "—",
    insurance: s.insurance || "$0.00",
    signatureRequired: s.signatureRequired || "—",
    notifications: s.notifications || "",
    // Use pre-geocoded coords only when BOTH are stored. A partial pair (one
    // real coord + one sentinel) would make isSentinelCoords() return false and
    // suppress the Nominatim fallback, leaving one pin at the wrong location.
    // When either is missing, fall back to all-sentinel so geocoding triggers.
    originCoords: (s.originCoords && s.destCoords)
      ? s.originCoords
      : ([-33.8688, 151.2093] as [number, number]),
    currentCoords: (s.originCoords && s.destCoords)
      ? lerpCoords(s.originCoords, s.destCoords, progress / 100)
      : ([-33.8688, 151.2093] as [number, number]),
    destinationCoords: (s.originCoords && s.destCoords)
      ? s.destCoords
      : ([-33.8688, 151.2093] as [number, number]),
    timeline: [
      {
        date: s.createdAt,
        time: null,
        event: s.shipmentStatus,
        location: s.senderAddress,
        note: s.notes || null,
        status: "active",
      },
      {
        date: s.createdAt,
        time: null,
        event: "Shipment information received",
        location: "System",
        note: null,
        status: "done",
      },
    ],
  };
}

function lookupShipment(id: string): ShipmentDisplay | null {
  const trimmed = id.trim();
  if (!trimmed) return null;
  // Check localStorage store first — admin edits are always preferred
  const stored = getShipments().find(s => s.id === trimmed);
  if (stored) return storedToDisplay(stored);
  return null;
}

const STEPS = ["Picked Up", "In Transit", "Out for Delivery", "Delivered"];

function getStepIndex(progress: number) {
  if (progress <= 0) return -1;
  if (progress <= 25) return 0;
  if (progress <= 50) return 1;
  if (progress <= 75) return 2;
  return 3;
}

interface ResolvedCoords {
  origin: [number, number];
  current: [number, number];
  destination: [number, number];
}
function ShipmentResult({ data, resolvedCoords, geocoding }: {
  data: ShipmentDisplay;
  resolvedCoords: ResolvedCoords | null;
  geocoding: boolean;
}) {
  const mapOrigin      = resolvedCoords?.origin      ?? data.originCoords;
  const mapCurrent     = resolvedCoords?.current     ?? data.currentCoords;
  const mapDestination = resolvedCoords?.destination ?? data.destinationCoords;
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
            <Link
              href={`/receipt/${data.trackingId}`}
              className="flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </Link>

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

        {/* Row 3: info cells */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: MapPin,       color: "text-green-400",  label: "Origin",        value: data.origin },
            { icon: Flag,         color: "text-red-400",    label: "Destination",   value: data.destination },
            { icon: Weight,       color: "text-purple-400", label: "Weight",        value: data.weight },
            { icon: CalendarDays, color: "text-cyan-400",   label: "Pickup Date",   value: data.pickupDate || "—" },
            { icon: CalendarDays, color: "text-blue-400",   label: "Est. Delivery", value: data.estDelivery },
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
          {geocoding ? (
            <div className="w-full h-full bg-[#111827] flex items-center justify-center">
              <div className="text-white/40 text-sm">Locating route…</div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                <div className="text-white/40 text-sm">Loading map…</div>
              </div>
            }>
              <TrackingMap
                originCoords={mapOrigin}
                currentCoords={mapCurrent}
                destinationCoords={mapDestination}
                progress={data.progress / 100}
              />
            </Suspense>
          )}
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
          {data.notifications ? (
            <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3 mb-4">
              <Bell className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm leading-relaxed">{data.notifications}</p>
            </div>
          ) : (
            <p className="text-white/40 text-sm mb-4">No notifications available</p>
          )}
          {/* Payment method row */}
          <div className="flex justify-between items-center text-sm border-t border-white/8 pt-4">
            <span className="text-white/50 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Payment Method
            </span>
            <span className="text-white font-semibold">{data.paymentMode || "—"}</span>
          </div>
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

/**
 * Returns true when all three coord pairs are the same point —
 * the sentinel we use for "not yet resolved / geocoding failed".
 */
function isSentinelCoords(d: ShipmentDisplay): boolean {
  const [olat, olng] = d.originCoords;
  const [dlat, dlng] = d.destinationCoords;
  return olat === dlat && olng === dlng;
}
export function Track() {
  const [trackingId, setTrackingId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ShipmentDisplay | null>(null);
  const [resolvedCoords, setResolvedCoords] = useState<ResolvedCoords | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  // Stable refs that survive re-renders.
  // geocodeAbortRef: cancels the in-flight Fetch when the user searches a new ID.
  // geocodeGenRef: monotonic counter; only the callback whose gen matches the
  //   current value is allowed to commit state, preventing stale results from
  //   a slow previous lookup overwriting the current one.
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const geocodeGenRef   = useRef<number>(0);

  /**
   * Cancel any in-flight geocoding request and reset geocoding state.
   * Must be called at the start of every new submission, regardless of whether
   * the new result needs geocoding, to ensure stale results can never land.
   */
  function cancelGeocoding() {
    geocodeAbortRef.current?.abort();
    geocodeAbortRef.current = null;
    geocodeGenRef.current += 1;   // invalidate any pending callback
    setGeocoding(false);
    setResolvedCoords(null);
  }

  /**
   * Start geocoding for a stored shipment that has sentinel/default coordinates.
   * No-op for the demo shipment and any shipment that already has real coords.
   */
  function startGeocoding(display: ShipmentDisplay) {
    if (!isSentinelCoords(display)) return; // already has real coords — nothing to do

    const controller = new AbortController();
    geocodeAbortRef.current = controller;
    const gen = geocodeGenRef.current; // capture generation token

    setGeocoding(true);

    resolveCoords(display, controller.signal).then((coords) => {
      // Discard this result if a newer lookup has since started
      if (geocodeGenRef.current !== gen) return;
      setResolvedCoords(coords);
      setGeocoding(false);
    });
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setTrackingId(id);
      setSubmitted(true);
      cancelGeocoding();
      const display = lookupShipment(id);
      setResult(display);
      if (display) startGeocoding(display);
    }
    // Abort on unmount so an unresolved request never updates unmounted state.
    return () => { geocodeAbortRef.current?.abort(); };
  }, []);

  // Re-query when localStorage changes (cross-tab: 'storage', same-tab: 'mff-shipments-updated').
  // Only active while a result is displayed so we don't fire unnecessary lookups.
  useEffect(() => {
    if (!submitted || !trackingId.trim()) return;

    function refresh() {
      const display = lookupShipment(trackingId);
      setResult(display);
      // Kick off geocoding only if we have a result and geocoding isn't already running.
      if (display && !geocoding) startGeocoding(display);
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === null || e.key === "mff_shipments") refresh();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("mff-shipments-updated", refresh);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mff-shipments-updated", refresh);
    };
  }, [submitted, trackingId, geocoding]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setSubmitted(true);
    // Cancel any previous lookup unconditionally before starting a new one.
    cancelGeocoding();
    const display = lookupShipment(trackingId);
    setResult(display);
    if (display) startGeocoding(display);
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
                  placeholder="Enter tracking ID"
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
          {submitted && result && (
            <ShipmentResult
              data={result}
              resolvedCoords={resolvedCoords}
              geocoding={geocoding}
            />
          )}

          {/* Not found */}
          {submitted && !result && (
            <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-10 text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">No shipment found</h3>
              <p className="text-white/45 text-sm max-w-sm mx-auto">
                We couldn't find a shipment matching <span className="text-white/70 font-semibold">{trackingId}</span>.
                Double-check the tracking ID and try again.
              </p>
            </div>
          )}

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

/** Geocode origin + destination, then interpolate current position. */
async function resolveCoords(
  d: ShipmentDisplay,
  signal: AbortSignal
): Promise<ResolvedCoords | null> {
  const [originResult, destResult] = await Promise.all([
    geocodeAddress(d.origin, signal),
    geocodeAddress(d.destination, signal),
  ]);

  if (signal.aborted) return null;

  const origin = originResult ?? AUSTRALIA_CENTRE;
  const dest = destResult ?? AUSTRALIA_CENTRE;
  const t = d.progress / 100;
  const current = lerpCoords(origin, dest, t);

  return { origin, current, destination: dest };
}
