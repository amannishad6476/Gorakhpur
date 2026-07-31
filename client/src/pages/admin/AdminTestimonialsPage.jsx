import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StarRating from '../../components/ui/StarRating';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = { name: '', role: 'Homeowner', location: 'Gorakhpur', text: '', rating: 5, image: '', service: '', isFeatured: false, isActive: true };

const TestimonialForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Name *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.name} onChange={e => set('name', e.target.value)} placeholder="Customer name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Role / Occupation</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.role} onChange={e => set('role', e.target.value)} placeholder="Homeowner, Businessman..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Location</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.location} onChange={e => set('location', e.target.value)} placeholder="Civil Lines, Gorakhpur" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Service Used</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.service} onChange={e => set('service', e.target.value)} placeholder="Interior Painting" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Rating</label>
          <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Photo URL</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Testimonial Text *</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={3} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.text} onChange={e => set('text', e.target.value)} placeholder="Customer testimonial text..." />
        </div>
        <div className="flex items-center gap-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Featured</span>
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16a34a]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Active</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Testimonial'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminTestimonialsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/testimonials').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/testimonials', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-testimonials']); toast.success('Testimonial added!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/testimonials/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-testimonials']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-testimonials']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Testimonials</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} testimonials</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add Testimonial</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <TestimonialForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.map((t, i) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[#1a1a2e] font-bold text-sm">{t.name?.charAt(0)}</div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[var(--color-text)] text-sm">{t.name}</p>
                        {t.isFeatured && <span className="text-xs bg-[rgba(212,160,23,0.15)] text-[#d4a017] px-2 py-0.5 rounded-full">Featured</span>}
                        {!t.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">{t.role} · {t.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(t); setShowForm(false); }} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Edit</button>
                    <button onClick={() => { if (window.confirm('Delete?')) del.mutate(t._id); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">Delete</button>
                  </div>
                </div>
                <StarRating rating={t.rating} readonly size="sm" />
                <p className="text-[var(--color-text-muted)] text-sm mt-2 line-clamp-2">"{t.text}"</p>
                {t.service && <p className="text-xs text-[#d4a017] mt-1">{t.service}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonialsPage;
