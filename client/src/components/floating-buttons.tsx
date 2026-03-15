import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, Star, ChefHat } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import chefsHatImg from "@assets/chefs-hat_1773556627617.png";
import waiterImg from "@assets/waiter_1773555177013.png";
import fallbackImg from "@assets/coming_soon_imagev2_1766811809828.jpg";

export default function FloatingButtons() {
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showSmartMenu, setShowSmartMenu] = useState(false);
  const [activeSmartSection, setActiveSmartSection] = useState<"today" | "chef">("today");
  const [smartVegFilter, setSmartVegFilter] = useState<"all" | "veg" | "non-veg">("all");

  const { data: allItems = [] } = useQuery<MenuItem[]>({ queryKey: ["/api/menu-items"] });

  const smartSections = useMemo(() => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return {
      today: shuffled.slice(0, 10),
      chef: shuffled.slice(10, 20),
    };
  }, [allItems]);

  const smartFilteredItems = useMemo(() => {
    const items = smartSections[activeSmartSection] || [];
    if (smartVegFilter === "veg") return items.filter((i) => i.isVeg);
    if (smartVegFilter === "non-veg") return items.filter((i) => !i.isVeg);
    return items;
  }, [smartSections, activeSmartSection, smartVegFilter]);

  return (
    <>
      {/* ── Smart Picks ── */}

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

      {/* Slide-up panel */}
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
            <div className="flex gap-2 px-5 pb-3 flex-shrink-0">
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

            {/* Veg / Non-Veg Filter row */}
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

            {/* Scrollable grid */}
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
                  {smartFilteredItems.length === 0 ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                      <p
                        className="text-sm tracking-widest uppercase"
                        style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        No items found
                      </p>
                    </div>
                  ) : (
                    smartFilteredItems.map((item, idx) => (
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
                        <div className="relative overflow-hidden" style={{ height: "190px" }}>
                          <img
                            src={item.image || fallbackImg}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackImg;
                            }}
                          />
                          <div
                            className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border ${
                              item.isVeg ? "bg-green-500 border-green-300" : "bg-red-500 border-red-300"
                            }`}
                          />
                        </div>
                        <div className="p-2">
                          <p
                            className="text-[11px] font-semibold tracking-wide uppercase leading-tight line-clamp-2 mb-0.5"
                            style={{ color: "#D4AF37", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-[10px] truncate mb-1"
                            style={{ color: "#DCD4C8", fontFamily: "'DM Sans', sans-serif", opacity: 0.75 }}
                          >
                            {item.description || ""}
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
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Picks floating button — bottom left */}
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

      {/* ── Call Waiter ── */}
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
            style={{
              border: waiterCalled ? "2px solid rgba(74,222,128,0.7)" : "2px solid rgba(212,175,55,0.7)",
            }}
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
    </>
  );
}
