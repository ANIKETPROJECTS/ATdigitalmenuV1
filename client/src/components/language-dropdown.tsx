import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Loader2, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supportedLanguages } from "@/lib/translationService";

interface LanguageDropdownProps {
  className?: string;
}

export default function LanguageDropdown({ className = "" }: LanguageDropdownProps) {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const current = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const filtered = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} data-testid="language-dropdown">
      <button
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        disabled={isTranslating}
        className="flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-200 hover:opacity-80 disabled:opacity-50"
        style={{
          borderColor: "#B8986A",
          backgroundColor: "rgba(184,152,106,0.12)",
          color: "#dcd4c8",
          minWidth: "60px",
        }}
        data-testid="button-language-toggle"
        aria-label="Select language"
      >
        {isTranslating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#B8986A" }} />
        ) : (
          <Globe className="w-3.5 h-3.5" style={{ color: "#B8986A" }} />
        )}
        <span className="text-xs font-semibold tracking-wide" style={{ color: "#dcd4c8" }}>
          {current.native}
        </span>
        <ChevronDown
          className="w-3 h-3 transition-transform duration-200"
          style={{ color: "#B8986A", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 shadow-xl"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #B8986A",
            width: "180px",
          }}
        >
          {/* Search box */}
          <div className="p-2 border-b" style={{ borderColor: "rgba(184,152,106,0.3)" }}>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
              <Search className="w-3 h-3 flex-shrink-0" style={{ color: "#B8986A" }} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs outline-none w-full"
                style={{ color: "#dcd4c8" }}
                autoFocus
              />
            </div>
          </div>

          {/* Language list */}
          <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-center" style={{ color: "rgba(220,212,200,0.5)" }}>
                No language found
              </div>
            ) : (
              filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
                  style={{
                    backgroundColor: language === lang.code ? "rgba(184,152,106,0.2)" : "transparent",
                    color: language === lang.code ? "#B8986A" : "#dcd4c8",
                    fontWeight: language === lang.code ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (language !== lang.code) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== lang.code) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }
                  }}
                  data-testid={`button-lang-${lang.code}`}
                >
                  <span className="w-8 text-xs font-bold flex-shrink-0" style={{ color: "#B8986A" }}>
                    {lang.native}
                  </span>
                  <span className="text-xs truncate">{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-xs" style={{ color: "#B8986A" }}>✓</span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer note */}
          <div
            className="px-3 py-1.5 text-center border-t"
            style={{ borderColor: "rgba(184,152,106,0.3)", color: "rgba(220,212,200,0.4)", fontSize: "10px" }}
          >
            Powered by MyMemory
          </div>
        </div>
      )}
    </div>
  );
}
