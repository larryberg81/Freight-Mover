import { Link, useParams } from "wouter";
import { Printer, Eye } from "lucide-react";
import { getShipments } from "../lib/shipmentStore";

// ── Data types ────────────────────────────────────────────────────────────────

interface ReceiptData {
  trackingId: string;
  receiptDate: string;
  senderName: string;
  senderContact: string;
  senderEmail: string;
  senderAddress: string;
  receiverName: string;
  receiverContact: string;
  receiverEmail: string;
  receiverAddress: string;
  serviceType: string;
  weight: string;
  dimensions: string;
  carrier: string;
  origin: string;
  destination: string;
  shipmentMode: string;
  insurance: string;
  pickupDate?: string;
  deliveryDate?: string;
  paymentStatus: string;
  paymentMode: string;
  baseShippingRate: number;
  weightCharges: number;
  insuranceFee: number;
}

// ── Fallback demo data for known tracking IDs ─────────────────────────────────

const DEMO_RECEIPTS: Record<string, ReceiptData> = {
  STN5088840683: {
    trackingId: "STN5088840683",
    receiptDate: "August 09, 2026",
    senderName: "Williams Daxtron",
    senderContact: "0445484376",
    senderEmail: "4x4offroadwrecking@gmail.com",
    senderAddress: "3175 Dandenong Vic Australia",
    receiverName: "William Evans",
    receiverContact: "0492071494",
    receiverEmail: "william@binalong.com.au",
    receiverAddress: "422 wyee farms road, wyee NSW 2259",
    serviceType: "Overnight",
    weight: "12 kg",
    dimensions: "40 × 30 × 20 cm",
    carrier: "MoveFreight",
    origin: "3175 Dandenong Vic",
    destination: "422 wyee farms road, wyee NSW 2259",
    shipmentMode: "Land Freight",
    insurance: "$0.00",
    paymentStatus: "UNPAID",
    paymentMode: "Others",
    baseShippingRate: 50.0,
    weightCharges: 0.0,
    insuranceFee: 0.0,
  },
};

// ── Data lookup ───────────────────────────────────────────────────────────────

function findReceipt(trackingId: string): ReceiptData | null {
  // 1. Check localStorage store (admin-managed / user-created shipments)
  try {
    const stored = getShipments().find(s => s.id === trackingId);
    if (stored) {
      return {
        trackingId: stored.id,
        receiptDate: stored.createdAt,
        senderName: stored.sender,
        senderContact: stored.senderPhone,
        senderEmail: stored.senderEmail,
        senderAddress: stored.senderAddress,
        receiverName: stored.recipient,
        receiverContact: stored.recipientPhone,
        receiverEmail: stored.recipientEmail,
        receiverAddress: stored.dest,
        serviceType: stored.service,
        weight: stored.weight,
        dimensions: "—",
        carrier: "MoveFreight",
        origin: stored.senderAddress.split(",")[0] || stored.senderAddress,
        destination: stored.dest,
        shipmentMode: stored.shipmentMode,
        insurance: "$0.00",
        pickupDate: stored.pickupDate,
        deliveryDate: stored.deliveryDate,
        paymentStatus: stored.paymentStatus,
        paymentMode: stored.paymentMode,
        baseShippingRate: stored.baseRate,
        weightCharges: 0,
        insuranceFee: 0,
      };
    }
  } catch {
    // localStorage unavailable
  }

  // 2. Fall back to hardcoded demo data
  return DEMO_RECEIPTS[trackingId] ?? null;
}

// ── Payment status helpers ────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<string, string> = {
  UNPAID:           "UNPAID",
  PENDING_PAYMENT:  "PENDING",
  DEPOSIT_RECEIVED: "DEPOSIT RECEIVED",
  PARTIALLY_PAID:   "PARTIALLY PAID",
  PAID:             "PAID",
  REFUNDED:         "REFUNDED",
  WAIVED:           "WAIVED",
};

const PAYMENT_COLORS: Record<string, string> = {
  UNPAID:           "#ef4444",
  PENDING_PAYMENT:  "#f59e0b",
  DEPOSIT_RECEIVED: "#3b82f6",
  PARTIALLY_PAID:   "#f97316",
  PAID:             "#16a34a",
  REFUNDED:         "#8b5cf6",
  WAIVED:           "#6b7280",
};

// ── Row component ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 gap-4 text-sm">
      <span className="font-bold text-gray-800 flex-shrink-0">{label}</span>
      <span className="text-gray-700 text-right">{value || "—"}</span>
    </div>
  );
}

// ── Receipt page ──────────────────────────────────────────────────────────────

export function Receipt() {
  const params = useParams<{ trackingId: string }>();
  const trackingId = params.trackingId ?? "";
  const data = findReceipt(trackingId);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Receipt Not Found</h1>
          <p className="text-gray-500 mb-6">No shipment found for tracking ID <span className="font-mono font-bold">{trackingId}</span>.</p>
          <Link href="/track" className="inline-flex items-center gap-2 bg-[#00b8d4] text-white font-semibold px-6 py-3 rounded-lg">
            <Eye className="w-4 h-4" /> Go to Tracking
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = PAYMENT_COLORS[data.paymentStatus] ?? "#6b7280";
  const statusLabel = PAYMENT_LABELS[data.paymentStatus] ?? data.paymentStatus;
  const total = (data.baseShippingRate + data.weightCharges + data.insuranceFee).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:py-0 print:px-0">

      {/* Action buttons — hidden when printing */}
      <div className="max-w-3xl mx-auto mb-5 flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
        <Link
          href={`/track?id=${data.trackingId}`}
          className="flex items-center gap-2 bg-[#0d6e7a] hover:bg-[#0a5c67] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm shadow"
        >
          <Eye className="w-4 h-4" />
          View Tracking
        </Link>
      </div>

      {/* Receipt card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none">
        <div className="p-8 print:p-10">

          {/* ── Logo ── */}
          <div className="text-center mb-5">
            <div
              className="text-3xl font-bold italic leading-tight"
              style={{ color: "#00b8d4", fontFamily: "Georgia, serif" }}
            >
              Move Freight<br />Fast
            </div>
          </div>

          {/* ── Header info ── */}
          <div className="text-center text-sm text-gray-600 leading-7 mb-1">
            <div>2005 Eye Street, Suite 9, Bakersfield, CA 93301</div>
            <div>
              📞 +15015311020 &nbsp;|&nbsp; 📧 info@movefreightfast.com
            </div>
            <div className="text-gray-800">
              <strong>Receipt #:</strong> {data.trackingId} &nbsp;&nbsp;
              <strong>Date:</strong> {data.receiptDate}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t-2 border-[#00b8d4] my-6" />

          {/* ── Sender / Receiver two-column ── */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Sender */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-[#00b8d4] font-bold text-base mb-3 pb-2 border-b border-[#00b8d4]/30">
                Sender Information
              </h3>
              <InfoRow label="Name:"    value={data.senderName} />
              <InfoRow label="Contact:" value={data.senderContact} />
              <InfoRow label="Email:"   value={data.senderEmail} />
              <InfoRow label="Address:" value={data.senderAddress} />
            </div>

            {/* Receiver */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-[#00b8d4] font-bold text-base mb-3 pb-2 border-b border-[#00b8d4]/30">
                Receiver Information
              </h3>
              <InfoRow label="Name:"    value={data.receiverName} />
              <InfoRow label="Contact:" value={data.receiverContact} />
              <InfoRow label="Email:"   value={data.receiverEmail} />
              <InfoRow label="Address:" value={data.receiverAddress} />
            </div>
          </div>

          {/* ── Shipment Details ── */}
          <div className="relative mb-8">
            <h3 className="text-[#00b8d4] font-bold text-base mb-3 pb-2 border-b border-[#00b8d4]/30">
              Shipment Details
            </h3>

            {/* Stamp watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 1, top: "30px" }}
            >
              <div
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: "50%",
                  border: `7px solid ${statusColor}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.15,
                  transform: "rotate(-20deg)",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 900, color: statusColor, letterSpacing: 2, textTransform: "uppercase" }}>
                  APPROVED
                </span>
                <span style={{ fontSize: 22, fontWeight: 900, color: statusColor, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1.2 }}>
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 relative" style={{ zIndex: 2 }}>
              <div>
                <InfoRow label="Service Type:" value={data.serviceType} />
                <InfoRow label="Weight:"        value={data.weight} />
                <InfoRow label="Dimensions:"    value={data.dimensions} />
                <InfoRow label="Carrier:"       value={data.carrier} />
              </div>
              <div>
                <InfoRow label="From:"          value={data.origin} />
                <InfoRow label="To:"            value={data.destination} />
                <InfoRow label="Shipment Mode:" value={data.shipmentMode} />
                <InfoRow label="Insurance:"     value={data.insurance} />
                {data.pickupDate   && <InfoRow label="Pickup Date:"   value={data.pickupDate} />}
                {data.deliveryDate && <InfoRow label="Delivery Date:" value={data.deliveryDate} />}
              </div>
            </div>
          </div>

          {/* ── Payment Summary ── */}
          <div className="border-l-4 border-[#00b8d4] pl-5 mb-8">
            <h3 className="text-[#00b8d4] font-bold text-xl mb-4">Payment Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Base Shipping Rate:</span>
                <span className="font-medium">${data.baseShippingRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Weight Charges:</span>
                <span className="font-medium">${data.weightCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Insurance Fee:</span>
                <span className="font-medium">${data.insuranceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-gray-800 font-bold text-base">
                <span>Total Amount:</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-700">Payment Status:</span>
                <span
                  className="px-3 py-1 rounded border-2 text-xs font-bold tracking-wide uppercase"
                  style={{ borderColor: statusColor, color: statusColor }}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Payment Mode:</span>
                <span className="font-medium">{data.paymentMode}</span>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="border-t border-gray-200 pt-5 text-xs text-gray-400 space-y-0.5">
            <div className="font-medium text-gray-600">Move Freight Fast</div>
            <div>© 2026 Move Freight Fast. All Rights Reserved.</div>
          </div>

        </div>
      </div>
    </div>
  );
}
