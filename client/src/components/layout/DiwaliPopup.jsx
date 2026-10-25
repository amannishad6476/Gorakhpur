import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SEO_CONFIG } from '../../utils/seo';

const STORAGE_KEY = 'diwali_dhamaka_2026_shown_at';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// In-memory fallback if storage access fails in private/incognito mode
let sessionShownToday = false;

const hasBeenShownToday = () => {
  if (sessionShownToday) return true;
  try {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    if (!lastShown) return false;
    const time = parseInt(lastShown, 10);
    if (isNaN(time)) return false;
    return Date.now() - time < ONE_DAY_MS;
  } catch {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return sessionShownToday;
    }
  }
};

const markAsShown = () => {
  sessionShownToday = true;
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Safe no-op
    }
  }
};

const DiwaliPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Open popup after a short delay on first visit of the day
  useEffect(() => {
    try {
      if (hasBeenShownToday()) {
        return;
      }
    } catch {
      return;
    }

    const timer = setTimeout(() => {
      try {
        if (!hasBeenShownToday()) {
          markAsShown();
          previousActiveElement.current = document.activeElement;
          setIsOpen(true);
        }
      } catch {
        // Prevent unhandled errors from breaking the page
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Return focus to previous element for accessibility
    try {
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    } catch {
      // Safe ignore
    }
  }, []);

  const handleExploreServices = useCallback(() => {
    handleClose();
    navigate('/services');
  }, [handleClose, navigate]);

  // Keyboard navigation & accessibility (Escape key and focus trap)
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on primary CTA or close button
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        const primaryBtn = modalRef.current.querySelector('[data-autofocus]');
        if (primaryBtn) {
          primaryBtn.focus();
        }
      }
    }, 100);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, handleClose]);

  const cleanWhatsappNumber = (SEO_CONFIG.whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    'Hello Gorakhpur Painter! I am interested in your Diwali Dhamaka 2026 special offer. Please provide a free painting quotation for my home.'
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  const services = [
    { name: 'Interior & Exterior Painting', icon: '🏠' },
    { name: 'Premium Texture Painting', icon: '✨' },
    { name: 'Wall Putty & Waterproofing', icon: '🛡️' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="diwali-modal-title"
            aria-describedby="diwali-modal-desc"
            className="relative w-full max-w-[490px] rounded-3xl overflow-hidden shadow-2xl z-10 my-auto text-white flex flex-col max-h-[92vh]"
            style={{
              background: 'radial-gradient(circle at 50% 0%, #6b0716 0%, #400109 55%, #1f0005 100%)',
              border: '2px solid #d4a017',
              boxShadow: '0 0 45px rgba(212, 160, 23, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Decorative Subtle Festive Lights Toran Header */}
            <div className="relative w-full h-8 flex items-center justify-around px-4 bg-gradient-to-b from-black/40 to-transparent border-b border-amber-500/20 select-none pointer-events-none">
              {['#ffd700', '#f97316', '#facc15', '#ea580c', '#ffd700', '#f97316', '#facc15'].map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-2 bg-amber-400/40" />
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            opacity: [0.6, 1, 0.6],
                            scale: [0.9, 1.15, 0.9],
                          }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2.5 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-amber-400/40 hover:border-amber-400 flex items-center justify-center text-amber-200 hover:text-white transition-all text-base z-20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Close Diwali Offer Popup"
            >
              ✕
            </button>

            {/* Scrollable Modal Content */}
            <div className="px-5 sm:px-7 pt-2 pb-6 overflow-y-auto overscroll-contain">
              {/* Center Diya & Festive Badge */}
              <div className="flex flex-col items-center text-center mt-1">
                {/* Decorative Diya SVG */}
                <div className="relative mb-2">
                  <svg
                    width="68"
                    height="54"
                    viewBox="0 0 68 54"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    aria-hidden="true"
                  >
                    {/* Flame Glow */}
                    <circle cx="34" cy="18" r="14" fill="url(#flameGlow)" opacity="0.6" />

                    {/* Outer Flame */}
                    <motion.path
                      d="M34 4C34 4 41 14 41 21C41 24.866 37.866 28 34 28C30.134 28 27 24.866 27 21C27 14 34 4 34 4Z"
                      fill="url(#outerFlame)"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scaleY: [1, 1.08, 0.97, 1.05, 1],
                              scaleX: [1, 0.96, 1.04, 0.98, 1],
                            }
                      }
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ originX: '34px', originY: '28px' }}
                    />

                    {/* Inner Flame Core */}
                    <motion.path
                      d="M34 10C34 10 38 16 38 21C38 23.2091 36.2091 25 34 25C31.7909 25 30 23.2091 30 21C30 16 34 10 34 10Z"
                      fill="url(#innerFlame)"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scaleY: [1, 1.12, 1],
                            }
                      }
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ originX: '34px', originY: '25px' }}
                    />

                    {/* Diya Base */}
                    <path
                      d="M10 32C10 32 18 45 34 45C50 45 58 32 58 32C58 32 54 48 34 48C14 48 10 32 10 32Z"
                      fill="url(#diyaBase)"
                    />
                    <path
                      d="M8 31C8 30 16 29 34 29C52 29 60 30 60 31C60 32.5 52 35 34 35C16 35 8 32.5 8 31Z"
                      fill="url(#diyaRim)"
                    />
                    {/* Stand base */}
                    <path
                      d="M24 47C24 47 28 52 34 52C40 52 44 47 44 47H24Z"
                      fill="#854d0e"
                    />

                    <defs>
                      <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="outerFlame" x1="34" y1="4" x2="34" y2="28" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                      <linearGradient id="innerFlame" x1="34" y1="10" x2="34" y2="25" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="60%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="diyaBase" x1="34" y1="32" x2="34" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#b45309" />
                        <stop offset="50%" stopColor="#78350f" />
                        <stop offset="100%" stopColor="#451a03" />
                      </linearGradient>
                      <linearGradient id="diyaRim" x1="8" y1="31" x2="60" y2="31" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#d4a017" />
                        <stop offset="50%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#d4a017" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Subdued Festive Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-semibold tracking-wider uppercase text-amber-200 mb-1.5">
                  <span>✨</span>
                  <span>FESTIVE HOME MAKEOVER</span>
                  <span>✨</span>
                </div>

                {/* Main Heading */}
                <h2
                  id="diwali-modal-title"
                  className="font-black text-2xl sm:text-3xl tracking-tight leading-tight uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: 'linear-gradient(135deg, #fffbeb 0%, #ffd700 45%, #f59e0b 80%, #d4a017 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 14px rgba(251, 191, 36, 0.35)',
                  }}
                >
                  DIWALI DHAMAKA 2026
                </h2>

                {/* Subheading */}
                <p
                  id="diwali-modal-desc"
                  className="text-amber-100 font-medium text-xs sm:text-sm mt-1 max-w-[360px]"
                >
                  Give Your Home a Beautiful Festive Makeover!
                </p>
              </div>

              {/* Services Highlighted Card */}
              <div className="mt-4 p-3 rounded-2xl bg-black/35 border border-amber-500/25 backdrop-blur-md">
                <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2 text-center">
                  Specialized Festive Painting Services
                </p>
                <div className="space-y-1.5">
                  {services.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/15 text-xs text-amber-50 font-medium"
                    >
                      <span className="text-sm select-none" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                      <span className="ml-auto text-amber-400 text-xs">✔</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offer Highlight Box */}
              <div
                className="mt-3.5 p-3 rounded-2xl text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.18) 0%, rgba(234, 88, 12, 0.18) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.45)',
                }}
              >
                <p className="text-xs sm:text-[13px] font-bold text-amber-100 leading-snug">
                  Special Diwali Offer — Contact Us for Your Best Painting Quote!
                </p>
                <p className="text-[10px] text-amber-200/80 mt-0.5">
                  Munnalal Painter · Gorakhpur & Nearby Areas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                {/* 1. Get Free Quotation (WhatsApp) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-autofocus="true"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 transition-all shadow-lg hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300"
                  style={{
                    background: 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #f59e0b 100%)',
                    boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)',
                  }}
                  onClick={() => {
                    // Mark action taken & close after brief moment
                    markAsShown();
                  }}
                >
                  <span className="text-base">💬</span>
                  <span>Get Free Quotation</span>
                </a>

                {/* 2. Explore Services */}
                <button
                  type="button"
                  onClick={handleExploreServices}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-amber-200 hover:text-white bg-white/5 hover:bg-white/10 border border-amber-400/30 hover:border-amber-400 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <span>Explore Services</span>
                  <span>→</span>
                </button>
              </div>

              {/* Trust Footer Note */}
              <p className="text-[10px] text-amber-200/60 text-center mt-3">
                15+ Years Experience · On-Time Completion · Premium Quality Paints
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DiwaliPopup;
