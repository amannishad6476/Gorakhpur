import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageUploader from '../../components/admin/ImageUploader';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  features: '',
  icon: '🎨',
  color: '#e8f4fd',
  image: '',
  imagePublicId: '',
  price: '',
  priceUnit: '',
  metaTitle: '',
  metaDescription: '',
  isActive: true,
  sortOrder: 0,
};

const ServiceForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(() => {
    if (!initial) return emptyForm;
    return {
      ...initial,
      sortOrder: initial.sortOrder !== undefined ? initial.sortOrder : (initial.order || 0),
      features: Array.isArray(initial.features) ? initial.features.join('\n') : (initial.features || ''),
    };
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error('Service Name is required');
      return;
    }
    if (!form.slug.trim()) {
      toast.error('Service Slug is required');
      return;
    }
    if (!form.shortDescription.trim()) {
      toast.error('Short Description is required');
      return;
    }

    const formattedFeatures = typeof form.features === 'string'
      ? form.features.split('\n').map(s => s.trim()).filter(Boolean)
      : (form.features || []);

    onSave({
      ...form,
      features: formattedFeatures,
    });
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">
        {initial?._id ? 'Edit Service' : 'Add New Service'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Service Name *
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!initial?._id) set('slug', autoSlug(e.target.value));
            }}
            placeholder="e.g. Interior Painting"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Slug *
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="interior-painting"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Icon (emoji)
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.icon}
            onChange={(e) => set('icon', e.target.value)}
            placeholder="🎨"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Card Accent Color
          </label>
          <input
            type="color"
            className="w-full h-10 px-1 py-1 rounded-lg border cursor-pointer"
            style={{ borderColor: 'var(--color-border)' }}
            value={form.color || '#e8f4fd'}
            onChange={(e) => set('color', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            label="Service Feature Image"
            value={form.image}
            publicId={form.imagePublicId}
            folder="munnalal-services"
            onChange={(url, publicId) => {
              setForm(f => ({ ...f, image: url, imagePublicId: publicId }));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Starting Price
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.price || ''}
            onChange={(e) => set('price', e.target.value)}
            placeholder="e.g. ₹8-25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Price Unit
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.priceUnit || ''}
            onChange={(e) => set('priceUnit', e.target.value)}
            placeholder="e.g. per sq ft"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Short Description *
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.shortDescription}
            onChange={(e) => set('shortDescription', e.target.value)}
            placeholder="Brief service description for card view"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Full Description (HTML)
          </label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border text-sm"
            rows={4}
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Detailed description for service detail page..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Features (one per line)
          </label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border text-sm"
            rows={3}
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.features}
            onChange={(e) => set('features', e.target.value)}
            placeholder="Premium quality paints&#10;Expert craftsmen&#10;1-year warranty"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Display Order
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.sortOrder}
            onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex items-center pt-5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-semibold text-[var(--color-text)]">
              {form.isActive ? 'Active (Visible)' : 'Disabled (Hidden)'}
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : initial?._id ? 'Update Service' : 'Create Service'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          Cancel
        </button>
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
    queryFn: () => api.get('/services/admin/all').then((r) => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/services', body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-services']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service created successfully!');
      setShowForm(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create service'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/services/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-services']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service updated successfully!');
      setEditing(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update service'),
  });

  const toggleStatus = useMutation({
    mutationFn: (id) => api.patch(`/services/${id}/status`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-services']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service status updated');
    },
  });

  const removeImage = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}/image`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-services']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service image removed');
    },
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-services']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service deleted');
    },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Services</h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              {data?.length || 0} services registered
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="btn-primary text-sm"
          >
            + Add New Service
          </button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <ServiceForm
                initial={editing}
                onSave={(form) =>
                  editing
                    ? update.mutate({ id: editing._id, body: form })
                    : create.mutate(form)
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-3 rounded-xl overflow-hidden">
                    {service.image ? (
                      <div className="relative group">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-36 object-cover rounded-xl border"
                          style={{ borderColor: 'var(--color-border)' }}
                        />
                        <button
                          onClick={() => {
                            if (window.confirm('Remove image for this service?')) {
                              removeImage.mutate(service._id);
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow opacity-90 hover:opacity-100"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-full h-24 rounded-xl flex items-center justify-center text-4xl border"
                        style={{ background: service.color || 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                      >
                        {service.icon || '🎨'}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{service.icon || '🎨'}</span>
                      <h3 className="font-bold text-[var(--color-text)] text-base">
                        {service.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleStatus.mutate(service._id)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold cursor-pointer ${
                        service.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-[var(--color-text-muted)] text-xs mb-3 line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {service.price && (
                    <p className="text-[#d4a017] text-xs font-semibold mb-3">
                      {service.price} {service.priceUnit}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <button
                    onClick={() => {
                      setEditing(service);
                      setShowForm(false);
                    }}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-colors text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete service "${service.title}"?`)) {
                        del.mutate(service._id);
                      }
                    }}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors text-center"
                  >
                    Delete
                  </button>
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
