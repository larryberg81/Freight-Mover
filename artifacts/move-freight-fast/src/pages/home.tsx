import { useLocation } from "wouter";
import {
  Map,
  Zap,
  ShieldCheck,
  BarChart3,
  Warehouse,
  Globe,
  CheckCircle2,
  Anchor,
  PlaneTakeoff,
  Package,
  ArrowRight,
} from "lucide-react";

const WHY_CARDS = [
  {
    icon: Map,
    title: "Global Reach",
    desc: "Extensive network covering 38 countries with localized expertise.",
  },
  {
    icon: Zap,
    title: "Technology Driven",
    desc: "Real-time tracking, predictive analytics, and automated reporting.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Infrastructure",
    desc: "Top-tier security protocols for high-value and sensitive cargo.",
  },
  {
    icon: BarChart3,
    title: "Supply Chain Optimisation",
    desc: "Data-backed route optimisation to reduce lead times and costs.",
  },
  {
    icon: Warehouse,
    title: "Smart Distribution",
    desc: "Strategic warehousing facilities ensuring rapid regional deployment.",
  },
  {
    icon: Globe,
    title: "Fleet Management",
    desc: "Modern, eco-friendly fleet maintained to the highest standards.",
  },
];

const SERVICES = [
  {
    icon: Anchor,
    title: "Sea Freight",
    desc: "FCL and LCL shipping solutions for high-volume global commerce.",
    points: [
      "Full & Less-than Container Load",
      "Reefer container options",
      "Port handling & inland distribution",
    ],
    img: "https://images.unsplash.com/photo-1578575436955-ef29da568c6c?w=800&q=80",
  },
  {
    icon: PlaneTakeoff,
    title: "Air Freight",
    desc: "Express delivery for time-critical cargo via premier carriers.",
    points: [
      "Express & standard air cargo",
      "Aircraft chartering available",
      "Airport-to-door options",
    ],
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    icon: Package,
    title: "Contract Logistics",
    desc: "Scalable warehousing and integrated distribution networks.",
    points: [
      "Smart inventory management",
      "Pick, pack & fulfilment",
      "Rapid regional deployment",
    ],
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  },
];

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "38", label: "Countries Reached" },
  { value: "25,000+", label: "Satisfied Clients" },
  { value: "24/7", label: "Global Support" },
];

export function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1800&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#080d1a]/80" />
        {/* Subtle cyan glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00b8d4]/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 container mx-auto px-6 lg:px-16 pb-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mb-4">
            Your Trusted Global
            <br />
            <span className="text-[#00b8d4]">Logistics Partner</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
            Delivering excellence across the globe with cutting-edge technology,
            unparalleled reliability, and intelligent supply chain solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setLocation("/track")}
              className="h-12 px-8 rounded-lg bg-[#00b8d4] hover:bg-[#00a8c4] text-white font-semibold text-base transition-colors"
              data-testid="button-track-shipment-hero"
            >
              Track Shipment
            </button>
            <button
              onClick={() => setLocation("/contact")}
              className="h-12 px-8 rounded-lg border border-white/30 hover:border-white/60 text-white font-semibold text-base transition-colors bg-transparent"
              data-testid="button-get-quote"
            >
              Get a Quote
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 w-full border-t border-white/10 bg-[#080d1a]/70 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-7 gap-1"
                >
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {value}
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section className="py-24 bg-[#080d1a]">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Why Choose Move Freight Fast?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              We provide end-to-end supply chain solutions tailored to your
              business needs, ensuring maximum efficiency and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/8 bg-[#0d1726] p-7 hover:border-[#00b8d4]/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00b8d4]/10 flex items-center justify-center mb-5 group-hover:bg-[#00b8d4]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#00b8d4]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE LOGISTICS SERVICES ── */}
      <section className="py-24 bg-[#07111d]">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                Core Logistics Services
              </h2>
              <p className="text-white/55 text-lg">
                Comprehensive transport solutions designed for speed, scale, and
                certainty.
              </p>
            </div>
            <button
              onClick={() => setLocation("/services")}
              className="shrink-0 flex items-center gap-2 border border-[#00b8d4]/40 hover:border-[#00b8d4] text-[#00b8d4] rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors self-start md:self-auto"
              data-testid="button-view-all-services"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc, points, img }) => (
              <div
                key={title}
                className="rounded-xl border border-white/8 bg-[#0d1726] overflow-hidden hover:border-[#00b8d4]/30 transition-colors group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1726] via-[#0d1726]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-9 h-9 rounded-lg bg-[#00b8d4]/15 flex items-center justify-center border border-[#00b8d4]/30">
                    <Icon className="w-4 h-4 text-[#00b8d4]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
                  <p className="text-white/55 text-sm mb-5 leading-relaxed">
                    {desc}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#00b8d4] shrink-0" />
                        <span className="text-white/70 text-sm">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setLocation("/services")}
                    className="flex items-center gap-1.5 text-[#00b8d4] text-sm font-semibold hover:gap-3 transition-all"
                    data-testid={`button-learn-more-${title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
