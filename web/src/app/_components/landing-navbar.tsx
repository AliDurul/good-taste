"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Wheat } from "lucide-react";

const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Why Us", href: "#why-us" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "App", href: "#app" },
  { label: "Contact", href: "#contact" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-amber-100"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600">
              <Wheat className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-stone-900">
              Good Taste
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
            >
              <a href="#app">Download App</a>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Link href="/login">Admin Login</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-stone-700 hover:bg-amber-50"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 pb-4 pt-2 shadow-lg">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
              >
                <a href="#app" onClick={() => setMenuOpen(false)}>
                  Download App
                </a>
              </Button>
              <Button
                asChild
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Admin Login
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
