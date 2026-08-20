import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Lock, Eye, EyeOff, ShieldCheck,
  Package, Search, BarChart3, Users, Truck, Settings,
  Zap, Copy, CheckCircle2, X, PenLine, Save, CreditCard, Trash2,
  MapPin, Loader2,
} from "lucide-react";
import {
  seedStore, getShipments, updateShipment, deleteShipment,
} from "../lib/shipmentStore";
import { geocodeAddress } from "../lib/geocode";
import { DEMO_SHIPMENTS } from "../lib/demoShipments";

const ADMIN_PASSWORD = "admin123";
const SESSION_KEY    = "mff_admin_auth";

// ── Seed data (demo rows shown on first ever visit) ───────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────

const PAYMENT_STATUSES = [
  { value: "UNPAID",           label: "Unpaid",           color: "text-red-400 bg-red-500/10 border-red-500/30" },
  { value: "PENDING_PAYMENT",  label: "Pending Payment",  color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { value: "DEPOSIT_RECEIVED", label: "Deposit Received", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { value: "PARTIALLY_PAID",   label: "Partially Paid",   color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  { value: "PAID",             label: "Paid",             color: "text-green-400 bg-green-500/10 border-green-500/30" },
  { value: "REFUNDED",         label: "Refunded",         color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { value: "WAIVED",           label: "Waived",           color: "text-white/50 bg-white/5 border-white/10" },
];

const SHIPMENT_STATUSES = ["Pending Pickup", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "On Hold", "Returned"];
const SERVICE_TYPES     = ["Road Freight", "Overnight Express", "International Air Freight", "Sea Freight", "Economy Ground", "Same Day Delivery"];
const SHIPMENT_MODES    = ["Land Freight", "Air Freight", "Sea Freight", "Express Courier"];
const PAYMENT_MODES     = ["Bank Transfer", "Credit Card", "Cash", "PayPal", "Invoice", "Others"];

const QUICK_STATS = [
  { icon: Package,   label: "Total Shipments", value: "1,284", change: "+12% this month" },
  { icon: Truck,     label: "In Transit",       value: "43",    change: "Active right now" },
  { icon: Users,     label: "Active Clients",   value: "512",   change: "+8 this week" },
  { icon: BarChart3, label: "On-Time Rate",      value: "98.2%", change: "Last 30 days" },
];

const ADMIN_ACTIONS = [
  { icon: Package,  title: "Create Shipment", description: "Book a new freight shipment and generate a tracking ID.", href: "/ship",     cta: "Create Shipment", accent: "bg-[#00b8d4] hover:bg-[#00a0bb]" },
  { icon: Search,   title: "Track Shipment",  description: "Look up live status and location for any shipment.",      href: "/track",    cta: "Track Shipment",  accent: "bg-[#1e3a8a] hover:bg-[#1e40af]" },
  { icon: Settings, title: "Manage Services", description: "Review and update available freight service offerings.",  href: "/services", cta: "View Services",   accent: "bg-[#374151] hover:bg-[#4b5563]" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function paymentStyle(v: string) { return PAYMENT_STATUSES.find(p => p.value === v)?.color ?? "text-white/50 bg-white/5 border-white/10"; }
function paymentLabel(v: string) { return PAYMENT_STATUSES.find(p => p.value === v)?.label ?? v; }

function statusColor(s: string) {
  if (s === "Delivered")        return "bg-green-500/15 text-green-400";
  if (s === "In Transit")       return "bg-[#00b8d4]/15 text-[#00b8d4]";
  if (s === "Out for Delivery") return "bg-yellow-500/15 text-yellow-400";
  if (s === "On Hold")          return "bg-red-500/15 text-red-400";
  return "bg-white/8 text-white/50";
}

const inputCls  = "w-full bg-[#0a1020] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ── Demo data for test-ID generator ──────────────────────────────────────────

const DEMO_SENDERS = [
  { name: "James Hargreaves", company: "MFF Operations",        email: "james@movefreightfast.com", phone: "+44 20 7946 0201" },
  { name: "Sarah Okonkwo",    company: "Global Trade Co.",       email: "sarah@globaltrade.com",     phone: "+61 2 9000 1234" },
  { name: "Daniel Reeves",    company: "Reeves Imports Pty Ltd", email: "d.reeves@reevesimports.au", phone: "+61 3 8800 5678" },
];
const DEMO_RECIPIENTS = [
  { name: "Alice Chen",    company: "Pacific Retail Group",   email: "alice@pacificretail.com.au", phone: "+61 7 3200 9900",  street: "12 Harbour View Rd",  city: "Brisbane",  state: "QLD",     postcode: "4000",   country: "Australia" },
  { name: "Mark Thompson", company: "Thompson Engineering",   email: "mark@thompsoneng.co.uk",     phone: "+44 161 500 0022", street: "88 Industrial Way",   city: "Manchester",state: "England", postcode: "M1 2AB", country: "United Kingdom" },
  { name: "Nina Patel",    company: "Patel Distribution Ltd", email: "nina@pateldist.nz",          phone: "+64 9 888 3300",   street: "44 Commerce Street",  city: "Auckland",  state: "AKL",     postcode: "1010",   country: "New Zealand" },
];
const DEMO_SERVICES = ["Road Freight", "Overnight Express", "International Air Freight", "Sea Freight", "Economy Ground"];
const DEMO_GOODS    = ["Electronic components", "Automotive parts", "Textile samples", "Medical supplies", "Industrial equipment", "Consumer goods"];

function generateTestShipment() {
  const sender    = DEMO_SENDERS[Math.floor(Math.random() * DEMO_SENDERS.length)];
  const recipient = DEMO_RECIPIENTS[Math.floor(Math.random() * DEMO_RECIPIENTS.length)];
  const service   = DEMO_SERVICES[Math.floor(Math.random() * DEMO_SERVICES.length)];
  const goods     = DEMO_GOODS[Math.floor(Math.random() * DEMO_GOODS.length)];
  const weight    = (Math.random() * 50 + 1).toFixed(1);
  const id        = `MFF${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const now       = new Date();
  const eta       = new Date(now.getTime() + (2 + Math.floor(Math.random() * 5)) * 86400000);
  return {
    trackingId:  id, bookedAt: now.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }),
    estDelivery: eta.toLocaleDateString("en-AU", { dateStyle: "medium" }),
    sender, recipient, service, weight: `${weight} kg`, goods, status: "Pending Pickup",
  };
}
type TestShipment = ReturnType<typeof generateTestShipment>;

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState("");
  const [shaking, setShaking]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem(SESSION_KEY, "1"); onLogin(); }
    else { setError("Incorrect password. Please try again."); setShaking(true); setTimeout(() => setShaking(false), 500); }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className={`w-full max-w-md ${shaking ? "animate-[shake_0.4s_ease]" : ""}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00b8d4]/10 border border-[#00b8d4]/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#00b8d4]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/45 text-sm">Enter your password to access the dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0d1627] border border-white/8 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={password} autoFocus
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
              />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Sign In
          </button>
          <p className="text-center text-white/25 text-xs">Hint: <span className="font-mono">admin123</span></p>
        </form>
      </div>
    </div>
  );
}

// ── Test shipment modal ───────────────────────────────────────────────────────

function TestShipmentModal({ shipment, onClose }: { shipment: TestShipment; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(shipment.trackingId); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  const rows: [string, string][] = [
    ["Status", shipment.status], ["Service", shipment.service], ["Weight", shipment.weight],
    ["Contents", shipment.goods], ["Booked", shipment.bookedAt], ["Est. Delivery", shipment.estDelivery],
    ["Sender", `${shipment.sender.name} — ${shipment.sender.company}`],
    ["Sender Email", shipment.sender.email], ["Sender Phone", shipment.sender.phone],
    ["Recipient", `${shipment.recipient.name} — ${shipment.recipient.company}`],
    ["Recipient Address", `${shipment.recipient.street}, ${shipment.recipient.city} ${shipment.recipient.state} ${shipment.recipient.postcode}`],
    ["Destination Country", shipment.recipient.country],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1627] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /><h2 className="text-white font-bold text-lg">Test Shipment Generated</h2></div>
          <button onClick={onClose} className="text-white/35 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 bg-[#111827]/60 border-b border-white/8">
          <div className="text-[#00b8d4] text-xs font-semibold uppercase tracking-widest mb-1">Tracking ID</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white tracking-wider font-mono">{shipment.trackingId}</span>
            <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-1">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0 text-sm gap-4">
              <span className="text-white/40 flex-shrink-0">{label}</span>
              <span className="text-white font-medium text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 border-t border-white/8 flex gap-3">
          <Link href={`/track?id=${shipment.trackingId}`} onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
            <Search className="w-4 h-4" /> Track It
          </Link>
          <button onClick={onClose} className="flex-1 border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold py-3 rounded-lg transition-colors text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Shipment modal ───────────────────────────────────────────────────────

function EditShipmentModal({ shipment, onSave, onClose }: {
  shipment: StoredShipment;
  onSave: (updated: StoredShipment) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<StoredShipment>({ ...shipment });
  const [saved, setSaved] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState<"success" | "error" | null>(null);

  const set = (k: keyof StoredShipment) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleLocate() {
    const addr = form.currentLocation?.trim();
    if (!addr) return;
    setLocating(true);
    setLocateMsg(null);
    const coords = await geocodeAddress(addr);
    setLocating(false);
    if (coords) {
      setForm(f => ({ ...f, currentCoords: coords }));
      setLocateMsg("success");
    } else {
      setLocateMsg("error");
    }
  }

  function handleSave() {
    updateShipment(form);
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  }

  const Section = ({ title }: { title: string }) => (
    <div className="text-[#00b8d4] text-xs font-bold uppercase tracking-widest mt-6 mb-3 pb-2 border-b border-white/8">{title}</div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1627] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-[#00b8d4]" />
            <div>
              <h2 className="text-white font-bold text-lg">Edit Shipment</h2>
              <p className="text-white/40 text-xs font-mono">{shipment.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/35 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-2">

          <Section title="Shipment Status" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Shipment Status</label>
              <select className={selectCls} value={form.shipmentStatus} onChange={set("shipmentStatus")}>
                {SHIPMENT_STATUSES.map(s => <option key={s} value={s} className="bg-[#0a1020]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Service Type</label>
              <select className={selectCls} value={form.service} onChange={set("service")}>
                {SERVICE_TYPES.map(s => <option key={s} value={s} className="bg-[#0a1020]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Shipment Mode</label>
              <select className={selectCls} value={form.shipmentMode} onChange={set("shipmentMode")}>
                {SHIPMENT_MODES.map(s => <option key={s} value={s} className="bg-[#0a1020]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Weight</label>
              <input className={inputCls} placeholder="e.g. 12.5 kg" value={form.weight} onChange={set("weight")} />
            </div>
          </div>

          <Section title="Payment" />
          <div className="mb-4">
            <label className="block text-xs font-bold text-white/70 mb-2">Payment Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAYMENT_STATUSES.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, paymentStatus: opt.value }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    form.paymentStatus === opt.value
                      ? `${opt.color} ring-2 ring-current ring-offset-1 ring-offset-[#0d1627]`
                      : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />{opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Payment Mode</label>
              <select className={selectCls} value={form.paymentMode} onChange={set("paymentMode")}>
                {PAYMENT_MODES.map(s => <option key={s} value={s} className="bg-[#0a1020]">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Base Rate ($)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.baseRate} onChange={set("baseRate")} />
            </div>
          </div>

          <Section title="Sender" />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Name</label><input className={inputCls} value={form.sender} onChange={set("sender")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Email</label><input type="email" className={inputCls} value={form.senderEmail} onChange={set("senderEmail")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Phone</label><input className={inputCls} value={form.senderPhone} onChange={set("senderPhone")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Address</label><input className={inputCls} value={form.senderAddress} onChange={set("senderAddress")} /></div>
          </div>

          <Section title="Recipient" />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Name</label><input className={inputCls} value={form.recipient} onChange={set("recipient")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Email</label><input type="email" className={inputCls} value={form.recipientEmail} onChange={set("recipientEmail")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Phone</label><input className={inputCls} value={form.recipientPhone} onChange={set("recipientPhone")} /></div>
            <div><label className="block text-xs font-bold text-white/70 mb-1.5">Destination</label><input className={inputCls} value={form.dest} onChange={set("dest")} /></div>
          </div>

          <Section title="Package Details" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Dimensions (e.g. 40 × 30 × 20 cm)</label>
              <input className={inputCls} placeholder="—" value={form.dimensions ?? ""} onChange={set("dimensions")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Insurance Value (e.g. $500.00)</label>
              <input className={inputCls} placeholder="$0.00" value={form.insurance ?? ""} onChange={set("insurance")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Signature Required</label>
              <select className={selectCls} value={form.signatureRequired ?? ""} onChange={set("signatureRequired")}>
                <option value="" className="bg-[#0a1020]">— Not set —</option>
                <option value="Yes" className="bg-[#0a1020]">Yes</option>
                <option value="No" className="bg-[#0a1020]">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Carrier</label>
              <input className={inputCls} placeholder="MoveFreight" value={form.carrier ?? ""} onChange={set("carrier")} />
            </div>
          </div>

          <Section title="Current Location" />
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Current Location Address
              <span className="text-white/35 font-normal ml-1">(shown on tracking map &amp; status bar)</span>
            </label>
            <div className="flex gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder="e.g. Boston, MA  or  95 Main St, Hartford CT"
                value={form.currentLocation ?? ""}
                onChange={set("currentLocation")}
              />
              <button
                type="button"
                onClick={handleLocate}
                disabled={locating || !form.currentLocation?.trim()}
                className="px-4 py-2 bg-[#00b8d4] hover:bg-[#00a0bb] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                {locating
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <MapPin className="w-3.5 h-3.5" />}
                {locating ? "Locating…" : "Locate"}
              </button>
            </div>
            {locateMsg === "success" && (
              <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Coordinates saved — map pin updated
              </p>
            )}
            {locateMsg === "error" && (
              <p className="text-red-400 text-xs mt-1.5">
                Address not found — try a more specific location.
              </p>
            )}
            {form.currentCoords && locateMsg !== "error" && (
              <p className="text-white/25 text-xs mt-1">
                📍 {form.currentCoords[0].toFixed(4)}, {form.currentCoords[1].toFixed(4)}
              </p>
            )}
          </div>

          <Section title="Notifications" />
          <textarea className={`${inputCls} resize-none`} rows={3}
            placeholder="Enter customer-facing notification message (visible on tracking page)…"
            value={form.notifications ?? ""} onChange={set("notifications")}
          />

          <Section title="Dates" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Pickup Date</label>
              <input type="date" className={inputCls} value={form.pickupDate ?? ""} onChange={set("pickupDate")} />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/70 mb-1.5">Delivery Date</label>
              <input type="date" className={inputCls} value={form.deliveryDate ?? ""} onChange={set("deliveryDate")} />
            </div>
          </div>

          <Section title="Internal Notes" />
          <textarea className={`${inputCls} resize-none`} rows={3}
            placeholder="Add any internal notes about this shipment..."
            value={form.notes} onChange={set("notes")}
          />

          <div className="pb-4" />
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-white/8 flex-shrink-0">
          <button onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all text-sm ${saved ? "bg-green-600 text-white" : "bg-[#00b8d4] hover:bg-[#00a0bb] text-white"}`}
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <button onClick={onClose} className="flex-1 border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold py-3 rounded-lg transition-colors text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete button with two-step confirm ───────────────────────────────────────

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (confirming) { onConfirm(); }
    else { setConfirming(true); setTimeout(() => setConfirming(false), 3000); }
  }

  return (
    <button
      onClick={handleClick}
      title={confirming ? "Click again to confirm delete" : "Delete shipment"}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
        confirming
          ? "bg-red-500/15 border-red-500/50 text-red-400 hover:bg-red-500/25"
          : "border-white/10 text-white/40 hover:border-red-500/40 hover:text-red-400"
      }`}
    >
      <Trash2 className="w-3.5 h-3.5" />
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [shipments, setShipments]       = useState<StoredShipment[]>([]);
  const [testShipment, setTestShipment] = useState<TestShipment | null>(null);
  const [editing, setEditing]           = useState<StoredShipment | null>(null);

  // Seed demo data on first visit; always load from store
  useEffect(() => {
    seedStore(DEMO_SHIPMENTS);
    setShipments(getShipments());
  }, []);

  function handleSave(updated: StoredShipment) {
    setShipments(getShipments());
    setEditing(null);
  }

  function handleDelete(id: string) {
    deleteShipment(id);
    setShipments(getShipments());
  }

  return (
    <>
      {testShipment && <TestShipmentModal shipment={testShipment} onClose={() => setTestShipment(null)} />}
      {editing      && <EditShipmentModal shipment={editing} onSave={handleSave} onClose={() => setEditing(null)} />}

      <div className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-6xl space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-[#00b8d4] font-semibold text-sm uppercase tracking-widest block mb-1">Admin Portal</span>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setTestShipment(generateTestShipment())}
                className="flex items-center gap-2 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-400 font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
                <Zap className="w-4 h-4" /> Generate Test ID
              </button>
              <button onClick={onLogout}
                className="text-white/40 hover:text-white/70 text-sm font-medium border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-lg transition-colors">
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_STATS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-[#0d1627] border border-white/8 rounded-xl p-5">
                  <Icon className="w-5 h-5 text-[#00b8d4] mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-white/45 text-xs font-medium">{s.label}</div>
                  <div className="text-[#00b8d4]/70 text-xs mt-1">{s.change}</div>
                </div>
              );
            })}
          </div>

          {/* Admin quick-actions */}
          <div>
            <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {ADMIN_ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <div key={action.title} className="bg-[#0d1627] border border-white/8 rounded-xl p-6 flex flex-col">
                    <div className="w-11 h-11 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-[#00b8d4]" />
                    </div>
                    <h3 className="text-white font-bold text-base mb-2">{action.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed flex-1 mb-5">{action.description}</p>
                    <Link href={action.href} className={`inline-flex items-center justify-center text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors ${action.accent}`}>
                      {action.cta}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipments table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">All Shipments</h2>
              <span className="text-white/35 text-sm">{shipments.length} record{shipments.length !== 1 ? "s" : ""}</span>
            </div>

            {shipments.length === 0 ? (
              <div className="bg-[#0d1627] border border-white/8 rounded-xl p-12 text-center">
                <Package className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-white/35 text-sm">No shipments yet. Create one via the Quick Actions above.</p>
              </div>
            ) : (
              <div className="bg-[#0d1627] border border-white/8 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/8">
                        {["Tracking ID", "Created", "Sender", "Recipient / Destination", "Service", "Status", "Payment", "Actions"].map(col => (
                          <th key={col} className="text-left text-white/40 font-semibold text-xs uppercase tracking-wider px-4 py-4 whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {shipments.map(row => (
                        <tr key={row.id} className="hover:bg-white/2 transition-colors group">
                          <td className="px-4 py-4 font-mono text-[#00b8d4] text-xs font-semibold whitespace-nowrap">{row.id}</td>
                          <td className="px-4 py-4 text-white/35 text-xs whitespace-nowrap">{row.createdAt}</td>
                          <td className="px-4 py-4">
                            <div className="text-white/80 font-medium text-xs">{row.sender}</div>
                            <div className="text-white/30 text-xs">{row.senderEmail}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-white/80 font-medium text-xs">{row.recipient}</div>
                            <div className="text-white/30 text-xs max-w-[180px] truncate">{row.dest}</div>
                          </td>
                          <td className="px-4 py-4 text-white/55 text-xs whitespace-nowrap">{row.service}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(row.shipmentStatus)}`}>
                              {row.shipmentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${paymentStyle(row.paymentStatus)}`}>
                              {paymentLabel(row.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditing(row)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-[#00b8d4] border border-white/10 hover:border-[#00b8d4]/40 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                              >
                                <PenLine className="w-3.5 h-3.5" /> Edit
                              </button>
                              <DeleteButton onConfirm={() => handleDelete(row.id)} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  function logout() { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a] pt-20">
      {authed ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={() => setAuthed(true)} />}
    </div>
  );
}
