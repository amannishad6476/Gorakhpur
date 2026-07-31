import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const actionColors = {
  create: 'bg-green-100 text-green-600',
  update: 'bg-blue-100 text-blue-600',
  delete: 'bg-red-100 text-red-600',
  login: 'bg-purple-100 text-purple-600',
  logout: 'bg-gray-100 text-gray-600',
  approve: 'bg-yellow-100 text-yellow-600',
  reject: 'bg-orange-100 text-orange-600',
};

const AdminActivityPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => api.get('/activity').then(r => r.data.data),
    refetchInterval: 30000,
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--color-text)]">Activity Logs</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Recent admin actions and system events</p>
        </div>
        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {data?.length === 0 && (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-[var(--color-text-muted)]">No activity logged yet.</p>
              </div>
            )}
            {data?.map((log, i) => (
              <motion.div key={log._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="card p-4 flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                    {log.action}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--color-text)] text-sm font-medium">{log.description || `${log.action} on ${log.resource}`}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {log.resource && <span className="text-xs text-[var(--color-text-muted)]">📁 {log.resource}</span>}
                    {log.performedBy && <span className="text-xs text-[var(--color-text-muted)]">👤 {log.performedBy}</span>}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">{new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityPage;
