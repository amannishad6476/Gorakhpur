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
  subtitle: '',
  image: '',
  imagePublicId: '',
  buttonText: 'Get Free Estimate',
  buttonLink: '/free-estimate',
  isActive: true,
  isPrimary: false,
  sortOrder: 0,
};

const BannerForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(() => {
    if (!initial) return emptyForm;
    return {
      ...initial,
      buttonText: initial.buttonText || initial.ctaText || '',
      buttonLink: initial.buttonLink || initial.ctaLink || '',
      sortOrder: initial.sortOrder !== undefined ? initial.sortOrder : (initial.order || 0),
    };
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error('Banner Title is required');
      return;
    }
    if (!form.image) {
      toast.error('Banner background image is required');
      return;
    }
    onSave(form);
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">
        {initial?._id ? 'Edit Hero Banner' : 'Add New Hero Banner'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Banner Title *
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Transform Your Home with Colors That Last"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Short Description / Subtitle
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            placeholder="e.g. Professional house painting and waterproofing in Gorakhpur."
          />
        </div>

        <div className="md:col-span-2">
          <ImageUploader
            label="Banner Background Image *"
            value={form.image}
            publicId={form.imagePublicId}
            folder="munnalal-banners"
            onChange={(url, publicId) => {
              setForm(f => ({ ...f, image: url, imagePublicId: publicId }));
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Optional CTA Button Text
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.buttonText}
            onChange={(e) => set('buttonText', e.target.value)}
            placeholder="e.g. Get Free Estimate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Optional CTA Button Link / URL
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.buttonLink}
            onChange={(e) => set('buttonLink', e.target.value)}
            placeholder="e.g. /free-estimate or tel:7668415684"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
            Display Order / Priority
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.sortOrder}
            onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)}
          />
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
            Lower numbers appear first on the slider (e.g. 0, 1, 2)
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-semibold text-[var(--color-text)]">
              {form.isActive ? 'Enabled (Active)' : 'Disabled (Hidden)'}
            </span>
          </label>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.isPrimary}
              onChange={(e) => set('isPrimary', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-semibold text-[var(--color-text)]">
              ⭐ Primary / First Slide
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
          {loading ? 'Saving...' : initial?._id ? 'Update Banner' : 'Create Banner'}
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

const AdminBannersPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get('/banners/admin/all').then((r) => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/banners', body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['home-banners']);
      toast.success('Hero Banner created!');
      setShowForm(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create banner'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/banners/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['home-banners']);
      toast.success('Banner updated successfully!');
      setEditing(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update banner'),
  });

  const toggleStatus = useMutation({
    mutationFn: (id) => api.patch(`/banners/${id}/status`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['home-banners']);
      toast.success('Banner status updated');
    },
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['home-banners']);
      toast.success('Banner deleted');
    },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Hero Banners</h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Manage Home page hero carousel background banners and call-to-action slides
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="btn-primary text-sm"
          >
            + Add New Banner
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
              <BannerForm
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
          <div className="space-y-4">
            {(!data || data.length === 0) && (
              <div className="card p-10 text-center text-[var(--color-text-muted)]">
                <div className="text-5xl mb-3">🖼️</div>
                <p className="font-semibold text-lg mb-1">No hero banners created yet</p>
                <p className="text-sm">
                  Add background banners to feature on the homepage slider
                </p>
              </div>
            )}
            {data?.map((banner, i) => {
              const btnText = banner.buttonText || banner.ctaText;
              const btnLink = banner.buttonLink || banner.ctaLink;
              const sortNum = banner.sortOrder !== undefined ? banner.sortOrder : (banner.order || 0);

              return (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 flex flex-col md:flex-row items-start md:items-center gap-4"
                >
                  <div className="relative flex-shrink-0">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-36 h-20 object-cover rounded-xl border"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                    ) : (
                      <div
                        className="w-36 h-20 rounded-xl flex items-center justify-center text-2xl border"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                      >
                        🖼️
                      </div>
                    )}
                    {banner.isPrimary && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        ⭐ PRIMARY
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[var(--color-text)] text-base truncate">
                        {banner.title}
                      </h3>
                      <button
                        onClick={() => toggleStatus.mutate(banner._id)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold cursor-pointer transition-colors ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {banner.isActive ? '● Active' : '○ Disabled'}
                      </button>
                      <span className="text-xs text-[var(--color-text-muted)] font-mono">
                        Order: #{sortNum}
                      </span>
                    </div>

                    {banner.subtitle && (
                      <p className="text-xs text-[var(--color-text-muted)] mb-1.5 line-clamp-2">
                        {banner.subtitle}
                      </p>
                    )}

                    {btnText && (
                      <p className="text-xs text-[#d4a017] font-semibold">
                        CTA Button: {btnText} {btnLink ? `(${btnLink})` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                    <button
                      onClick={() => {
                        setEditing(banner);
                        setShowForm(false);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this hero banner?')) {
                          del.mutate(banner._id);
                        }
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannersPage;
