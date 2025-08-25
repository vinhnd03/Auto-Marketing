import React, { useEffect, useState } from "react";
import { ArrowUpCircle } from "lucide-react";

/**
 * GlobalScrollToTop component
 * Shows a floating button at bottom right, scrolls to top when clicked.
 */
const GlobalScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return showScrollTop ? (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-6 right-6 z-[9999] bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all"
      aria-label="Scroll to top"
    >
      <ArrowUpCircle size={32} />
    </button>
  ) : null;
};

export default GlobalScrollToTop;