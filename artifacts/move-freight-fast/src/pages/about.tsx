import { Shield, Globe, Clock, Award, TrendingUp, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const stats = [
  { value: "2008", label: "Founded" },
  { value: "38+", label: "Countries Served" },
  { value: "25,000+", label: "Shipments / Year" },
  { value: "500+", label: "Trusted Clients" },
];

const values = [
  {
    icon: Shield,
    title: "Reliability",
    description:
      "We deliver on our promises — every shipment, every time. Our clients trust us because we've earned it through consistent, dependable execution.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "With partners across 38 countries and a network built over 15 years, we connect your business to markets that matter.",
  },
  {
    icon: Clock,
    title: "Speed",
    description:
      "Freight moves fast. So do we. Our optimised routing and real-time tracking ensure your cargo arrives on schedule, without surprises.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Award-winning service backed by ISO-certified processes and a team that holds itself to the highest standards in the industry.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We continuously invest in technology and process improvements so our clients benefit from smarter, more efficient logistics solutions.",
  },
  {
    icon: Users,
    title: "Partnership",
    description:
      "We don't just move freight — we build long-term relationships. Your growth drives our growth, and we're invested in your success.",
  },
];

const milestones = [
  { year: "2008", event: "Founded in London with a 3-truck fleet and a simple mission: faster, smarter freight." },
  { year: "2011", event: "Expanded into European cross-border haulage; first international partnership signed in Frankfurt." },
  { year: "2014", event: "Launched a dedicated customs brokerage division, simplifying import/export for SME clients." },
  { year: "2017", event: "Opened regional hubs in Manchester, Birmingham, and Bristol to serve UK-wide demand." },
  { year: "2020", event: "Invested in a proprietary tracking platform — giving clients live shipment visibility for the first time." },
  { year: "2023", event: "Surpassed 25,000 annual shipments; recognised as a Top 50 UK Logistics Provider by FreightWeek." },
];

const team = [
  {
    name: "James Hargreaves",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    bio: "20 years in international freight. James co-founded MFF with a conviction that logistics could be simpler, faster, and more transparent.",
  },
  {
    name: "Sarah Okonkwo",
    role: "Chief Operations Officer",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=800&auto=format&fit=crop",
    bio: "A logistics engineer by training, Sarah oversees our entire fleet and warehouse network, ensuring every link in the chain performs.",
  },
  {
    name: "Daniel Reeves",
    role: "Head of International Freight",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    bio: "Daniel manages our cross-border corridors and customs relationships across 38 countries, making complex shipments straightforward.",
  },
];

export function About() {
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">

      {/* ── Hero ── */}
      <div className="relative h-[520px] flex items-center justify-center text-center">
        <img
          src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070&auto=format&fit=crop"
          alt="Shipping port"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#080d1a]/70" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16">
          <span className="inline-block text-[#00b8d4] font-semibold tracking-widest uppercase text-sm mb-4">
            Who We Are
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Moving the World's<br />
            <span className="text-[#00b8d4]">Freight Forward</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            For over 15 years, Move Freight Fast has been the logistics partner businesses trust
            — reliably, efficiently, and anywhere in the world.
          </p>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="border-y border-white/10 bg-[#0d1627]">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="py-8 px-8 text-center">
                <div className="text-3xl font-bold text-[#00b8d4] mb-1">{s.value}</div>
                <div className="text-white/50 font-medium tracking-wide uppercase text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our Story ── */}
      <div className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Main image — fixed height so it always fills */}
            <div className="relative h-[420px] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"
                alt="Warehouse logistics"
                className="w-full h-full object-cover"
              />
              {/* Inset badge */}
              <div className="absolute bottom-5 left-5 bg-[#1e3a8a]/90 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 shadow-xl">
                <div className="text-xl font-bold text-[#00b8d4]">Since 2008</div>
                <div className="text-white/70 text-sm">Serving the world</div>
              </div>
              {/* Inset thumbnail */}
              <div className="absolute top-5 right-5 w-36 h-28 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop"
                  alt="Truck fleet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-3 block">
                Our Story
              </span>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Built on Trust,<br />Driven by Results
              </h2>
              <div className="space-y-4 text-white/60 text-base leading-relaxed mb-8">
                <p>
                  Move Freight Fast was founded in 2008 with a single conviction: freight logistics didn't have
                  to be complicated. What began with a modest fleet of three trucks and a London office has grown
                  into one of the UK's most respected end-to-end logistics operators.
                </p>
                <p>
                  Today we move thousands of shipments every year across road, sea, and air — from pallet
                  collections to full container loads, domestic express runs to complex multi-leg international
                  freight. Every consignment receives the same focused attention that defined us from day one.
                </p>
                <p>
                  Our growth has never been accidental. It reflects the loyalty of clients who rely on us year
                  after year, and a team that treats every shipment as a personal responsibility.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/services" className="inline-flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                  Our Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 border border-white/20 hover:border-[#00b8d4]/60 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                  Get in Touch
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mission & Vision ── */}
      <div className="py-6 px-6 bg-[#0d1627]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">

            <div className="relative rounded-2xl overflow-hidden h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2070&auto=format&fit=crop"
                alt="Mission"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/90 via-[#080d1a]/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[#00b8d4] font-semibold uppercase tracking-widest text-xs mb-2">Our Mission</span>
                <h3 className="text-2xl font-bold text-white mb-3">Simplify global freight for every business</h3>
                <p className="text-white/65 text-sm leading-relaxed">
                  We exist to remove the friction from freight — replacing complexity with clarity, and delay
                  with dependability, so our clients can focus on growing their business.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070&auto=format&fit=crop"
                alt="Vision"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/90 via-[#080d1a]/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[#00b8d4] font-semibold uppercase tracking-widest text-xs mb-2">Our Vision</span>
                <h3 className="text-2xl font-bold text-white mb-3">The most trusted freight partner in Europe</h3>
                <p className="text-white/65 text-sm leading-relaxed">
                  By 2030, we aim to be the first call for any business moving freight across Europe —
                  recognised not just for speed and coverage, but for the trust we've earned shipment by shipment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Core Values ── */}
      <div className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-4xl font-bold text-white">Our Core Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-[#0d1627] border border-white/8 rounded-2xl p-7 hover:border-[#00b8d4]/40 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 bg-[#00b8d4]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00b8d4]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#00b8d4]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-white/55 leading-relaxed text-sm">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="py-20 px-6 bg-[#0d1627]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-3 block">
              15 Years of Growth
            </span>
            <h2 className="text-4xl font-bold text-white">Our Milestones</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="flex gap-5 bg-[#080d1a] border border-white/8 rounded-xl p-6 hover:border-[#00b8d4]/30 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00b8d4]/15 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-5 h-5 text-[#00b8d4]" />
                </div>
                <div>
                  <div className="text-[#00b8d4] font-bold text-base mb-1">{m.year}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Leadership Team ── */}
      <div className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-3 block">
              Leadership
            </span>
            <h2 className="text-4xl font-bold text-white mb-3">Meet the Team</h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Experienced, driven, and committed to getting your freight where it needs to be.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {team.map((member) => (
              <div key={member.name} className="group bg-[#0d1627] border border-white/8 rounded-2xl overflow-hidden hover:border-[#00b8d4]/30 transition-colors">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1627]/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <div className="text-[#00b8d4] font-semibold text-sm mb-3">{member.role}</div>
                  <p className="text-white/50 leading-relaxed text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="relative py-24 px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
          alt="Cargo ship at sea"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#080d1a]/80" />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Ready to Move Freight Smarter?
          </h2>
          <p className="text-white/65 text-lg mb-8 leading-relaxed">
            Join 500+ businesses that trust Move Freight Fast to deliver. Let's talk about what we can do for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#00b8d4] hover:bg-[#00a0bb] text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/track" className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base">
              Track a Shipment
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
