import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, link, color }) => (
  <motion.div whileHover={{ y: -4 }} className="card p-5 cursor-pointer" onClick={() => link && (window.location.href = link)}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[var(--color-text-muted)] text-sm mb-1">{label}</p>
        <p className="text-3xl font-black" style={{ color }}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => api.get('/stats/dashboard').then(r => r.data.data), staleTime: 60 * 1000 });

  if (isLoading) return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );

  const stats = data || {};

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[var(--color-text)]">Dashboard</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Welcome to Munnalal Painter Admin Panel</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🎨" label="Total Services" value={stats.services || 12} link="/admin/services" color="#d4a017" />
          <StatCard icon="🖼️" label="Gallery Items" value={stats.gallery || 0} link="/admin/gallery" color="#2563a8" />
          <StatCard icon="📝" label="Published Blogs" value={stats.blogs || 0} link="/admin/blogs" color="#16a34a" />
          <StatCard icon="⭐" label="Approved Reviews" value={stats.allReviews || 0} link="/admin/reviews" color="#d4a017" />
          <StatCard icon="⏳" label="Pending Reviews" value={stats.pendingReviews || 0} link="/admin/reviews" color="#f97316" />
          <StatCard icon="📧" label="Total Enquiries" value={stats.enquiries || 0} link="/admin/enquiries" color="#8b5cf6" />
          <StatCard icon="📨" label="New Enquiries" value={stats.newEnquiries || 0} link="/admin/enquiries" color="#ef4444" />
          <StatCard icon="📋" label="Estimate Requests" value={stats.estimates || 0} link="/admin/estimates" color="#0ea5e9" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold text-[var(--color-text)] mb-4">Recent Enquiries</h2>
            {stats.recentEnquiries?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEnquiries.map(e => (
                  <div key={e._id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                    <div>
                      <p className="font-medium text-[var(--color-text)] text-sm">{e.name}</p>
                      <p className="text-[var(--color-text-muted)] text-xs">{e.phone} · {e.service || 'General'}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      e.status === 'new' ? 'bg-red-100 text-red-600' :
                      e.status === 'replied' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{e.status}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[var(--color-text-muted)] text-sm">No enquiries yet</p>}
          </div>
          <div className="card p-6">
            <h2 className="font-bold text-[var(--color-text)] mb-4">Recent Estimate Requests</h2>
            {stats.recentEstimates?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEstimates.map(e => (
                  <div key={e._id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                    <div>
                      <p className="font-medium text-[var(--color-text)] text-sm">{e.name}</p>
                      <p className="text-[var(--color-text-muted)] text-xs">{e.serviceType} · {e.city}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      e.status === 'new' ? 'bg-red-100 text-red-600' :
                      e.status === 'converted' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>{e.status}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[var(--color-text-muted)] text-sm">No estimate requests yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
