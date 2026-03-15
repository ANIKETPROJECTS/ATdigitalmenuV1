import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Menu as MenuIcon,
  X,
  Tag,
  Calendar,
} from "lucide-react";

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";
import { categoryTranslationMap } from "@/lib/translations";
import HamburgerMenu from "@/components/hamburger-menu";
import FloatingButtons from "@/components/floating-buttons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

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
      {/* Card body — two-section horizontal layout */}
      <div
        className="flex rounded-2xl overflow-hidden relative"
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

function CouponsFullScreen({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: "#3D3100" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
        >
          {/* Top gold shimmer bar */}
          <div
            className="h-[3px] w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4AF37, #F0CC60, #D4AF37, transparent)",
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.18)" }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-light mb-0.5"
                style={{ color: "#D4AF37" }}
              >
                Exclusive Offers
              </p>
              <h2
                className="text-2xl font-black leading-none uppercase tracking-widest"
                style={{
                  color: "#D4AF37",
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.18em",
                }}
              >
                Coupons &amp; Deals
              </h2>
            </div>

            {/* Gold close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1.5px solid rgba(212,175,55,0.45)",
                color: "#D4AF37",
              }}
              data-testid="button-close-coupons-fullscreen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable coupon list */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                {/* Full-width coupon card — same design as CouponCard */}
                <div
                  className="flex rounded-2xl overflow-hidden relative w-full"
                  style={{
                    border: "1.5px solid #D4AF37",
                    minHeight: "104px",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.18)",
                  }}
                >
                  {/* LEFT — gold gradient panel */}
                  <div
                    className="flex flex-col items-center justify-center px-5 py-4 flex-shrink-0"
                    style={{
                      width: "36%",
                      background: "linear-gradient(135deg, #D4AF37, #E6C55A)",
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

                  {/* RIGHT — details on dark background */}
                  <div
                    className="flex flex-col justify-center px-4 py-3 text-left flex-1 min-w-0"
                    style={{ background: "#1A1408" }}
                  >
                    <p
                      className="text-sm font-black tracking-widest leading-none uppercase"
                      style={{
                        color: "#D4AF37",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
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
                    {/* Validity */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Calendar
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: "#D4AF37", opacity: 0.7 }}
                      />
                      <p
                        className="text-[9px] uppercase tracking-wider"
                        style={{ color: "#D4AF37", opacity: 0.7 }}
                      >
                        {coupon.validity}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom gold shimmer bar */}
          <div
            className="h-[2px] w-full flex-shrink-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function MenuLanding() {
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showCoupons, setShowCoupons] = useState(false);
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
                  className="w-52 object-contain mb-1"
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
                              className="h-10 w-[27px] rounded-lg text-sm font-bold first:rounded-l-lg first:border-l last:rounded-r-lg transition-all"
                              style={{
                                background: "rgba(212,175,55,0.14)",
                                border: "1.5px solid rgba(212,175,55,0.6)",
                                color: "#F0E080",
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
                      background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
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

      <div className="container mx-auto px-3 sm:px-4 pt-5 pb-24">
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
                onClick={() => setShowCoupons(true)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
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

      <CouponsFullScreen
        open={showCoupons}
        onClose={() => setShowCoupons(false)}
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

      <FloatingButtons />
    </div>
  );
}
