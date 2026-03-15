import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Clock, MapPin, QrCode, Copy, Check, ExternalLink, Star, Utensils, Calendar } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { mainCategories } from "@/lib/menu-categories";
import { useLanguage } from "@/contexts/LanguageContext";
import { categoryTranslationMap } from "@/lib/translations";
import { useState } from "react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (categoryId: string) => void;
}

const UPI_ID = "barrelborn@upi";
const PHONE = "+91 8278251111";

export default function HamburgerMenu({
  isOpen,
  onClose,
  onCategoryClick,
}: HamburgerMenuProps) {
  const { t } = useLanguage();
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
    onClose();
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).catch(() => {});
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto"
          style={{ background: "linear-gradient(160deg, #1C1500 0%, #0A0800 100%)" }}
        >
          {/* Gold shimmer top bar */}
          <div
            className="h-[3px] w-full flex-shrink-0"
            style={{ background: "linear-gradient(90deg, transparent, #D4AF37, #F0CC60, #D4AF37, transparent)" }}
          />

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
            style={{ background: "linear-gradient(180deg, #1C1500 80%, transparent)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #D4AF37, #E6C55A)" }} />
              <h2
                className="text-base font-black tracking-[0.25em] uppercase"
                style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
              >
                {t.menuCategories}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}
              data-testid="button-close-menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 pb-10 space-y-5 pt-3">

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {mainCategories.filter((cat) => !cat.hidden).map((category, index) => {
                const translationKey = categoryTranslationMap[category.id];
                const label = translationKey ? t[translationKey] : category.displayLabel;
                return (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className="relative p-4 rounded-2xl text-left transition-all duration-200 overflow-hidden"
                    style={{
                      background: "rgba(212,175,55,0.06)",
                      border: "1px solid rgba(212,175,55,0.22)",
                    }}
                    data-testid={`button-category-${category.id}`}
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, #D4AF37, #E6C55A)" }} />
                    <p
                      className="text-[10px] font-semibold tracking-widest uppercase mb-0.5"
                      style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p
                      className="text-[13px] font-bold tracking-wide leading-tight"
                      style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />
              <Utensils className="w-3.5 h-3.5" style={{ color: "rgba(212,175,55,0.4)" }} />
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />
            </div>

            {/* Restaurant Info */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.18)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
                <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                  Restaurant Info
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <MapPin className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>Barrel Born</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(220,212,200,0.55)", fontFamily: "'DM Sans', sans-serif" }}>Thane, Maharashtra</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <Phone className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                      {t.contactUs}
                    </p>
                    <button
                      onClick={() => window.open(`tel:${PHONE.replace(/\s/g, "")}`, "_self")}
                      className="text-sm font-bold transition-opacity hover:opacity-80"
                      style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {PHONE}
                    </button>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(220,212,200,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                      {t.forReservations}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <Clock className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>11:00 AM – 11:30 PM</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(220,212,200,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{t.openAllDays}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                    <FaInstagram className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
                  </div>
                  <div>
                    <button
                      onClick={() => window.open("https://www.instagram.com/barrelborn_", "_blank", "noopener,noreferrer")}
                      className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
                      style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      @barrelborn_
                      <ExternalLink className="w-3 h-3" style={{ color: "rgba(212,175,55,0.5)" }} />
                    </button>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(220,212,200,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{t.followForUpdates}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI / Payment Gateway */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.22)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.05)" }}>
                <div className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5" style={{ color: "#D4AF37" }} />
                  <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(212,175,55,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                    Pay & Order
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* UPI ID row */}
                <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>UPI ID</p>
                    <p className="text-sm font-bold tracking-wide" style={{ color: "#D4AF37", fontFamily: "monospace" }}>{UPI_ID}</p>
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold transition-all active:scale-95"
                    style={{ background: copiedUpi ? "#22c55e" : "linear-gradient(90deg, #D4AF37, #E6C55A)", color: "#1C1500" }}
                    data-testid="button-copy-upi"
                  >
                    {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedUpi ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* QR toggle */}
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all active:scale-95"
                  style={{ border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", background: "rgba(212,175,55,0.05)" }}
                  data-testid="button-show-qr"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  {showQr ? "Hide QR Code" : "Show QR Code"}
                </button>

                <AnimatePresence>
                  {showQr && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <div
                          className="w-40 h-40 rounded-xl flex items-center justify-center"
                          style={{ background: "white", border: "3px solid #D4AF37" }}
                        >
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=${UPI_ID}&pn=BarrelBorn&cu=INR`}
                            alt="UPI QR Code"
                            className="w-36 h-36 object-contain rounded"
                          />
                        </div>
                        <p className="text-[10px] text-center tracking-wide" style={{ color: "rgba(220,212,200,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                          Scan with any UPI app
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment apps row */}
                <div className="flex items-center gap-2 pt-1">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                    <div
                      key={app}
                      className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-semibold"
                      style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", color: "rgba(220,212,200,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {app}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => window.open("https://maps.app.goo.gl/C7K6BijrGrvWTXyBA", "_blank")}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all active:scale-95"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                data-testid="button-get-directions"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div className="text-left">
                  <p className="text-[11px] font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>Directions</p>
                  <p className="text-[9px]" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Get on Maps</p>
                </div>
              </button>

              <button
                onClick={() => window.open(`https://wa.me/918278251111?text=Hi! I'd like to make a reservation at Barrel Born.`, "_blank")}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all active:scale-95"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                data-testid="button-reserve-table"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div className="text-left">
                  <p className="text-[11px] font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>Reserve</p>
                  <p className="text-[9px]" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Book a table</p>
                </div>
              </button>

              <button
                onClick={() => window.open("https://g.page/r/CbKAeLOlg005EBM/review", "_blank")}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all active:scale-95"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                data-testid="button-leave-review"
              >
                <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div className="text-left">
                  <p className="text-[11px] font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>Review Us</p>
                  <p className="text-[9px]" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>On Google</p>
                </div>
              </button>

              <button
                onClick={() => window.open(`https://wa.me/918278251111`, "_blank")}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all active:scale-95"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}
                data-testid="button-whatsapp"
              >
                <FaWhatsapp className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div className="text-left">
                  <p className="text-[11px] font-bold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>WhatsApp</p>
                  <p className="text-[9px]" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Chat with us</p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.1)" }} />
            </div>
            <p
              className="text-center text-[10px] tracking-widest cursor-pointer transition-opacity hover:opacity-80"
              style={{ color: "rgba(212,175,55,0.3)", fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => window.open("https://www.atdigitalmenu.com", "_blank")}
            >
              Powered by AT Digital Menu
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
