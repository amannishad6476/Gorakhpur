import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = { title: '', slug: '', shortDescription: '', description: '', features: '', icon: '🎨', color: '#e8f4fd', price: '', priceUnit: '', metaTitle: '', metaDescription: '', isActive: true, sortOrder: 0 };

const ServiceForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Service' : 'Add New Service'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Service Name *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title} onChange={e => { set('title', e.target.value); if (!initial?._id) set('slug', autoSlug(e.target.value)); }} placeholder="e.g. Interior Painting" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Slug *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="interior-painting" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Icon (emoji)</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎨" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Background Color</label>
          <input type="color" className="w-full h-10 px-1 py-1 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--color-border)' }}
            value={form.color} onChange={e => set('color', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Starting Price</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.price} onChange={e => set('price', e.target.value)} placeholder="₹8-25" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Price Unit</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)} placeholder="per sq ft" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Short Description *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="Brief service description" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Full Description (HTML)</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={5} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed description in HTML..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Features (one per line)</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={4} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={Array.isArray(form.features) ? form.features.join('\n') : form.features} onChange={e => set('features', e.target.value)} placeholder="Premium quality paints\nExpert painters\n1-year warranty" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Meta Title</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Sort Order</label>
          <input type="number" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value))} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Meta Description</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={2} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Active</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave({ ...form, features: Array.isArray(form.features) ? form.features : form.features.split('\n').filter(Boolean) })} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Service'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminServicesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/services/admin/all').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/services', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-services']); toast.success('Service created!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/services/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-services']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-services']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Services</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} services</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add Service</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <ServiceForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((service, i) => (
              <motion.div key={service._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: service.color || '#e8f4fd' }}>{service.icon || '🎨'}</div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text)] text-sm">{service.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--color-text-muted)] text-xs mb-3 line-clamp-2">{service.shortDescription}</p>
                {service.price && <p className="text-[#d4a017] text-xs font-semibold mb-3">{service.price} {service.priceUnit}</p>}
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(service); setShowForm(false); }} className="flex-1 text-xs py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Edit</button>
                  <button onClick={() => { if (window.confirm('Delete this service?')) del.mutate(service._id); }} className="flex-1 text-xs py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;
