import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICES, SERVICE_AREAS } from '../../utils/constants';
import { SEO_CONFIG } from '../../utils/seo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden mt-0" style={{ background: 'linear-gradient(180deg, #0d1f3c 0%, #071020 100%)' }}>
      {/* Decorative top border */}
      <div className="h-1 w-full gradient-gold" />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-[#1a1a2e] font-black text-2xl">
                M
              </div>
              <div>
                <div className="text-white font-black text-lg">Munnalal</div>
                <div className="text-[#d4a017] text-xs font-semibold tracking-widest uppercase">Painter</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Gorakhpur's most trusted painting contractor with 15+ years of experience in house, interior, exterior, texture painting and waterproofing.
            </p>
            <div className="space-y-2">
              <a href={`tel:${SEO_CONFIG.phone}`} className="flex items-center gap-2 text-white/70 hover:text-[#d4a017] transition-colors text-sm">
                📞 {SEO_CONFIG.phone}
              </a>
              <a href={`https://wa.me/${SEO_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-[#25D366] transition-colors text-sm">
                💬 WhatsApp Us
              </a>
              <a href={`mailto:${SEO_CONFIG.email}`} className="flex items-center gap-2 text-white/70 hover:text-[#d4a017] transition-colors text-sm">
                ✉️ {SEO_CONFIG.email}
              </a>
              <p className="flex items-start gap-2 text-white/70 text-sm">
                📍 {SEO_CONFIG.address}
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 gradient-gold rounded" />
              Our Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="flex items-center gap-2 text-white/60 hover:text-[#d4a017] transition-colors text-sm"
                  >
                    <span className="text-[#d4a017] text-xs">›</span>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 gradient-gold rounded" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Projects', href: '/projects' },
                { label: 'Blog', href: '/blog' },
                { label: 'Customer Reviews', href: '/reviews' },
                { label: 'FAQs', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Free Estimate', href: '/free-estimate' },
                { label: 'Service Areas', href: '/service-areas' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms-conditions' },
                { label: 'Admin Login 🔒', href: '/admin' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-white/60 hover:text-[#d4a017] transition-colors text-sm"
                  >
                    <span className="text-[#d4a017] text-xs">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 gradient-gold rounded" />
              Service Areas
            </h3>
            <div className="space-y-4">
              {SERVICE_AREAS.map((region) => (
                <div key={region.name}>
                  <p className="text-[#d4a017] text-xs font-semibold uppercase tracking-wider mb-2">{region.name}</p>
                  <p className="text-white/60 text-sm">{region.areas.slice(0, 5).join(' · ')}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
              <p className="text-[#d4a017] font-semibold text-sm mb-2">🚀 Get Free Estimate</p>
              <p className="text-white/60 text-xs mb-3">Professional painters available within 24 hours</p>
              <Link to="/free-estimate" className="btn-primary text-xs py-2 px-4 w-full justify-center">
                Request Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {currentYear} Munnalal Painter. All rights reserved.</p>
          <p className="text-center">
            Painter in Gorakhpur | House Painting | Interior Painting | Exterior Painting | Texture Painting
          </p>
          <p>Made with ❤️ in Gorakhpur, UP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
