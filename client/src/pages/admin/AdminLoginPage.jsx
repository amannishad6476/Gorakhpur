import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';

const AdminLoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const onLogin = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const onForgotPassword = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.forgotEmail });
      setOtpEmail(data.forgotEmail);
      setOtpMode(true);
      toast.success('OTP sent to your email!');
    } catch (err) { toast.error(err.response?.data?.message || 'Email not found'); } finally { setLoading(false); }
  };

  const onVerifyOTP = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: otpEmail, otp: data.otp });
      setResetToken(res.data.resetToken);
      setResetMode(true);
      toast.success('OTP verified!');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid OTP'); } finally { setLoading(false); }
  };

  const onResetPassword = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { resetToken, newPassword: data.newPassword });
      toast.success('Password reset! Please login.');
      setForgotMode(false); setOtpMode(false); setResetMode(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #071020 0%, #1e3a5f 50%, #071020 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center text-3xl font-black text-[#1a1a2e] mx-auto mb-4">M</div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm">Munnalal Painter Management</p>
        </div>
        {!forgotMode && !otpMode && !resetMode && (
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-1.5">Email Address</label>
              <input {...register('email', { required: 'Required' })} type="email" placeholder="amannishad6476@gmail.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, color: '#fff' }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1.5">Password</label>
              <input {...register('password', { required: 'Required' })} type="password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.2)'}`, color: '#fff' }} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">{loading ? '⏳ Signing in...' : '🔐 Sign In'}</button>
            <button type="button" onClick={() => setForgotMode(true)} className="w-full text-center text-white/60 text-sm hover:text-[#d4a017] transition-colors">Forgot Password?</button>
          </form>
        )}
        {forgotMode && !otpMode && (
          <form onSubmit={handleSubmit(onForgotPassword)} className="space-y-4">
            <h3 className="text-white font-bold mb-2">Forgot Password</h3>
            <p className="text-white/60 text-sm mb-4">Enter your admin email and we'll send an OTP.</p>
            <input {...register('forgotEmail', { required: 'Required' })} type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Sending...' : 'Send OTP'}</button>
            <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-white/60 text-sm hover:text-white">Back to Login</button>
          </form>
        )}
        {otpMode && !resetMode && (
          <form onSubmit={handleSubmit(onVerifyOTP)} className="space-y-4">
            <h3 className="text-white font-bold mb-2">Verify OTP</h3>
            <p className="text-white/60 text-sm mb-4">Enter the 6-digit OTP sent to {otpEmail}.</p>
            <input {...register('otp', { required: 'Required', minLength: { value: 6, message: '6 digits required' } })} type="text" placeholder="123456" maxLength="6" className="w-full px-4 py-3 rounded-xl text-sm outline-none text-center text-2xl tracking-widest" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        )}
        {resetMode && (
          <form onSubmit={handleSubmit(onResetPassword)} className="space-y-4">
            <h3 className="text-white font-bold mb-2">Set New Password</h3>
            <input {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} type="password" placeholder="New password" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
