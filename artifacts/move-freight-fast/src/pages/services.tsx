import { Box, CreditCard, CheckCircle2 } from "lucide-react";

export function Services() {
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-40 px-6 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop"
            alt="Logistics Management"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#080d1a]/80" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            Comprehensive logistics solutions designed to meet the diverse needs of modern businesses the globe.
          </p>
        </div>
      </div>

      {/* Core Services Section */}
      <div className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-4 block">
              Core Services
            </span>
            <h2 className="text-4xl font-bold text-white mb-6">
              End-to-End Logistics Solutions
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto italic">
              From pickup to delivery, we handle every aspect of your logistics needs with precision and care
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-end">
            
            {/* Left Service */}
            <div className="flex flex-col sm:flex-row gap-8 items-end animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
                  alt="Worldwide Haulage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full sm:w-1/2 pb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e3a8a]/30 border border-[#1e3a8a] flex items-center justify-center mb-6">
                  <Box className="w-6 h-6 text-[#00b8d4]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Worldwide Haulage</h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  Comprehensive transportation services covering all 38 Countries. From full truckloads to consolidated shipments, we ensure your goods reach their destination safely and on time.
                </p>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00b8d4]" />
                  <span className="text-white/80">Real-time GPS tracking</span>
                </div>
              </div>
            </div>

            {/* Right Service */}
            <div className="flex flex-col-reverse sm:flex-row gap-8 items-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
              <div className="w-full sm:w-1/2 pb-4">
                <div className="w-12 h-12 rounded-xl bg-[#1e3a8a]/30 border border-[#1e3a8a] flex items-center justify-center mb-6">
                  <CreditCard className="w-6 h-6 text-[#00b8d4]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">International Freight</h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  Global shipping solutions via air and sea freight. We handle customs clearance, documentation, and ensure compliance with international trade regulations.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00b8d4]" />
                    <span className="text-white/80">Customs clearance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00b8d4]" />
                    <span className="text-white/80">Documentation handling</span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/2 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop"
                  alt="International Freight"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
