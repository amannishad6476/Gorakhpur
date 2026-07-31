import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
  title: '',
  subtitle: '',
  image: '',
  buttonText: '',
  buttonLink: '',
  isActive: true,
  sortOrder: 0,
};

const BannerForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Banner' : 'Add Hero Banner'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title} onChange={e => set('title', e.target.value)} placeholder="Professional Painters in Gorakhpur" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Subtitle</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="15+ years of experience..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Background Image URL</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." />
          {form.image && (
            <img src={form.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded-lg" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Button Text</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.buttonText} onChange={e => set('buttonText', e.target.value)} placeholder="Get Free Estimate" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Button Link</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.buttonLink} onChange={e => set('buttonLink', e.target.value)} placeholder="/free-estimate" />
        </div>
        <div className="flex items-center gap-8">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Active</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Sort Order</label>
            <input type="number" className="w-24 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Banner'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminBannersPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get('/banners/admin/all').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/banners', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-banners']); toast.success('Banner added!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/banners/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-banners']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/banners/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-banners']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Hero Banners</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Manage homepage hero slides</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add Banner</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <BannerForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {(!data || data.length === 0) && (
              <div className="card p-10 text-center text-[var(--color-text-muted)]">
                <div className="text-5xl mb-3">🖼️</div>
                <p className="font-semibold text-lg mb-1">No banners yet</p>
                <p className="text-sm">Add hero banners to display on the homepage slider</p>
              </div>
            )}
            {data?.map((banner, i) => (
              <motion.div key={banner._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-center gap-4">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-28 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-28 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: 'var(--color-surface-2)' }}>🖼️</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[var(--color-text)] text-sm truncate">{banner.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${banner.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">#{banner.sortOrder}</span>
                  </div>
                  {banner.subtitle && <p className="text-xs text-[var(--color-text-muted)] mb-1 truncate">{banner.subtitle}</p>}
                  {banner.buttonText && (
                    <p className="text-xs text-[#d4a017]">{banner.buttonText} → {banner.buttonLink}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(banner); setShowForm(false); }} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors">Edit</button>
                  <button onClick={() => { if (window.confirm('Delete this banner?')) del.mutate(banner._id); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannersPage;
