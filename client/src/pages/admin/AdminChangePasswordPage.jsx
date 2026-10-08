import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const strongPasswordValidation = {
  required: 'New password is required',
  minLength: { value: 12, message: 'Password must be at least 12 characters' },
  validate: {
    hasUpper: (v) => /[A-Z]/.test(v) || 'Must contain at least 1 uppercase letter',
    hasLower: (v) => /[a-z]/.test(v) || 'Must contain at least 1 lowercase letter',
    hasNumber: (v) => /[0-9]/.test(v) || 'Must contain at least 1 number',
    hasSpecial: (v) => /[^a-zA-Z0-9]/.test(v) || 'Must contain at least 1 special character',
  },
};

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
                    {...register('newPassword', strongPasswordValidation)}
                    className="w-full px-4 py-3 rounded-xl border text-sm pr-12"
                    style={inputStyle}
                    placeholder="Enter new strong password (min 12 chars)"
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
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Password Requirements</h3>
              <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
                <li>• Minimum 12 characters</li>
                <li>• At least 1 uppercase letter (A-Z)</li>
                <li>• At least 1 lowercase letter (a-z)</li>
                <li>• At least 1 number (0-9)</li>
                <li>• At least 1 special character (!@#$%^&*...)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePasswordPage;
