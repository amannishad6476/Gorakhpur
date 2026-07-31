import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { SERVICES } from '../../utils/constants';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  const isTransparent = location.pathname === '/' && !isScrolled && !mobileOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent'
            : 'backdrop-blur-xl shadow-lg'
        }`}
        style={!isTransparent ? {
          background: isDark
            ? 'rgba(15,23,40,0.95)'
            : 'rgba(255,255,255,0.97)',
          borderBottom: '1px solid var(--color-border)',
        } : {}}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-[#1a1a2e] font-black text-xl shadow-md group-hover:scale-110 transition-transform">
                M
              </div>
              <div className="leading-tight">
                <div className={`font-black text-base tracking-tight ${isTransparent ? 'text-white' : 'text-[var(--color-text)]'}`}>
                  Munnalal
                </div>
                <div className="text-[#d4a017] text-xs font-semibold tracking-widest uppercase">
                  Painter
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
              ].map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#d4a017] bg-[rgba(212,160,23,0.1)]'
                        : isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Services Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    location.pathname.startsWith('/services')
                      ? 'text-[#d4a017] bg-[rgba(212,160,23,0.1)]'
                      : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                  }`}
                >
                  Services
                  <motion.span
                    animate={{ rotate: servicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs"
                  >
                    ▾
                  </motion.span>
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                      className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-xl overflow-hidden z-50"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="p-2">
                        <Link
                          to="/services"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#d4a017] hover:bg-[rgba(212,160,23,0.1)] transition-colors"
                        >
                          🎯 All Services
                        </Link>
                        <div className="my-1 border-t border-[var(--color-border)]" />
                        {SERVICES.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-colors"
                          >
                            <span>{s.icon}</span>
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { label: 'Gallery', href: '/gallery' },
                { label: 'Blog', href: '/blog' },
                { label: 'Reviews', href: '/reviews' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#d4a017] bg-[rgba(212,160,23,0.1)]'
                        : isTransparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isTransparent
                    ? 'text-white/80 hover:bg-white/10'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              {/* Admin Panel Button */}
              <Link
                to="/admin"
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all rounded-lg border ${
                  isTransparent
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[#d4a017] hover:border-[#d4a017] hover:bg-[var(--color-surface-2)]'
                }`}
                title="Go to Admin Panel"
              >
                🔒 Admin
              </Link>

              {/* Free Estimate CTA */}
              <Link
                to="/free-estimate"
                className="hidden lg:flex btn-primary text-sm py-2.5 px-5"
              >
                Free Estimate
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                }`}
                aria-label="Toggle menu"
              >
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-0.5 bg-current rounded"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block w-5 h-0.5 bg-current rounded"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-0.5 bg-current rounded"
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden pt-16"
            style={{ background: 'var(--color-surface)' }}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-1">
                {[
                  { label: '🏠 Home', href: '/' },
                  { label: '👥 About Us', href: '/about' },
                  { label: '🎨 All Services', href: '/services' },
                  ...SERVICES.map((s) => ({ label: `  ${s.icon} ${s.title}`, href: `/services/${s.slug}` })),
                  { label: '🖼️ Gallery', href: '/gallery' },
                  { label: '🏗️ Projects', href: '/projects' },
                  { label: '📝 Blog', href: '/blog' },
                  { label: '⭐ Reviews', href: '/reviews' },
                  { label: '❓ FAQs', href: '/faq' },
                  { label: '📞 Contact', href: '/contact' },
                  { label: '📍 Service Areas', href: '/service-areas' },
                  { label: '🔒 Admin Panel', href: '/admin' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center px-4 py-3 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-surface-2)] hover:text-[#d4a017] transition-all text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <Link to="/free-estimate" className="btn-primary w-full justify-center">
                  Get Free Estimate
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
