import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const statusColors = { new: 'bg-red-100 text-red-600', read: 'bg-blue-100 text-blue-600', replied: 'bg-green-100 text-green-600', closed: 'bg-gray-100 text-gray-600' };

const AdminEnquiriesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-enquiries'], queryFn: () => api.get('/enquiries').then(r => r.data.data) });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/enquiries/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-enquiries']); toast.success('Status updated'); },
  });

  const deleteEnquiry = useMutation({
    mutationFn: (id) => api.delete(`/enquiries/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-enquiries']); toast.success('Enquiry deleted'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-black text-[var(--color-text)] mb-8">Contact Enquiries</h1>
        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {data?.length === 0 && <div className="card p-8 text-center text-[var(--color-text-muted)]">No enquiries yet</div>}
            {data?.map(e => (
              <div key={e._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[var(--color-text)]">{e.name}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm">{e.email} · {e.phone}</p>
                    {e.service && <p className="text-[#d4a017] text-xs mt-0.5">Service: {e.service}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[e.status]}`}>{e.status}</span>
                    <select value={e.status} onChange={(ev) => updateStatus.mutate({ id: e._id, status: ev.target.value })} className="text-xs px-2 py-1 rounded border text-[var(--color-text)]" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                      {['new', 'read', 'replied', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => { if (confirm('Delete this enquiry?')) deleteEnquiry.mutate(e._id); }} className="text-red-500 hover:text-red-600 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50">Delete</button>
                  </div>
                </div>
                {e.subject && <p className="font-medium text-[var(--color-text)] text-sm mb-1">{e.subject}</p>}
                <p className="text-[var(--color-text-muted)] text-sm">{e.message}</p>
                <p className="text-[var(--color-text-muted)] text-xs mt-2">{new Date(e.createdAt).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;
