import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import EstimateForm from '../components/forms/EstimateForm';

const FreeEstimatePage = () => (
  <>
    <SEOHead
      title="Free Painting Estimate in Gorakhpur | Munnalal Painter"
      description="Get a free painting estimate in Gorakhpur from Munnalal Painter. No obligation. Fill the form and our expert will visit within 24 hours."
      canonical="/free-estimate"
      breadcrumbs={[{ name: 'Free Estimate', href: '/free-estimate' }]}
    />
    <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
      <div className="container-custom py-16">
        <Breadcrumb items={[{ name: 'Free Estimate', href: '/free-estimate' }]} />
        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Get Your <span className="text-gradient-gold">Free Estimate</span></h1>
        <p className="text-white/70 text-lg max-w-2xl">Fill the form below and our expert painter will contact you within 24 hours with a detailed, transparent estimate — no obligation, no hidden charges.</p>
      </div>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
    </div>
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[{ icon: '📞', text: 'Call within 24 hours' }, { icon: '✔️', text: 'Free site visit' }, { icon: '📋', text: 'Detailed written quote' }].map(item => (
              <div key={item.text} className="text-center card p-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-[var(--color-text)] text-xs font-medium">{item.text}</p>
              </div>
            ))}
          </div>
          <EstimateForm />
        </div>
      </div>
    </section>
  </>
);

export default FreeEstimatePage;
