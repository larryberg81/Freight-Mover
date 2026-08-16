import { Router, type IRouter } from "express";
import { GetShipmentResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// ── Mock shipment store (mirrors the web app's demo data) ─────────────────────
// The web app stores shipments in browser localStorage. This endpoint exposes
// the same demo shipment so the mobile app can look it up by tracking ID.
const MOCK_SHIPMENTS: Record<string, unknown> = {
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

router.get("/shipments/:trackingId", (req, res) => {
  const { trackingId } = req.params;
  const raw = MOCK_SHIPMENTS[trackingId];
  if (!raw) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  const data = GetShipmentResponse.parse(raw);
  res.json(data);
});

export default router;
