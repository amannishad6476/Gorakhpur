import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StarRating from '../../components/ui/StarRating';
import toast from 'react-hot-toast';

const AdminReviewsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-reviews'], queryFn: () => api.get('/reviews/admin/all').then(r => r.data.data) });

  const approve = useMutation({ mutationFn: (id) => api.patch(`/reviews/${id}/approve`), onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Review approved!'); } });
  const reject = useMutation({ mutationFn: (id) => api.patch(`/reviews/${id}/reject`), onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Review rejected.'); } });
  const verify = useMutation({ mutationFn: (id) => api.patch(`/reviews/${id}/verify`), onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Verification toggled.'); } });
  const del = useMutation({ mutationFn: (id) => api.delete(`/reviews/${id}`), onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Review deleted.'); } });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-black text-[var(--color-text)] mb-8">Customer Reviews</h1>
        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {data?.map(review => (
              <div key={review._id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-[var(--color-text)]">{review.name}</p>
                      {review.isApproved && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Approved</span>}
                      {!review.isApproved && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Pending</span>}
                      {review.isVerified && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">✔ Verified</span>}
                    </div>
                    <StarRating rating={review.rating} readonly size="sm" />
                    <p className="text-[var(--color-text-muted)] text-sm mt-2">{review.reviewText}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{review.email} · {review.location} · {review.service}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!review.isApproved ? (
                      <button onClick={() => approve.mutate(review._id)} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                    ) : (
                      <button onClick={() => reject.mutate(review._id)} className="text-xs px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200">Reject</button>
                    )}
                    <button onClick={() => verify.mutate(review._id)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200">{review.isVerified ? 'Unverify' : 'Verify'}</button>
                    <button onClick={() => { if (confirm('Delete?')) del.mutate(review._id); }} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
