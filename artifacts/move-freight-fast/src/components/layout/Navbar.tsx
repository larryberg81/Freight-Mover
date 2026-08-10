import { Link, useLocation } from "wouter";
import { Search, Plus } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0f1e]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f1e]/80 border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight" data-testid="link-home-logo">
          <span className="text-[#00b8d4] font-bold italic text-xl tracking-tight leading-none">
            Move Freight
          </span>
          <span className="text-[#00b8d4] font-bold italic text-xl tracking-tight leading-none">
            Fast
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-[#00b8d4] ${
                  location === link.href ? "text-[#00b8d4]" : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <Link
            href="/ship"
            data-testid="link-nav-ship"
            className={`flex items-center gap-2 border px-4 py-2.5 rounded-md font-medium text-sm transition-colors ${
              location === "/ship"
                ? "border-[#00b8d4] text-[#00b8d4]"
                : "border-white/20 text-white/80 hover:border-[#00b8d4]/60 hover:text-[#00b8d4]"
            }`}
          >
            <Plus className="w-4 h-4" />
            Create Shipment
          </Link>
          <Link
            href="/track"
            data-testid="link-nav-track"
            className="flex items-center gap-2 bg-[#00b8d4] hover:bg-[#17c3d4] text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Track Shipment
          </Link>
        </div>
      </div>
    </header>
  );
}
