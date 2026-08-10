import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

export function Home() {
  const [, setLocation] = useLocation();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setLocation(`/track?id=${encodeURIComponent(trackingId.trim())}`);
    } else {
      setLocation("/track");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] bg-[#080d1a] relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00b8d4]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Welcome to <span className="text-[#00b8d4]">Move Freight Fast</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
          Your trusted logistics partner delivering excellence across the globe with cutting-edge technology and unmatched reliability.
        </p>
        
        <form 
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row w-full max-w-2xl gap-3 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300"
        >
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Your Tracking ID"
            className="flex-1 h-14 px-6 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00b8d4] focus:ring-1 focus:ring-[#00b8d4] transition-all text-lg"
            data-testid="input-tracking-id"
          />
          <button
            type="submit"
            className="h-14 px-8 rounded-lg bg-[#00b8d4] hover:bg-[#17c3d4] text-white font-semibold text-lg transition-colors whitespace-nowrap"
            data-testid="button-track-now"
          >
            Track Now
          </button>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          {[
            "Real-time Tracking",
            "Worldwide Coverage",
            "24/7 Support"
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00b8d4]" />
              <span className="text-white/90 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
