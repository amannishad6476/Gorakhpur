import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '../../api/axiosInstance';
import { SEO_CONFIG } from '../../utils/seo';

const STORAGE_PREFIX = 'festival_popup_shown_';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const FESTIVAL_THEMES = {
  diwali: {
    id: 'diwali',
    name: 'Diwali',
    bgGradient: 'radial-gradient(circle at 50% 0%, #6b0716 0%, #400109 55%, #1f0005 100%)',
    borderColor: '#d4a017',
    glowColor: 'rgba(212, 160, 23, 0.45)',
    headingGradient: 'linear-gradient(135deg, #fffbeb 0%, #ffd700 45%, #f59e0b 80%, #d4a017 100%)',
    badgeText: '✨ DIWALI SPECIAL CELEBRATION ✨',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
    badgeColor: '#fef08a',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(245, 158, 11, 0.25)',
    primaryBtnBg: 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #f59e0b 100%)',
    primaryBtnText: '#0f172a',
    accentText: '#fde047',
    iconType: 'diwali',
    lightColors: ['#ffd700', '#f97316', '#facc15', '#ea580c', '#ffd700', '#f97316', '#facc15'],
  },
  holi: {
    id: 'holi',
    name: 'Holi',
    bgGradient: 'radial-gradient(circle at 50% 0%, #701a75 0%, #4a044e 50%, #1e1b4b 100%)',
    borderColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    headingGradient: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 35%, #f59e0b 70%, #38bdf8 100%)',
    badgeText: '🎨 RANGOTSAV CELEBRATION 🎨',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeBorder: 'rgba(244, 63, 94, 0.4)',
    badgeColor: '#fce7f3',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    primaryBtnBg: 'linear-gradient(135deg, #fb7185 0%, #ec4899 50%, #f59e0b 100%)',
    primaryBtnText: '#ffffff',
    accentText: '#f472b6',
    iconType: 'holi',
    lightColors: ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'],
  },
  navratri: {
    id: 'navratri',
    name: 'Dussehra / Navratri',
    bgGradient: 'radial-gradient(circle at 50% 0%, #7c2d12 0%, #431407 55%, #1c0a02 100%)',
    borderColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    headingGradient: 'linear-gradient(135deg, #ffedd5 0%, #fb923c 45%, #ea580c 80%, #facc15 100%)',
    badgeText: '🔱 SHUBH NAVRATRI & DUSSEHRA 🔱',
    badgeBg: 'rgba(234, 88, 12, 0.2)',
    badgeBorder: 'rgba(234, 88, 12, 0.4)',
    badgeColor: '#fed7aa',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(249, 115, 22, 0.3)',
    primaryBtnBg: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 50%, #ea580c 100%)',
    primaryBtnText: '#431407',
    accentText: '#fb923c',
    iconType: 'navratri',
    lightColors: ['#f97316', '#facc15', '#ea580c', '#ffd700', '#f97316', '#facc15', '#ea580c'],
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas',
    bgGradient: 'radial-gradient(circle at 50% 0%, #064e3b 0%, #022c22 55%, #051a14 100%)',
    borderColor: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.4)',
    headingGradient: 'linear-gradient(135deg, #ffffff 0%, #fecdd3 40%, #fb7185 75%, #fde047 100%)',
    badgeText: '🎄 MERRY CHRISTMAS & NEW YEAR 🎄',
    badgeBg: 'rgba(225, 29, 72, 0.2)',
    badgeBorder: 'rgba(225, 29, 72, 0.4)',
    badgeColor: '#ffe4e6',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(225, 29, 72, 0.3)',
    primaryBtnBg: 'linear-gradient(135deg, #ffe4e6 0%, #f43f5e 50%, #be123c 100%)',
    primaryBtnText: '#ffffff',
    accentText: '#fda4af',
    iconType: 'christmas',
    lightColors: ['#e11d48', '#10b981', '#fbbf24', '#ffffff', '#e11d48', '#10b981', '#fbbf24'],
  },
  eid: {
    id: 'eid',
    name: 'Eid',
    bgGradient: 'radial-gradient(circle at 50% 0%, #064e3b 0%, #022c22 55%, #021e17 100%)',
    borderColor: '#d4a017',
    glowColor: 'rgba(212, 160, 23, 0.45)',
    headingGradient: 'linear-gradient(135deg, #f0fdf4 0%, #86efac 40%, #ffd700 80%, #f59e0b 100%)',
    badgeText: '🌙 EID MUBARAK SPECIAL 🌙',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeBorder: 'rgba(212, 160, 23, 0.4)',
    badgeColor: '#bbf7d0',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(212, 160, 23, 0.3)',
    primaryBtnBg: 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #d4a017 100%)',
    primaryBtnText: '#064e3b',
    accentText: '#86efac',
    iconType: 'eid',
    lightColors: ['#10b981', '#facc15', '#34d399', '#ffd700', '#10b981', '#facc15', '#34d399'],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    bgGradient: 'radial-gradient(circle at 50% 0%, #1e3a5f 0%, #0f172a 60%, #030712 100%)',
    borderColor: '#d4a017',
    glowColor: 'rgba(212, 160, 23, 0.35)',
    headingGradient: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #d4a017 100%)',
    badgeText: '🎉 SPECIAL PROMOTIONAL OFFER 🎉',
    badgeBg: 'rgba(212, 160, 23, 0.15)',
    badgeBorder: 'rgba(212, 160, 23, 0.35)',
    badgeColor: '#fef08a',
    cardBg: 'rgba(0, 0, 0, 0.35)',
    cardBorder: 'rgba(212, 160, 23, 0.25)',
    primaryBtnBg: 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #d4a017 100%)',
    primaryBtnText: '#0f172a',
    accentText: '#fde047',
    iconType: 'custom',
    lightColors: ['#38bdf8', '#facc15', '#818cf8', '#ffd700', '#38bdf8', '#facc15', '#818cf8'],
  },
};

// In-memory tracker for private browsing / storage fallback
const sessionShownOffers = new Set();

const hasBeenShownToday = (offerId) => {
  if (sessionShownOffers.has(offerId)) return true;
  try {
    const key = `${STORAGE_PREFIX}${offerId}`;
    const lastShown = localStorage.getItem(key);
    if (!lastShown) return false;
    const time = parseInt(lastShown, 10);
    if (isNaN(time)) return false;
    return Date.now() - time < ONE_DAY_MS;
  } catch {
    try {
      return sessionStorage.getItem(`${STORAGE_PREFIX}${offerId}`) === 'true';
    } catch {
      return sessionShownOffers.has(offerId);
    }
  }
};

const markAsShown = (offerId) => {
  sessionShownOffers.add(offerId);
  try {
    const key = `${STORAGE_PREFIX}${offerId}`;
    localStorage.setItem(key, Date.now().toString());
  } catch {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${offerId}`, 'true');
    } catch {
      // Safe no-op
    }
  }
};

const FestivalPopup = ({ isPreview = false, previewData = null, onClose }) => {
  const [activeOffer, setActiveOffer] = useState(previewData);
  const [isOpen, setIsOpen] = useState(isPreview);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // If in preview mode, react to changes in previewData prop
  useEffect(() => {
    if (isPreview) {
      setActiveOffer(previewData);
      setIsOpen(true);
    }
  }, [isPreview, previewData]);

  // If running in live website mode, fetch active campaign from backend
  useEffect(() => {
    if (isPreview) return;

    let isMounted = true;
    const fetchActiveOffer = async () => {
      try {
        const res = await api.get('/festival-offers/active');
        if (!isMounted) return;

        const offer = res.data?.data;
        if (!offer || !offer._id) {
          return;
        }

        // Validate client-side date boundary as additional safeguard
        const now = Date.now();
        const start = new Date(offer.startDate).getTime();
        const end = new Date(offer.endDate).getTime();
        if (now < start || now > end) {
          return;
        }

        if (hasBeenShownToday(offer._id)) {
          return;
        }

        setActiveOffer(offer);

        // Open smoothly after a short delay
        const timer = setTimeout(() => {
          if (!isMounted) return;
          if (!hasBeenShownToday(offer._id)) {
            markAsShown(offer._id);
            previousActiveElement.current = document.activeElement;
            setIsOpen(true);
          }
        }, 2200);

        return () => clearTimeout(timer);
      } catch {
        // Fails gracefully without breaking public site
      }
    };

    fetchActiveOffer();
    return () => {
      isMounted = false;
    };
  }, [isPreview]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof onClose === 'function') {
      onClose();
    }
    try {
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    } catch {
      // Safe ignore
    }
  }, [onClose]);

  const handleSecondaryAction = useCallback(() => {
    handleClose();
    const link = activeOffer?.secondaryButtonLink || '/services';
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  }, [handleClose, activeOffer, navigate]);

  // Keyboard navigation & accessibility (Escape key and focus trap)
  useEffect(() => {
    if (!isOpen) return;

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

  const themeConfig = useMemo(() => {
    const rawTheme = (activeOffer?.theme || 'diwali').toLowerCase();
    const baseTheme = FESTIVAL_THEMES[rawTheme] || FESTIVAL_THEMES.diwali;

    if (rawTheme === 'custom' && activeOffer?.customThemeConfig) {
      const { primaryColor, secondaryColor, accentColor, textColor } = activeOffer.customThemeConfig;
      return {
        ...baseTheme,
        bgGradient: `radial-gradient(circle at 50% 0%, ${primaryColor || '#1e3a5f'} 0%, ${secondaryColor || '#0f172a'} 60%, #030712 100%)`,
        borderColor: accentColor || '#d4a017',
        glowColor: `${accentColor || '#d4a017'}55`,
        headingGradient: `linear-gradient(135deg, ${textColor || '#ffffff'} 0%, ${accentColor || '#ffd700'} 100%)`,
        accentText: accentColor || '#ffd700',
      };
    }

    return baseTheme;
  }, [activeOffer]);

  if (!activeOffer) return null;

  const cleanWhatsappNumber = (SEO_CONFIG.whatsapp || '').replace(/[^0-9]/g, '');
  const festivalTitle = activeOffer.festivalName || 'Festival';
  const headingTitle = activeOffer.heading || 'Special Festive Offer';
  const whatsappMessage = encodeURIComponent(
    `Hello Gorakhpur Painter! I am interested in your ${festivalTitle} offer (${headingTitle}). Please provide a free painting quotation for my home.`
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`;

  const defaultServices = [
    'Interior & Exterior Painting',
    'Premium Texture Painting',
    'Wall Putty & Waterproofing',
  ];
  const servicesList = Array.isArray(activeOffer.services) && activeOffer.services.length > 0
    ? activeOffer.services
    : defaultServices;

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
            aria-labelledby="festival-modal-title"
            aria-describedby="festival-modal-desc"
            className="relative w-full max-w-[490px] rounded-3xl overflow-hidden shadow-2xl z-10 my-auto text-white flex flex-col max-h-[92vh]"
            style={{
              background: themeConfig.bgGradient,
              border: `2px solid ${themeConfig.borderColor}`,
              boxShadow: `0 0 45px ${themeConfig.glowColor}, 0 25px 50px -12px rgba(0, 0, 0, 0.85)`,
            }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Decorative Subtle Festive Lights Toran Header */}
            <div className="relative w-full h-8 flex items-center justify-around px-4 bg-gradient-to-b from-black/40 to-transparent border-b border-white/10 select-none pointer-events-none">
              {themeConfig.lightColors.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-[1px] h-2 bg-white/30" />
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
              className="absolute top-2.5 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 hover:border-white/50 flex items-center justify-center text-white/90 hover:text-white transition-all text-base z-20 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Close Promotional Popup"
            >
              ✕
            </button>

            {/* Scrollable Modal Content */}
            <div className="px-5 sm:px-7 pt-2 pb-6 overflow-y-auto overscroll-contain">
              {/* Optional Custom Banner Image */}
              {activeOffer.bannerImage && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-white/15 max-h-36 sm:max-h-40 w-full shadow-md">
                  <img
                    src={activeOffer.bannerImage}
                    alt={activeOffer.heading || 'Festival Banner'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Center Artwork & Festive Badge */}
              <div className="flex flex-col items-center text-center mt-1">
                {/* Festival SVG Artwork if no custom banner, or companion icon */}
                {!activeOffer.bannerImage && (
                  <div className="relative mb-2">
                    {/* 1. Diwali Diya Artwork */}
                    {themeConfig.iconType === 'diwali' && (
                      <svg width="68" height="54" viewBox="0 0 68 54" fill="none" className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" aria-hidden="true">
                        <circle cx="34" cy="18" r="14" fill="#fef08a" opacity="0.4" />
                        <motion.path
                          d="M34 4C34 4 41 14 41 21C41 24.866 37.866 28 34 28C30.134 28 27 24.866 27 21C27 14 34 4 34 4Z"
                          fill="url(#diwaliOuterFlame)"
                          animate={shouldReduceMotion ? {} : { scaleY: [1, 1.08, 0.97, 1.05, 1], scaleX: [1, 0.96, 1.04, 0.98, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ originX: '34px', originY: '28px' }}
                        />
                        <motion.path
                          d="M34 10C34 10 38 16 38 21C38 23.2091 36.2091 25 34 25C31.7909 25 30 23.2091 30 21C30 16 34 10 34 10Z"
                          fill="#ffffff"
                          animate={shouldReduceMotion ? {} : { scaleY: [1, 1.12, 1] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ originX: '34px', originY: '25px' }}
                        />
                        <path d="M10 32C10 32 18 45 34 45C50 45 58 32 58 32C58 32 54 48 34 48C14 48 10 32 10 32Z" fill="#b45309" />
                        <path d="M8 31C8 30 16 29 34 29C52 29 60 30 60 31C60 32.5 52 35 34 35C16 35 8 32.5 8 31Z" fill="#d4a017" />
                        <path d="M24 47C24 47 28 52 34 52C40 52 44 47 44 47H24Z" fill="#854d0e" />
                        <defs>
                          <linearGradient id="diwaliOuterFlame" x1="34" y1="4" x2="34" y2="28" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="40%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}

                    {/* 2. Holi Colorful Palette & Splashes */}
                    {themeConfig.iconType === 'holi' && (
                      <svg width="64" height="52" viewBox="0 0 64 52" fill="none" className="drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" aria-hidden="true">
                        <circle cx="20" cy="18" r="10" fill="#f43f5e" />
                        <circle cx="36" cy="14" r="8" fill="#facc15" />
                        <circle cx="48" cy="22" r="9" fill="#06b6d4" />
                        <circle cx="28" cy="32" r="11" fill="#ec4899" />
                        <circle cx="44" cy="34" r="8" fill="#a855f7" />
                        <path d="M12 40C20 44 44 44 52 40" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )}

                    {/* 3. Navratri Trishul & Flame */}
                    {themeConfig.iconType === 'navratri' && (
                      <svg width="60" height="52" viewBox="0 0 60 52" fill="none" className="drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" aria-hidden="true">
                        <path d="M30 4V48M20 14C20 24 30 28 30 28C30 28 40 24 40 14M20 14L16 8M40 14L44 8" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="30" cy="8" r="4" fill="#ea580c" />
                      </svg>
                    )}

                    {/* 4. Christmas Tree & Star */}
                    {themeConfig.iconType === 'christmas' && (
                      <svg width="60" height="52" viewBox="0 0 60 52" fill="none" className="drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" aria-hidden="true">
                        <polygon points="30,4 33,12 41,12 35,17 37,25 30,20 23,25 25,17 19,12 27,12" fill="#ffd700" />
                        <path d="M30 18L18 32H24L14 44H46L36 32H42L30 18Z" fill="#10b981" />
                        <rect x="27" y="44" width="6" height="7" fill="#b45309" />
                      </svg>
                    )}

                    {/* 5. Eid Crescent Moon & Star */}
                    {themeConfig.iconType === 'eid' && (
                      <svg width="60" height="52" viewBox="0 0 60 52" fill="none" className="drop-shadow-[0_0_12px_rgba(212,160,23,0.6)]" aria-hidden="true">
                        <path d="M36 8C26 10 18 19 18 30C18 41 27 50 39 49C30 46 25 38 25 29C25 20 30 12 36 8Z" fill="#ffd700" />
                        <polygon points="42,16 44,21 49,21 45,24 47,29 42,26 37,29 39,24 35,21 40,21" fill="#fef08a" />
                      </svg>
                    )}

                    {/* 6. Custom Sparkle & Paintbrush */}
                    {themeConfig.iconType === 'custom' && (
                      <svg width="60" height="52" viewBox="0 0 60 52" fill="none" className="drop-shadow-[0_0_12px_rgba(212,160,23,0.6)]" aria-hidden="true">
                        <circle cx="30" cy="26" r="16" fill="url(#customGlow)" opacity="0.3" />
                        <path d="M22 34L38 18M38 18L42 22M38 18L34 14M22 34L18 38C17 39 19 41 20 40L24 36M22 34L24 36" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="42" cy="14" r="3" fill="#38bdf8" />
                        <circle cx="16" cy="20" r="2.5" fill="#f43f5e" />
                        <defs>
                          <radialGradient id="customGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="transparent" />
                          </radialGradient>
                        </defs>
                      </svg>
                    )}
                  </div>
                )}

                {/* Subdued Festive Pill */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-1.5"
                  style={{
                    backgroundColor: themeConfig.badgeBg,
                    border: `1px solid ${themeConfig.badgeBorder}`,
                    color: themeConfig.badgeColor,
                  }}
                >
                  <span>{themeConfig.badgeText}</span>
                </div>

                {/* Main Heading */}
                <h2
                  id="festival-modal-title"
                  className="font-black text-2xl sm:text-3xl tracking-tight leading-tight uppercase"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: themeConfig.headingGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: `0 2px 14px ${themeConfig.glowColor}`,
                  }}
                >
                  {activeOffer.heading}
                </h2>

                {/* Subheading / Description */}
                {activeOffer.subheading && (
                  <p
                    id="festival-modal-desc"
                    className="text-white/90 font-medium text-xs sm:text-sm mt-1 max-w-[380px]"
                  >
                    {activeOffer.subheading}
                  </p>
                )}

                {/* Optional Discount Badge (only displayed when explicitly entered by admin) */}
                {activeOffer.discountText && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/30 text-xs sm:text-sm font-bold text-amber-200 shadow-sm animate-pulse">
                    <span>🏷️</span>
                    <span>{activeOffer.discountText}</span>
                  </div>
                )}
              </div>

              {/* Services Highlighted Card */}
              <div
                className="mt-3.5 p-3 rounded-2xl backdrop-blur-md"
                style={{
                  backgroundColor: themeConfig.cardBg,
                  border: `1px solid ${themeConfig.cardBorder}`,
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-center text-white/80">
                  Featured Festive Painting Services
                </p>
                <div className="space-y-1.5">
                  {servicesList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 font-medium"
                    >
                      <span className="text-sm select-none" aria-hidden="true">
                        🎨
                      </span>
                      <span>{item}</span>
                      <span className="ml-auto text-xs" style={{ color: themeConfig.accentText }}>
                        ✔
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offer Highlight Box */}
              {activeOffer.offerMessage && (
                <div
                  className="mt-3 p-3 rounded-2xl text-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                    border: `1px solid ${themeConfig.cardBorder}`,
                  }}
                >
                  <p className="text-xs sm:text-[13px] font-bold text-white leading-snug">
                    {activeOffer.offerMessage}
                  </p>
                  <p className="text-[10px] text-white/70 mt-0.5">
                    Munnalal Painter · Gorakhpur & Nearby Areas
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                {/* 1. Primary Action (WhatsApp or Quotation) */}
                {activeOffer.showWhatsappButton !== false ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-autofocus="true"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white"
                    style={{
                      background: themeConfig.primaryBtnBg,
                      color: themeConfig.primaryBtnText,
                      boxShadow: `0 4px 18px ${themeConfig.glowColor}`,
                    }}
                    onClick={() => {
                      if (!isPreview && activeOffer._id) {
                        markAsShown(activeOffer._id);
                      }
                    }}
                  >
                    <span className="text-base">💬</span>
                    <span>{activeOffer.primaryButtonLabel || 'Get Free Quotation'}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    data-autofocus="true"
                    onClick={() => {
                      handleClose();
                      navigate('/free-estimate');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white"
                    style={{
                      background: themeConfig.primaryBtnBg,
                      color: themeConfig.primaryBtnText,
                    }}
                  >
                    <span>📋</span>
                    <span>{activeOffer.primaryButtonLabel || 'Get Free Quotation'}</span>
                  </button>
                )}

                {/* 2. Secondary Action */}
                <button
                  type="button"
                  onClick={handleSecondaryAction}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>{activeOffer.secondaryButtonLabel || 'Explore Services'}</span>
                  <span>→</span>
                </button>
              </div>

              {/* Trust Footer Note */}
              <p className="text-[10px] text-white/50 text-center mt-3">
                15+ Years Experience · On-Time Completion · Premium Quality Paints
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FestivalPopup;
