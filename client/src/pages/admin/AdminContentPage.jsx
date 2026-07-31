import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminContentPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: () => api.get('/content').then(r => r.data.data),
  });

  const update = useMutation({
    mutationFn: ({ key, value }) => api.put(`/content/${key}`, { value }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-content']); toast.success('Content updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update'),
  });

  const startEdit = (item) => {
    setEditing(item.key);
    setEditValue(item.value);
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--color-text)]">Site Content</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage dynamic content across the website</p>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {data?.map((item) => (
              <div key={item.key} className="card p-5">
                {editing === item.key ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>{item.key}</span>
                      {item.label && <span className="font-medium text-[var(--color-text)] text-sm">{item.label}</span>}
                    </div>
                    {item.type === 'textarea' ? (
                      <textarea
                        className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)', minHeight: '120px' }}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                      />
                    ) : (
                      <input
                        className="w-full px-3 py-2 rounded-lg border text-sm mb-3"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                      />
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => update.mutate({ key: item.key, value: editValue })} disabled={update.isPending} className="btn-primary text-sm">{update.isPending ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>{item.key}</span>
                        {item.label && <span className="font-medium text-[var(--color-text)] text-sm">{item.label}</span>}
                      </div>
                      <p className="text-[var(--color-text-muted)] text-sm truncate">{item.value || <em className="opacity-50">Empty</em>}</p>
                    </div>
                    <button onClick={() => startEdit(item)} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex-shrink-0">Edit</button>
                  </div>
                )}
              </div>
            ))}
            {(!data || data.length === 0) && (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-[var(--color-text-muted)]">No content items found. Seed the database to add default content.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContentPage;
