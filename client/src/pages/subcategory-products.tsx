import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, Mic, MicOff, Loader2, ChevronDown, Filter } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "@/components/product-card";
import DishDetailModal from "@/components/dish-detail-modal";
import { useLanguage } from "@/contexts/LanguageContext";
import { categoryTranslationMap } from "@/lib/translations";
import { getMainCategory } from "@/lib/menu-categories";
import type { MenuItem } from "@shared/schema";

interface ISpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function SubcategoryProducts() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string; subcategory: string }>();
  const categoryId = params.category || "mocktails";
  const subcategoryId = params.subcategory || "";
  const { t } = useLanguage();

  // Get filter from URL params, fallback to localStorage
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const getInitialFilter = () => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      return urlFilter as "all" | "veg" | "non-veg";
    }
    try {
      const saved = localStorage.getItem("foodVegFilter");
      return (saved as "all" | "veg" | "non-veg") || "all";
    } catch {
      return "all";
    }
  };

  const mainCategory = getMainCategory(categoryId);
  const subcategories = mainCategory?.subcategories || [];
  const currentSubcategory = subcategories.find(s => s.id === subcategoryId);

  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">(getInitialFilter);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const itemsQuery = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items", subcategoryId],
    queryFn: async () => {
      const response = await fetch(`/api/menu-items?category=${encodeURIComponent(subcategoryId)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
  
  const { data: menuItems = [], isLoading, error, isError } = itemsQuery;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    console.log("Menu Items Query State:", {
      isLoading,
      isError,
      error: error?.message,
      dataCount: menuItems.length,
      data: menuItems
    });
  }, [menuItems, isLoading, isError, error]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  useEffect(() => {
    console.log("DETAILED CATEGORY DEBUG:", {
      categoryId,
      subcategoryId,
      mainCategory: mainCategory?.displayLabel,
      currentSubcategory: currentSubcategory?.id,
      dbCategory: currentSubcategory?.dbCategory,
      displayLabel: currentSubcategory?.displayLabel,
      menuItemsCount: menuItems.length,
      firstItemCategory: menuItems[0]?.category,
      allItemCategories: Array.from(new Set(menuItems.map(item => item.category))),
    });
  }, [menuItems, currentSubcategory, categoryId, subcategoryId, mainCategory]);

  const filteredItems = useMemo(() => {
    const dbCategory = currentSubcategory?.dbCategory;
    
    let filtered = menuItems;
    
    // Apply availability filter
    filtered = filtered.filter(item => item.isAvailable);
    
    // Apply veg filter
    if (vegFilter === "veg") {
      filtered = filtered.filter(item => item.isVeg);
    } else if (vegFilter === "non-veg") {
      filtered = filtered.filter(item => !item.isVeg);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [menuItems, searchQuery, vegFilter]);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  if (!mainCategory || !currentSubcategory) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#3D3100" }}>
        <p style={{ color: "#DCD4C8" }}>Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3D3100" }}>
      <header className="sticky top-0 z-30" style={{ backgroundColor: "#3D3100" }}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation(`/menu/${categoryId}`)}
              className="hover:bg-transparent flex-shrink-0"
              style={{ color: "#C9A55C" }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <div className="flex-1 flex items-center justify-center relative">
              <h1
                className="font-semibold text-center tracking-widest uppercase"
                style={{
                  fontSize: "clamp(13px, 3.5vw, 19px)",
                  color: "#D4AF37",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {(categoryTranslationMap[currentSubcategory.id]
                  ? t[categoryTranslationMap[currentSubcategory.id]]
                  : currentSubcategory.displayLabel
                ).toString().toUpperCase()}
              </h1>
            </div>

            <div className="w-9" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <div className="relative mb-3 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
          <Input
            type="text"
            placeholder={t.searchItems}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-32 sm:pr-40 h-11 rounded-full border-2 text-white placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-[#C9A55C]/50"
            style={{ 
              borderColor: '#C9A55C', 
              backgroundColor: 'transparent'
            }}
            data-testid="input-search"
          />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0">
            {categoryId === "food" && (
              <div className="flex items-center">
                <div 
                  className="inline-flex rounded-full p-0.5 items-center gap-0"
                  style={{
                    backgroundColor: vegFilter === "all" ? "rgba(255, 255, 255, 0.1)" : vegFilter === "veg" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"
                  }}
                >
                  <button
                    onClick={() => setVegFilter("all")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-all"
                    style={
                      vegFilter === "all"
                        ? { backgroundColor: "white", color: "black", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    {t.all}
                  </button>
                  <button
                    onClick={() => setVegFilter("veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-veg"
                    style={
                      vegFilter === "veg"
                        ? { backgroundColor: "#22C55E", color: "white", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    {t.veg}
                  </button>
                  <button
                    onClick={() => setVegFilter("non-veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-non-veg"
                    style={
                      vegFilter === "non-veg"
                        ? { backgroundColor: "#EF4444", color: "white", lineHeight: "1.2" }
                        : { color: "#C9A55C", lineHeight: "1.2" }
                    }
                  >
                    {t.nonVeg}
                  </button>
                </div>
              </div>
            )}
            {voiceSearchSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={isListening ? undefined : startVoiceSearch}
                className="h-9 w-9 hover:bg-transparent"
                data-testid="button-voice-search"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: "#C9A55C" }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
            <Search className="h-12 w-12 mb-4" style={{ color: "rgba(212,175,55,0.4)" }} />
            <h3 className="text-lg font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif", color: "#D4AF37" }}>
              {t.noItemsFound}
            </h3>
            <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#DCD4C8", opacity: 0.6 }}>
              {searchQuery ? `${t.noResultsFor} "${searchQuery}"` : t.noItemsFound}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard item={item} onClick={(dish) => setSelectedDish(dish)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}