import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { SERVICES } from '../../utils/constants';

const EstimateForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/estimates', data);
      toast.success('Estimate request submitted! We\'ll contact you within 24 hours.');
      setSuccess(true);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">Request Submitted!</h3>
        <p className="text-[var(--color-text-muted)] mb-6">Our team will contact you within 24 hours with a detailed estimate.</p>
        <button onClick={() => setSuccess(false)} className="btn-primary">Submit Another Request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name *</label>
          <input {...register('name', { required: 'Required' })} type="text" placeholder="Your full name" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.name ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Phone Number *</label>
          <input {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid number' } })} type="tel" placeholder="10-digit number" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.phone ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email Address *</label>
        <input {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.email ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Address *</label>
        <input {...register('address', { required: 'Required' })} type="text" placeholder="House no, Street, Area, Gorakhpur" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.address ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }} />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Service Required *</label>
          <select {...register('serviceType', { required: 'Required' })} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.serviceType ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }}>
            <option value="">Select service</option>
            {SERVICES.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
          </select>
          {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Property Type</label>
          <select {...register('propertyType')} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
            <option value="house">House / Villa</option>
            <option value="apartment">Apartment / Flat</option>
            <option value="office">Office</option>
            <option value="commercial">Commercial Space</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Approx. Area (sq ft)</label>
          <input {...register('area')} type="text" placeholder="e.g. 1200 sq ft" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Preferred Date</label>
          <input {...register('preferredDate')} type="date" min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Additional Information</label>
        <textarea {...register('additionalInfo')} rows={3} placeholder="Any special requirements, current condition of walls, preferred paint brands, etc." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? '⏳ Submitting...' : '🚀 Get My Free Estimate'}
      </button>
      <p className="text-center text-xs text-[var(--color-text-muted)]">Free estimate · No obligation · Response within 24 hours</p>
    </form>
  );
};

export default EstimateForm;
