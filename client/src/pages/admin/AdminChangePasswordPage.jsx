import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminChangePasswordPage = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPass = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await api.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[var(--color-text)]">Change Password</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Update your admin account password</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    {...register('currentPassword', { required: 'Current password is required' })}
                    className="w-full px-4 py-3 rounded-xl border text-sm pr-12"
                    style={inputStyle}
                    placeholder="Enter current password"
                  />
                  <button type="button" onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    {showOld ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    className="w-full px-4 py-3 rounded-xl border text-sm pr-12"
                    style={inputStyle}
                    placeholder="Enter new password (min 6 chars)"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === newPass || 'Passwords do not match',
                    })}
                    className="w-full px-4 py-3 rounded-xl border text-sm pr-12"
                    style={inputStyle}
                    placeholder="Confirm new password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Changing Password...' : '🔒 Change Password'}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Password Tips</h3>
              <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
                <li>• Use at least 8 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Add numbers and special characters</li>
                <li>• Avoid common words or personal info</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePasswordPage;
