import { Mail, CheckCircle2 } from "lucide-react";

export function Contact() {
  return (
    <div className="flex-1 flex flex-col bg-[#080d1a]">
      {/* Header */}
      <div className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-white/70">
            Ready to optimize your logistics? Get in touch with our experts for personalized solutions and competitive quotes
          </p>
        </div>
      </div>

      <div className="pb-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          
          {/* Top Info Card */}
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <div className="bg-[#111827]/80 border border-white/5 rounded-2xl p-8 max-w-sm mx-auto sm:mx-0 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#1e3a8a]/30 border border-[#00b8d4]/30 flex items-center justify-center mb-6">
                <Mail className="w-5 h-5 text-[#00b8d4]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
              <p className="text-[#00b8d4] font-medium mb-1">info@movefreightfast.com</p>
              <p className="text-white/50 text-sm">24/7 Response</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <span className="text-[#00b8d4] font-bold tracking-wider uppercase text-sm mb-4 block">
                Get In Touch
              </span>
              <h2 className="text-4xl font-bold text-white mb-6">
                Let's Discuss Your Logistics Needs
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Whether you need a one-time shipment or a comprehensive logistics solution, our team is ready to help. Fill out the form and we'll get back to you within 24 hours.
              </p>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#00b8d4]" />
                <span className="text-white font-medium">Free Consultation</span>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-[#111827]/80 border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
              <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">First Name *</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full bg-[#1f2937]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b8d4] transition-colors"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Last Name *</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full bg-[#1f2937]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b8d4] transition-colors"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-[#1f2937]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b8d4] transition-colors"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Message *</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your logistics needs..."
                    className="w-full bg-[#1f2937]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00b8d4] transition-colors resize-none"
                    data-testid="input-message"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#00b8d4] hover:bg-[#17c3d4] text-white font-bold rounded-lg px-4 py-4 transition-colors"
                  data-testid="button-submit-contact"
                >
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
