import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['interior', 'exterior', 'texture', 'waterproofing', 'pop', 'commercial', 'before-after', 'other'];

const emptyForm = { title: '', beforeImage: '', afterImage: '', category: 'interior', location: '', description: '', isFeatured: false, sortOrder: 0 };

const GalleryForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Beautiful Living Room Interior" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">After Image URL *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.afterImage} onChange={e => set('afterImage', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Before Image URL (optional)</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.beforeImage} onChange={e => set('beforeImage', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Category *</label>
          <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Location</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.location} onChange={e => set('location', e.target.value)} placeholder="Civil Lines, Gorakhpur" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Description</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={2} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="flex items-center gap-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Featured</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Sort Order</label>
            <input type="number" className="w-20 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Item'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminGalleryPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => api.get('/gallery/admin/all').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/gallery', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-gallery']); toast.success('Item added!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/gallery/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-gallery']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/gallery/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-gallery']); toast.success('Deleted!'); },
  });

  const filtered = filterCat === 'all' ? (data || []) : (data || []).filter(i => i.category === filterCat);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Gallery</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} items</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add Item</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <GalleryForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 flex-wrap mb-6">
          {['all', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterCat === cat ? 'gradient-gold text-[#1a1a2e]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              style={filterCat !== cat ? { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' } : {}}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item, i) => (
              <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                {item.isFeatured && <span className="absolute top-2 left-2 text-xs bg-[#d4a017] text-[#1a1a2e] px-2 py-0.5 rounded-full font-bold">Featured</span>}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                  <p className="text-white text-xs font-semibold mb-2 line-clamp-1">{item.title}</p>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(item); setShowForm(false); }} className="flex-1 text-xs py-1 rounded-md bg-yellow-400/90 text-black hover:bg-yellow-400">Edit</button>
                    <button onClick={() => { if (window.confirm('Delete?')) del.mutate(item._id); }} className="flex-1 text-xs py-1 rounded-md bg-red-500/90 text-white hover:bg-red-500">Del</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
