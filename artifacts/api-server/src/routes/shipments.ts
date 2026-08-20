import { Router, type IRouter } from "express";
import { GetShipmentResponse } from "@workspace/api-zod";
import { db, shipmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// ── Demo fallback (last-resort only) ─────────────────────────────────────────
// Returned when a trackingId is not in the database — keeps the demo
// shipment STN5088840683 working out-of-the-box without a database record.
const DEMO_SHIPMENTS: Record<string, unknown> = {
  STN5088840683: {
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
    senderName: "Williams Daxtron",
    senderContact: "0445484376",
    senderEmail: "4x4offroadwrecking@gmail.com",
    senderAddress: "3175 Dandenong Vic Australia",
    receiverName: "William Evans",
    receiverContact: "0492071494",
    receiverEmail: "william@binalong.com.au",
    receiverAddress: "422 wyee farms road, wyee NSW 2259",
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
    notifications: "",
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
  },
};

// ── GET /shipments/:trackingId ─────────────────────────────────────────────
router.get("/shipments/:trackingId", async (req, res) => {
  const { trackingId } = req.params;

  // 1. Try the shared database (real shipments from the web app)
  try {
    const rows = await db
      .select()
      .from(shipmentsTable)
      .where(eq(shipmentsTable.trackingId, trackingId))
      .limit(1);

    if (rows.length > 0) {
      const data = GetShipmentResponse.parse(rows[0].data);
      res.json(data);
      return;
    }
  } catch (err) {
    // DB unavailable — fall through to demo data
    console.error("DB lookup failed for", trackingId, err);
  }

  // 2. Fall back to hardcoded demo shipment
  const raw = DEMO_SHIPMENTS[trackingId];
  if (!raw) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  const data = GetShipmentResponse.parse(raw);
  res.json(data);
});

// ── POST /shipments ────────────────────────────────────────────────────────
// Called by the web app after a booking is created. Accepts the web app's
// StoredShipment shape and converts it to the ShipmentDetails API shape so
// the mobile app can retrieve it by tracking ID.
router.post("/shipments", async (req, res) => {
  const body = req.body as {
    id?: string;
    createdAt?: string;
    sender?: string;
    senderEmail?: string;
    senderPhone?: string;
    senderAddress?: string;
    recipient?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    dest?: string;
    service?: string;
    weight?: string;
    shipmentMode?: string;
    shipmentStatus?: string;
    paymentStatus?: string;
    paymentMode?: string;
    baseRate?: number;
    notes?: string;
    pickupDate?: string;
    deliveryDate?: string;
    dimensions?: string;
    insurance?: string;
    signatureRequired?: string;
    carrier?: string;
    notifications?: string;
    originCoords?: [number, number];
    destCoords?: [number, number];
  };

  const trackingId = body.id;
  if (!trackingId) {
    res.status(400).json({ error: "id (trackingId) is required" });
    return;
  }

  // Convert StoredShipment → ShipmentDetails
  const shipmentData = {
    trackingId,
    receiptDate: body.createdAt ?? new Date().toLocaleDateString("en-AU", { dateStyle: "long" }),
    status: body.shipmentStatus ?? "Pending Pickup",
    paymentStatus: body.paymentStatus ?? "UNPAID",
    paymentMode: body.paymentMode ?? "Others",
    baseShippingRate: body.baseRate ?? 0,
    weightCharges: 0,
    insuranceFee: parseFloat(body.insurance ?? "0") || 0,
    statusLocation: body.senderAddress ?? "",
    progress: 10,
    senderName: body.sender ?? "",
    senderContact: body.senderPhone ?? "",
    senderEmail: body.senderEmail ?? "",
    senderAddress: body.senderAddress ?? "",
    receiverName: body.recipient ?? "",
    receiverContact: body.recipientPhone ?? "",
    receiverEmail: body.recipientEmail ?? "",
    receiverAddress: body.dest ?? "",
    origin: body.senderAddress ?? "",
    destination: body.dest ?? "",
    pickupDate: body.pickupDate ?? "",
    estDelivery: body.deliveryDate ?? "",
    weight: body.weight ?? "",
    serviceType: body.service ?? "",
    shipmentMode: body.shipmentMode ?? "Land Freight",
    carrier: body.carrier ?? "MoveFreight",
    dimensions: body.dimensions ?? "",
    insurance: body.insurance ? `$${body.insurance}` : "$0.00",
    signatureRequired: body.signatureRequired ?? "No",
    notifications: body.notifications ?? "",
    timeline: [
      {
        date: body.deliveryDate ?? "",
        time: null,
        event: "Expected Delivery",
        location: body.dest ?? "",
        note: null,
        status: "pending",
      },
      {
        date: body.pickupDate ?? "",
        time: null,
        event: body.shipmentStatus ?? "Pending Pickup",
        location: body.senderAddress ?? "",
        note: body.notes || null,
        status: "active",
      },
      {
        date: body.createdAt ?? "",
        time: null,
        event: "Shipment information received",
        location: "Shipment information received",
        note: null,
        status: "done",
      },
    ],
  };

  try {
    // Validate against the response schema before persisting
    const validated = GetShipmentResponse.parse(shipmentData);

    await db
      .insert(shipmentsTable)
      .values({ trackingId, data: validated })
      .onConflictDoUpdate({
        target: shipmentsTable.trackingId,
        set: { data: validated, updatedAt: new Date() },
      });

    res.status(201).json({ trackingId });
  } catch (err) {
    console.error("Failed to save shipment", trackingId, err);
    res.status(500).json({ error: "Failed to save shipment" });
  }
});

export default router;
