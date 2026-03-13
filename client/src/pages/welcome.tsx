import { Utensils } from "lucide-react";
import googleReviewImg from "@assets/Google_Review_(1)_1773391050407.png";
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
import mapsImg from "@assets/logo_(1)_1773390711534.png";
import callImg from "@assets/call_1773390891033.png";
import mailImg from "@assets/communication_1773390476300.png";

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

      {/* Main content container — everything centered */}
      <div className="flex flex-col items-center w-full px-6 pt-0 pb-4">

        {/* Logo Image */}
        <div className="flex flex-col items-center w-full -mt-12">
          <img
            src={logoImage}
            alt="Barrelborn Dine & Draft"
            className="w-[380px] h-auto"
          />
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-6 -mt-14">
          <button
            onClick={() => handleSocialClick("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
            className="flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <img src={instaImg} alt="Instagram" className="w-11 h-11 rounded-xl object-cover" />
          </button>
          <button
            onClick={() => handleSocialClick("https://facebook.com")}
            className="flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <img src={fbImg} alt="Facebook" className="w-9 h-9 rounded-xl object-cover" />
          </button>
          <button
            onClick={() => handleSocialClick("https://youtube.com")}
            className="flex items-center justify-center transition-opacity hover:opacity-80"
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
        <div className="flex flex-col items-center mt-5">
          <p className="font-medium text-base mb-2" style={{ color: "#dcd4c8" }}>
            {t.rateOnGoogle}
          </p>
          <button onClick={handleReviewClick} className="hover:opacity-80 transition-opacity">
            <img
              src={googleReviewImg}
              alt="Rate us on Google"
              className="w-52 h-auto object-contain"
            />
          </button>
        </div>

        {/* Info rows — all anchored to a common left edge via inline-flex */}
        <div className="mt-5 flex flex-col items-start gap-4">

          {/* Location */}
          <button
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={() => window.open("https://maps.app.goo.gl/C7K6BijrGrvWTXyBA", "_blank")}
          >
            <img src={mapsImg} alt="Google Maps" className="w-9 h-9 flex-shrink-0 rounded-lg object-cover" />
            <span className="text-sm font-medium" style={{ color: "#E8DFD1" }}>
              📍 Click to View Our Location
            </span>
          </button>

          {/* Phone */}
          <button
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={() => window.open("tel:+918278251111")}
          >
            <img src={callImg} alt="Call" className="w-9 h-9 flex-shrink-0 rounded-full object-cover" />
            <span className="text-sm font-medium" style={{ color: "#E8DFD1" }}>+91 8278251111</span>
          </button>

          {/* Email */}
          <button
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            onClick={() => window.open("mailto:info@barrelborn.in")}
          >
            <img src={mailImg} alt="Email" className="w-9 h-9 flex-shrink-0 rounded-lg object-cover" />
            <span className="text-sm font-medium" style={{ color: "#E8DFD1" }}>info@barrelborn.in</span>
          </button>

        </div>

        {/* Website URL */}
        <p
          className="mt-5 cursor-pointer text-sm"
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
