import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageUploader from '../../components/admin/ImageUploader';
import FestivalPopup, { FESTIVAL_THEMES } from '../../components/layout/FestivalPopup';
import toast from 'react-hot-toast';

// Format Date object to YYYY-MM-DDTHH:mm for datetime-local input
const toDateTimeLocal = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Format date for Indian Standard Time (Asia/Kolkata) display
const formatIST = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d) + ' IST';
};

const getInitialEmptyForm = () => {
  const now = new Date();
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    festivalName: '',
    heading: '',
    subheading: '',
    offerMessage: '',
    discountText: '',
    services: [
      'Interior & Exterior Painting',
      'Premium Texture Painting',
      'Wall Putty & Waterproofing',
    ],
    bannerImage: '',
    bannerImagePublicId: '',
    theme: 'diwali',
    customThemeConfig: {
      primaryColor: '#680512',
      secondaryColor: '#1f0005',
      accentColor: '#d4a017',
      textColor: '#ffffff',
    },
    primaryButtonLabel: 'Get Free Quotation',
    showWhatsappButton: true,
    secondaryButtonLabel: 'Explore Services',
    secondaryButtonLink: '/services',
    startDate: toDateTimeLocal(now),
    endDate: toDateTimeLocal(oneMonthLater),
    isActive: true,
  };
};

const AdminFestivalOffersPage = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getInitialEmptyForm());
  const [newServiceInput, setNewServiceInput] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Fetch all campaigns
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['admin-festival-offers'],
    queryFn: async () => {
      const res = await api.get('/festival-offers/admin/all');
      return res.data?.data || [];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newOffer) => api.post('/festival-offers', newOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-festival-offers'] });
      toast.success('Festival campaign created successfully!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create campaign.');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/festival-offers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-festival-offers'] });
      toast.success('Festival campaign updated successfully!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update campaign.');
    },
  });

  // Toggle active mutation
  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/festival-offers/${id}/toggle`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-festival-offers'] });
      toast.success(res.data?.message || 'Status updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to toggle status.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/festival-offers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-festival-offers'] });
      toast.success('Festival campaign deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete campaign.');
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm(getInitialEmptyForm());
    setNewServiceInput('');
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      ...offer,
      startDate: toDateTimeLocal(offer.startDate),
      endDate: toDateTimeLocal(offer.endDate),
      customThemeConfig: offer.customThemeConfig || {
        primaryColor: '#680512',
        secondaryColor: '#1f0005',
        accentColor: '#d4a017',
        textColor: '#ffffff',
      },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.festivalName.trim()) {
      toast.error('Festival/Campaign name is required.');
      return;
    }
    if (!form.heading.trim()) {
      toast.error('Popup heading is required.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error('Start and end dates are required.');
      return;
    }

    const start = new Date(form.startDate).getTime();
    const end = new Date(form.endDate).getTime();
    if (end < start) {
      toast.error('End date cannot be earlier than start date.');
      return;
    }

    const payload = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleAddService = () => {
    if (!newServiceInput.trim()) return;
    if (form.services.includes(newServiceInput.trim())) {
      toast.error('Service already added');
      return;
    }
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, newServiceInput.trim()],
    }));
    setNewServiceInput('');
  };

  const handleRemoveService = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />

      <main className="ml-64 flex-1 p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] flex items-center gap-2">
              <span>🎉</span> Festival Offers & Popups
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Configure seasonal promotional popups, festive themes, WhatsApp offers, and scheduling (Asia/Kolkata).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border border-amber-500/30 transition-all shadow-sm"
              title="Preview popup with current form settings"
            >
              <span>👁️</span> Preview Popup
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-500/15 text-[var(--color-text)] hover:bg-gray-500/25 border border-[var(--color-border)] transition-all"
              >
                + New Campaign
              </button>
            )}
          </div>
        </div>

        {/* Campaign Configuration Form */}
        <div className="card p-6 md:p-8 mb-10 shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6">
            <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
              <span>{editingId ? '✏️' : '➕'}</span>
              <span>{editingId ? 'Edit Festival Campaign' : 'Create Next Festival Campaign'}</span>
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--color-text)] cursor-pointer select-none">
                {form.isActive ? '🟢 Popup Enabled' : '⚪ Popup Disabled'}
              </label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-5 h-5 accent-[#d4a017] cursor-pointer"
              />
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Row 1: Name and Heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Festival / Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.festivalName}
                  onChange={(e) => setForm((f) => ({ ...f, festivalName: e.target.value }))}
                  placeholder="e.g. Diwali Dhamaka 2026, Holi Special 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Popup Heading (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={form.heading}
                  onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                  placeholder="e.g. DIWALI DHAMAKA 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            {/* Row 2: Subtitle & Offer Message */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={form.subheading}
                  onChange={(e) => setForm((f) => ({ ...f, subheading: e.target.value }))}
                  placeholder="e.g. Give Your Home a Beautiful Festive Makeover!"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Offer Message
                </label>
                <input
                  type="text"
                  value={form.offerMessage}
                  onChange={(e) => setForm((f) => ({ ...f, offerMessage: e.target.value }))}
                  placeholder="e.g. Special Diwali Offer — Contact Us for Your Best Painting Quote!"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            {/* Row 3: Optional Discount Text */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                Optional Discount Text <span className="text-[var(--color-text-muted)] font-normal">(Leave empty if no specific discount is offered)</span>
              </label>
              <input
                type="text"
                value={form.discountText}
                onChange={(e) => setForm((f) => ({ ...f, discountText: e.target.value }))}
                placeholder="e.g. Flat ₹2000 Off on Whole-Home Painting (only if applicable)"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {/* Row 4: Theme Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-2">
                Festival Theme Variant
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.values(FESTIVAL_THEMES).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, theme: t.id }))}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      form.theme === t.id
                        ? 'border-[#d4a017] ring-2 ring-[#d4a017]/30 shadow-md scale-[1.02]'
                        : 'border-[var(--color-border)] hover:border-amber-400/50'
                    }`}
                    style={{ background: 'var(--color-surface-2)' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-inner"
                      style={{ background: t.bgGradient, border: `1.5px solid ${t.borderColor}` }}
                    />
                    <span className="text-xs font-bold text-[var(--color-text)] capitalize">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Theme Settings (only when theme === 'custom') */}
            {form.theme === 'custom' && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-text)] mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={form.customThemeConfig?.primaryColor || '#1e3a5f'}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        customThemeConfig: { ...f.customThemeConfig, primaryColor: e.target.value },
                      }))
                    }
                    className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-text)] mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={form.customThemeConfig?.secondaryColor || '#0f172a'}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        customThemeConfig: { ...f.customThemeConfig, secondaryColor: e.target.value },
                      }))
                    }
                    className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-text)] mb-1">Accent Gold/Color</label>
                  <input
                    type="color"
                    value={form.customThemeConfig?.accentColor || '#d4a017'}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        customThemeConfig: { ...f.customThemeConfig, accentColor: e.target.value },
                      }))
                    }
                    className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-text)] mb-1">Text Color</label>
                  <input
                    type="color"
                    value={form.customThemeConfig?.textColor || '#ffffff'}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        customThemeConfig: { ...f.customThemeConfig, textColor: e.target.value },
                      }))
                    }
                    className="w-full h-9 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Row 5: Banner Image Upload or URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-2">
                Optional Banner / Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader
                  label="Upload Festival Image"
                  value={form.bannerImage}
                  publicId={form.bannerImagePublicId}
                  folder="munnalal-festivals"
                  onChange={(url, publicId) => {
                    setForm((f) => ({ ...f, bannerImage: url, bannerImagePublicId: publicId }));
                  }}
                />

                <div className="flex flex-col justify-center">
                  <label className="block text-xs text-[var(--color-text-muted)] mb-1">
                    Or Enter Direct Image URL
                  </label>
                  <input
                    type="url"
                    value={form.bannerImage}
                    onChange={(e) => setForm((f) => ({ ...f, bannerImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      background: 'var(--color-surface-2)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                    If no custom image is set, the festival's crafted artwork (Diya, Crescent, Tree, Splashes) is elegantly displayed.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 6: Featured Services */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                Featured Painting Services
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.services.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-[var(--color-text)]"
                  >
                    <span>🎨 {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-red-400 hover:text-red-600 font-bold ml-1 text-xs"
                      title="Remove service"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  placeholder="Add another service..."
                  className="flex-1 px-3 py-1.5 rounded-xl border text-xs"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#d4a017] text-white hover:opacity-90 transition-opacity"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Row 7: Button Labels & WhatsApp Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={form.primaryButtonLabel}
                  onChange={(e) => setForm((f) => ({ ...f, primaryButtonLabel: e.target.value }))}
                  placeholder="Get Free Quotation"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  WhatsApp Direct Button?
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="showWhatsapp"
                    checked={form.showWhatsappButton}
                    onChange={(e) => setForm((f) => ({ ...f, showWhatsappButton: e.target.checked }))}
                    className="w-5 h-5 accent-[#d4a017] cursor-pointer"
                  />
                  <label htmlFor="showWhatsapp" className="text-xs text-[var(--color-text)] cursor-pointer">
                    Open prefilled WhatsApp chat
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={form.secondaryButtonLabel}
                  onChange={(e) => setForm((f) => ({ ...f, secondaryButtonLabel: e.target.value }))}
                  placeholder="Explore Services"
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            {/* Row 8: Start and End Dates with IST Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  Start Date & Time (Asia/Kolkata IST) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  Active from: {formatIST(form.startDate)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-1.5">
                  End Date & Time (Asia/Kolkata IST) *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  Expires at: {formatIST(form.endDate)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="btn-primary text-sm py-2.5 px-6 font-bold"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving Changes...'
                  : editingId
                  ? '💾 Update Campaign'
                  : '💾 Save Campaign'}
              </button>

              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="btn-secondary text-sm py-2.5 px-5 font-semibold"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                👁️ Preview Popup
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Campaigns List */}
        <div>
          <h2 className="text-xl font-black text-[var(--color-text)] mb-4 flex items-center gap-2">
            <span>📋</span> Existing Festival Campaigns ({offers.length})
          </h2>

          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
              Failed to load festival campaigns: {error.message}
            </div>
          ) : offers.length === 0 ? (
            <div className="card p-8 text-center text-[var(--color-text-muted)] text-sm">
              No festival campaigns found. Use the form above to create your first festival offer!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => {
                const now = Date.now();
                const start = new Date(offer.startDate).getTime();
                const end = new Date(offer.endDate).getTime();
                const isScheduled = now < start;
                const isExpired = now > end;

                return (
                  <div
                    key={offer._id}
                    className={`card p-5 border relative overflow-hidden transition-all ${
                      editingId === offer._id ? 'ring-2 ring-[#d4a017]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[var(--color-text)]">
                            {offer.festivalName}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            {offer.theme}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {offer.heading}
                        </p>
                      </div>

                      {/* Status Badges */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${
                          !offer.isActive
                            ? 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                            : isExpired
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : isScheduled
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {!offer.isActive
                          ? 'Disabled'
                          : isExpired
                          ? 'Expired'
                          : isScheduled
                          ? 'Scheduled'
                          : 'Live Now'}
                      </span>
                    </div>

                    {/* Timeline Info */}
                    <div className="text-xs text-[var(--color-text-muted)] space-y-0.5 my-3 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl">
                      <div>
                        <span className="font-semibold text-[var(--color-text)]">Start:</span>{' '}
                        {formatIST(offer.startDate)}
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--color-text)]">End:</span>{' '}
                        {formatIST(offer.endDate)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForm({
                              ...offer,
                              startDate: toDateTimeLocal(offer.startDate),
                              endDate: toDateTimeLocal(offer.endDate),
                            });
                            setPreviewOpen(true);
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-medium transition-colors"
                        >
                          👁️ Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(offer)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-medium transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleMutation.mutate(offer._id)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                            offer.isActive
                              ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {offer.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete campaign "${offer.festivalName}"?`)) {
                            deleteMutation.mutate(offer._id);
                          }
                        }}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Interactive Preview Modal */}
        {previewOpen && (
          <FestivalPopup
            isPreview={true}
            previewData={form}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminFestivalOffersPage;
