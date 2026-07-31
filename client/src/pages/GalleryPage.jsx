import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';

const categories = [
  { value: 'all', label: 'All Work' },
  { value: 'interior', label: '🎨 Interior' },
  { value: 'exterior', label: '🏗️ Exterior' },
  { value: 'texture', label: '✨ Texture' },
  { value: 'waterproofing', label: '💧 Waterproofing' },
  { value: 'pop', label: '🏛️ POP Design' },
  { value: 'commercial', label: '🏢 Commercial' },
  { value: 'before-after', label: '↔️ Before & After' },
];

const placeholderImages = [
  { _id: '1', title: 'Beautiful Living Room Interior', afterImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', category: 'interior', location: 'Civil Lines, Gorakhpur' },
  { _id: '2', title: 'Modern Bedroom Painting', afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600', category: 'interior', location: 'Rapti Nagar, Gorakhpur' },
  { _id: '3', title: 'Exterior House Painting', afterImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600', category: 'exterior', location: 'Shastri Nagar, Gorakhpur' },
  { _id: '4', title: 'Sand Texture Feature Wall', afterImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', category: 'texture', location: 'Golghar, Gorakhpur' },
  { _id: '5', title: 'Office Space Painting', afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', category: 'commercial', location: 'City Mall Area, Gorakhpur' },
  { _id: '6', title: 'Ceiling POP Design', afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', category: 'pop', location: 'Basharatpur, Gorakhpur' },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', activeCategory],
    queryFn: () => api.get(`/gallery${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const items = (data && data.length > 0) ? data : placeholderImages;
  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);
  const slides = filtered.map(i => ({ src: i.afterImage, title: i.title }));

  return (
    <>
      <SEOHead
        title="Painting Gallery - Before & After Projects in Gorakhpur"
        description="View our painting gallery featuring before & after photos of house painting, interior, exterior, texture, and waterproofing projects across Gorakhpur, UP."
        canonical="/gallery"
        breadcrumbs={[{ name: 'Gallery', href: '/gallery' }]}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Gallery', href: '/gallery' }]} />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our <span className="text-gradient-gold">Work Gallery</span></h1>
          <p className="text-white/70 text-lg max-w-2xl">Browse through hundreds of our completed painting projects across Gorakhpur and nearby areas.</p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
      </div>
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.value ? 'gradient-gold text-[#1a1a2e] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                style={activeCategory !== cat.value ? { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' } : {}}>
                {cat.label}
              </button>
            ))}
          </div>
          {isLoading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="relative group cursor-pointer rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}
                  onClick={() => setLightboxIndex(i)}>
                  <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    {item.location && <p className="text-white/70 text-xs">{item.location}</p>}
                    <div className="text-2xl mt-1">🔍</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <Lightbox open={lightboxIndex >= 0} close={() => setLightboxIndex(-1)} index={lightboxIndex} slides={slides} />
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
