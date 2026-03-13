import { Utensils } from "lucide-react";
import googleReviewImg from "@assets/Google_Review_1773389968949.png";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDropdown from "@/components/language-dropdown";
import logoImage from "@assets/Untitled_design_(20)_1765720426678.png";
import bgPattern from "@assets/dark_bg_pattern.png";
import instaImg from "@assets/instagram_(2)_1773345405292.png";
import fbImg from "@assets/facebook_(2)_1773345408410.png";
import ytImg from "@assets/youtube_1773345412112.png";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { playWelcomeAudio } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);
  const { t } = useLanguage();

  const handleExploreMenu = () => {
    playWelcomeAudio();
    setLocation("/menu");
  };

  const handleSocialClick = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, []);

  const handleReviewClick = useCallback(() => {
    window.open("https://g.page/r/CbKAeLOlg005EBM/review", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div
      className="min-h-screen w-full overflow-auto relative"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />

      {/* Language dropdown — fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageDropdown />
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center w-full px-4 pt-0 pb-2">

        {/* Logo Image */}
        <div className="flex flex-col items-center w-full -mt-12">
          <img
            src={logoImage}
            alt="Barrelborn Dine & Draft"
            className="w-[380px] h-auto"
          />
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-6 -mt-14">
          <button
            onClick={() => handleSocialClick("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
            className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <img src={instaImg} alt="Instagram" className="w-11 h-11 rounded-xl object-cover" />
          </button>
          <button
            onClick={() => handleSocialClick("https://facebook.com")}
            className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <img src={fbImg} alt="Facebook" className="w-9 h-9 rounded-xl object-cover" />
          </button>
          <button
            onClick={() => handleSocialClick("https://youtube.com")}
            className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <img src={ytImg} alt="YouTube" className="w-11 h-11 rounded-xl object-cover" />
          </button>
        </div>

        {/* Explore Menu Button */}
        <button
          onClick={handleExploreMenu}
          className="mt-7 px-10 py-3 font-semibold border-2 rounded-full transition-colors flex items-center gap-2 text-base"
          style={{ borderColor: "#FFFFFF", color: "#FFFFFF", backgroundColor: "#B8986A", outline: "2px solid #FFFFFF", outlineOffset: "2px" }}
          data-testid="button-explore-menu"
        >
          <Utensils className="w-5 h-5" style={{ color: "#FFFFFF" }} />
          <span>{t.exploreMenu}</span>
        </button>

        {/* Rating Section */}
        <div className="text-center mt-5">
          <p className="font-medium text-base mb-2" style={{ color: "#dcd4c8" }}>
            {t.rateOnGoogle}
          </p>
          <div
            className="flex justify-center cursor-pointer"
            onClick={handleReviewClick}
          >
            <img
              src={googleReviewImg}
              alt="Rate us on Google"
              className="w-56 h-auto object-contain hover:opacity-80 transition-opacity"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="text-center mt-5">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: "#B8986A" }}
          >
            <span className="font-semibold text-sm" style={{ color: "#dcd4c8" }}>
              {t.address}
            </span>
          </div>
          <div
            className="leading-snug text-sm cursor-pointer transition-opacity hover:opacity-80"
            style={{ color: "#E8DFD1" }}
            onClick={() =>
              window.open(
                "https://www.google.com/maps/place/Barrelborn+%7C+Dine+%26+Draft+%7C+Thane/@19.1935267,72.9666575,17z",
                "_blank"
              )
            }
          >
            <p>{t.addressLine1}</p>
            <p>{t.addressLine2}</p>
            <p>{t.addressLine3}</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-4">
          <div
            className="border-2 rounded-full inline-block px-5 py-1 mb-2"
            style={{ borderColor: "#B8986A" }}
          >
            <span className="font-semibold text-sm" style={{ color: "#dcd4c8" }}>
              {t.contact}
            </span>
          </div>
          <div className="text-sm" style={{ color: "#E8DFD1" }}>
            <p>+91 8278251111</p>
            <p>info@barrelborn.in</p>
          </div>
        </div>

        {/* Website URL */}
        <p
          className="mt-4 cursor-pointer text-sm"
          style={{ color: "#B8986A" }}
          onClick={() => window.open("https://www.barrelborn.in", "_blank")}
        >
          www.barrelborn.in
        </p>

        {/* Developer Credit */}
        <div className="text-center mt-3 mb-4 text-xs" style={{ color: "#E8DFD1" }}>
          <p>{t.developedBy}</p>
          <p
            className="font-medium cursor-pointer"
            onClick={() => window.open("http://www.airavatatechnologies.com", "_blank")}
            style={{ color: "#B8986A" }}
          >
            AIRAVATA TECHNOLOGIES
          </p>
        </div>

      </div>
    </div>
  );
}
