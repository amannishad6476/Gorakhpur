import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICE_TYPES = ['Interior Painting', 'Exterior Painting', 'Texture Painting', 'Waterproofing', 'POP Design', 'Wood Polish', 'Commercial Painting', 'Apartment Painting', 'House Painting', 'Other'];
const STATUSES = ['completed', 'ongoing', 'upcoming'];

const emptyForm = { title: '', client: '', location: '', serviceType: 'Interior Painting', area: '', description: '', beforeImage: '', afterImage: '', status: 'completed', completedDate: '', isFeatured: false, tags: '' };

const ProjectForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Project' : 'Add Project'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Project Title *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 3BHK Villa Interior Painting" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Client Name</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.client} onChange={e => set('client', e.target.value)} placeholder="Mr. Sharma" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Location</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.location} onChange={e => set('location', e.target.value)} placeholder="Civil Lines, Gorakhpur" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Service Type</label>
          <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.serviceType} onChange={e => set('serviceType', e.target.value)}>
            {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Status</label>
          <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Area (sq ft)</label>
          <input type="number" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.area} onChange={e => set('area', e.target.value)} placeholder="1500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Completion Date</label>
          <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.completedDate ? form.completedDate.split('T')[0] : ''} onChange={e => set('completedDate', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Description</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={3} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">After Image URL *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.afterImage} onChange={e => set('afterImage', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Before Image URL</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.beforeImage} onChange={e => set('beforeImage', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Tags (comma separated)</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => set('tags', e.target.value)} placeholder="interior, luxury, 3bhk" />
        </div>
        <div className="flex items-end">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Featured</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onSave({ ...form, tags: Array.isArray(form.tags) ? form.tags : form.tags.split(',').map(t => t.trim()).filter(Boolean) })}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const statusColors = { completed: 'bg-green-100 text-green-600', ongoing: 'bg-blue-100 text-blue-600', upcoming: 'bg-yellow-100 text-yellow-600' };

const AdminProjectsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/projects').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/projects', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-projects']); toast.success('Project added!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/projects/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-projects']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-projects']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Projects</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} projects in portfolio</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add Project</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <ProjectForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <>
            {(!data || data.length === 0) && (
              <div className="card p-10 text-center text-[var(--color-text-muted)]">
                <div className="text-5xl mb-3">🏗️</div>
                <p className="font-semibold text-lg mb-1">No projects yet</p>
                <p className="text-sm">Add your first project to showcase your work</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.map((project, i) => (
                <motion.div key={project._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="card overflow-hidden">
                  {project.afterImage && (
                    <img src={project.afterImage} alt={project.title} className="w-full h-36 object-cover" loading="lazy" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-[var(--color-text)] text-sm leading-tight">{project.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${statusColors[project.status] || ''}`}>{project.status}</span>
                    </div>
                    {project.client && <p className="text-xs text-[var(--color-text-muted)] mb-0.5">👤 {project.client}</p>}
                    {project.location && <p className="text-xs text-[var(--color-text-muted)] mb-1">📍 {project.location}</p>}
                    <p className="text-xs text-[#d4a017] font-semibold mb-3">{project.serviceType}{project.area ? ` · ${project.area} sq ft` : ''}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(project); setShowForm(false); }} className="flex-1 text-xs py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors">Edit</button>
                      <button onClick={() => { if (window.confirm('Delete this project?')) del.mutate(project._id); }} className="flex-1 text-xs py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Delete</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;
