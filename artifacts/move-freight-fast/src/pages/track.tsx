import { MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function Track() {
  const [trackingId, setTrackingId] = useState("");
  
  useEffect(() => {
    // Get query param if exists
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#00b8d4] to-[#005f73] pt-32 pb-40 px-6 text-center">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-xl">
              <MapPin className="w-8 h-8 text-[#00b8d4]" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-sm">
            Track Your Shipment
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-sm">
            Real-time tracking with live location updates, delivery estimates, and comprehensive shipment history
          </p>
        </div>
      </div>

      {/* Tracking Input Section */}
      <div className="pb-32 px-6 relative -mt-16">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-[#111827] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <form 
              onSubmit={(e) => { e.preventDefault(); /* mock tracking action */ }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {/* Since lucide doesn't have a perfect Barcode, using a generic package/layout icon or search */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00b8d4]">
                    <path d="M3 5v14M8 5v14M12 5v14M17 5v14M21 5v14" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Your Tracking ID (e.g., SWT1234567890)"
                  className="w-full h-14 pl-12 pr-6 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00b8d4] focus:ring-1 focus:ring-[#00b8d4] transition-all text-lg"
                  data-testid="input-track-page-id"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 rounded-xl bg-[#00b8d4] hover:bg-[#17c3d4] text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                data-testid="button-track-package"
              >
                <Search className="w-5 h-5" />
                Track Package
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
