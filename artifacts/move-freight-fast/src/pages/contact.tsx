import { Send, Mail, Phone, MapPin, Clock } from "lucide-react";

const services = [
  "Road Freight",
  "International Air Freight",
  "Sea Freight",
  "Customs Brokerage",
  "Warehousing & Storage",
  "Express Delivery",
  "Other",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@movefreightfast.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+44 20 7946 0958",
    sub: "Mon – Fri, 8am – 6pm",
  },
  {
    icon: MapPin,
    label: "Head Office",
    value: "12 Commerce Way, London, EC1A 1BB",
    sub: "United Kingdom",
  },
  {
    icon: Clock,
    label: "Operations",
    value: "24 / 7 Tracking Support",
    sub: "Always available",
  },
];

export function Contact() {
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">

      {/* ── Hero ── */}
      <div className="pt-32 pb-16 px-6 text-center border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#00b8d4] font-semibold tracking-widest uppercase text-sm mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Ready to optimise your logistics? Speak to our team for tailored solutions and competitive quotes.
          </p>
        </div>
      </div>

      {/* ── Contact Info Strip ── */}
      <div className="bg-[#0d1627] border-b border-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4 px-6 py-7">
                  <div className="w-10 h-10 rounded-lg bg-[#00b8d4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-[#00b8d4]" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs uppercase tracking-wide mb-1">{item.label}</div>
                    <div className="text-white font-semibold text-sm leading-snug">{item.value}</div>
                    <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left — intro text */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                Let's Discuss Your<br />Logistics Needs
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                Whether you need a one-time shipment or a full logistics partnership, our specialists are ready to help. Fill in the form and we'll get back to you within 24 hours.
              </p>

              <ul className="space-y-3">
                {[
                  "Free, no-obligation consultation",
                  "Competitive rates across all freight modes",
                  "Dedicated account manager assigned",
                  "Response guaranteed within 24 hours",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00b8d4] flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3 bg-[#0d1627] border border-white/8 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

                {/* First / Last Name */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">First Name *</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 602 123 4567"
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm"
                  />
                </div>

                {/* Service Interest */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Service Interest</label>
                  <select
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white/60 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s} className="text-white bg-[#111827]">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Message *</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your logistics needs..."
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#00b8d4] transition-colors text-sm resize-y"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg px-6 py-4 transition-colors text-base mt-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
