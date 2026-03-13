import { Utensils } from "lucide-react";
import googleReviewImg from "@assets/Google_Review_(2)_1773394875392.png";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDropdown from "@/components/language-dropdown";
import digitalMenuImg from "@assets/Untitled_design_(2)_1773391381521.png";
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
      className="h-screen w-full overflow-hidden relative flex flex-col"
      style={{ backgroundColor: "#f8f1de" }}
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />

      {/* Language dropdown — fixed top right */}
      <div className="fixed top-3 right-3 z-50">
        <LanguageDropdown />
      </div>

      {/* Main content — fills screen with even distribution */}
      <div className="flex flex-col items-center w-full flex-1 px-5 pb-3 justify-evenly">

        {/* Digital Menu Logo — negative margins trim internal whitespace */}
        <img
          src={digitalMenuImg}
          alt="Digital Menu"
          className="w-full max-w-xs h-auto object-contain"
          style={{ marginTop: "-18%", marginBottom: "-18%" }}
        />

        {/* Stay Connected Always — Social Icons */}
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#000000" }}>
            Stay Connected Always
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleSocialClick("https://www.instagram.com/barrelborn_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}
              className="transition-opacity hover:opacity-80"
            >
              <img src={instaImg} alt="Instagram" className="w-10 h-10 rounded-xl object-cover" />
            </button>
            <button
              onClick={() => handleSocialClick("https://facebook.com")}
              className="transition-opacity hover:opacity-80"
            >
              <img src={fbImg} alt="Facebook" className="w-8 h-8 rounded-xl object-cover" />
            </button>
            <button
              onClick={() => handleSocialClick("https://youtube.com")}
              className="transition-opacity hover:opacity-80"
            >
              <img src={ytImg} alt="YouTube" className="w-10 h-10 rounded-xl object-cover" />
            </button>
          </div>
        </div>

        {/* Explore Menu Button */}
        <button
          onClick={handleExploreMenu}
          className="px-9 py-2.5 font-semibold border-2 rounded-full transition-colors flex items-center gap-2 text-sm"
          style={{ borderColor: "#B8986A", color: "#FFFFFF", backgroundColor: "#B8986A", outline: "2px solid #B8986A", outlineOffset: "2px" }}
          data-testid="button-explore-menu"
        >
          <Utensils className="w-4 h-4" style={{ color: "#FFFFFF" }} />
          <span>{t.exploreMenu}</span>
        </button>

        {/* Google Review badge — no label text */}
        <button onClick={handleReviewClick} className="hover:opacity-80 transition-opacity">
          <img
            src={googleReviewImg}
            alt="Rate us on Google"
            className="w-44 h-auto object-contain"
          />
        </button>

        {/* Connect With Us — Maps, Call, Mail */}
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#000000" }}>
            Connect With Us
          </p>
          <div className="flex items-start justify-center gap-7">
            <button
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
              onClick={() => window.open("https://maps.app.goo.gl/C7K6BijrGrvWTXyBA", "_blank")}
            >
              <img src={mapsImg} alt="Google Maps" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs font-medium" style={{ color: "#000000" }}>Location</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
              onClick={() => window.open("tel:+918278251111")}
            >
              <img src={callImg} alt="Call" className="w-10 h-10 rounded-full object-cover" />
              <span className="text-xs font-medium" style={{ color: "#000000" }}>Call Us</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
              onClick={() => window.open("mailto:info@barrelborn.in")}
            >
              <img src={mailImg} alt="Email" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs font-medium" style={{ color: "#000000" }}>Email Us</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-0.5">
          <p
            className="cursor-pointer text-xs font-medium"
            style={{ color: "#000000" }}
            onClick={() => window.open("https://www.atdigitalmenu.com", "_blank")}
          >
            www.atdigitalmenu.com
          </p>
        </div>

      </div>
    </div>
  );
}
