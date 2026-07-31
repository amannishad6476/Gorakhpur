import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import StarRating from '../ui/StarRating';
import { SERVICES } from '../../utils/constants';

const ReviewForm = () => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/reviews', { ...data, rating });
      toast.success('Review submitted! It will appear after admin approval.');
      setSuccess(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 card p-8">
        <div className="text-5xl mb-3">🌟</div>
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Thank You for Your Review!</h3>
        <p className="text-[var(--color-text-muted)] text-sm">Your review has been submitted and will appear after approval.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Share Your Experience</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Your Rating *</label>
          <StarRating rating={rating} onRate={setRating} size="lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Your Name *</label>
            <input {...register('name', { required: 'Required' })} type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.name ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email *</label>
            <input {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.email ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Service Used</label>
            <select {...register('service')} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              <option value="">Select service</option>
              {SERVICES.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Your Location</label>
            <input {...register('location')} type="text" placeholder="e.g. Civil Lines, Gorakhpur" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Your Review *</label>
          <textarea {...register('reviewText', { required: 'Required', minLength: { value: 30, message: 'Min 30 characters' } })} rows={4} placeholder="Share your experience with Munnalal Painter..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.reviewText ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
          {errors.reviewText && <p className="text-red-500 text-xs mt-1">{errors.reviewText.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? '⏳ Submitting...' : '⭐ Submit Review'}
        </button>
        <p className="text-xs text-center text-[var(--color-text-muted)]">Reviews are published after admin verification</p>
      </form>
    </div>
  );
};

export default ReviewForm;
