import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { SERVICES } from '../../utils/constants';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/enquiries', data);
      toast.success('Message sent! We\'ll contact you within 24 hours.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Full Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.name ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Phone Number *</label>
          <input
            {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid Indian mobile number' } })}
            type="tel"
            placeholder="10-digit mobile number"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.phone ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email Address *</label>
        <input
          {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email' } })}
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.email ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Service Interested In</label>
        <select
          {...register('service')}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="">Select a service (optional)</option>
          {SERVICES.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Subject</label>
        <input
          {...register('subject')}
          type="text"
          placeholder="Brief subject"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Message *</label>
        <textarea
          {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message must be at least 20 characters' } })}
          rows={4}
          placeholder="Describe your requirements..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
          style={{ background: 'var(--color-surface-2)', border: `1px solid ${errors.message ? '#ef4444' : 'var(--color-border)'}`, color: 'var(--color-text)' }}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? '⏳ Sending...' : '📤 Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
