import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = { question: '', answer: '', category: 'General', sortOrder: 0, isActive: true };

const FAQForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit FAQ' : 'Add FAQ'}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Question *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.question} onChange={e => set('question', e.target.value)} placeholder="e.g. How much does painting cost?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Answer *</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={4} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="Detailed answer..." />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Category</label>
            <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              value={form.category} onChange={e => set('category', e.target.value)}>
              {['General', 'Pricing', 'Process', 'Materials', 'Warranty', 'Booking'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Sort Order</label>
            <input type="number" className="w-24 px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
          </div>
          <div className="flex items-end pb-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
              <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Active</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save FAQ'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminFAQsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => api.get('/faqs').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/faqs', body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-faqs']); toast.success('FAQ created!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/faqs/${id}`, body),
    onSuccess: () => { queryClient.invalidateQueries(['admin-faqs']); toast.success('Updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/faqs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-faqs']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">FAQs</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} questions</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ Add FAQ</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <FAQForm
                initial={editing}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {data?.map((faq, i) => (
              <motion.div key={faq._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full badge-gold">{faq.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${faq.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{faq.isActive ? 'Active' : 'Inactive'}</span>
                      <span className="text-xs text-[var(--color-text-muted)]"># {faq.sortOrder}</span>
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)] text-sm mb-1">{faq.question}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditing(faq); setShowForm(false); }} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Edit</button>
                    <button onClick={() => { if (window.confirm('Delete?')) del.mutate(faq._id); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">Delete</button>
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

export default AdminFAQsPage;
