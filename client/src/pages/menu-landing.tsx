import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X, Tag, Copy, Check, Calendar, Percent, Info } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { mainCategories } from "@/lib/menu-categories";
import { categoryTranslationMap } from "@/lib/translations";
import HamburgerMenu from "@/components/hamburger-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    title: "Buy 1 Get 1",
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

function CouponCard({ coupon, onClick }: { coupon: typeof coupons[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 focus:outline-none active:scale-95 transition-transform duration-150"
      style={{ width: "78vw", maxWidth: "340px", minWidth: "260px" }}
      data-testid={`coupon-card-${coupon.id}`}
    >
      {/* Left notch */}
      <div
        className="absolute left-[36%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 pointer-events-none"
        style={{ backgroundColor: "#151515" }}
      />

      {/* Card body — two-section horizontal layout */}
      <div
        className="flex rounded-2xl overflow-hidden border border-dashed"
        style={{ borderColor: "#C9A55C55", backgroundColor: "#1A1A1A", minHeight: "90px" }}
      >
        {/* LEFT — discount panel */}
        <div
          className="flex flex-col items-center justify-center px-4 py-3 flex-shrink-0"
          style={{
            width: "37%",
            background: "linear-gradient(160deg, #2A2018 0%, #1A1408 100%)",
            borderRight: "1.5px dashed #C9A55C55",
          }}
        >
          <Tag className="w-4 h-4 mb-1 opacity-70" style={{ color: "#C9A55C" }} />
          <p
            className="text-xl font-black leading-none text-center"
            style={{
              color: "#C9A55C",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "-0.5px",
            }}
          >
            {coupon.title}
          </p>
          <p className="text-[9px] uppercase tracking-widest mt-1 opacity-60 text-center" style={{ color: "#DCD4C8" }}>
            {coupon.tag}
          </p>
        </div>

        {/* RIGHT — code + condition */}
        <div className="flex flex-col justify-center px-4 py-3 text-left flex-1 min-w-0">
          <p
            className="text-base font-black tracking-widest leading-none"
            style={{ color: "#FFFFFF", fontFamily: "monospace" }}
          >
            {coupon.code}
          </p>
          <p className="text-[11px] mt-1.5 leading-snug" style={{ color: "#B8986A" }}>
            {coupon.subtitle}
          </p>
          <p className="text-[10px] mt-1 leading-snug opacity-60" style={{ color: "#DCD4C8" }}>
            {coupon.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function CouponDetailModal({ coupon, onClose }: { coupon: typeof coupons[0] | null; onClose: () => void }) {
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
            style={{ backgroundColor: "#1A1A1A", border: "1px solid #B8986A44" }}
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            {/* Header gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, #B8986A, #C9A55C, #B8986A)" }}
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
                  <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "#C9A55C" }}>
                    {coupon.tag}
                  </p>
                  <h3
                    className="text-2xl font-black leading-none"
                    style={{ color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {coupon.title}
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: "#DCD4C8" }}>
                    {coupon.subtitle}
                  </p>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed my-4" style={{ borderColor: "#B8986A44" }} />

              {/* Details */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#C9A55C" }} />
                  <p className="text-sm" style={{ color: "#DCD4C8" }}>{coupon.description}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "#C9A55C" }} />
                  <p className="text-sm" style={{ color: "#DCD4C8" }}>{coupon.validity}</p>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="border-t border-dashed mb-4" style={{ borderColor: "#B8986A44" }} />

              {/* Code + Copy */}
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: "#242424" }}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#888" }}>
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
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedCoupon, setSelectedCoupon] = useState<typeof coupons[0] | null>(null);
  const [lightboxImage, setLightboxImage] = useState<typeof promotionalImages[0] | null>(null);
  const lightboxPaused = useRef(false);
  const swipeTouchX = useRef<number | null>(null);

  useEffect(() => {
    const savedCustomer = localStorage.getItem("customer_info");
    if (!savedCustomer) {
      setShowPopup(true);
    }
  }, []);

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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % promotionalImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/menu/${categoryId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3D3100" }}>
      <header className="sticky top-0 z-30 elegant-shadow" style={{ backgroundColor: "#3D3100" }}>
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

      <Dialog
        open={showPopup}
        onOpenChange={(open) => {
          if (localStorage.getItem("customer_info")) {
            setShowPopup(open);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[425px] bg-[#1a1a1a] border-[#B8986A] text-[#dcd4c8]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-[#B8986A] text-2xl font-bold text-center">
              {t.welcomeToBarrelborn}
            </DialogTitle>
            <DialogDescription className="text-[#dcd4c8] text-center">
              {t.enterDetailsPrompt}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#dcd4c8]">
                {t.name}
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.enterYourName}
                className="bg-transparent border-[#B8986A] text-[#dcd4c8] focus:ring-[#B8986A]"
                required
                data-testid="input-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#dcd4c8]">
                {t.contactNumber}
              </Label>
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                value={customerPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) {
                    setCustomerPhone(val);
                  }
                }}
                placeholder={t.enter10Digit}
                className="bg-transparent border-[#B8986A] text-[#dcd4c8] focus:ring-[#B8986A]"
                required
                data-testid="input-customer-phone"
              />
              {customerPhone && customerPhone.length !== 10 && (
                <p className="text-xs text-[#B8986A]">{t.enterExactly10}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B8986A] hover:bg-[#a6895f] text-white font-bold py-6 rounded-full"
              data-testid="button-submit-customer"
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-3 sm:px-4 py-2">
        <div
          className="relative rounded-xl overflow-hidden mb-4 cursor-pointer group"
          style={{ height: "220px" }}
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

          {/* Tap-to-expand hint */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-[10px] text-white font-medium">View</span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(21,21,21,0.6), transparent)" }}
          />

          <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {promotionalImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white w-5" : "bg-white/50 w-1.5"
                }`}
                data-testid={`carousel-dot-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Coupon Auto-Scroll Carousel — directly below image banner */}
        <div className="py-3 overflow-hidden">
          <div className="coupon-track flex gap-4" style={{ width: "max-content" }}>
            {[...coupons, ...coupons].map((coupon, index) => (
              <CouponCard
                key={`${coupon.id}-${index}`}
                coupon={coupon}
                onClick={() => setSelectedCoupon(coupon)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {mainCategories
            .filter((cat) => cat.id !== "wine" && !cat.hidden)
            .map((category, index) => {
              const translationKey = categoryTranslationMap[category.id];
              const label = translationKey ? t[translationKey] : category.displayLabel;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className="relative rounded-lg overflow-hidden group"
                  style={{ aspectRatio: "1/1.05" }}
                  data-testid={`tile-${category.id}`}
                >
                  <img
                    src={
                      failedImages.has(category.id)
                        ? fallbackImg
                        : categoryImages[category.id]
                    }
                    alt={label as string}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(category.id));
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                    <h3
                      className="text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase text-center"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#FFFFFF",
                        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {label}
                    </h3>
                  </div>
                </motion.button>
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
                const prev = (currentImageIndex - 1 + promotionalImages.length) % promotionalImages.length;
                setCurrentImageIndex(prev);
                setLightboxImage(promotionalImages[prev]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
                      idx === currentImageIndex ? "bg-white w-5" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
