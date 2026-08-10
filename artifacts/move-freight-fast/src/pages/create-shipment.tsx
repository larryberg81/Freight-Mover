import { useState } from "react";
import { Link } from "wouter";
import {
  User, Building2, MapPin, Phone, Mail,
  Package, Weight, Ruler, Shield, PenLine,
  ChevronRight, ChevronLeft, CheckCircle2,
  Truck, Copy, Search, ArrowRight,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Address {
  name: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface PackageInfo {
  serviceType: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  description: string;
  insurance: string;
  signatureRequired: boolean;
}

interface ShipmentResult {
  trackingId: string;
  createdAt: string;
  sender: Address;
  recipient: Address;
  pkg: PackageInfo;
}

const STEPS = ["Sender", "Recipient", "Package", "Confirm"];

const SERVICE_TYPES = [
  "Road Freight",
  "International Air Freight",
  "Sea Freight",
  "Overnight Express",
  "Economy Ground",
  "Same Day Delivery",
];

const COUNTRIES = [
  "Australia", "United Kingdom", "United States", "Canada",
  "Germany", "France", "New Zealand", "Singapore", "Japan", "Other",
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateTrackingId() {
  const prefix = "MFF";
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${digits}`;
}

function emptyAddress(): Address {
  return { name: "", company: "", email: "", phone: "", street: "", city: "", state: "", postcode: "", country: "Australia" };
}

function emptyPackage(): PackageInfo {
  return { serviceType: "Road Freight", weight: "", length: "", width: "", height: "", description: "", insurance: "0", signatureRequired: false };
}

// ── Field components ─────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-white mb-2">
        {label}{required && <span className="text-[#00b8d4] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ── Step 1 & 2: Address form ─────────────────────────────────────────────────

function AddressForm({ data, onChange, title, icon: Icon }: {
  data: Address;
  onChange: (d: Address) => void;
  title: string;
  icon: React.ElementType;
}) {
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [k]: e.target.value });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#00b8d4]" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" required>
          <input className={inputCls} placeholder="Jane Smith" value={data.name} onChange={set("name")} />
        </Field>
        <Field label="Company / Organisation">
          <input className={inputCls} placeholder="Acme Logistics Pty Ltd" value={data.company} onChange={set("company")} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email Address" required>
          <input type="email" className={inputCls} placeholder="jane@company.com" value={data.email} onChange={set("email")} />
        </Field>
        <Field label="Phone Number" required>
          <input type="tel" className={inputCls} placeholder="+61 400 000 000" value={data.phone} onChange={set("phone")} />
        </Field>
      </div>

      <Field label="Street Address" required>
        <input className={inputCls} placeholder="123 Commerce Street" value={data.street} onChange={set("street")} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="City" required>
          <input className={inputCls} placeholder="Sydney" value={data.city} onChange={set("city")} />
        </Field>
        <Field label="State / Province" required>
          <input className={inputCls} placeholder="NSW" value={data.state} onChange={set("state")} />
        </Field>
        <Field label="Postcode" required>
          <input className={inputCls} placeholder="2000" value={data.postcode} onChange={set("postcode")} />
        </Field>
      </div>

      <Field label="Country" required>
        <select className={selectCls} value={data.country} onChange={set("country")}>
          {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#111827]">{c}</option>)}
        </select>
      </Field>
    </div>
  );
}

// ── Step 3: Package form ─────────────────────────────────────────────────────

function PackageForm({ data, onChange }: { data: PackageInfo; onChange: (d: PackageInfo) => void }) {
  const set = (k: keyof PackageInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange({ ...data, [k]: e.target.value });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-[#00b8d4]" />
        </div>
        <h2 className="text-2xl font-bold text-white">Package Details</h2>
      </div>

      <Field label="Service Type" required>
        <select className={selectCls} value={data.serviceType} onChange={set("serviceType")}>
          {SERVICE_TYPES.map(s => <option key={s} value={s} className="bg-[#111827]">{s}</option>)}
        </select>
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Weight (kg)" required>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input className={`${inputCls} pl-10`} type="number" min="0.1" step="0.1" placeholder="5.0" value={data.weight} onChange={set("weight")} />
          </div>
        </Field>
        <Field label="Insurance Value ($)">
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input className={`${inputCls} pl-10`} type="number" min="0" placeholder="0.00" value={data.insurance} onChange={set("insurance")} />
          </div>
        </Field>
      </div>

      <div>
        <label className="block text-sm font-bold text-white mb-2">
          Dimensions (cm) <span className="text-white/40 font-normal">— optional</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["length", "width", "height"] as const).map(dim => (
            <div key={dim} className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                className={`${inputCls} pl-9`}
                type="number" min="1" placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
                value={data[dim]}
                onChange={set(dim)}
              />
            </div>
          ))}
        </div>
      </div>

      <Field label="Contents Description" required>
        <div className="relative">
          <PenLine className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
          <textarea
            className={`${inputCls} pl-10 resize-none`}
            rows={3}
            placeholder="Describe the contents of your shipment..."
            value={data.description}
            onChange={set("description")}
          />
        </div>
      </Field>

      <div className="flex items-center gap-3 bg-[#111827] border border-white/10 rounded-lg px-4 py-3 cursor-pointer select-none"
        onClick={() => onChange({ ...data, signatureRequired: !data.signatureRequired })}>
        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${data.signatureRequired ? "bg-[#00b8d4] border-[#00b8d4]" : "border-white/20"}`}>
          {data.signatureRequired && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <span className="text-white text-sm font-medium">Signature Required on Delivery</span>
      </div>
    </div>
  );
}

// ── Step 4: Review ───────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-white/5 last:border-0 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="text-white font-medium text-right ml-4 max-w-xs">{value || "—"}</span>
    </div>
  );
}

function ReviewSection({ title, icon: Icon, rows }: { title: string; icon: React.ElementType; rows: { label: string; value: string }[] }) {
  return (
    <div className="bg-[#111827] border border-white/8 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[#00b8d4]" />
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      {rows.map(r => <ReviewRow key={r.label} {...r} />)}
    </div>
  );
}

// ── Confirmation screen ──────────────────────────────────────────────────────

function ConfirmationScreen({ result, onNew }: { result: ShipmentResult; onNew: () => void }) {
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(result.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="bg-gradient-to-r from-[#00b8d4]/10 to-[#1e3a8a]/10 border border-[#00b8d4]/25 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Shipment Created!</h2>
        <p className="text-white/55 mb-6">Your shipment has been booked. Use the tracking ID below to monitor progress.</p>

        <div className="inline-flex items-center gap-3 bg-[#0d1627] border border-[#00b8d4]/30 rounded-xl px-6 py-4">
          <div>
            <div className="text-[#00b8d4] text-xs font-semibold uppercase tracking-widest mb-1">Tracking ID</div>
            <div className="text-2xl font-bold text-white tracking-wider">{result.trackingId}</div>
          </div>
          <button
            onClick={copyId}
            className="ml-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            title="Copy"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            href={`/track?id=${result.trackingId}`}
            className="inline-flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" /> Track This Shipment
          </Link>
          <button
            onClick={onNew}
            className="inline-flex items-center gap-2 border border-white/20 hover:border-[#00b8d4]/50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> Create Another
          </button>
        </div>
      </div>

      {/* Shipment summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <ReviewSection title="Sender" icon={User} rows={[
          { label: "Name", value: result.sender.name },
          { label: "Company", value: result.sender.company },
          { label: "Email", value: result.sender.email },
          { label: "Phone", value: result.sender.phone },
          { label: "Address", value: `${result.sender.street}, ${result.sender.city} ${result.sender.state} ${result.sender.postcode}` },
          { label: "Country", value: result.sender.country },
        ]} />
        <ReviewSection title="Recipient" icon={MapPin} rows={[
          { label: "Name", value: result.recipient.name },
          { label: "Company", value: result.recipient.company },
          { label: "Email", value: result.recipient.email },
          { label: "Phone", value: result.recipient.phone },
          { label: "Address", value: `${result.recipient.street}, ${result.recipient.city} ${result.recipient.state} ${result.recipient.postcode}` },
          { label: "Country", value: result.recipient.country },
        ]} />
        <ReviewSection title="Package" icon={Package} rows={[
          { label: "Service", value: result.pkg.serviceType },
          { label: "Weight", value: result.pkg.weight ? `${result.pkg.weight} kg` : "—" },
          { label: "Dimensions", value: result.pkg.length ? `${result.pkg.length} × ${result.pkg.width} × ${result.pkg.height} cm` : "—" },
          { label: "Insurance", value: result.pkg.insurance ? `$${result.pkg.insurance} Coverage` : "$0.00 Coverage" },
          { label: "Signature Required", value: result.pkg.signatureRequired ? "Yes" : "No" },
          { label: "Description", value: result.pkg.description },
        ]} />
        <ReviewSection title="Booking Info" icon={Truck} rows={[
          { label: "Tracking ID", value: result.trackingId },
          { label: "Booked At", value: result.createdAt },
          { label: "Status", value: "Pending Pickup" },
        ]} />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export function CreateShipment() {
  const [step, setStep] = useState(0);
  const [sender, setSender] = useState<Address>(emptyAddress());
  const [recipient, setRecipient] = useState<Address>(emptyAddress());
  const [pkg, setPkg] = useState<PackageInfo>(emptyPackage());
  const [result, setResult] = useState<ShipmentResult | null>(null);

  function isStepValid() {
    if (step === 0) return !!(sender.name && sender.email && sender.phone && sender.street && sender.city && sender.country);
    if (step === 1) return !!(recipient.name && recipient.email && recipient.phone && recipient.street && recipient.city && recipient.country);
    if (step === 2) return !!(pkg.weight && pkg.description);
    return true;
  }

  function handleSubmit() {
    const now = new Date();
    setResult({
      trackingId: generateTrackingId(),
      createdAt: now.toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }),
      sender,
      recipient,
      pkg,
    });
  }

  function handleNew() {
    setSender(emptyAddress());
    setRecipient(emptyAddress());
    setPkg(emptyPackage());
    setResult(null);
    setStep(0);
  }

  if (result) {
    return (
      <div className="flex-1 bg-[#080d1a]">
        <div className="pt-28 pb-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <ConfirmationScreen result={result} onNew={handleNew} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#080d1a]">

      {/* Header */}
      <div className="pt-28 pb-10 px-6 text-center border-b border-white/5">
        <span className="text-[#00b8d4] font-semibold tracking-widest uppercase text-sm mb-3 block">Book a Shipment</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Create Shipment</h1>
        <p className="text-white/55 text-base max-w-xl mx-auto">
          Fill in the details below to generate a tracking ID and book your freight.
        </p>
      </div>

      <div className="py-10 px-6">
        <div className="container mx-auto max-w-3xl">

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    i < step ? "bg-[#00b8d4] border-[#00b8d4] text-white"
                    : i === step ? "bg-transparent border-[#00b8d4] text-[#00b8d4]"
                    : "bg-transparent border-white/15 text-white/30"
                  }`}>
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${i === step ? "text-[#00b8d4]" : "text-white/30"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors ${i < step ? "bg-[#00b8d4]" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-[#0d1627] border border-white/8 rounded-2xl p-7 mb-6">
            {step === 0 && <AddressForm data={sender} onChange={setSender} title="Sender Details" icon={User} />}
            {step === 1 && <AddressForm data={recipient} onChange={setRecipient} title="Recipient Details" icon={MapPin} />}
            {step === 2 && <PackageForm data={pkg} onChange={setPkg} />}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#00b8d4]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Review & Confirm</h2>
                </div>
                <p className="text-white/50 text-sm mb-4">Check all details before generating your tracking ID.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ReviewSection title="Sender" icon={User} rows={[
                    { label: "Name", value: sender.name },
                    { label: "Email", value: sender.email },
                    { label: "Phone", value: sender.phone },
                    { label: "Address", value: `${sender.street}, ${sender.city} ${sender.state} ${sender.postcode}, ${sender.country}` },
                  ]} />
                  <ReviewSection title="Recipient" icon={MapPin} rows={[
                    { label: "Name", value: recipient.name },
                    { label: "Email", value: recipient.email },
                    { label: "Phone", value: recipient.phone },
                    { label: "Address", value: `${recipient.street}, ${recipient.city} ${recipient.state} ${recipient.postcode}, ${recipient.country}` },
                  ]} />
                  <ReviewSection title="Package" icon={Package} rows={[
                    { label: "Service", value: pkg.serviceType },
                    { label: "Weight", value: pkg.weight ? `${pkg.weight} kg` : "—" },
                    { label: "Dimensions", value: pkg.length ? `${pkg.length} × ${pkg.width} × ${pkg.height} cm` : "—" },
                    { label: "Insurance", value: `$${pkg.insurance || "0"} Coverage` },
                    { label: "Signature", value: pkg.signatureRequired ? "Required" : "Not required" },
                    { label: "Contents", value: pkg.description },
                  ]} />
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-white/70 hover:text-white font-semibold px-5 py-3 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!isStepValid()}
                className="flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] disabled:opacity-40 disabled:pointer-events-none text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                <Truck className="w-4 h-4" /> Generate Tracking ID
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
