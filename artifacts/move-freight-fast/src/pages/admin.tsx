import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Lock, Eye, EyeOff, ShieldCheck,
  Package, Search, BarChart3, Users, Truck, Settings,
} from "lucide-react";

const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "mff_admin_auth";

const QUICK_STATS = [
  { icon: Package, label: "Total Shipments", value: "1,284", change: "+12% this month" },
  { icon: Truck, label: "In Transit", value: "43", change: "Active right now" },
  { icon: Users, label: "Active Clients", value: "512", change: "+8 this week" },
  { icon: BarChart3, label: "On-Time Rate", value: "98.2%", change: "Last 30 days" },
];

const ADMIN_ACTIONS = [
  {
    icon: Package,
    title: "Create Shipment",
    description: "Book a new freight shipment and generate a tracking ID.",
    href: "/ship",
    cta: "Create Shipment",
    accent: "bg-[#00b8d4] hover:bg-[#00a0bb]",
  },
  {
    icon: Search,
    title: "Track Shipment",
    description: "Look up live status and location for any shipment.",
    href: "/track",
    cta: "Track Shipment",
    accent: "bg-[#1e3a8a] hover:bg-[#1e40af]",
  },
  {
    icon: Settings,
    title: "Manage Services",
    description: "Review and update available freight service offerings.",
    href: "/services",
    cta: "View Services",
    accent: "bg-[#374151] hover:bg-[#4b5563]",
  },
];

// ── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className={`w-full max-w-md transition-all ${shaking ? "animate-[shake_0.4s_ease]" : ""}`}>

        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00b8d4]/10 border border-[#00b8d4]/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#00b8d4]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/45 text-sm">Enter your password to access the dashboard.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#0d1627] border border-white/8 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 pr-11 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Sign In
          </button>

          <p className="text-center text-white/25 text-xs">
            Hint: <span className="font-mono">admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex-1 py-12 px-6">
      <div className="container mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#00b8d4] font-semibold text-sm uppercase tracking-widest block mb-1">Admin Portal</span>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={onLogout}
            className="text-white/40 hover:text-white/70 text-sm font-medium border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-[#0d1627] border border-white/8 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-[#00b8d4]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-white/45 text-xs font-medium">{s.label}</div>
                <div className="text-[#00b8d4]/70 text-xs mt-1">{s.change}</div>
              </div>
            );
          })}
        </div>

        {/* Admin actions */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {ADMIN_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="bg-[#0d1627] border border-white/8 rounded-xl p-6 flex flex-col">
                  <div className="w-11 h-11 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#00b8d4]" />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{action.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed flex-1 mb-5">{action.description}</p>
                  <Link
                    href={action.href}
                    className={`inline-flex items-center justify-center text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors ${action.accent}`}
                  >
                    {action.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent shipments placeholder */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Recent Shipments</h2>
          <div className="bg-[#0d1627] border border-white/8 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Tracking ID", "Sender", "Destination", "Service", "Status"].map(col => (
                    <th key={col} className="text-left text-white/40 font-semibold text-xs uppercase tracking-wider px-5 py-4">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: "MFF3847291056", sender: "J. Hargreaves", dest: "Sydney NSW", service: "Overnight", status: "In Transit" },
                  { id: "MFF9021847365", sender: "S. Okonkwo", dest: "Melbourne VIC", service: "Road Freight", status: "Delivered" },
                  { id: "MFF5088840683", sender: "D. Reeves", dest: "Wyee NSW", service: "Road Freight", status: "Pending" },
                  { id: "MFF7712039482", sender: "Acme Co.", dest: "Brisbane QLD", service: "Air Freight", status: "Out for Delivery" },
                ].map(row => (
                  <tr key={row.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 font-mono text-[#00b8d4] text-xs font-semibold">{row.id}</td>
                    <td className="px-5 py-4 text-white/70">{row.sender}</td>
                    <td className="px-5 py-4 text-white/70">{row.dest}</td>
                    <td className="px-5 py-4 text-white/55">{row.service}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.status === "Delivered" ? "bg-green-500/15 text-green-400"
                        : row.status === "In Transit" ? "bg-[#00b8d4]/15 text-[#00b8d4]"
                        : row.status === "Out for Delivery" ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-white/8 text-white/50"
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  return (
    <div className="flex-1 flex flex-col bg-[#080d1a] pt-20">
      {authed ? <Dashboard onLogout={logout} /> : <LoginScreen onLogin={() => setAuthed(true)} />}
    </div>
  );
}
