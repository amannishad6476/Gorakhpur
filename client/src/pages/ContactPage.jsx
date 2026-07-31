import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import ContactForm from '../components/forms/ContactForm';
import { SEO_CONFIG } from '../utils/seo';
import MapSection from '../components/home/MapSection';

const ContactPage = () => (
  <>
    <SEOHead
      title="Contact Us - Painter in Gorakhpur | Munnalal Painter"
      description="Contact Munnalal Painter for professional painting services in Gorakhpur. Call +91-9876543210, WhatsApp, or fill the form. Free estimate available."
      canonical="/contact"
      breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
    />
    <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
      <div className="container-custom py-16">
        <Breadcrumb items={[{ name: 'Contact', href: '/contact' }]} />
        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Get In <span className="text-gradient-gold">Touch</span></h1>
        <p className="text-white/70 text-lg max-w-2xl">Have a project in mind? We'd love to help. Send us a message and we'll get back to you within 24 hours.</p>
      </div>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
    </div>
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Contact Info</h2>
            {[
              { icon: '📍', title: 'Our Address', info: SEO_CONFIG.address },
              { icon: '📞', title: 'Phone', info: SEO_CONFIG.phone, href: `tel:${SEO_CONFIG.phone}` },
              { icon: '💬', title: 'WhatsApp', info: 'Chat with us', href: `https://wa.me/${SEO_CONFIG.whatsapp}` },
              { icon: '✉️', title: 'Email', info: SEO_CONFIG.email, href: `mailto:${SEO_CONFIG.email}` },
              { icon: '⏰', title: 'Working Hours', info: 'Mon-Sat: 8am-8pm\nSunday: 9am-6pm' },
            ].map(item => (
              <div key={item.title} className="card p-4 flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm mb-0.5">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} className="text-[#d4a017] text-sm hover:underline whitespace-pre-line">{item.info}</a>
                  ) : (
                    <p className="text-[var(--color-text-muted)] text-sm whitespace-pre-line">{item.info}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <MapSection />
  </>
);

export default ContactPage;
