import React, { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Wifi,
  Wind,
  Smartphone,
  Droplet,
  Tv,
  Volume2,
  BookOpen,
  Shield,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  ThumbsUp,
  Star
} from "lucide-react";
import BookingCalculator from "./BookingCalculator";
import AirportsGrid from "./AirportsGrid";

import mercedesEconomyImg from "../assets/images/fleet_economy_1786403470397.jpg";
import mercedesLuxuryImg from "../assets/images/fleet_luxury_1786403483244.jpg";
import mercedesFamilyImg from "../assets/images/fleet_family_1786403496325.jpg";
import heroImg from "../assets/images/hero_background_1786403449488.jpg";
import transferPortImg from "../assets/images/transfer_port_1786403532912.jpg";
import { getCustomImage } from "../utils/customImages";

interface RenaxLayoutProps {
  settings: any;
  calculatorPickup: string;
  calculatorDropoff: string;
  setCalculatorPickup: (v: string) => void;
  setCalculatorDropoff: (v: string) => void;
  handleScrollTo: (elementId: string) => void;
  handleSelectTransferPreset: (pickup: string, dropoff: string) => void;
  handleSelectClassPreset: (carClass: "Economy" | "Luxury" | "Family") => void;
}

export default function RenaxLayout({
  settings,
  calculatorPickup,
  calculatorDropoff,
  setCalculatorPickup,
  setCalculatorDropoff,
  handleScrollTo,
  handleSelectTransferPreset,
  handleSelectClassPreset
}: RenaxLayoutProps) {
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";
  const emailAddr = settings?.business_email || "info@travelluxx.co.uk";
  const officeAddr = settings?.office_address || "Shirley B90 Shirley, Solihull, West Midlands, UK";

  const [pricing, setPricing] = useState<any>(null);
  const [gmbReviews, setGmbReviews] = useState<any[]>([]);
  const [activeFleetTab, setActiveFleetTab] = useState<"Economy" | "Luxury" | "Family">("Luxury");
  const [bgImage, setBgImage] = useState<string>(() => {
    const customSetting = settings?.hero_image || settings?.heroImage;
    return (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : heroImg;
  });

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Failed to fetch fleet pricing:", err));
  }, []);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => { if (data.reviews && data.reviews.length > 0) setGmbReviews(data.reviews.slice(0, 3)); })
      .catch(() => {});
  }, []);

  const formattedPhone = whatsappNum.startsWith("44") 
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}` 
    : whatsappNum;

  const fleet = {
    Economy: {
      name: "Business Economy Class",
      tagline: "Elegant, clean, and highly efficient travel.",
      image: getCustomImage("fleet_Economy", mercedesEconomyImg),
      rate: pricing?.Economy?.perMile !== undefined ? `£${Number(pricing.Economy.perMile).toFixed(2)}` : "£1.50",
      description: "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency.",
      cars: ["Tesla Model 3", "Audi A4 Executive", "Mercedes C-Class"],
      features: ["Complimentary 4G Wi-Fi", "Dual-zone Climate Control", "USB Charging Ports", "Bottle Holders & Newspapers"],
      passengers: 4,
      luggage: 2,
      transmission: "Auto"
    },
    Luxury: {
      name: "First Chauffeur Class",
      tagline: "The pinnacle of executive comfort and style.",
      image: getCustomImage("fleet_Luxury", mercedesLuxuryImg),
      rate: pricing?.Luxury?.perMile !== undefined ? `£${Number(pricing.Luxury.perMile).toFixed(2)}` : "£2.00",
      description: "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs.",
      cars: ["Mercedes-Benz S-Class", "Audi A8 L", "Jaguar XJ Luxury"],
      features: ["Premium Leather Reclining Seats", "Complimentary Bottled Water", "Ambient Lighting Controls", "Rear Seat Entertainment Systems", "Quiet Acoustic Cabins"],
      passengers: 4,
      luggage: 3,
      transmission: "Auto"
    },
    Family: {
      name: "Family & Executive MPV",
      tagline: "Generous space for luggage and loved ones.",
      image: getCustomImage("fleet_Family", mercedesFamilyImg),
      rate: pricing?.Family?.perMile !== undefined ? `£${Number(pricing.Family.perMile).toFixed(2)}` : "£2.50",
      description: "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort.",
      cars: ["Mercedes-Benz V-Class", "Audi Q7 S-Line", "Volkswagen Caravelle Executive"],
      features: ["Conference Seating Options", "Massive Boot Capacity", "Automatic Sliding Doors", "Privacy Glass", "Individual Air-Con Units", "Child Seats Available (On Request)"],
      passengers: 7,
      luggage: 6,
      transmission: "Auto"
    }
  };

  const getAmenityIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes("wi-fi") || f.includes("wifi")) return <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("climate") || f.includes("air-con") || f.includes("air conditioning")) return <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("charging") || f.includes("usb")) return <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("water") || f.includes("bottle")) return <Droplet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("entertainment") || f.includes("tv")) return <Tv className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("quiet") || f.includes("acoustic")) return <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("leather") || f.includes("seat") || f.includes("reclining")) return <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("newspaper") || f.includes("book")) return <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("privacy") || f.includes("glass")) return <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("boot") || f.includes("capacity")) return <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (f.includes("door")) return <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  };

  const selectedFleet = fleet[activeFleetTab];

  return (
    <div className="bg-[#08090d] text-slate-100 font-['Outfit'] antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* 1. RENAX LUXURY HERO */}
      <section id="hero" className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-24 overflow-hidden bg-black">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img
            src={bgImage}
            alt="Luxury Banner"
            className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/80 via-[#08090d]/40 to-[#08090d]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Premium Chauffeur Service</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none uppercase">
              Nationwide Airport <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Transfers & Private Chauffeur
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-light">
              Experience the pinnacle of luxury private hire. Highly maintained Mercedes-Benz & Audi fleets for your comfort with guaranteed fixed rates.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto pt-6 border-t border-slate-900">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Licensed Operators</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Nationwide Coverage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Zero Surge Pricing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => handleScrollTo("calculator-section")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold tracking-wide px-8 py-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/30 w-full sm:w-auto"
            >
              <span>Book Chauffeur Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${whatsappNum}`}
              className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold tracking-wide px-8 py-4 rounded-xl text-sm transition-all duration-300 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-emerald-400 fill-current" />
              <span>{formattedPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. RENAX BOOKING CALCULATOR SEGMENT */}
      <section id="calculator-section" className="relative z-20 -mt-20 max-w-6xl mx-auto px-4">
        <div className="bg-[#0e1017] border border-slate-800/80 rounded-[28px] shadow-2xl p-6 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-emerald-400 font-sans text-xs tracking-widest uppercase font-bold">Luxury Ride</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Book Your Chauffeur Transfer</h2>
          </div>
          <BookingCalculator
            initialPickup={calculatorPickup}
            initialDropoff={calculatorDropoff}
            settings={settings}
          />
        </div>
      </section>

      {/* III. ABOUT COMPANY SECTION (RENAX DEMO 12 ACCURATE STYLE) */}
      <section id="about" className="py-24 bg-[#08090d] border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Block - Copy */}
            <div className="space-y-6">
              <span className="text-emerald-400 text-xs tracking-widest uppercase font-bold block">About Travelluxx</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight leading-tight">
                We Are More Than <br />
                <span className="text-emerald-400">A Private Hire Company</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                At {brandName}, we provide a first-class private hire and airport chauffeur service across the United Kingdom. With absolute luxury and punctuality, our services are customized for executive corporate transfers, weddings, and premium airport pickups.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Sports & Luxury Cars</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Executive Economy Cars</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">High Capacity MPVs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">24/7 Flight Monitoring</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleScrollTo("contact")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-emerald-700/10"
                >
                  Read More ↗
                </button>
              </div>
            </div>

            {/* Right Block - Graphic Image Representation */}
            <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-[4/3] border border-slate-800/40 bg-slate-950">
              <img
                src={getCustomImage("about_showcase", transferPortImg)}
                alt="Travelluxx Luxury Chauffeur"
                className="w-full h-full object-cover opacity-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              
              {/* Play Overlay Box */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-4 bg-emerald-950/80 border border-emerald-500/20 px-4 py-3 rounded-2xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-none">Chauffeur Certified</p>
                  <p className="text-xs text-white font-bold mt-1 leading-none">Safe & Professional Travels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RENAX FLEET SHOWCASE */}
      <section id="fleet" className="py-24 bg-[#0a0b0e] border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs tracking-widest uppercase block mb-3 font-bold">Our Premium Fleet</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 uppercase">
              Explore Our Luxury Vehicles
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Curated luxury fleets of state-of-the-art Mercedes-Benz and Audi models. Meticulously clean, safe, and chauffeured to your location.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#0e1017] border border-slate-800/80 p-1.5 rounded-2xl flex space-x-1 sm:space-x-2">
              {(Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFleetTab(tab)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeFleetTab === tab
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "Family" ? "Family / MPV" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Car Card Panel (Renax-inspired card with specs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#0e1017] border border-slate-800/60 p-6 sm:p-10 rounded-[28px] shadow-lg">
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-video lg:aspect-[4/3] group border border-slate-800/40 shadow-sm bg-slate-950">
              <img
                src={selectedFleet.image}
                alt={selectedFleet.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md">
                From {selectedFleet.rate} / mile
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                  {selectedFleet.name}
                </h3>
                <p className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-wider">{selectedFleet.tagline}</p>
              </div>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
                {selectedFleet.description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-800/60">
                <div className="flex flex-col items-center justify-center p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <Users className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400">PASSENGERS</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedFleet.passengers}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <Briefcase className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400">LUGGAGE</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedFleet.luggage} Slots</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <Compass className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-slate-400">TRANSMISSION</span>
                  <span className="text-xs font-bold text-white mt-0.5">{selectedFleet.transmission}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Included Amenities:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedFleet.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center shrink-0">
                        {getAmenityIcon(feat)}
                      </div>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleScrollTo("calculator-section")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-4 rounded-xl text-sm transition-all duration-300 shadow-md shadow-emerald-700/10 cursor-pointer flex justify-center items-center space-x-2"
                >
                  <span>Select vehicle class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VII. CAR RENTAL PROCESS / STEPS (RENAX DEMO 12 ACCURATE STYLE) */}
      <section className="py-24 bg-[#08090d] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs tracking-widest uppercase block mb-3 font-bold">How It Works</span>
            <h2 className="text-3xl font-bold text-white uppercase">3 Easy Steps to Rent</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#0e1017] border border-slate-800/60 p-8 rounded-3xl relative overflow-hidden group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Choose A Class</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                Select your preferred luxury class—Economy, Chauffeur First Class, or high capacity Family MPVs according to requirements.
              </p>
              {/* Circular bottom-left mask element representation */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#08090d] rounded-full flex items-center justify-center font-bold text-xs text-slate-500 select-none group-hover:text-emerald-400 transition-colors duration-300 border border-slate-900">
                01
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0e1017] border border-slate-800/60 p-8 rounded-3xl relative overflow-hidden group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Book Chauffeur</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                Enter your locations, date, and pickup times in our fixed rates calculator. Confirm pricing and chauffeur details.
              </p>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#08090d] rounded-full flex items-center justify-center font-bold text-xs text-slate-500 select-none group-hover:text-emerald-400 transition-colors duration-300 border border-slate-900">
                02
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0e1017] border border-slate-800/60 p-8 rounded-3xl relative overflow-hidden group shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <ThumbsUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Enjoy Journey</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                Our professionally dressed licensed chauffeur arrives on-time in a pristine vehicle to complete your nationwide transfer.
              </p>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#08090d] rounded-full flex items-center justify-center font-bold text-xs text-slate-500 select-none group-hover:text-emerald-400 transition-colors duration-300 border border-slate-900">
                03
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IX. TESTIMONIALS / WHAT CLIENTS SAY — GMB synced */}
      <section className=”py-24 bg-[#0a0b0e] border-t border-slate-900”>
        <div className=”max-w-7xl mx-auto px-4 sm:px-6 lg:px-8”>
          <div className=”text-center max-w-2xl mx-auto mb-16”>
            <span className=”text-emerald-400 text-xs tracking-widest uppercase block mb-3 font-bold”>Testimonials</span>
            <h2 className=”text-3xl font-bold text-white uppercase”>What Clients Say</h2>
          </div>

          <div className=”grid grid-cols-1 md:grid-cols-3 gap-8”>
            {(gmbReviews.length > 0 ? gmbReviews : [
              { author_name: “David Miller”, rating: 5, text: “Outstanding service from Heathrow. The Mercedes S-class was immaculate and the driver was prompt, professional, and took care of all our luggage. Highly recommended for corporate transfers.”, relative_time_description: “Corporate Client” },
              { author_name: “Sarah Jenkins”, rating: 5, text: “Booked the MPV class for our family vacation to Gatwick. Plenty of space for 6 suitcases and our children. The driver was extremely polite and monitored our flights for our return.”, relative_time_description: “Family Transfer” },
              { author_name: “James Sterling”, rating: 5, text: “The fixed price booking was exactly as quoted, without any hidden charges. The best chauffeur service in Solihull. Will certainly use Travelluxx for all my executive trips.”, relative_time_description: “Executive Commuter” }
            ]).map((review: any, idx: number) => (
              <div key={idx} className=”bg-[#0e1017] border border-slate-800/60 p-8 rounded-3xl relative overflow-hidden shadow-lg space-y-6”>
                <span className=”text-emerald-400 font-serif text-5xl leading-none block select-none”>”</span>
                <p className=”text-slate-300 text-xs sm:text-sm leading-relaxed font-light italic”>
                  “{review.text}”
                </p>
                <div className=”border-t border-slate-800 pt-4 flex justify-between items-center”>
                  <div className=”flex items-center gap-3”>
                    {review.profile_photo_url ? (
                      <img src={review.profile_photo_url} alt={review.author_name} className=”w-8 h-8 rounded-full object-cover shrink-0” />
                    ) : null}
                    <div>
                      <p className=”text-sm font-bold text-white”>{review.author_name}</p>
                      <p className=”text-[10px] text-slate-500 uppercase tracking-widest mt-0.5”>{review.relative_time_description || “Google Review”}</p>
                    </div>
                  </div>
                  <div className=”flex space-x-0.5 text-emerald-400 shrink-0”>
                    {Array.from({ length: Math.min(review.rating || 5, 5) }).map((_, i) => (
                      <Star key={i} className=”w-3.5 h-3.5 fill-current” />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AIRPORT TRANSFER CARDS */}
      <section className="py-24 bg-[#08090d] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-400 text-xs tracking-widest uppercase block mb-3 font-bold">Fixed Presets</span>
            <h2 className="text-3xl font-bold text-white uppercase">Popular Transfer Routes</h2>
          </div>
          <AirportsGrid onSelectTransfer={handleSelectTransferPreset} />
        </div>
      </section>

      {/* 6. CONTACT SEGMENT */}
      <section id="contact" className="py-24 bg-[#0e1017] border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-xs tracking-widest uppercase block mb-3 font-bold font-sans">Get In Touch</span>
            <h2 className="text-3xl font-bold text-white uppercase font-sans">Contact Our Desk</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Have unique requirements or need a dedicated luxury chauffeur contract? Fill out our contact form below.
            </p>
          </div>
          <div className="bg-[#08090d] border border-slate-800/60 p-6 sm:p-10 rounded-[28px] shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center text-xs">
              <div className="p-4 bg-[#0e1017] border border-slate-800/40 rounded-2xl">
                <Phone className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-400">Call / WhatsApp</p>
                <p className="text-white font-bold mt-1">{formattedPhone}</p>
              </div>
              <div className="p-4 bg-[#0e1017] border border-slate-800/40 rounded-2xl">
                <Mail className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-400">Email Address</p>
                <p className="text-white font-bold mt-1 truncate">{emailAddr}</p>
              </div>
              <div className="p-4 bg-[#0e1017] border border-slate-800/40 rounded-2xl">
                <MapPin className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-400">Head Office</p>
                <p className="text-white font-bold mt-1 line-clamp-1">{officeAddr.split(",")[0]}</p>
              </div>
            </div>
            
            <div className="p-2">
              <div className="text-slate-300">
                <form className="space-y-4">
                  <div className="text-slate-300 text-center">
                    <p className="text-xs">Please use the contact form details below to query custom routes.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
