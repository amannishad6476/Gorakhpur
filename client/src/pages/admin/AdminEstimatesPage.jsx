import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const statusColors = {
  new: 'bg-red-100 text-red-600',
  contacted: 'bg-blue-100 text-blue-600',
  visited: 'bg-purple-100 text-purple-600',
  quoted: 'bg-yellow-100 text-yellow-600',
  converted: 'bg-green-100 text-green-600',
  cancelled: 'bg-gray-100 text-gray-600',
};

const AdminEstimatesPage = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-estimates'],
    queryFn: () => api.get('/estimates').then(r => r.data.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/estimates/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-estimates']); toast.success('Status updated'); },
  });

  const deleteEstimate = useMutation({
    mutationFn: (id) => api.delete(`/estimates/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-estimates']); toast.success('Deleted'); setSelected(null); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--color-text)]">Estimate Requests</h1>
          <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} total requests</p>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {data?.length === 0 && <div className="card p-8 text-center text-[var(--color-text-muted)]">No estimate requests yet</div>}
            {data?.map((e, i) => (
              <motion.div key={e._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-[var(--color-text)]">{e.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[e.status] || statusColors.new}`}>{e.status}</span>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm">{e.phone} {e.email && `· ${e.email}`}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[var(--color-text-muted)]">
                      {e.serviceType && <span>🎨 {e.serviceType}</span>}
                      {e.propertyType && <span>🏠 {e.propertyType}</span>}
                      {e.area && <span>📐 {e.area} sq ft</span>}
                      {e.city && <span>📍 {e.city}</span>}
                      {e.preferredDate && <span>📅 {new Date(e.preferredDate).toLocaleDateString('en-IN')}</span>}
                    </div>
                    {e.notes && <p className="mt-2 text-sm text-[var(--color-text-muted)] italic">"{e.notes}"</p>}
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">{new Date(e.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-fit">
                    <select
                      value={e.status}
                      onChange={(ev) => updateStatus.mutate({ id: e._id, status: ev.target.value })}
                      className="text-xs px-2 py-1.5 rounded-lg border cursor-pointer"
                      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      {['new', 'contacted', 'visited', 'quoted', 'converted', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => { if (window.confirm('Delete this request?')) deleteEstimate.mutate(e._id); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >Delete</button>
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

export default AdminEstimatesPage;
