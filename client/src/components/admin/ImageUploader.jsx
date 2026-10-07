import { useState, useRef } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const ImageUploader = ({ value, publicId, onChange, label = 'Image', folder = 'munnalal-painter' }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid image format. Allowed: JPG, PNG, WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Max size: 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    setUploading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        const { url, publicId: newPublicId } = res.data.data;
        onChange(url, newPublicId || '');
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    if (publicId) {
      try {
        await api.delete('/upload', { data: { publicId, url: value } });
      } catch (e) {
        // Silently catch delete errors
      }
    }
    onChange('', '');
    toast.success('Image removed');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border p-2 flex items-center gap-4" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-24 h-20 object-cover rounded-lg flex-shrink-0 border"
            style={{ borderColor: 'var(--color-border)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--color-text-muted)] truncate mb-1" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#d4a017] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Replace'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            dragActive ? 'border-[#d4a017] bg-[rgba(212,160,23,0.05)]' : 'border-[var(--color-border)] hover:border-[#d4a017]'
          }`}
          style={{ background: 'var(--color-surface-2)' }}
        >
          {uploading ? (
            <div className="py-2 text-sm text-[#d4a017] font-semibold animate-pulse flex items-center justify-center gap-2">
              <span className="animate-spin text-lg">⏳</span> Uploading Image...
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl mb-1">🖼️</div>
              <p className="text-xs font-semibold text-[var(--color-text)]">
                Click to upload or drag & drop image
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Supports: JPG, JPEG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL Input Option */}
      <div className="pt-1">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, publicId)}
          placeholder="Or paste direct image URL (https://...)"
          className="w-full px-3 py-1.5 rounded-lg border text-xs"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
