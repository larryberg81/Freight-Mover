export function About() {
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-40 px-6 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070&auto=format&fit=crop"
            alt="Shipping port"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#080d1a]/80 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Move Freight Fast
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            Pioneering logistics excellence worldwide for over 15 years, connecting businesses to opportunities nationwide and beyond.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-4 block">
                Our Story
              </span>
              <h2 className="text-4xl font-bold text-white mb-8">
                Building The Logistics Future
              </h2>
              
              <div className="space-y-6 text-white/70 text-lg leading-relaxed mb-12">
                <p>
                  Founded in 2008, Move Freight Fast emerged from a vision to revolutionize Global logistics landscape. What started as a small freight company has grown into one of the nation's most trusted logistics partners.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, strategic partnerships, and an unwavering commitment to customer satisfaction. Today, we serve over 500 businesses across 38 countries.
                </p>
              </div>

              <div className="flex items-center gap-16">
                <div>
                  <div className="text-4xl font-bold text-[#00b8d4] mb-2">15+</div>
                  <div className="text-white/60 font-medium">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#00b8d4] mb-2">500+</div>
                  <div className="text-white/60 font-medium">Happy Clients</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8ed7c83a54?q=80&w=2070&auto=format&fit=crop"
                  alt="Global logistics"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badge overlay */}
              <div className="absolute -bottom-8 -left-8 bg-[#1e3a8a] text-white p-8 rounded-xl shadow-2xl shadow-black/50 border border-white/10 hidden md:block">
                <div className="text-2xl font-bold mb-1 text-[#00b8d4]">Since 2008</div>
                <div className="text-white/80 font-medium tracking-wide">Serving The World</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
