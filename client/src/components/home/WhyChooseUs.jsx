import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from '../ui/SectionHeader';

const reasons = [
  { icon: '🏆', title: '15+ Years Experience', desc: 'Over a decade and a half of professional painting experience in Gorakhpur and surrounding areas.', color: '#fef3e2' },
  { icon: '🎨', title: 'Premium Quality Paints', desc: 'We use only top brands like Asian Paints, Berger, Nerolac and Dulux for long-lasting, beautiful results.', color: '#e8f4fd' },
  { icon: '💰', title: 'Competitive Pricing', desc: 'Transparent, affordable pricing with no hidden charges. Free detailed written quotations before starting work.', color: '#e8fdf0' },
  { icon: '⏰', title: 'On-Time Completion', desc: 'We respect your time. Our projects are always completed within the committed timeframe without compromising quality.', color: '#f3e8fd' },
  { icon: '🛡️', title: '1-Year Warranty', desc: 'All painting work comes with a 1-year workmanship warranty. Waterproofing carries a 5-year guarantee.', color: '#fde8e8' },
  { icon: '🧹', title: 'Clean & Tidy Work', desc: 'We protect your furniture, clean up completely after every job, and leave your space spotless and paint-ready.', color: '#e8f8fd' },
  { icon: '👨🎨', title: 'Expert Painters', desc: 'Our team consists of trained, experienced, and background-verified professional painters.', color: '#fdf8e8' },
  { icon: '📋', title: 'Free Consultation', desc: 'Get expert color consultation and advice on the best paints for your specific requirements at no charge.', color: '#fdf0e8' },
];

const WhyChooseUs = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding" style={{ background: 'var(--color-surface-2)' }}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              badge="🌟 Why Choose Us"
              title="Gorakhpur's Most"
              titleHighlight="Trusted Painters"
              subtitle="We combine 15+ years of expertise with premium materials and professional ethics to deliver results that exceed your expectations."
              center={false}
            />
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
                <span className="text-[#d4a017]">✓</span>
                <span className="text-sm font-medium text-[var(--color-text)]">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
                <span className="text-[#d4a017]">✓</span>
                <span className="text-sm font-medium text-[var(--color-text)]">Licensed Contractor</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
                <span className="text-[#d4a017]">✓</span>
                <span className="text-sm font-medium text-[var(--color-text)]">Insured Workers</span>
              </div>
            </div>
          </div>

          <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3" style={{ background: reason.color }}>
                  {reason.icon}
                </div>
                <h3 className="font-bold text-[var(--color-text)] text-sm mb-1">{reason.title}</h3>
                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
