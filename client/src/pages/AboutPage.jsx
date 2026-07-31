import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import SectionHeader from '../components/ui/SectionHeader';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SEO_CONFIG } from '../utils/seo';

const milestones = [
  { year: '2009', event: 'Munnalal Painter Founded', desc: 'Started with a small team of 3 painters serving Gorakhpur city.' },
  { year: '2012', event: 'Expanded to Texture Painting', desc: 'Introduced texture and designer painting services to Gorakhpur.' },
  { year: '2015', event: '500 Projects Milestone', desc: 'Completed 500+ successful projects across Gorakhpur.' },
  { year: '2018', event: 'Waterproofing Division', desc: 'Launched dedicated waterproofing and POP design services.' },
  { year: '2021', event: '1500+ Projects Done', desc: 'Expanded service to 8+ districts in Eastern UP.' },
  { year: '2024', event: '2500+ Happy Clients', desc: 'Serving 12+ cities with a team of 50+ professional painters.' },
];

const team = [
  { name: 'Munnalal Ji', role: 'Founder & Master Painter', exp: '25+ years', icon: '👨🎨' },
  { name: 'Ramesh Kumar', role: 'Senior Interior Specialist', exp: '18+ years', icon: '👨🔧' },
  { name: 'Suresh Yadav', role: 'Texture & POP Expert', exp: '14+ years', icon: '👨🏫' },
  { name: 'Amit Singh', role: 'Waterproofing Specialist', exp: '12+ years', icon: '👨💼' },
];

const AboutPage = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <SEOHead
        title="About Us - 15+ Years of Painting Excellence in Gorakhpur"
        description="Learn about Munnalal Painter - Gorakhpur's trusted painting contractor since 2009. 15+ years experience, 2500+ projects, 1800+ happy clients across Gorakhpur, UP."
        canonical="/about"
        breadcrumbs={[{ name: 'About Us', href: '/about' }]}
      />

      {/* Hero */}
      <div className="pt-20 pb-0" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'About Us', href: '/about' }]} />
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            About <span className="text-gradient-gold">Munnalal Painter</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Gorakhpur's most trusted painting service since 2009. We bring your vision to life with colors that last.
          </p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" />
        </svg>
      </div>

      {/* Story */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader badge="🏠 Our Story" title="15 Years of" titleHighlight="Painting Excellence" center={false} />
              <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                <p>Founded in 2009 by Munnalal Ji, our painting company began with a simple mission: to provide the highest quality painting services to the people of Gorakhpur at honest, affordable prices.</p>
                <p>Over 15 years, we have grown from a 3-person team to a professional organization of 50+ expert painters, serving homes, offices, commercial spaces, and large residential projects across Eastern Uttar Pradesh.</p>
                <p>We combine traditional craftsmanship with modern techniques, using premium quality paints from leading brands to deliver results that not only look beautiful but stand the test of time.</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/free-estimate" className="btn-primary">🎨 Get Free Estimate</Link>
                <a href={`tel:${SEO_CONFIG.phone}`} className="btn-secondary text-[var(--color-text)]"
                   style={{ borderColor: 'var(--color-border)' }}>📞 Call Us Now</a>
              </div>
            </div>
            <div ref={ref} className="grid grid-cols-2 gap-4">
              {[
                { value: '15+', label: 'Years Experience', icon: '🏆' },
                { value: '2500+', label: 'Projects Completed', icon: '🎨' },
                { value: '1800+', label: 'Happy Clients', icon: '😊' },
                { value: '50+', label: 'Expert Painters', icon: '👨🎨' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }} className="card p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-gradient-gold mb-1">{stat.value}</div>
                  <div className="text-[var(--color-text-muted)] text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding" style={{ background: 'var(--color-surface-2)' }}>
        <div className="container-custom">
          <SectionHeader badge="📅 Our Journey" title="Milestones &" titleHighlight="Achievements" />
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 gradient-gold" style={{ width: '2px', background: 'linear-gradient(180deg, #d4a017, #f0c040, #d4a017)' }} />
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex gap-6 mb-8 last:mb-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center font-black text-[#1a1a2e] text-xs z-10 relative">{m.year}</div>
                </div>
                <div className="card p-5 flex-1">
                  <h3 className="font-bold text-[var(--color-text)] mb-1">{m.event}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <SectionHeader badge="👥 Our Team" title="Meet Our" titleHighlight="Expert Painters" subtitle="Our team of experienced professionals brings skill, dedication and artistry to every project." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="card p-6 text-center">
                <div className="text-5xl mb-4">{member.icon}</div>
                <h3 className="font-bold text-[var(--color-text)] mb-1">{member.name}</h3>
                <p className="text-[#d4a017] text-sm font-medium mb-1">{member.role}</p>
                <p className="text-[var(--color-text-muted)] text-xs">{member.exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
