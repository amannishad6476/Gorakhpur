import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  ongoing: 'bg-blue-100 text-blue-700',
  upcoming: 'bg-yellow-100 text-yellow-700',
};

const placeholderProjects = [
  { _id: '1', title: '3BHK Villa Interior Painting', client: 'Mr. Sharma', location: 'Civil Lines, Gorakhpur', serviceType: 'Interior Painting', area: 1800, completedDate: '2024-03-15', status: 'completed', description: 'Complete interior painting of a 3BHK luxury villa including texture work, POP design, and wood polish.', afterImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', tags: ['interior', 'texture', 'luxury'] },
  { _id: '2', title: 'Commercial Office Building', client: 'XYZ Enterprises', location: 'Golghar, Gorakhpur', serviceType: 'Commercial Painting', area: 5000, completedDate: '2024-02-20', status: 'completed', description: 'Full exterior and interior painting of a 4-floor commercial office building with weather-resistant paints.', afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', tags: ['commercial', 'exterior', 'large-scale'] },
  { _id: '3', title: 'Residential Waterproofing Project', client: 'Mrs. Gupta', location: 'Rapti Nagar, Gorakhpur', serviceType: 'Waterproofing', area: 2200, completedDate: '2024-01-10', status: 'completed', description: 'Complete terrace and bathroom waterproofing with 5-year guarantee.', afterImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', tags: ['waterproofing', 'terrace'] },
  { _id: '4', title: 'Hotel Lobby POP Design', client: 'Hotel Sunrise', location: 'Basharatpur, Gorakhpur', serviceType: 'POP Design', area: 800, completedDate: '2024-04-05', status: 'completed', description: 'Elaborate POP ceiling design and texture walls for hotel lobby and conference hall.', afterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', tags: ['pop', 'hotel', 'luxury'] },
  { _id: '5', title: 'Apartment Complex Exterior', client: 'Green Valley Apartments', location: 'Shahjanwa, Gorakhpur', serviceType: 'Exterior Painting', area: 12000, status: 'ongoing', description: 'Exterior painting of a 120-unit residential apartment complex using weather-shield paints.', afterImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600', tags: ['exterior', 'apartment', 'large-scale'] },
  { _id: '6', title: 'School Building Renovation', client: 'DPS Gorakhpur', location: 'Taramandal, Gorakhpur', serviceType: 'Exterior & Interior', area: 8000, status: 'upcoming', description: 'Complete renovation painting of school building including all classrooms, corridors, and exterior.', afterImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', tags: ['school', 'renovation', 'large-scale'] },
];

const ProjectsPage = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const projects = (data && data.length > 0) ? data : placeholderProjects;
  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);
  const slides = filtered.map(p => ({ src: p.afterImage || p.images?.[0], title: p.title }));

  return (
    <>
      <SEOHead
        title="Our Projects - Painting Work Portfolio in Gorakhpur"
        description="Explore Munnalal Painter's project portfolio - residential, commercial, interior, exterior painting projects across Gorakhpur, UP. View before & after transformations."
        canonical="/projects"
        breadcrumbs={[{ name: 'Projects', href: '/projects' }]}
      />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Projects', href: '/projects' }]} />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Our <span className="text-gradient-gold">Projects</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">A showcase of our finest painting projects across Gorakhpur — from residential homes to large commercial buildings.</p>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" />
        </svg>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="flex gap-3 flex-wrap justify-center mb-10">
            {[{ v: 'all', l: 'All Projects' }, { v: 'completed', l: '✅ Completed' }, { v: 'ongoing', l: '🔄 Ongoing' }, { v: 'upcoming', l: '📌 Upcoming' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f.v ? 'gradient-gold text-[#1a1a2e] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
                style={filter !== f.v ? { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' } : {}}>
                {f.l}
              </button>
            ))}
          </div>

          {isLoading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="card overflow-hidden group">
                  <div className="relative overflow-hidden cursor-pointer" style={{ aspectRatio: '16/10' }} onClick={() => setLightboxIndex(i)}>
                    <img src={project.afterImage || project.images?.[0]} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <span className="text-white text-3xl">🔍</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[project.status] || statusColors.completed}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-[var(--color-text)] mb-1 group-hover:text-[#d4a017] transition-colors">{project.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)] mb-3">
                      {project.client && <span>👤 {project.client}</span>}
                      {project.location && <span>📍 {project.location}</span>}
                      {project.area && <span>📐 {project.area.toLocaleString()} sq ft</span>}
                      {project.completedDate && <span>📅 {new Date(project.completedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>}
                    </div>
                    {project.serviceType && <span className="badge-gold text-xs">{project.serviceType}</span>}
                    {project.description && <p className="text-[var(--color-text-muted)] text-sm mt-3 line-clamp-2">{project.description}</p>}
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

export default ProjectsPage;
