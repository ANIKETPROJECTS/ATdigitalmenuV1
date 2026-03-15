import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";
import { useState } from "react";

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const NUTRITION_PLACEHOLDER = [
  { label: "Calories", value: "—" },
  { label: "Protein", value: "—" },
  { label: "Carbs", value: "—" },
  { label: "Fat", value: "—" },
  { label: "Fibre", value: "—" },
  { label: "Sodium", value: "—" },
];

const ALLERGEN_PLACEHOLDER = "Information not available for this item.";
const INGREDIENTS_PLACEHOLDER = "Detailed ingredient list not available.";
const PREP_TIME_PLACEHOLDER = "15–25 mins";

export default function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const isBroken = imgError || !item.image || item.image.includes("placeholder.com") || item.image.includes("example.com");
  const imageUrl = isBroken ? fallbackImg : item.image;

  const priceDisplay =
    typeof item.price === "string" && item.price.includes("|")
      ? item.price.split("|").map((p: string) => `₹${p.trim()}`).join("  |  ")
      : `₹${item.price}`;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Sheet */}
          <motion.div
            className="relative w-full sm:max-w-md overflow-y-auto rounded-t-3xl"
            style={{
              backgroundColor: "#1A1408",
              border: "1px solid rgba(212,175,55,0.3)",
              borderBottom: "none",
              maxHeight: "95vh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.35)" }} />
            </div>

            {/* Hero Image — full width, no tint */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: "rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
                data-testid="button-close-dish-modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Veg / Non-Veg badge — no icon, short label */}
              <div
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: item.isVeg ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  border: item.isVeg ? "1px solid rgba(74,222,128,0.5)" : "1px solid rgba(252,165,165,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {item.isVeg ? "Veg" : "Non-Veg"}
              </div>
            </div>

            {/* Gold accent line */}
            <div
              className="w-full h-px"
              style={{ background: "linear-gradient(90deg, transparent, #D4AF37, #E6C55A, transparent)" }}
            />

            {/* Name + Price row */}
            <div className="px-5 pt-4 pb-2 flex items-start justify-between gap-3">
              <h2
                className="font-bold leading-tight uppercase flex-1"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(16px, 5vw, 22px)",
                  letterSpacing: "0.08em",
                  wordBreak: "break-word",
                }}
                data-testid="text-dish-name"
              >
                {item.name}
              </h2>
              <p
                className="text-base font-bold tracking-wider flex-shrink-0"
                style={{
                  background: "linear-gradient(90deg, #D4AF37, #E6C55A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                data-testid="text-dish-price"
              >
                {priceDisplay}
              </p>
            </div>

            {/* Content */}
            <div className="px-5 pb-6 space-y-4">

              {/* Description */}
              {item.description && (
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    borderLeft: "3px solid #D4AF37",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}
                    data-testid="text-dish-description"
                  >
                    {item.description}
                  </p>
                </div>
              )}

              {/* Prep time */}
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div>
                  <p
                    className="text-[10px] uppercase tracking-widest font-semibold"
                    style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Preparation Time
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {PREP_TIME_PLACEHOLDER}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "rgba(212,175,55,0.12)" }} />

              {/* Nutritional Contents — no icon */}
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Nutritional Contents
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {NUTRITION_PLACEHOLDER.map((n) => (
                    <div
                      key={n.label}
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: "rgba(212,175,55,0.06)",
                        border: "1px solid rgba(212,175,55,0.14)",
                      }}
                    >
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: "rgba(220,212,200,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {n.label}
                      </p>
                      <p
                        className="text-base font-bold"
                        style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {n.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p
                  className="text-[10px] mt-2 text-center uppercase tracking-wider"
                  style={{ color: "rgba(212,175,55,0.35)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Nutritional info will be available soon
                </p>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "rgba(212,175,55,0.12)" }} />

              {/* Allergens — no icon */}
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Allergens
                </h3>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.14)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}
                  >
                    {ALLERGEN_PLACEHOLDER}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "rgba(212,175,55,0.12)" }} />

              {/* Ingredients — no icon */}
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Ingredients
                </h3>
                <div
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.14)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}
                  >
                    {INGREDIENTS_PLACEHOLDER}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
