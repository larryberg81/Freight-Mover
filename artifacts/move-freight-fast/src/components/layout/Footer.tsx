import { Truck, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#080d1a] border-t border-white/5 py-12">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-6 h-6 text-[#00b8d4]" />
          <span className="text-[#00b8d4] font-bold text-xl tracking-tight">
            Move Freight Fast
          </span>
        </div>
        
        <p className="text-white/60 text-sm mb-8" data-testid="text-copyright">
          © 2026 Move Freight Fast. All Rights Reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <a href="#" className="text-white/60 hover:text-[#00b8d4] transition-colors" data-testid="link-social-facebook" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/60 hover:text-[#00b8d4] transition-colors" data-testid="link-social-twitter" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/60 hover:text-[#00b8d4] transition-colors" data-testid="link-social-linkedin" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
