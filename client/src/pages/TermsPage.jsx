import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';

const TermsPage = () => (
  <>
    <SEOHead title="Terms & Conditions - Munnalal Painter" description="Terms and Conditions for Munnalal Painter painting services in Gorakhpur." canonical="/terms-conditions" noIndex />
    <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
      <div className="container-custom py-16">
        <Breadcrumb items={[{ name: 'Terms & Conditions', href: '/terms-conditions' }]} />
        <h1 className="text-4xl font-black text-white mt-4" style={{ fontFamily: 'Playfair Display, serif' }}>Terms & <span className="text-gradient-gold">Conditions</span></h1>
      </div>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
    </div>
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom max-w-4xl">
        <p className="text-[var(--color-text-muted)] mb-8">Last updated: January 1, 2024</p>
        {[{ title: '1. Services', content: 'Munnalal Painter provides professional painting, waterproofing, POP design, and related services in Gorakhpur and surrounding areas. All services are subject to availability and prior scheduling.' }, { title: '2. Estimates & Pricing', content: 'Free estimates are provided without obligation. Final pricing is confirmed in a written quotation before work begins. We do not charge hidden fees. Any additional work beyond the original scope will be quoted separately.' }, { title: '3. Payment Terms', content: 'Payment terms are agreed upon in the service contract. Typically, 30% advance is required to begin work, 40% upon completion of major work, and the remaining 30% upon final completion. We accept cash, bank transfer, and UPI.' }, { title: '4. Warranty', content: 'We provide a 1-year workmanship warranty on all painting services. The paint manufacturer warranty (5-7 years) is separate. Warranty is void if damage occurs due to water seepage, structural issues, or misuse.' }, { title: '5. Cancellation', content: 'You may cancel a scheduled service 48 hours before the start date without penalty. Cancellations within 48 hours may incur a nominal cancellation fee to cover mobilization costs.' }, { title: '6. Liability', content: 'Munnalal Painter is not liable for damages arising from pre-existing structural issues, customer-supplied materials, or events beyond our control. Our liability is limited to the value of services provided.' }, { title: '7. Governing Law', content: 'These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Gorakhpur, Uttar Pradesh.' }].map(s => (
          <div key={s.title} className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-3">{s.title}</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default TermsPage;
