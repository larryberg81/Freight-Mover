import { useState, useEffect, lazy, Suspense } from "react";
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
} from "lucide-react";

// Lazy-load the Leaflet map so it never runs at module-eval time in production.
// Leaflet accesses window/document on import, which crashes during SSR/build.
const TrackingMap = lazy(() => import("../components/TrackingMap"));

// ── Mock shipment data ──────────────────────────────────────────────────────
const MOCK_SHIPMENT = {
  trackingId: "STN5088840683",
  receiptDate: "August 09, 2026",
  status: "Pending",
  paymentStatus: "UNPAID",
  paymentMode: "Others",
  baseShippingRate: 50.00,
  weightCharges: 0.00,
  insuranceFee: 0.00,
  statusLocation: "422 wyee farms road, wyee NSW 2259 Australia",
  progress: 10,
  // Sender
  senderName: "Williams Daxtron",
  senderContact: "0445484376",
  senderEmail: "4x4offroadwrecking@gmail.com",
  senderAddress: "3175 Dandenong Vic Australia",
  // Receiver
  receiverName: "William Evans",
  receiverContact: "0492071494",
  receiverEmail: "william@binalong.com.au",
  receiverAddress: "422 wyee farms road, wyee NSW 2259",
  // Shipment
  origin: "3175 Dandenong Vic",
  destination: "422 wyee farms road, wyee NSW 2259",
  pickupDate: "Aug 04, 2026",
  estDelivery: "Aug 06, 2026",
  weight: "12 kg",
  serviceType: "Overnight",
  shipmentMode: "Land Freight",
  carrier: "MoveFreight",
  dimensions: "40 × 30 × 20 cm",
  insurance: "$0.00",
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

// ── Receipt generator ────────────────────────────────────────────────────────
function buildReceiptHTML(data: typeof MOCK_SHIPMENT): string {
  const total = (data.baseShippingRate + data.weightCharges + data.insuranceFee).toFixed(2);
  const isPaid = data.paymentStatus === "PAID";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Receipt – ${data.trackingId}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a2e;background:#fff;padding:32px}
  .page{max-width:720px;margin:0 auto;position:relative}
  /* header */
  .logo{text-align:center;margin-bottom:10px}
  .logo-text{font-size:28px;font-weight:700;color:#00b8d4;font-style:italic;line-height:1.1}
  .header-info{text-align:center;color:#333;line-height:1.7;margin-bottom:6px;font-size:12px}
  .header-meta{text-align:center;margin-bottom:16px;font-size:13px}
  .header-meta strong{font-weight:700}
  hr{border:none;border-top:2px solid #00b8d4;margin:16px 0}
  /* two-column section */
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:24px}
  .section-title{color:#00b8d4;font-weight:700;font-size:14px;margin-bottom:12px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}
  .info-row{display:flex;justify-content:space-between;margin-bottom:8px;gap:8px}
  .info-label{color:#555;font-weight:400;flex-shrink:0}
  .info-value{text-align:right;font-weight:500;color:#111}
  /* shipment details */
  .shipment-section{position:relative;margin-bottom:24px}
  .shipment-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
  /* watermark stamp */
  .stamp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-20deg);width:160px;height:160px;border:6px solid ${isPaid ? "#16a34a" : "#ef4444"};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0.18;pointer-events:none;z-index:1}
  .stamp-approved{font-size:13px;font-weight:900;color:${isPaid ? "#16a34a" : "#ef4444"};letter-spacing:2px;text-transform:uppercase}
  .stamp-status{font-size:22px;font-weight:900;color:${isPaid ? "#16a34a" : "#ef4444"};letter-spacing:2px;text-transform:uppercase}
  /* payment summary */
  .payment-section{border-left:4px solid #00b8d4;padding-left:16px;margin-bottom:24px}
  .payment-title{color:#00b8d4;font-size:20px;font-weight:700;margin-bottom:14px}
  .pay-row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px}
  .pay-row.total{font-size:16px;font-weight:700;border-top:2px solid #1a1a2e;padding-top:10px;margin-top:4px}
  .status-badge{display:inline-block;padding:3px 14px;border:2px solid ${isPaid ? "#16a34a" : "#ef4444"};border-radius:4px;color:${isPaid ? "#16a34a" : "#ef4444"};font-weight:700;font-size:12px;letter-spacing:1px}
  /* footer */
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#888}
  @media print{
    body{padding:0}
    @page{margin:20mm}
  }
</style>
</head>
<body>
<div class="page">

  <!-- Logo -->
  <div class="logo">
    <div class="logo-text">Move Freight<br/>Fast</div>
  </div>

  <!-- Header info -->
  <div class="header-info">
    2005 Eye Street, Suite 9, Bakersfield, CA 93301<br/>
    📞 +15015311020 &nbsp;|&nbsp; ✉ info@movefreightfast.com
  </div>
  <div class="header-meta">
    <strong>Receipt #:</strong> ${data.trackingId} &nbsp;&nbsp;
    <strong>Date:</strong> ${data.receiptDate}
  </div>

  <hr/>

  <!-- Sender / Receiver -->
  <div class="two-col">
    <div>
      <div class="section-title">Sender Information</div>
      <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${data.senderName}</span></div>
      <div class="info-row"><span class="info-label">Contact:</span><span class="info-value">${data.senderContact}</span></div>
      <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${data.senderEmail}</span></div>
      <div class="info-row"><span class="info-label">Address:</span><span class="info-value">${data.senderAddress}</span></div>
    </div>
    <div>
      <div class="section-title">Receiver Information</div>
      <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${data.receiverName}</span></div>
      <div class="info-row"><span class="info-label">Contact:</span><span class="info-value">${data.receiverContact}</span></div>
      <div class="info-row"><span class="info-label">Email:</span><span class="info-value">${data.receiverEmail}</span></div>
      <div class="info-row"><span class="info-label">Address:</span><span class="info-value">${data.receiverAddress}</span></div>
    </div>
  </div>

  <!-- Shipment Details -->
  <div class="shipment-section">
    <div class="section-title">Shipment Details</div>
    <!-- Watermark stamp -->
    <div class="stamp">
      <span class="stamp-approved">APPROVED</span>
      <span class="stamp-status">${data.paymentStatus}</span>
    </div>
    <div class="shipment-grid">
      <div>
        <div class="info-row"><span class="info-label">Service Type:</span><span class="info-value">${data.serviceType}</span></div>
        <div class="info-row"><span class="info-label">Weight:</span><span class="info-value">${data.weight}</span></div>
        <div class="info-row"><span class="info-label">Dimensions:</span><span class="info-value">${data.dimensions}</span></div>
        <div class="info-row"><span class="info-label">Carrier:</span><span class="info-value">${data.carrier}</span></div>
      </div>
      <div>
        <div class="info-row"><span class="info-label">From:</span><span class="info-value">${data.origin}</span></div>
        <div class="info-row"><span class="info-label">To:</span><span class="info-value">${data.destination}</span></div>
        <div class="info-row"><span class="info-label">Shipment Mode:</span><span class="info-value">${data.shipmentMode}</span></div>
        <div class="info-row"><span class="info-label">Insurance:</span><span class="info-value">${data.insurance}</span></div>
      </div>
    </div>
  </div>

  <!-- Payment Summary -->
  <div class="payment-section">
    <div class="payment-title">Payment Summary</div>
    <div class="pay-row"><span>Base Shipping Rate:</span><span>$${data.baseShippingRate.toFixed(2)}</span></div>
    <div class="pay-row"><span>Weight Charges:</span><span>$${data.weightCharges.toFixed(2)}</span></div>
    <div class="pay-row"><span>Insurance Fee:</span><span>$${data.insuranceFee.toFixed(2)}</span></div>
    <div class="pay-row total"><span>Total Amount:</span><span>$${total}</span></div>
    <div class="pay-row" style="margin-top:12px">
      <span>Payment Status:</span>
      <span class="status-badge">${data.paymentStatus}</span>
    </div>
    <div class="pay-row" style="margin-top:8px"><span>Payment Mode:</span><span>${data.paymentMode}</span></div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div>Move Freight Fast</div>
    <div>© 2026 Move Freight Fast. All Rights Reserved.</div>
  </div>

</div>
<script>window.onload=()=>window.print()</script>
</body>
</html>`;
}

function downloadReceipt(data: typeof MOCK_SHIPMENT) {
  const html = buildReceiptHTML(data);
  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `receipt-${data.trackingId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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

  function handleDownload() {
    downloadReceipt(data);
  }

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
          <Suspense fallback={
            <div className="w-full h-full bg-[#111827] flex items-center justify-center">
              <div className="text-white/40 text-sm">Loading map…</div>
            </div>
          }>
            <TrackingMap
              originCoords={data.originCoords}
              currentCoords={data.currentCoords}
              destinationCoords={data.destinationCoords}
            />
          </Suspense>
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
