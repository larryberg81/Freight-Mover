// Shared shipment store backed by localStorage.
// Both create-shipment.tsx and admin.tsx read/write through these helpers.

export interface StoredShipment {
  id: string;
  createdAt: string;
  sender: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  recipient: string;
  recipientEmail: string;
  recipientPhone: string;
  dest: string;
  service: string;
  weight: string;
  shipmentMode: string;
  shipmentStatus: string;
  paymentStatus: string;
  paymentMode: string;
  baseRate: number;
  notes: string;
  pickupDate?: string;
  deliveryDate?: string;
  dimensions?: string;
  insurance?: string;
  signatureRequired?: string;
  carrier?: string;
  notifications?: string;
  originCoords?: [number, number];
  destCoords?: [number, number];
  /** Admin-set current location address shown on the tracking page status bar. */
  currentLocation?: string;
  /** Geocoded coordinates for currentLocation — overrides the auto-lerped pin. */
  currentCoords?: [number, number];
}

const STORE_KEY  = "mff_shipments";
// v2: bumped to include the NY→Maine demo shipment with currentLocation support.
const SEEDED_KEY = "mff_seeded_v2";

// ── Seed ─────────────────────────────────────────────────────────────────────
// Call once on admin mount with the demo rows. Only writes on first ever visit.
export function seedStore(initial: StoredShipment[]): void {
  if (!localStorage.getItem(SEEDED_KEY)) {
    localStorage.setItem(STORE_KEY, JSON.stringify(initial));
    localStorage.setItem(SEEDED_KEY, "1");
  }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
export function getShipments(): StoredShipment[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredShipment[]) : [];
  } catch {
    return [];
  }
}

function persist(shipments: StoredShipment[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(shipments));
  // Notify same-tab listeners; cross-tab listeners receive the native 'storage' event automatically.
  window.dispatchEvent(new CustomEvent("mff-shipments-updated"));
}

export function addShipment(shipment: StoredShipment): void {
  persist([shipment, ...getShipments()]);
}

export function updateShipment(updated: StoredShipment): void {
  persist(getShipments().map(s => (s.id === updated.id ? updated : s)));
}

export function deleteShipment(id: string): void {
  persist(getShipments().filter(s => s.id !== id));
}
