import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Menu as MenuIcon,
  X,
  Tag,
  Copy,
  Check,
  Calendar,
  Percent,
  Info,
  Star,
  ChefHat,
} from "lucide-react";
import type { MenuItem } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";
import { categoryTranslationMap } from "@/lib/translations";
import HamburgerMenu from "@/components/hamburger-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import waiterImg from "@assets/waiter_1773555177013.png";
import chefsHatImg from "@assets/chefs-hat_1773556627617.png";
import premiumFoodImg from "@assets/image_1765866040643.png";
import premiumBarImg from "@assets/stock_images/premium_whisky_cockt_68b3295e.jpg";
import premiumDessertsImg from "@assets/image_1765866710467.png";
import premiumMocktailsImg from "@assets/stock_images/premium_colorful_moc_1a15dee9.jpg";
import cocktailsImg from "@assets/COCKTAILS_1766751289781.jpg";
import craftedBeerImg from "@assets/CRAFTED_BEER_1766750491358.jpg";
import logoImg from "@assets/ATDIGITALMENUNOBG_1773511851120.png";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

// @ts-ignore
import promo1 from "@assets/1_1_11zon_1767593666240.jpg";
// @ts-ignore
import promo2 from "@assets/2_2_11zon_1767593666237.jpg";
// @ts-ignore
import promo3 from "@assets/3_3_11zon_1767593666238.jpg";
// @ts-ignore
import promo4 from "@assets/4_4_11zon_1767593666239.jpg";
// @ts-ignore
import promo5 from "@assets/5_5_11zon_1767593666239.jpg";

const promotionalImages = [
  { id: 1, src: promo1, alt: "Restaurant Interior" },
  { id: 2, src: promo2, alt: "Bar & Dining Area" },
  { id: 3, src: promo3, alt: "Modern Ambiance" },
  { id: 4, src: promo4, alt: "Contemporary Dining" },
  { id: 5, src: promo5, alt: "Elegant Seating" },
];

const categoryImages: Record<string, string> = {
  food: premiumFoodImg,
  "crafted-beer": craftedBeerImg,
  cocktails: cocktailsImg,
  bar: premiumBarImg,
  desserts: premiumDessertsImg,
  mocktails: premiumMocktailsImg,
};

const coupons = [
  {
    id: 1,
    code: "BARREL20",
    title: "20% OFF",
    subtitle: "On your total bill",
    description: "Valid on dine-in orders above ₹1000",
    validity: "Valid till 31 Mar 2026",
    gradient: ["#B8986A", "#7C5C30"],
    tag: "LIMITED",
  },
  {
    id: 2,
    code: "HAPPYHOUR",
    title: "₹100 Off",
    subtitle: "On all cocktails",
    description: "Every weekday between 5 PM – 8 PM",
    validity: "Valid till 30 Apr 2026",
    gradient: ["#5B7FA6", "#2C4A6E"],
    tag: "HAPPY HOUR",
  },
  {
    id: 3,
    code: "CRAFT15",
    title: "15% OFF",
    subtitle: "On craft beers",
    description: "All draught & craft beer on tap",
    validity: "Valid till 15 Apr 2026",
    gradient: ["#7A5C3C", "#4A3020"],
    tag: "BEER LOVERS",
  },
  {
    id: 4,
    code: "WELCOME50",
    title: "₹50 OFF",
    subtitle: "First visit discount",
    description: "On your very first order at Barrelborn",
    validity: "Single use only",
    gradient: ["#5C7A5C", "#3A5A3A"],
    tag: "NEW GUEST",
  },
  {
    id: 5,
    code: "WEEKEND25",
    title: "25% OFF",
    subtitle: "Weekend special",
    description: "On food orders — Saturday & Sunday",
    validity: "Every weekend",
    gradient: ["#7A3C5C", "#4A2038"],
    tag: "WEEKEND",
  },
];

function CouponCard({
  coupon,
  onClick,
}: {
  coupon: (typeof coupons)[0];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 focus:outline-none active:scale-95 transition-transform duration-150"
      style={{ width: "78vw", maxWidth: "340px", minWidth: "260px" }}
      data-testid={`coupon-card-${coupon.id}`}
    >
      {/* Notch cutouts */}
      <div
        className="absolute left-[36%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 pointer-events-none"
        style={{ backgroundColor: "#3D3100" }}
      />
      <div
        className="absolute left-[36%] top-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 pointer-events-none"
        style={{ backgroundColor: "#3D3100" }}
      />
      <div
        className="absolute left-[36%] bottom-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full z-10 pointer-events-none"
        style={{ backgroundColor: "#3D3100" }}
      />

      {/* Card body — two-section horizontal layout */}
      <div
        className="flex rounded-2xl overflow-hidden"
        style={{
          border: "1.5px solid #D4AF37",
          minHeight: "96px",
          boxShadow: "0 4px 20px rgba(212,175,55,0.18)",
        }}
      >
        {/* LEFT — gold gradient discount panel */}
        <div
          className="flex flex-col items-center justify-center px-4 py-3 flex-shrink-0"
          style={{
            width: "37%",
            background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
            borderRight: "1.5px dashed rgba(61,49,0,0.35)",
          }}
        >
          <Tag
            className="w-4 h-4 mb-1"
            style={{ color: "#3D3100", opacity: 0.8 }}
          />
          <p
            className="text-xl font-black leading-none text-center"
            style={{
              color: "#3D3100",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {coupon.title}
          </p>
          <p
            className="text-[9px] uppercase tracking-widest mt-1.5 text-center font-semibold"
            style={{ color: "#3D3100", opacity: 0.75 }}
          >
            {coupon.tag}
          </p>
        </div>

        {/* RIGHT — code + condition on dark background */}
        <div
          className="flex flex-col justify-center px-4 py-3 text-left flex-1 min-w-0"
          style={{ background: "#1A1408" }}
        >
          <p
            className="text-sm font-black tracking-widest leading-none uppercase"
            style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
          >
            {coupon.code}
          </p>
          <p
            className="text-[11px] mt-1.5 leading-snug tracking-wide"
            style={{ color: "#E6C55A", opacity: 0.9 }}
          >
            {coupon.subtitle}
          </p>
          <p
            className="text-[10px] mt-1 leading-snug tracking-wide"
            style={{ color: "#DCD4C8", opacity: 0.55 }}
          >
            {coupon.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function CouponDetailModal({
  coupon,
  onClose,
}: {
  coupon: (typeof coupons)[0] | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {coupon && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full sm:max-w-sm mx-4 sm:mx-auto rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #B8986A44",
            }}
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* Header gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, #B8986A, #C9A55C, #B8986A)",
              }}
            />

            <div className="p-5">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#2A2A2A", color: "#888" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Tag icon + title */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#C9A55C22" }}
                >
                  <Tag className="w-5 h-5" style={{ color: "#C9A55C" }} />
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-0.5"
                    style={{ color: "#C9A55C" }}
                  >
                    {coupon.tag}
                  </p>
                  <h3
                    className="text-2xl font-black leading-none"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {coupon.title}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "#DCD4C8" }}>
                    {coupon.subtitle}
                  </p>
                </div>
              </div>

              {/* Dashed divider */}
              <div
                className="border-t border-dashed my-4"
                style={{ borderColor: "#B8986A44" }}
              />

              {/* Details */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5">
                  <Info
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C9A55C" }}
                  />
                  <p className="text-sm" style={{ color: "#DCD4C8" }}>
                    {coupon.description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "#C9A55C" }}
                  />
                  <p className="text-sm" style={{ color: "#DCD4C8" }}>
                    {coupon.validity}
                  </p>
                </div>
              </div>

              {/* Dashed divider */}
              <div
                className="border-t border-dashed mb-4"
                style={{ borderColor: "#B8986A44" }}
              />

              {/* Code + Copy */}
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: "#242424" }}
              >
                <div>
                  <p
                    className="text-[10px] uppercase tracking-widest mb-0.5"
                    style={{ color: "#888" }}
                  >
                    Coupon Code
                  </p>
                  <p
                    className="text-lg font-black tracking-widest"
                    style={{ color: "#C9A55C", fontFamily: "monospace" }}
                  >
                    {coupon.code}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: copied ? "#22c55e" : "#C9A55C",
                    color: "#1A1A1A",
                  }}
                  data-testid="button-copy-coupon-modal"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MenuLanding() {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showSmartMenu, setShowSmartMenu] = useState(false);
  const [activeSmartSection, setActiveSmartSection] = useState<"today" | "chef">("today");
  const [smartVegFilter, setSmartVegFilter] = useState<"all" | "veg" | "non-veg">("all");

  const { data: allMenuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    staleTime: 5 * 60 * 1000,
  });

  const smartSections = useMemo(() => {
    const available = allMenuItems.filter(i => i.isAvailable);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    return {
      today: shuffled.slice(0, 10),
      chef: shuffled.slice(10, 20),
    };
  }, [allMenuItems]);

  const smartFilteredItems = useMemo(() => {
    const items = smartSections[activeSmartSection] || [];
    if (smartVegFilter === "veg") return items.filter(i => i.isVeg);
    if (smartVegFilter === "non-veg") return items.filter(i => !i.isVeg);
    return items;
  }, [smartSections, activeSmartSection, smartVegFilter]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedCoupon, setSelectedCoupon] = useState<
    (typeof coupons)[0] | null
  >(null);
  const [lightboxImage, setLightboxImage] = useState<
    (typeof promotionalImages)[0] | null
  >(null);
  const lightboxPaused = useRef(false);
  const swipeTouchX = useRef<number | null>(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer_info");
    const skipped = localStorage.getItem("customer_skipped");
    if (!savedCustomer && !skipped) {
      setShowPopup(true);
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem("customer_skipped", "true");
    setShowPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/customers", {
        name: customerName,
        contactNumber: customerPhone,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }

      const data = await res.json();
      localStorage.setItem("customer_info", JSON.stringify(data.customer));
      setShowPopup(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.failedToSave,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % promotionalImages.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/menu/${categoryId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3D3100" }}>
      <header
        className="sticky top-0 z-30 elegant-shadow"
        style={{ backgroundColor: "#3D3100" }}
      >
        <div className="container mx-auto px-2 sm:px-4 py-5 sm:py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#DCD4C8" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src={logoImg}
                alt="AT Digital Menu Logo"
                className="h-40 sm:h-44 md:h-48 w-auto object-contain"
                data-testid="img-logo"
              />
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#DCD4C8" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                  <X className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                ) : (
                  <MenuIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(10,8,0,0.82)", backdropFilter: "blur(6px)" }}
              onClick={handleSkip}
            />

            {/* Card */}
            <motion.div
              className="relative w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1C1500 0%, #0F0C00 100%)",
                border: "1.5px solid #D4AF37",
                boxShadow: "0 0 60px rgba(212,175,55,0.18), 0 24px 64px rgba(0,0,0,0.7)",
              }}
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              {/* Gold shimmer top bar */}
              <div
                className="h-[3px] w-full"
                style={{ background: "linear-gradient(90deg, transparent, #D4AF37, #F0CC60, #D4AF37, transparent)" }}
              />

              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                data-testid="button-close-popup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="px-7 pt-6 pb-7 flex flex-col items-center">
                {/* Logo */}
                <img
                  src={logoImg}
                  alt="AT Digital Menu"
                  className="w-40 object-contain mb-1"
                  style={{ filter: "drop-shadow(0 0 12px rgba(212,175,55,0.35))" }}
                />

                {/* Ornamental divider */}
                <div className="flex items-center gap-3 w-full mb-4">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
                  <span className="text-[10px] tracking-[0.3em] font-light" style={{ color: "#D4AF37" }}>WELCOME</span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
                </div>

                {/* Headline */}
                <h2
                  className="text-center font-black mb-1 leading-tight uppercase tracking-widest"
                  style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", letterSpacing: "0.18em" }}
                >
                  Please Enter Your Details
                </h2>
                <p className="text-center text-[11px] mb-5 font-light uppercase tracking-widest" style={{ color: "#6A5A3A", letterSpacing: "0.12em" }}>
                  To Proceed To Our Menu
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-[0.2em] font-medium uppercase" style={{ color: "#B8986A" }}>
                      Your Name
                    </label>
                    <div
                      className="flex items-center rounded-xl px-4 py-0 h-12 transition-all"
                      style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.35)" }}
                    >
                      <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-transparent outline-none text-sm font-light placeholder:opacity-40"
                        style={{ color: "#E8D8B4", caretColor: "#D4AF37" }}
                        data-testid="input-customer-name"
                      />
                    </div>
                  </div>

                  {/* Phone — 10 OTP digit boxes */}
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] font-medium uppercase" style={{ color: "#B8986A" }}>
                      Contact Number
                    </label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={10}
                        value={customerPhone}
                        onChange={(val) => setCustomerPhone(val)}
                        pattern={REGEXP_ONLY_DIGITS}
                        inputMode="numeric"
                        data-testid="input-customer-phone"
                      >
                        <InputOTPGroup className="gap-[5px]">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="h-9 w-[26px] rounded-lg text-sm font-semibold first:rounded-l-lg first:border-l last:rounded-r-lg transition-all"
                              style={{
                                background: "rgba(212,175,55,0.08)",
                                border: "1px solid rgba(212,175,55,0.35)",
                                color: "#E8D8B4",
                                borderRadius: "8px",
                              }}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {customerPhone.length > 0 && customerPhone.length < 10 && (
                      <p className="text-center text-[10px]" style={{ color: "#B8986A" }}>
                        {10 - customerPhone.length} digit{10 - customerPhone.length !== 1 ? "s" : ""} remaining
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || customerName.length === 0 || customerPhone.length !== 10}
                    className="w-full h-12 rounded-full font-bold tracking-widest text-sm transition-all active:scale-95 disabled:opacity-40 mt-2"
                    style={{
                      background: "linear-gradient(90deg, #B8986A, #D4AF37, #E6C55A, #D4AF37, #B8986A)",
                      backgroundSize: "200% 100%",
                      color: "#1C1500",
                      letterSpacing: "0.15em",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.35)",
                    }}
                    data-testid="button-submit-customer"
                  >
                    {isSubmitting ? "SAVING..." : "CONFIRM & PROCEED"}
                  </button>

                  {/* Skip option */}
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-center text-xs py-1 transition-opacity hover:opacity-70"
                    style={{ color: "#6A5A3A", letterSpacing: "0.08em" }}
                    data-testid="button-skip-popup"
                  >
                    Continue without entering details →
                  </button>
                </form>
              </div>

              {/* Gold shimmer bottom bar */}
              <div
                className="h-[2px] w-full"
                style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-3 sm:px-4 pt-5 pb-2">
        {/* Gold gradient border wrapper for carousel */}
        <div
          className="rounded-xl p-[2px] mb-3"
          style={{ background: "linear-gradient(90deg, #D4AF37, #E6C55A)" }}
        >
          <div
            className="relative rounded-[10px] overflow-hidden cursor-pointer group"
            style={{ height: "280px" }}
            onClick={() => setLightboxImage(promotionalImages[currentImageIndex])}
            data-testid="banner-image-carousel"
          >
            {promotionalImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            ))}

            <div
              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(21,21,21,0.6), transparent)",
              }}
            />
          </div>
        </div>

        {/* Coupon Auto-Scroll Carousel — directly below image banner */}
        <div className="py-3 mb-3 overflow-hidden">
          <div
            className="coupon-track flex gap-4"
            style={{ width: "max-content" }}
          >
            {[...coupons, ...coupons].map((coupon, index) => (
              <CouponCard
                key={`${coupon.id}-${index}`}
                coupon={coupon}
                onClick={() => setSelectedCoupon(coupon)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mainCategories
            .filter((cat) => cat.id !== "wine" && !cat.hidden)
            .map((category, index) => {
              const translationKey = categoryTranslationMap[category.id];
              const label = translationKey
                ? t[translationKey]
                : category.displayLabel;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
                    padding: "2px",
                    borderRadius: "10px",
                  }}
                >
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className="group overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      display: "block",
                      width: "100%",
                      aspectRatio: "1 / 1.05",
                      position: "relative",
                    }}
                    data-testid={`tile-${category.id}`}
                  >
                    <img
                      src={
                        failedImages.has(category.id)
                          ? fallbackImg
                          : categoryImages[category.id]
                      }
                      alt={label as string}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-110"
                      onError={() => {
                        setFailedImages((prev) => new Set(prev).add(category.id));
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                      <h3
                        className="text-sm sm:text-base md:text-lg font-semibold tracking-widest uppercase text-center"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#FFFFFF",
                          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                          letterSpacing: "0.15em",
                        }}
                      >
                        {label}
                      </h3>
                    </div>
                  </button>
                </motion.div>
              );
            })}
        </div>
      </div>

      <CouponDetailModal
        coupon={selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
      />

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={() => setLightboxImage(null)}
              data-testid="button-close-lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Navigation arrows */}
            <button
              className="absolute left-3 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={(e) => {
                e.stopPropagation();
                const prev =
                  (currentImageIndex - 1 + promotionalImages.length) %
                  promotionalImages.length;
                setCurrentImageIndex(prev);
                setLightboxImage(promotionalImages[prev]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              onClick={(e) => {
                e.stopPropagation();
                const next = (currentImageIndex + 1) % promotionalImages.length;
                setCurrentImageIndex(next);
                setLightboxImage(promotionalImages[next]);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Image */}
            <motion.div
              className="relative z-[1] w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="w-full rounded-xl object-contain"
                style={{ maxHeight: "80vh" }}
              />
              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                {promotionalImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                      setLightboxImage(promotionalImages[idx]);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "bg-white w-5"
                        : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Suggestions Floating Button + Panel */}
      <>
        {/* Backdrop */}
        <AnimatePresence>
          {showSmartMenu && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSmartMenu(false)}
            />
          )}
        </AnimatePresence>

        {/* Slide-up Panel */}
        <AnimatePresence>
          {showSmartMenu && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
              style={{
                backgroundColor: "#1A1408",
                border: "1px solid rgba(212,175,55,0.3)",
                borderBottom: "none",
                height: "96dvh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.3)" }} />
              </div>

              {/* Header */}
              <div className="px-5 pt-2 pb-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: "2px solid rgba(212,175,55,0.6)" }}
                  >
                    <img src={chefsHatImg} alt="Smart Picks" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2
                      className="text-sm font-bold tracking-widest uppercase"
                      style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Smart Picks
                    </h2>
                    <p
                      className="text-[11px]"
                      style={{ color: "#DCD4C8", opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Not sure what to order? We've got you!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSmartMenu(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "#DCD4C8" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section Tabs */}
              <div className="flex gap-2 px-5 pb-3 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
                {[
                  { key: "today", label: "Today's Special", icon: <Star className="w-3.5 h-3.5" /> },
                  { key: "chef", label: "Chef's Special", icon: <ChefHat className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSmartSection(tab.key as typeof activeSmartSection)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0"
                    style={
                      activeSmartSection === tab.key
                        ? {
                            background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
                            color: "#1A1408",
                            fontFamily: "'DM Sans', sans-serif",
                          }
                        : {
                            backgroundColor: "rgba(212,175,55,0.08)",
                            border: "1px solid rgba(212,175,55,0.25)",
                            color: "#D4AF37",
                            fontFamily: "'DM Sans', sans-serif",
                          }
                    }
                    data-testid={`smart-tab-${tab.key}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Veg / Non-Veg Filter + Description Row */}
              <div className="px-5 pb-3 flex items-center justify-between flex-shrink-0">
                <p
                  className="text-[11px] tracking-wide"
                  style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {activeSmartSection === "today" ? "Tried and loved picks for today" : "Handpicked by our head chef"}
                </p>
                <div
                  className="inline-flex rounded-full p-0.5 items-center gap-0 flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {[
                    { key: "all", label: "All" },
                    { key: "veg", label: "Veg" },
                    { key: "non-veg", label: "Non-Veg" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setSmartVegFilter(f.key as typeof smartVegFilter)}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-200"
                      style={
                        smartVegFilter === f.key
                          ? f.key === "veg"
                            ? { backgroundColor: "#22C55E", color: "white" }
                            : f.key === "non-veg"
                            ? { backgroundColor: "#EF4444", color: "white" }
                            : { backgroundColor: "white", color: "#1A1408" }
                          : { color: "#C9A55C" }
                      }
                      data-testid={`smart-filter-${f.key}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Items Grid */}
              <div className="overflow-y-auto flex-1 pb-8 px-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSmartSection + smartVegFilter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {smartFilteredItems.length === 0
                      ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                          <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                            No items found
                          </p>
                        </div>
                      )
                      : smartFilteredItems.map((item, idx) => (
                          <motion.div
                            key={item._id?.toString() || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="rounded-xl overflow-hidden"
                            style={{
                              backgroundColor: "rgba(212,175,55,0.07)",
                              border: "1px solid rgba(212,175,55,0.18)",
                            }}
                            data-testid={`smart-item-${item._id?.toString()}`}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={item.image || fallbackImg}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <div
                                className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border ${
                                  item.isVeg ? "bg-green-500 border-green-300" : "bg-red-500 border-red-300"
                                }`}
                              />
                            </div>
                            <div className="p-2">
                              <p
                                className="text-[11px] font-semibold tracking-wide uppercase leading-tight line-clamp-2 mb-1"
                                style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {item.name}
                              </p>
                              <p
                                className="text-xs font-bold"
                                style={{ color: "#E6C55A", fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {typeof item.price === "string" && item.price.includes("|")
                                  ? `₹${item.price.split("|")[0].trim()}`
                                  : `₹${item.price}`}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chef Button — bottom left */}
        <motion.button
          className="fixed bottom-6 left-4 z-40 flex items-center gap-2 pl-1 pr-4 py-1 rounded-full shadow-lg"
          style={{
            background: showSmartMenu
              ? "linear-gradient(135deg, #2a1a00, #1A1408)"
              : "linear-gradient(135deg, #3D3100, #1A1408)",
            border: showSmartMenu
              ? "1.5px solid rgba(212,175,55,0.9)"
              : "1.5px solid rgba(212,175,55,0.6)",
            backdropFilter: "blur(10px)",
            boxShadow: showSmartMenu
              ? "0 4px 24px rgba(212,175,55,0.35)"
              : "0 4px 24px rgba(212,175,55,0.15)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSmartMenu(!showSmartMenu)}
          data-testid="button-smart-menu"
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: "2px solid rgba(212,175,55,0.7)" }}
          >
            <img src={chefsHatImg} alt="Smart Picks" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-start">
            <span
              className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
              style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
            >
              Smart Picks
            </span>
            <span
              className="text-[9px] tracking-wide"
              style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}
            >
              What to order?
            </span>
          </div>
        </motion.button>
      </>

      {/* Call Waiter Floating Button */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {waiterCalled && (
            <motion.button
              key="cancel"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setWaiterCalled(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                backgroundColor: "rgba(30,20,0,0.92)",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#DCD4C8",
                fontFamily: "'DM Sans', sans-serif",
                backdropFilter: "blur(8px)",
              }}
              data-testid="button-cancel-waiter"
            >
              Cancel
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setWaiterCalled(!waiterCalled)}
          className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full shadow-lg"
          style={{
            background: waiterCalled
              ? "linear-gradient(135deg, #1a3a1a, #0f2a0f)"
              : "linear-gradient(135deg, #3D3100, #1A1408)",
            border: waiterCalled
              ? "1.5px solid rgba(74,222,128,0.6)"
              : "1.5px solid rgba(212,175,55,0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: waiterCalled
              ? "0 4px 24px rgba(74,222,128,0.25)"
              : "0 4px 24px rgba(212,175,55,0.2)",
          }}
          data-testid="button-call-waiter"
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: waiterCalled ? "2px solid rgba(74,222,128,0.7)" : "2px solid rgba(212,175,55,0.7)" }}
          >
            <img src={waiterImg} alt="Call Waiter" className="w-full h-full object-cover" />
          </div>
          <AnimatePresence mode="wait">
            {waiterCalled ? (
              <motion.div
                key="called"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-start"
              >
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
                  style={{ color: "#4ade80", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Waiter Called ✓
                </span>
                <span
                  className="text-[9px] tracking-wide"
                  style={{ color: "rgba(74,222,128,0.7)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  On the way!
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-start"
              >
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
                  style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Call Waiter
                </span>
                <span
                  className="text-[9px] tracking-wide"
                  style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Tap to request
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
