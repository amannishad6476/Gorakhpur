import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Icon from '../ui/Icon';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: 'palette', label: 'Services', href: '/admin/services' },
  { icon: 'gallery', label: 'Gallery', href: '/admin/gallery' },
  { icon: 'projects', label: 'Projects', href: '/admin/projects' },
  { icon: 'blog', label: 'Blog Posts', href: '/admin/blogs' },
  { icon: 'reviews', label: 'Reviews', href: '/admin/reviews' },
  { icon: 'message', label: 'Testimonials', href: '/admin/testimonials' },
  { icon: 'faq', label: 'FAQs', href: '/admin/faqs' },
  { icon: 'mail', label: 'Enquiries', href: '/admin/enquiries' },
  { icon: 'clipboard', label: 'Estimates', href: '/admin/estimates' },
  { icon: 'building', label: 'Banners', href: '/admin/banners' },
  { icon: 'edit', label: 'Site Content', href: '/admin/content' },
  { icon: 'file', label: 'Activity Logs', href: '/admin/activity' },
  { icon: 'admin', label: 'Change Password', href: '/admin/change-password' },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col" style={{ background: 'linear-gradient(180deg, #071020 0%, #0d1f3c 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-[#1a1a2e] font-black text-xl">M</div>
          <div>
            <div className="text-white font-black text-sm">Munnalal</div>
            <div className="text-[#d4a017] text-xs font-semibold tracking-widest uppercase">Admin</div>
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-[#1a1a2e] font-bold text-sm">{user?.name?.charAt(0) || 'A'}</div>
          <div>
            <p className="text-white text-xs font-medium">{user?.name || 'Admin'}</p>
            <p className="text-white/50 text-xs capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[rgba(212,160,23,0.15)] text-[#d4a017] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon name={item.icon} size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full">
          <Icon name="logout" size={17} /> Logout
        </button>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mt-1">
          <Icon name="home" size={17} /> View Website
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
