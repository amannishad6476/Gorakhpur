import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import FAQAccordion from '../components/faq/FAQAccordion';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const defaultFAQs = [
  { _id: '1', question: 'How much does house painting cost in Gorakhpur?', answer: 'The cost ranges from ₹8-25 per sq ft depending on size, paint type, and finish. Contact us for a free estimate.' },
  { _id: '2', question: 'How long does painting a 2BHK apartment take?', answer: 'A standard 2BHK (800-1000 sq ft) typically takes 3-5 days including preparation, putty, primer, and 2 coats.' },
  { _id: '3', question: 'Do you provide paint materials?', answer: 'Yes, we can procure all materials at competitive prices, or work with materials you provide. We recommend letting us handle for best quality assurance.' },
  { _id: '4', question: 'What paint brands do you use?', answer: 'We work with Asian Paints, Berger, Nerolac, Dulux, and Indigo. We recommend the best product based on your requirements.' },
  { _id: '5', question: 'Do you offer a warranty?', answer: 'Yes! 1-year workmanship warranty on all painting services. Waterproofing carries a 5-year guarantee.' },
  { _id: '6', question: 'Can you paint my home while I\'m living there?', answer: 'Absolutely! We protect furniture, clean up after every session, and work room-by-room to minimize disruption.' },
  { _id: '7', question: 'Do you provide free estimates?', answer: 'Yes! Free on-site estimates with no obligation. Fill our online form or call us and we\'ll visit within 24 hours.' },
  { _id: '8', question: 'Which areas in Gorakhpur do you serve?', answer: 'We serve all Gorakhpur city areas plus Deoria, Kushinagar, Maharajganj, Siddharthnagar, Basti, and surrounding districts.' },
];

const FAQPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['faqs'], queryFn: () => api.get('/faqs').then(r => r.data.data), staleTime: 10 * 60 * 1000 });
  const faqs = (data && data.length > 0) ? data : defaultFAQs;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions - Painter in Gorakhpur"
        description="FAQs about painting services in Gorakhpur. Painting costs, timeline, warranty, brands used, service areas and more. Munnalal Painter answers your questions."
        canonical="/faq"
        breadcrumbs={[{ name: 'FAQs', href: '/faq' }]}
        schemaMarkup={faqSchema}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'FAQs', href: '/faq' }]} />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Frequently Asked <span className="text-gradient-gold">Questions</span></h1>
          <p className="text-white/70 text-lg max-w-2xl">Everything you need to know about our painting services in Gorakhpur.</p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
      </div>
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom max-w-4xl">
          {isLoading ? <LoadingSpinner /> : <FAQAccordion faqs={faqs} />}
          <div className="mt-12 card p-8 text-center">
            <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Still Have Questions?</h3>
            <p className="text-[var(--color-text-muted)] mb-6">We're here to help! Contact us directly and we'll answer any questions.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">📞 Contact Us</Link>
              <Link to="/free-estimate" className="btn-secondary text-[var(--color-text)]" style={{ borderColor: 'var(--color-border)' }}>Get Free Estimate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQPage;
