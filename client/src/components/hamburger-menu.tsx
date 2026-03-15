import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Copy, Check, ExternalLink, Utensils, Users, ChevronDown, ChevronRight } from "lucide-react";
import { mainCategories } from "@/lib/menu-categories";
import { useLanguage } from "@/contexts/LanguageContext";
import { categoryTranslationMap } from "@/lib/translations";
import { useState } from "react";
import Lottie from "lottie-react";
// @ts-ignore
import confirmationAnimation from "@assets/Confirmation_1773569485933.json";
import mapsImg from "@assets/logo_(1)_1773390711534.png";
import callImg from "@assets/call_1773390891033.png";
import clockImg from "@assets/clock_1773568902929.png";
import instaImg from "@assets/instagram_(2)_1773345405292.png";
import fbImg from "@assets/facebook_(2)_1773345408410.png";
import ytImg from "@assets/youtube_1773345412112.png";
import whatsappImg from "@assets/apple_1773515172898.png";
import reservationImg from "@assets/daily-routine_1773569307075.png";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (categoryId: string) => void;
}

const UPI_ID = "atdigitalmenu@upi";
const PHONE = "+91 9619523254";

const TIME_SLOTS = [
  "11:00 AM – 12:30 PM",
  "12:30 PM – 02:00 PM",
  "02:00 PM – 03:30 PM",
  "03:30 PM – 05:00 PM",
  "05:00 PM – 06:30 PM",
  "06:30 PM – 08:00 PM",
  "08:00 PM – 09:30 PM",
  "09:30 PM – 11:00 PM",
];

function ReservationModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [guests, setGuests] = useState("2");
  const [occasion, setOccasion] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !timeSlot) return;
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmitting(false);
    setConfirmed(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full sm:max-w-sm mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1C1500 0%, #0F0C00 100%)",
          border: "1.5px solid rgba(212,175,55,0.4)",
          boxShadow: "0 0 60px rgba(212,175,55,0.12), 0 24px 64px rgba(0,0,0,0.7)",
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
      >
        {/* Gold shimmer top bar */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, #F0CC60, #D4AF37, transparent)" }} />

        {!confirmed ? (
          <div className="p-5 pb-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#D4AF37" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <img src={reservationImg} alt="Reservation" className="w-12 h-12 object-contain flex-shrink-0" />
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-0.5" style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  Make a Reservation
                </p>
                <h3 className="text-lg font-black leading-tight" style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}>
                  Book Your Table
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                  Your Name *
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-transparent outline-none text-sm font-light placeholder:opacity-35"
                    style={{ color: "#E8D8B4", caretColor: "#D4AF37" }}
                    data-testid="input-reservation-name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                  Contact Number *
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                    placeholder="+91 XXXXX XXXXX"
                    maxLength={10}
                    inputMode="numeric"
                    required
                    className="w-full bg-transparent outline-none text-sm font-light placeholder:opacity-35"
                    style={{ color: "#E8D8B4", caretColor: "#D4AF37" }}
                    data-testid="input-reservation-phone"
                  />
                </div>
              </div>

              {/* Date + Guests row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                    Date *
                  </label>
                  <div className="flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-transparent outline-none text-sm font-light"
                      style={{ color: "#E8D8B4", caretColor: "#D4AF37", colorScheme: "dark" }}
                      data-testid="input-reservation-date"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                    Guests *
                  </label>
                  <div className="relative flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <Users className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: "rgba(212,175,55,0.5)" }} />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm font-light appearance-none"
                      style={{ color: "#E8D8B4" }}
                      data-testid="select-reservation-guests"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <option key={n} value={String(n)} style={{ background: "#1C1500" }}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: "rgba(212,175,55,0.5)" }} />
                  </div>
                </div>
              </div>

              {/* Time Slot */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                  Time Slot *
                </label>
                <div className="relative flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none text-sm font-light appearance-none"
                    style={{ color: timeSlot ? "#E8D8B4" : "rgba(232,216,180,0.35)" }}
                    data-testid="select-reservation-timeslot"
                  >
                    <option value="" disabled style={{ background: "#1C1500" }}>Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} style={{ background: "#1C1500" }}>{slot}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: "rgba(212,175,55,0.5)" }} />
                </div>
              </div>

              {/* Occasion (optional) */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: "#B8986A" }}>
                  Occasion <span style={{ color: "rgba(180,160,100,0.5)" }}>(Optional)</span>
                </label>
                <div className="flex items-center rounded-xl px-4 h-11" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <input
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="Birthday, Anniversary, Business..."
                    className="w-full bg-transparent outline-none text-sm font-light placeholder:opacity-35"
                    style={{ color: "#E8D8B4", caretColor: "#D4AF37" }}
                    data-testid="input-reservation-occasion"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !name || !phone || !date || !timeSlot}
                className="w-full h-12 rounded-full font-bold tracking-widest text-sm transition-all active:scale-95 disabled:opacity-40 mt-2"
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
                  color: "#1C1500",
                  letterSpacing: "0.15em",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                }}
                data-testid="button-confirm-reservation"
              >
                {isSubmitting ? "RESERVING..." : "CONFIRM RESERVATION"}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation screen */
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <Lottie
              animationData={confirmationAnimation}
              loop={false}
              autoplay
              style={{ width: 180, height: 144 }}
            />
            <h3
              className="text-2xl font-black mt-2"
              style={{ color: "#D4AF37", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Reservation Confirmed!
            </h3>
            <p className="text-sm mt-2 font-light" style={{ color: "rgba(220,212,200,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
              We're looking forward to hosting you, <span style={{ color: "#E8D8B4", fontWeight: 600 }}>{name}</span>.
            </p>
            <div className="w-full mt-5 rounded-2xl p-4 space-y-2" style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)" }}>
              {[
                { label: "Date", value: new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
                { label: "Time", value: timeSlot },
                { label: "Guests", value: `${guests} ${Number(guests) === 1 ? "Guest" : "Guests"}` },
                ...(occasion ? [{ label: "Occasion", value: occasion }] : []),
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-4" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              Our team will contact you on <span style={{ color: "#D4AF37" }}>{phone}</span> to confirm.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-8 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
              style={{ background: "linear-gradient(90deg, #D4AF37, #E6C55A)", color: "#1C1500" }}
              data-testid="button-close-confirmation"
            >
              Done
            </button>
          </div>
        )}
        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
      </motion.div>
    </motion.div>
  );
}

export default function HamburgerMenu({
  isOpen,
  onClose,
  onCategoryClick,
}: HamburgerMenuProps) {
  const { t } = useLanguage();
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

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
    <>
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
            <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, #F0CC60, #D4AF37, transparent)" }} />

            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
              style={{ background: "linear-gradient(180deg, #1C1500 80%, transparent)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #D4AF37, #E6C55A)" }} />
                <h2 className="text-base font-black tracking-[0.25em] uppercase" style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}>
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

              {/* ── Category Grid ── */}
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
                      style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.22)" }}
                      data-testid={`button-category-${category.id}`}
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, #D4AF37, #E6C55A)" }} />
                      <p className="text-[10px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[13px] font-bold tracking-wide leading-tight" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />
                <Utensils className="w-3.5 h-3.5" style={{ color: "rgba(212,175,55,0.4)" }} />
                <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.15)" }} />
              </div>

              {/* ── Reservation Section ── */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowReservation(true)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.28)" }}
                data-testid="button-open-reservation"
              >
                <img src={reservationImg} alt="Reservation" className="w-12 h-12 object-contain flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
                    Table Booking
                  </p>
                  <p className="text-[15px] font-black tracking-wide" style={{ color: "#E8D8B4", fontFamily: "'DM Sans', sans-serif" }}>
                    Make a Reservation
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(220,212,200,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                    Reserve your table in seconds
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(90deg, #D4AF37, #E6C55A)" }}>
                  <ChevronRight className="w-4 h-4" style={{ color: "#1C1500", strokeWidth: 3 }} />
                </div>
              </motion.button>

              {/* ── Pay & Order ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.22)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5" style={{ color: "#D4AF37" }} />
                    <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(212,175,55,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                      Pay &amp; Order
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
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
                          <div className="w-44 h-44 rounded-xl flex items-center justify-center" style={{ background: "white", border: "3px solid #D4AF37" }}>
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=176x176&data=upi://pay?pa=${UPI_ID}&pn=BarrelBorn&cu=INR`}
                              alt="UPI QR Code"
                              className="w-40 h-40 object-contain rounded"
                            />
                          </div>
                          <p className="text-[10px] text-center tracking-wide" style={{ color: "rgba(220,212,200,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                            Scan with any UPI app
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2 pt-1">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <div key={app} className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-semibold"
                        style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", color: "rgba(220,212,200,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                        {app}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Restaurant Info ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.18)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
                  <p className="text-[10px] tracking-[0.25em] font-semibold uppercase" style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
                    Restaurant Info
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <img src={mapsImg} alt="Location" className="w-10 h-10 object-contain flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>atdigitalmenu</p>
                      <p className="text-xs mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>Thane, Maharashtra</p>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <img src={callImg} alt="Call" className="w-10 h-10 object-contain rounded-full flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold tracking-wide uppercase mb-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        {t.contactUs}
                      </p>
                      <button onClick={() => window.open(`tel:${PHONE.replace(/\s/g, "")}`, "_self")}
                        className="text-sm font-bold transition-opacity hover:opacity-80" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        {PHONE}
                      </button>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>{t.forReservations}</p>
                    </div>
                  </div>
                  {/* Hours */}
                  <div className="flex items-center gap-3">
                    <img src={clockImg} alt="Hours" className="w-10 h-10 object-contain flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>11:00 AM – 11:30 PM</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>{t.openAllDays}</p>
                    </div>
                  </div>
                  {/* Instagram */}
                  <div className="flex items-center gap-3">
                    <img src={instaImg} alt="Instagram" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                    <div>
                      <button onClick={() => window.open("https://www.instagram.com/atdigitalmenu", "_blank", "noopener,noreferrer")}
                        className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        @atdigitalmenu <ExternalLink className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                      </button>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>{t.followForUpdates}</p>
                    </div>
                  </div>
                  {/* Facebook */}
                  <div className="flex items-center gap-3">
                    <img src={fbImg} alt="Facebook" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                    <div>
                      <button onClick={() => window.open("https://facebook.com/atdigitalmenu", "_blank", "noopener,noreferrer")}
                        className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        atdigitalmenu <ExternalLink className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                      </button>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>Follow on Facebook</p>
                    </div>
                  </div>
                  {/* YouTube */}
                  <div className="flex items-center gap-3">
                    <img src={ytImg} alt="YouTube" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                    <div>
                      <button onClick={() => window.open("https://youtube.com/@atdigitalmenu", "_blank", "noopener,noreferrer")}
                        className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        atdigitalmenu <ExternalLink className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                      </button>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>Watch on YouTube</p>
                    </div>
                  </div>
                  {/* WhatsApp */}
                  <div className="flex items-center gap-3">
                    <img src={whatsappImg} alt="WhatsApp" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
                    <div>
                      <button onClick={() => window.open("https://wa.me/919619523254", "_blank", "noopener,noreferrer")}
                        className="text-sm font-bold flex items-center gap-1 transition-opacity hover:opacity-80" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        {PHONE} <ExternalLink className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                      </button>
                      <p className="text-[10px] mt-0.5" style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>Chat on WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-px w-full" style={{ background: "rgba(212,175,55,0.1)" }} />
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

      {/* ── Reservation Modal ── */}
      <AnimatePresence>
        {showReservation && (
          <ReservationModal onClose={() => setShowReservation(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
