import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
  Wheat,
  ShieldCheck,
  Truck,
  PackageCheck,
  Star,
  Smartphone,
  Coins,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { LandingNavbar } from "./_components/landing-navbar";
import { ContactForm } from "./_components/contact-form";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { size: "1 kg", price: "K0.80", desc: "Perfect for households. Light and easy to carry.", popular: false },
  { size: "2 kg", price: "K1.50", desc: "Great for small families. Freshly milled.", popular: false },
  { size: "5 kg", price: "K3.50", desc: "Our most popular home pack.", popular: true },
  { size: "10 kg", price: "K6.80", desc: "Ideal for larger families and small eateries.", popular: false },
  { size: "25 kg", price: "K16.00", desc: "Bulk sack for restaurants and caterers.", popular: false },
  { size: "50 kg", price: "K30.00", desc: "Commercial grade — wholesale & distributor pricing.", popular: false, bulk: true },
];

const WHY_US = [
  { icon: ShieldCheck, title: "100% Natural", desc: "No additives, no preservatives. Just pure maize, stone-milled the traditional way." },
  { icon: Wheat, title: "Freshly Milled", desc: "Milled in small batches to guarantee freshness in every sack you receive." },
  { icon: PackageCheck, title: "Bulk Orders Welcome", desc: "Whether you need 10 bags or 10,000, we handle wholesale with ease." },
  { icon: Truck, title: "Fast Delivery", desc: "Reliable logistics network ensures your order reaches you on time, every time." },
];

const STEPS = [
  { step: "01", icon: Smartphone, title: "Pick Your Size", desc: "Browse our range of maize flour sacks from 1 kg household packs to 50 kg commercial sacks." },
  { step: "02", icon: PackageCheck, title: "Place Your Order", desc: "Fill in our contact form or order directly through the Good Pocket app in seconds." },
  { step: "03", icon: Truck, title: "We Deliver", desc: "Sit back and relax — our team delivers fresh maize flour right to your door." },
];

const APP_FEATURES = [
  { icon: Smartphone, text: "Order any size from your phone, anytime" },
  { icon: Coins, text: "Earn reward points on every order you place" },
  { icon: MapPin, text: "Real-time delivery tracking to your doorstep" },
  { icon: Star, text: "Exclusive app-only deals and promotions" },
];

const TESTIMONIALS = [
  {
    quote: "Good Taste maize flour is the only brand my restaurant has used for three years. Consistent quality, reliable delivery.",
    name: "Margaret O.",
    role: "Restaurant Owner",
  },
  {
    quote: "We distribute 200+ bags a week through Good Taste. Their wholesale team is responsive and pricing is unbeatable.",
    name: "James K.",
    role: "Wholesale Distributor",
  },
  {
    quote: "Since downloading Good Pocket I order every week and the reward points add up fast. Amazing service!",
    name: "Aisha M.",
    role: "Household Customer",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <LandingNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative overflow-hidden bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 pt-32 pb-24"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-orange-200/30 blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-amber-600 text-white hover:bg-amber-600">
              🌽 100% Pure Maize Flour
            </Badge>
            <h1 className="font-serif text-5xl font-bold leading-tight text-stone-900 sm:text-6xl lg:text-7xl">
              Pure Maize.{" "}
              <span className="text-amber-600">Trusted</span>{" "}
              Quality.
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-stone-600 max-w-2xl">
              Good Taste delivers freshly milled maize flour in sizes from 1 kg household packs to
              50 kg wholesale sacks — straight to your door, every time.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8"
              >
                <a href="#contact">Order Now</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold px-8"
              >
                <a href="#app" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Download Good Pocket
                </a>
              </Button>
            </div>
            <div className="mt-14 flex flex-wrap gap-6">
              {[
                { icon: ShieldCheck, label: "Quality Certified" },
                { icon: Wheat, label: "Freshly Milled" },
                { icon: Truck, label: "Nationwide Delivery" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-stone-600">
                  <Icon className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              Our Products
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              A Size for Every Need
            </h2>
            <p className="mt-4 text-lg text-stone-500 max-w-xl mx-auto">
              From the kitchen pantry to the commercial warehouse — we have the right pack for you.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <Card
                key={product.size}
                className={`relative border transition-shadow hover:shadow-md ${
                  product.popular ? "border-amber-400 ring-1 ring-amber-300" : "border-stone-200"
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white">Most Popular</Badge>
                  </div>
                )}
                {product.bulk && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                    <Badge className="bg-stone-800 text-white">Wholesale</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                      <Wheat className="h-6 w-6 text-amber-600" />
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-stone-900">
                    {product.size} Sack
                  </h3>
                  <p className="mt-2 text-sm text-stone-500">{product.desc}</p>
                  <Button
                    asChild
                    className="mt-5 w-full bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                  >
                    <a href="#contact">Inquire Now</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-24 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              Why Good Taste
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              Quality You Can Taste
            </h2>
            <p className="mt-4 text-lg text-stone-500 max-w-xl mx-auto">
              We take pride in every sack we produce. Here&apos;s what sets us apart.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-600 shadow-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-stone-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              How It Works
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              Fresh Flour in 3 Simple Steps
            </h2>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3">
            {STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-200 bg-amber-600 shadow-md">
                  <Icon className="h-7 w-7 text-white" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-xl font-bold text-stone-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500 max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Good Pocket App ──────────────────────────────────────────────────── */}
      <section
        id="app"
        className="py-24 bg-linear-to-br from-stone-900 to-stone-800 text-white overflow-hidden relative"
      >
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange-400/10 blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-6 bg-amber-600 text-white hover:bg-amber-600">
                📱 Good Pocket App
              </Badge>
              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                Order Maize Flour.{" "}
                <span className="text-amber-400">Earn Rewards.</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-stone-300">
                Download Good Pocket — our free mobile app where every order earns you
                reward points you can redeem on future purchases. Fast, easy, and delivered to your door.
              </p>
              <ul className="mt-8 space-y-4">
                {APP_FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-stone-200">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-white text-stone-900 hover:bg-stone-100 font-semibold gap-2"
                  size="lg"
                >
                  <a href="#" aria-label="Download on the App Store">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    App Store
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2"
                  size="lg"
                >
                  <a href="#" aria-label="Get it on Google Play">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l14 8.5-14 8.5c-.5.33-1.5.33-1.5-.5zM5 6.69v10.62l7.76-5.31L5 6.69z" />
                    </svg>
                    Google Play
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative flex h-115 w-56 items-center justify-center rounded-[2.5rem] border-4 border-stone-600 bg-stone-700 shadow-2xl">
                <div className="absolute top-4 h-6 w-20 rounded-full bg-stone-600" />
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-600">
                    <Wheat className="h-10 w-10 text-white" />
                  </div>
                  <p className="font-serif text-lg font-bold text-white">Good Pocket</p>
                  <p className="text-xs text-stone-400">Order • Earn • Repeat</p>
                  <div className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-2 text-center text-sm font-semibold text-white">
                    Order Now
                  </div>
                </div>
                <div className="absolute bottom-4 h-1 w-20 rounded-full bg-stone-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              Testimonials
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              Loved by Customers Across the Country
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <Card key={name} className="border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
                  <Separator className="my-4" />
                  <div>
                    <p className="font-semibold text-stone-900">{name}</p>
                    <p className="text-sm text-stone-500">{role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Inquiry ────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              Get In Touch
            </Badge>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              Place an Inquiry
            </h2>
            <p className="mt-4 text-lg text-stone-500 max-w-lg mx-auto">
              Ready to stock up? Fill in the form below and our team will get back
              to you within 24 hours.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600">
                  <Wheat className="h-4 w-4 text-white" />
                </div>
                <span className="font-serif text-lg font-bold text-white">Good Taste</span>
              </div>
              <p className="text-sm leading-relaxed">
                Pure maize flour, freshly milled and delivered to your door. Trusted by households,
                restaurants, and distributors nationwide.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Products", href: "#products" },
                  { label: "Why Good Taste", href: "#why-us" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Good Pocket App", href: "#app" },
                  { label: "Contact Us", href: "#contact" },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-sm hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4 mb-6">
                {[
                  {
                    label: "Facebook",
                    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
                  },
                  {
                    label: "X (Twitter)",
                    path: "M4 4l16 16M20 4 4 20",
                    isX: true,
                  },
                  {
                    label: "Instagram",
                    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
                  },
                ].map(({ label, path, isX }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 hover:bg-amber-600 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 text-stone-300"
                      viewBox="0 0 24 24"
                      fill={isX ? "none" : "currentColor"}
                      stroke={isX ? "currentColor" : "none"}
                      strokeWidth={isX ? 2 : 0}
                      aria-hidden="true"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="border-stone-600 text-stone-300 hover:bg-stone-700 hover:text-white"
              >
                <Link href="/login">Admin Panel</Link>
              </Button>
            </div>
          </div>
          <Separator className="my-8 bg-stone-800" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p> Good Taste. All rights reserved.</p>
            <p>Freshly milled. Proudly delivered.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
