import SectionHeader from '../ui/SectionHeader';
import { SEO_CONFIG } from '../../utils/seo';
import { Link } from 'react-router-dom';

const MapSection = () => (
  <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
    <div className="container-custom">
      <SectionHeader
        badge="📍 Find Us"
        title="Visit Us In"
        titleHighlight="Gorakhpur"
        subtitle="We serve all areas of Gorakhpur and nearby districts. Our team is ready to visit your location for a free on-site estimate."
      />

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '2px solid var(--color-border)', height: '450px' }}>
            <iframe
              src={SEO_CONFIG.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Munnalal Painter Location - Gorakhpur"
            />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: '📍', title: 'Our Location', info: SEO_CONFIG.address },
            { icon: '📞', title: 'Phone', info: SEO_CONFIG.phone, href: `tel:${SEO_CONFIG.phone}` },
            { icon: '💬', title: 'WhatsApp', info: SEO_CONFIG.whatsapp, href: `https://wa.me/${SEO_CONFIG.whatsapp.replace(/[^0-9]/g, '')}` },
            { icon: '✉️', title: 'Email', info: SEO_CONFIG.email, href: `mailto:${SEO_CONFIG.email}` },
            { icon: '🕐', title: 'Working Hours', info: 'Mon-Sat: 8am - 8pm\nSunday: 9am - 6pm' },
          ].map((item) => (
            <div key={item.title} className="card p-4 flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-[var(--color-text)] text-sm mb-0.5">{item.title}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-[#d4a017] text-sm hover:underline whitespace-pre-line">{item.info}</a>
                ) : (
                  <p className="text-[var(--color-text-muted)] text-sm whitespace-pre-line">{item.info}</p>
                )}
              </div>
            </div>
          ))}

          <Link to="/free-estimate" className="btn-primary w-full justify-center">
            🎨 Get Free On-Site Estimate
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default MapSection;
