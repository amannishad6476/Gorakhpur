import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import StarRating from '../ui/StarRating';
import SectionHeader from '../ui/SectionHeader';
import LoadingSpinner from '../ui/LoadingSpinner';

const TestimonialsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const testimonials = data || [
    { _id: '1', name: 'Rajesh Kumar Gupta', designation: 'Home Owner', location: 'Civil Lines, Gorakhpur', message: 'Munnalal Painter did an excellent job on our 3BHK home. The finish is absolutely perfect, they completed work on time, and the price was very reasonable. Highly recommend!', rating: 5 },
    { _id: '2', name: 'Sunita Agarwal', designation: 'Apartment Owner', location: 'Rapti Nagar, Gorakhpur', message: 'We got our apartment painted before Diwali and the results were stunning! The texture work in the living room looks especially beautiful. Will definitely use their services again.', rating: 5 },
    { _id: '3', name: 'Anand Mishra', designation: 'Business Owner', location: 'Golghar, Gorakhpur', message: 'Got my showroom painted by Munnalal Painter. Professional grade work. They worked during non-business hours to avoid disruption. The waterproofing has been perfect for 2 years!', rating: 5 },
    { _id: '4', name: 'Priya Singh', designation: 'Interior Designer', location: 'Shastri Nagar, Gorakhpur', message: 'As an interior designer, I have high standards. Munnalal Painter consistently delivers excellence. Their POP work and texture painting are top-notch. I recommend them to all my clients.', rating: 5 },
    { _id: '5', name: 'Vikram Pandey', designation: 'Builder', location: 'Sahjanwa, Gorakhpur', message: 'We have used Munnalal Painter for multiple apartment projects. Their work quality is consistent, they handle large projects efficiently. Trusted contractor for us.', rating: 5 },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-2) 100%)' }}>
      <div className="container-custom">
        <SectionHeader
          badge="⭐ Customer Reviews"
          title="What Our Clients"
          titleHighlight="Say About Us"
          subtitle="Don't just take our word for it. Here's what our happy customers from Gorakhpur and surrounding areas have to say."
        />

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t._id}>
              <div className="card p-6 h-full flex flex-col">
                <div className="mb-4">
                  <StarRating rating={t.rating} readonly size="sm" />
                </div>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                  "{t.message}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[#1a1a2e] font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm">{t.name}</p>
                    <p className="text-[var(--color-text-muted)] text-xs">{t.designation} · {t.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;
