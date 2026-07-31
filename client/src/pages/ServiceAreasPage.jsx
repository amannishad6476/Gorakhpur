import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import SectionHeader from '../components/ui/SectionHeader';
import { SERVICE_AREAS } from '../utils/constants';
import { SERVICES } from '../utils/constants';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const nearbyAreas = [
  { name: 'Civil Lines', city: 'Gorakhpur', desc: 'Premium residential area with apartments and independent homes' },
  { name: 'Rapti Nagar', city: 'Gorakhpur', desc: 'Fast-growing residential colony with new construction' },
  { name: 'Golghar', city: 'Gorakhpur', desc: 'Commercial and residential hub of Gorakhpur' },
  { name: 'Shastri Nagar', city: 'Gorakhpur', desc: 'Well-established residential area' },
  { name: 'Basharatpur', city: 'Gorakhpur', desc: 'Busy locality with diverse property types' },
  { name: 'Bargadwa', city: 'Gorakhpur', desc: 'Rapidly developing area with modern housing' },
  { name: 'Sahjanwa', city: 'Gorakhpur District', desc: 'Tehsil headquarters with extensive residential needs' },
  { name: 'Deoria', city: 'Deoria District', desc: 'Nearby district capital - 45 min from Gorakhpur' },
  { name: 'Kushinagar', city: 'Kushinagar District', desc: 'Tourist district - 60 min from Gorakhpur' },
  { name: 'Maharajganj', city: 'Maharajganj District', desc: 'Border district - excellent connectivity' },
  { name: 'Basti', city: 'Basti District', desc: 'Division headquarters - 90 min from Gorakhpur' },
  { name: 'Siddharthnagar', city: 'Siddharthnagar District', desc: 'Rapidly developing district headquarters' },
];

const ServiceAreasPage = () => (
  <>
    <SEOHead
      title="Painter Service Areas - Gorakhpur, Deoria, Kushinagar & Nearby"
      description="Munnalal Painter serves all of Gorakhpur city, district, and surrounding areas including Deoria, Kushinagar, Maharajganj, Basti, Siddharthnagar. Best painter in Eastern UP."
      canonical="/service-areas"
      breadcrumbs={[{ name: 'Service Areas', href: '/service-areas' }]}
    />
    <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
      <div className="container-custom py-16">
        <Breadcrumb items={[{ name: 'Service Areas', href: '/service-areas' }]} />
        <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our <span className="text-gradient-gold">Service Areas</span></h1>
        <p className="text-white/70 text-lg max-w-2xl">Professional painting services across Gorakhpur, Eastern UP, and all nearby districts.</p>
      </div>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
    </div>
    <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
      <div className="container-custom">
        <SectionHeader badge="📍 Coverage" title="Areas We" titleHighlight="Serve" subtitle="We provide painting services across all major areas of Gorakhpur and surrounding districts." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {nearbyAreas.map((area, i) => (
            <motion.div key={area.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <h2 className="font-bold text-[var(--color-text)] mb-0.5">{area.name}</h2>
                  <p className="text-[#d4a017] text-sm font-medium mb-1">{area.city}</p>
                  <p className="text-[var(--color-text-muted)] text-sm">{area.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="card p-8 text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Don't See Your Area?</h3>
          <p className="text-[var(--color-text-muted)] mb-6">We serve all areas within 50 km of Gorakhpur. Contact us to confirm availability in your location.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">📞 Contact Us</Link>
            <Link to="/free-estimate" className="btn-secondary text-[var(--color-text)]" style={{ borderColor: 'var(--color-border)' }}>Get Free Estimate</Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default ServiceAreasPage;
