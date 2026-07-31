import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import SEOHead from '../components/layout/SEOHead';
import Breadcrumb from '../components/layout/Breadcrumb';
import ReviewForm from '../components/reviews/ReviewForm';
import StarRating from '../components/ui/StarRating';
import SectionHeader from '../components/ui/SectionHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const ReviewsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: () => api.get('/reviews').then(r => r.data.data), staleTime: 5 * 60 * 1000 });
  const reviews = data || [];
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <>
      <SEOHead title="Customer Reviews - Munnalal Painter Gorakhpur" description="Read genuine customer reviews for Munnalal Painter in Gorakhpur. 1800+ happy clients, 4.9/5 rating. Submit your own review." canonical="/reviews" breadcrumbs={[{ name: 'Reviews', href: '/reviews' }]} />
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 100%)' }}>
        <div className="container-custom py-16">
          <Breadcrumb items={[{ name: 'Reviews', href: '/reviews' }]} />
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Customer <span className="text-gradient-gold">Reviews</span></h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-5xl font-black text-gradient-gold">{avgRating}</span>
            <div>
              <StarRating rating={Math.round(parseFloat(avgRating))} readonly size="lg" />
              <p className="text-white/70 text-sm mt-1">Based on {reviews.length || '1800'}+ reviews</p>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" fill="var(--color-surface)" /></svg>
      </div>
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <SectionHeader badge="⭐ What Clients Say" title="Real Reviews from" titleHighlight="Our Clients" center={false} />
              {isLoading ? <LoadingSpinner /> : reviews.length === 0 ? (
                <div className="text-center py-12 card p-8">
                  <div className="text-5xl mb-3">⭐</div>
                  <p className="text-[var(--color-text-muted)]">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <motion.div key={review._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[#1a1a2e] font-bold text-sm">{review.name.charAt(0)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[var(--color-text)] text-sm">{review.name}</p>
                              {review.isVerified && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">✔ Verified</span>}
                            </div>
                            <p className="text-[var(--color-text-muted)] text-xs">{review.location || 'Gorakhpur'} · {review.service || 'Painting'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <p className="text-[var(--color-text-muted)] text-xs mt-1">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">"{review.reviewText}"</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">Write a Review</h2>
              <ReviewForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsPage;
