import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';

const PrivacyPolicyPage = () => (
  <>
    <SEOHead title="Privacy Policy - Munnalal Painter" description="Privacy Policy for Munnalal Painter. How we collect, use and protect your personal information." canonical="/privacy-policy" noIndex />
    <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
      <div className="container-custom py-16">
        <Breadcrumb items={[{ name: 'Privacy Policy', href: '/privacy-policy' }]} />
        <h1 className="text-4xl font-black text-white mt-4" style={{ fontFamily: 'Playfair Display, serif' }}>Privacy <span className="text-gradient-gold">Policy</span></h1>
      </div>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
    </div>
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom max-w-4xl prose prose-slate dark:prose-invert max-w-none">
        <p className="text-[var(--color-text-muted)]">Last updated: January 1, 2024</p>
        {[{ title: '1. Information We Collect', content: 'We collect information you provide when you fill contact forms, estimate requests, or submit reviews. This includes name, email address, phone number, and address. We also automatically collect IP address and browser information for security purposes.' }, { title: '2. How We Use Your Information', content: 'We use your information to respond to your enquiries, provide painting service estimates, send relevant service information, improve our website, and for internal record keeping.' }, { title: '3. Information Security', content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is stored securely on encrypted servers.' }, { title: '4. Cookies', content: 'Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some website functionality.' }, { title: '5. Third Party Sharing', content: 'We do not sell, trade, or share your personal information with third parties except when required by law or to protect our rights. We may share anonymized statistical data.' }, { title: '6. Your Rights', content: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, contact us at info@munnalalpainter.com.' }, { title: '7. Contact Us', content: 'If you have questions about this privacy policy, contact us at: Munnalal Painter, Near Railway Station, Gorakhpur, UP 273001. Email: info@munnalalpainter.com. Phone: +91-9876543210.' }].map(section => (
          <div key={section.title} className="mb-8">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-3">{section.title}</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default PrivacyPolicyPage;
